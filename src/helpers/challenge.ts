import { PanResponderGestureState } from 'react-native';

import testWords from 'assets/challenge';
import { Word } from '~/types/challenge';

export const getWordSamples = () => {
  const sampleCnt = 4;
  const sampledKeys = Array<string>();
  const wordKeys = Object.keys(testWords);
  const wordSamples = Array<Word>();
  while (sampledKeys.length < sampleCnt) {
    const selectedKey = wordKeys[Math.floor(Math.random() * wordKeys.length)];
    if (!sampledKeys.includes(selectedKey)) {
      sampledKeys.push(selectedKey);
      wordSamples.push(testWords[selectedKey]);
    }
  }
  return wordSamples;
};

interface DropPosition {
  params: {
    gestureState: PanResponderGestureState;
    questionThresholdCoordTop: number;
    questionThresholdCoordBottom: number;
    questionThresholdCoordLeft: number;
    questionThresholdCoordRight: number;
  };
  dropPosition: '' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
}

export const generateDropPosition = ({
  gestureState,
  questionThresholdCoordBottom,
  questionThresholdCoordLeft,
  questionThresholdCoordRight,
  questionThresholdCoordTop,
}: DropPosition['params']): DropPosition['dropPosition'] => {
  const gs = gestureState;
  let dropPosition = '' as DropPosition['dropPosition'];
  if (gs.moveY < questionThresholdCoordTop) {
    if (gs.moveX < questionThresholdCoordLeft) {
      dropPosition = 'topLeft';
    } else if (gs.moveX > questionThresholdCoordRight) {
      dropPosition = 'topRight';
    }
  } else if (gs.moveY > questionThresholdCoordBottom) {
    if (gs.moveX < questionThresholdCoordLeft) {
      dropPosition = 'bottomLeft';
    } else if (gs.moveX > questionThresholdCoordRight) {
      dropPosition = 'bottomRight';
    }
  }
  return dropPosition;
};

interface CheckAnswerParams {
  dropPosition: string;
  questionWord: Word;
  wordSamples: Word[];
}

export const convertDropPositionToIndex = (dropPosition: string) => {
  return dropPosition === 'topLeft'
    ? 0
    : dropPosition === 'topRight'
    ? 1
    : dropPosition === 'bottomLeft'
    ? 2
    : dropPosition === 'bottomRight'
    ? 3
    : null;
};

export const checkAnswer = (props: CheckAnswerParams) => {
  const { dropPosition, questionWord, wordSamples } = props;

  const droppedIndex =
    dropPosition === 'topLeft'
      ? 0
      : dropPosition === 'topRight'
      ? 1
      : dropPosition === 'bottomLeft'
      ? 2
      : dropPosition === 'bottomRight'
      ? 3
      : null;

  if (droppedIndex === null) return false;

  const droppedWord = wordSamples[droppedIndex];

  return questionWord.en === droppedWord.en;
};
