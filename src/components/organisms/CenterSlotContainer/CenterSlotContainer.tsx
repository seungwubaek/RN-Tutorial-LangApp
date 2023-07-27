import React from 'react';
import { Animated } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

// Styles
import {
  AniStViewAnswerCheckSlot,
  AniStViewAnswerReminderSlot,
  AniStViewQuestionSlot,
  AniStViewQuestionSlotHighlighter,
  StTextQuestion,
  StViewAnswerReminderText,
  StViewCenterContainer,
} from './CenterSlotContainer.style';

// Types
import { PanResponderInstance } from 'react-native';
import { Word } from '~/types/challenge';

interface CenterSlotContainerProps {
  questionWord: Word;
  questionPanResponder: PanResponderInstance;
  questionPosition: Animated.ValueXY;
  questionOpacity: Animated.Value;
  questionScale: Animated.Value;
  questionSlotHighlighterSwitch: boolean;
  questionSlotHighlighterOpacity: Animated.Value;
  questionSlotHighlighterScale: Animated.Value;
  answerCheckTrigger: boolean;
  answerCheckSlotOpacity: Animated.Value;
  answerCheckSlotScale: Animated.Value;
  answerReminderSlotPosition: Animated.ValueXY;
  answerReminderSlotOpacity: Animated.Value;
  answerReminderSlotScale: Animated.Value;
}

const CenterSlotContainer: React.FC<CenterSlotContainerProps> = (props) => {
  const {
    questionWord,
    questionPanResponder,
    questionPosition,
    questionOpacity,
    questionScale,
    questionSlotHighlighterSwitch,
    questionSlotHighlighterOpacity,
    questionSlotHighlighterScale,
    answerCheckTrigger,
    answerCheckSlotOpacity,
    answerCheckSlotScale,
    answerReminderSlotPosition,
    answerReminderSlotOpacity,
    answerReminderSlotScale,
  } = props;

  return (
    <StViewCenterContainer>
      <AniStViewQuestionSlot
        {...questionPanResponder.panHandlers}
        style={{
          opacity: questionOpacity,
          transform: [
            ...questionPosition.getTranslateTransform(),
            { scale: questionScale },
          ],
        }}
      >
        {questionSlotHighlighterSwitch && (
          <AniStViewQuestionSlotHighlighter
            style={{
              opacity: questionSlotHighlighterOpacity,
              transform: [{ scale: questionSlotHighlighterScale }],
            }}
          />
        )}
        <StTextQuestion>{questionWord?.en}</StTextQuestion>
      </AniStViewQuestionSlot>
      {answerCheckTrigger && (
        <>
          <AniStViewAnswerCheckSlot
            style={{
              opacity: answerCheckSlotOpacity,
              transform: [{ scale: answerCheckSlotScale }],
            }}
          >
            <FontAwesome5 name="check" size={120} color="green" />
          </AniStViewAnswerCheckSlot>
          <AniStViewAnswerReminderSlot
            style={{
              opacity: answerReminderSlotOpacity,
              transform: [
                ...answerReminderSlotPosition.getTranslateTransform(),
                { scale: answerReminderSlotScale },
              ],
            }}
          >
            <Ionicons name={questionWord.icon} size={200} color="white" />
            <StViewAnswerReminderText>
              {questionWord.en}
            </StViewAnswerReminderText>
          </AniStViewAnswerReminderSlot>
        </>
      )}
    </StViewCenterContainer>
  );
};

export default CenterSlotContainer;
