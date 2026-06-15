import { audioMap } from './audioMap.js';

const VOICE_SETTINGS = {
  celebration  : { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question     : { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis     : { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking     : { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement    : { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction  : { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL_ID = 'eleven_multilingual_v2';

class AudioManagerImpl {
  constructor() {
    this.activeAudio = null;
    this.activeBlobUrl = null;
    this.audioEnabled = true;
    this.isPlaying = false;
    this.queue = [];
    this.currentText = '';
    this.currentNarrationKey = null;
    this.playbackGeneration = 0;
    this.fallbackTimer = null;
    this.pendingPlay = false;
  }

  setAudioEnabled(enabled) {
    this.audioEnabled = enabled;
    if (!enabled) {
      this.stopAllAudio();
    }
  }

  _revokeBlobUrl() {
    if (this.activeBlobUrl && this.activeBlobUrl.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(this.activeBlobUrl);
      } catch {
        // ignore revoke errors
      }
    }
    this.activeBlobUrl = null;
  }

  _destroyActivePlayback() {
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
        this.activeAudio.onended = null;
        this.activeAudio.onerror = null;
        this.activeAudio.src = '';
        this.activeAudio.load();
      } catch (e) {
        console.error('Error stopping active audio:', e);
      }
      this.activeAudio = null;
    }

    this._revokeBlobUrl();

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }
  }

  stopAllAudio() {
    this.playbackGeneration += 1;
    this.pendingPlay = false;
    this._destroyActivePlayback();
    this.queue = [];
    this.isPlaying = false;
    this.currentText = '';
    this.currentNarrationKey = null;
  }

  cleanupAudio() {
    this.stopAllAudio();
  }

  stopIfKey(narrationKey) {
    if (narrationKey && this.currentNarrationKey === narrationKey) {
      this.stopAllAudio();
    }
  }

  async getAudioUrl(text, style) {
    if (audioMap[text]) {
      return audioMap[text];
    }

    try {
      const res = await fetch('/api/elevenlabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice_id: VOICE_ID,
          model_id: MODEL_ID,
          voice_settings: VOICE_SETTINGS[style] ?? VOICE_SETTINGS.statement,
        }),
      });
      if (!res.ok) throw new Error('ElevenLabs proxy error');
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    } catch {
      return null;
    }
  }

  speakFallback(text, generation, onEnded) {
    if (!window.speechSynthesis) {
      if (generation === this.playbackGeneration && onEnded) onEnded();
      return;
    }

    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'en-SG';
    utt.rate = 0.88;
    utt.pitch = 1.05;
    utt.onend = () => {
      if (generation !== this.playbackGeneration || this.currentText !== text) return;
      this.isPlaying = false;
      if (onEnded) onEnded();
    };
    utt.onerror = () => {
      if (generation !== this.playbackGeneration || this.currentText !== text) return;
      this.isPlaying = false;
      if (onEnded) onEnded();
    };
    window.speechSynthesis.speak(utt);
  }

  async playSingleAudio(text, style, onEnded) {
    if (!text) {
      if (onEnded) onEnded();
      return;
    }

    if (this.isPlaying && this.currentText === text && this.activeAudio) {
      return;
    }

    const generation = this.playbackGeneration;
    this._destroyActivePlayback();

    if (!this.audioEnabled) {
      this.isPlaying = false;
      this.currentText = '';
      if (onEnded) onEnded();
      return;
    }

    this.isPlaying = true;
    this.currentText = text;
    this.pendingPlay = true;

    const url = await this.getAudioUrl(text, style);

    if (
      generation !== this.playbackGeneration ||
      this.currentText !== text ||
      !this.pendingPlay
    ) {
      return;
    }

    this.pendingPlay = false;

    if (url) {
      if (url.startsWith('blob:')) {
        this.activeBlobUrl = url;
      }

      const audio = new Audio(url);
      this.activeAudio = audio;

      audio.onended = () => {
        if (generation !== this.playbackGeneration || this.currentText !== text) return;
        this.isPlaying = false;
        this.activeAudio = null;
        this._revokeBlobUrl();
        if (onEnded) onEnded();
      };

      audio.onerror = () => {
        if (generation !== this.playbackGeneration || this.currentText !== text) return;
        this.activeAudio = null;
        this._revokeBlobUrl();
        this.speakFallback(text, generation, onEnded);
      };

      try {
        await audio.play();
      } catch {
        if (generation !== this.playbackGeneration || this.currentText !== text) return;
        this.activeAudio = null;
        this._revokeBlobUrl();
        this.speakFallback(text, generation, onEnded);
      }
    } else {
      this.speakFallback(text, generation, onEnded);
    }
  }

  playNext() {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      this.currentText = '';
      return;
    }

    const { text, style } = this.queue.shift();
    this.playSingleAudio(text, style, () => {
      this.playNext();
    });
  }

  narrate(segments, replaceQueue = false, narrationKey = null) {
    if (!this.audioEnabled || !segments?.length) return;

    const key = narrationKey ?? segments.map((s) => s.text).join('||');

    if (replaceQueue && this.isPlaying && this.currentNarrationKey === key) {
      return;
    }

    if (replaceQueue) {
      this.stopAllAudio();
    } else {
      this._destroyActivePlayback();
    }

    this.currentNarrationKey = key;
    this.queue = replaceQueue ? [...segments] : [...this.queue, ...segments];

    if (!this.isPlaying && this.queue.length > 0) {
      this.playNext();
    }
  }
}

export const audioManager = new AudioManagerImpl();

export function stopAllAudio() {
  audioManager.stopAllAudio();
}

export function cleanupAudio() {
  audioManager.cleanupAudio();
}

export function playSingleAudio(text, style, onEnded) {
  audioManager.playSingleAudio(text, style, onEnded);
}
