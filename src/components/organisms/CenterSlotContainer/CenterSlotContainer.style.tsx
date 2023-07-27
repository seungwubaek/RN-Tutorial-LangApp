import { Animated } from 'react-native';
import styled from 'styled-components/native';

// Style Values
const QUESTION_SLOT_SIZE = 60;
const QUESTION_SLOT_HIGHLIGHTER_SIZE = 120;
const ANSWER_CHECK_SLOT_SIZE = 220;

export const StViewCenterContainer = styled.View`
  flex: 2;
  justify-content: center;
  align-items: center;
`;

const StViewQuestionSlot = styled.View`
  justify-content: center;
  align-items: center;
  height: ${QUESTION_SLOT_SIZE}px;
`;

export const AniStViewQuestionSlot =
  Animated.createAnimatedComponent(StViewQuestionSlot);

export const StTextQuestion = styled.Text`
  font-size: 45px;
  font-weight: 500;
  color: ${({ theme }) => theme.challDragQuestion};
`;

const StViewQuestionSlotHighlighter = styled.View`
  position: absolute;
  justify-content: center;
  align-items: center;
  width: ${QUESTION_SLOT_HIGHLIGHTER_SIZE}px;
  height: ${QUESTION_SLOT_HIGHLIGHTER_SIZE}px;
  border-radius: ${QUESTION_SLOT_HIGHLIGHTER_SIZE / 2}px;
  background-color: ${({ theme }) => theme.challDragWordSlotHighligher};
`;

export const AniStViewQuestionSlotHighlighter =
  Animated.createAnimatedComponent(StViewQuestionSlotHighlighter);

const StViewAnswerCheckSlot = styled.View`
  position: absolute;
  justify-content: center;
  align-items: center;
  background-color: white;
  width: ${ANSWER_CHECK_SLOT_SIZE}px;
  height: ${ANSWER_CHECK_SLOT_SIZE}px;
  border-radius: ${ANSWER_CHECK_SLOT_SIZE / 2}px;
`;

export const AniStViewAnswerCheckSlot = Animated.createAnimatedComponent(
  StViewAnswerCheckSlot
);

const StViewAnswerReminderSlot = styled.View`
  position: absolute;
  justify-content: center;
  align-items: center;
`;

export const AniStViewAnswerReminderSlot = Animated.createAnimatedComponent(
  StViewAnswerReminderSlot
);

export const StViewAnswerReminderText = styled.Text`
  padding-top: 10px;
  font-size: 25px;
  font-weight: 500;
  color: white;
`;
