import { useCallback, useEffect } from 'react';
import { audioManager } from '../utils/audioManager.js';

export function useAudio(audioEnabled) {
  useEffect(() => {
    audioManager.setAudioEnabled(audioEnabled);
  }, [audioEnabled]);

  const narrate = useCallback((segments, replaceQueue = false, narrationKey = null) => {
    audioManager.narrate(segments, replaceQueue, narrationKey);
  }, []);

  const stopNarration = useCallback(() => {
    audioManager.cleanupAudio();
  }, []);

  return { narrate, stopNarration };
}

/**
 * Plays narration once per key — prevents StrictMode double-mount duplicates
 * and cleans up when the page/panel unmounts or changes.
 */
export function usePageNarration(audioEnabled, narrationKey, segments) {
  const segmentSignature = segments?.map((s) => `${s.style}:${s.text}`).join('|') ?? '';

  useEffect(() => {
    if (!audioEnabled || !segments?.length) return undefined;

    audioManager.narrate(segments, true, narrationKey);

    return () => {
      audioManager.stopIfKey(narrationKey);
    };
  }, [audioEnabled, narrationKey, segmentSignature]);
}
