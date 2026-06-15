import { say, ask, cheer, think, instruct } from './audioHelpers.js';

export function wonderNarration() {
  return [
    ask("Oliver's toy shop just received a huge delivery! There are four hundred and seventy-six blocks on the shelf, and three hundred and fifty-seven more just arrived. Can you help Leo count them all without losing track?"),
  ];
}

export function storyPanelNarration(panelId) {
  const narrations = {
    1: [say("Oliver packed three hundred and sixty-four biscuits in the morning. Ruby packed two hundred and seventy-five more in the afternoon. They wanted to find out how many biscuits they had altogether!")],
    2: [say("Let's line them up in columns. Hundreds, Tens, and Ones. Start from the ones.")],
    3: [think("Six tens plus seven tens equals thirteen tens! That is more than nine, so we need to regroup. We trade ten tens for one hundred and carry it to the hundreds column.")],
    4: [cheer("Three hundreds plus two hundreds plus one more equals six hundreds. The answer is six hundred and thirty-nine! Oliver and Ruby have six hundred and thirty-nine biscuits!")],
    5: [say("Ruby had seven hundred and thirty-two biscuits ready to ship. She needed to send four hundred and sixty-eight of them. How many would she have left?")],
    6: [think("Two ones minus eight ones — we cannot do that! We need to borrow a ten from the tens column. Now we have twelve ones. Twelve minus eight equals four ones.")],
    7: [think("After lending one ten, we only have two tens left. Two tens minus six tens — we cannot do that either! We borrow one hundred from the hundreds column. Now we have twelve tens. Twelve tens minus six tens equals six tens.")],
    8: [cheer("Six hundreds, minus one hundred we lent, minus four hundreds equals two hundreds. So seven hundred and thirty-two minus four hundred and sixty-eight equals two hundred and sixty-four. Ruby has two hundred and sixty-four biscuits left!")]
  };
  return narrations[panelId] || [];
}

export function simulateStationIntro(stationIndex) {
  const intros = {
    0: [instruct("Drag the hundreds, tens, and ones blocks into the columns. Watch what happens when a column has more than nine!")],
    1: [instruct("Great borrowing! Now type your answer in the column. Start from the ones.")], // Wait, this fits Station B
    2: [instruct("Now let's try borrowing. When the ones column does not have enough, we borrow a ten from next door.")] // Abstract Station C
  };
  return intros[stationIndex] || [];
}

export function regroupCelebration() {
  return [
    cheer("Amazing! Ten tens just became one hundred. Your regrouping is perfect!"),
  ];
}

export function onesRegroupCelebration() {
  return [
    cheer("Whoa! Too many ones — time to regroup! Watch ten ones snap into one ten rod."),
  ];
}

export function playFeedback(isCorrect, isDoubleRegroup = false, isStreak = false) {
  if (isCorrect) {
    if (isStreak) {
      return [cheer("Streak on fire! Five in a row — you are incredible!")];
    }
    if (isDoubleRegroup) {
      return [cheer("Well done! You just cracked a double regrouping problem!")];
    }
    return [cheer("Brilliant regrouping! You are a hundreds hero!")];
  } else {
    return [say("Almost! Check your regrouping in the tens column.")];
  }
}

export function hintNarration(hintLevel) {
  if (hintLevel === 1) {
    return [think("Let me show you the hint. Look at the column where you need to regroup.")];
  }
  return [];
}

export function reflectNarration() {
  return [
    ask("You have learned how to regroup hundreds today! Can you explain to Leo what regrouping means, and show him one example? Use numbers or draw it out!"),
  ];
}
