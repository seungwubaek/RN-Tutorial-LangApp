import React from 'react';
import { Animated, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Styles
import {
  AniStViewSlotIconWrapper,
  AniStViewWordSlot,
  AniStViewWordSlotHighlighter,
  StViewWordSlotContainer,
} from './WordSlotContainer.style';

// Types
import { LayoutRect, Word } from '~/types/challenge';

interface WordSlotContainerProps {
  containerPosition: 'top' | 'bottom';
  wordSamples: Array<Word>;
  wordSlotOpacities: LayoutRect<Animated.Value>;
  wordSlotIconPositions: LayoutRect<Animated.ValueXY>;
  wordSlotIconOpacities: LayoutRect<Animated.Value>;
  wordSlotHighlighterSwitches: LayoutRect<boolean>;
  wordSlotHighlighterScales: LayoutRect<Animated.Value>;
  wordSlotHighlighterOpacities: LayoutRect<Animated.Value>;
}

const WordSlotContainer: React.FC<WordSlotContainerProps> = (props) => {
  const {
    containerPosition,
    wordSamples,
    wordSlotOpacities,
    wordSlotIconPositions,
    wordSlotIconOpacities,
    wordSlotHighlighterSwitches,
    wordSlotHighlighterScales,
    wordSlotHighlighterOpacities,
  } = props;

  const wordSampleForContainer =
    containerPosition === 'top'
      ? wordSamples.slice(0, 2)
      : wordSamples.slice(2, 4);

  return (
    <StViewWordSlotContainer containerPosition={containerPosition}>
      {wordSampleForContainer.map((wordSample, idx) => {
        const curSlotHorizontalPosition = idx % 2 === 0 ? 'left' : 'right';
        const curSlotPosition: keyof LayoutRect<boolean> =
          curSlotHorizontalPosition === 'left'
            ? `${containerPosition}Left`
            : `${containerPosition}Right`;
        const slotHighlighterSwitch =
          wordSlotHighlighterSwitches[curSlotPosition];
        const wordSlotIconOpacity = wordSlotIconOpacities[curSlotPosition];

        return (
          <AniStViewWordSlot
            key={wordSample.icon}
            style={{ opacity: wordSlotOpacities[curSlotPosition] }}
          >
            {slotHighlighterSwitch && (
              <AniStViewWordSlotHighlighter
                style={{
                  opacity: wordSlotHighlighterOpacities[curSlotPosition],
                  transform: [
                    { scale: wordSlotHighlighterScales[curSlotPosition] },
                  ],
                }}
              />
            )}
            <AniStViewSlotIconWrapper
              style={{
                opacity: wordSlotIconOpacity,
                transform: [
                  ...wordSlotIconPositions[
                    curSlotPosition
                  ].getTranslateTransform(),
                ],
              }}
            >
              <Ionicons name={wordSample.icon} size={60} color="white" />
            </AniStViewSlotIconWrapper>
          </AniStViewWordSlot>
        );
      })}
    </StViewWordSlotContainer>
  );
};

export default WordSlotContainer;
