import React, { useCallback, useRef, useState } from 'react';
import { Dimensions, PanResponder, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import iconNames from 'assets/icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Styles
import {
  AniStViewIconCard,
  AniStViewWordContainer,
  StTextWord,
  StViewCenter,
  StViewContainer,
  StViewEdge,
} from './DragDrop.style';

// Types
import { TabScreenProps } from '~/types/react-navigation';

const DragDrop: React.FC<TabScreenProps<'DragDrop'>> = () => {
  // States
  const [iconIndex, setIndex] = useState(0);
  const nextIcon = useCallback(() => {
    setIndex((prev) => prev + 1);
    wordCardPosition.setValue({ x: 0, y: 0 });
    Animated.parallel([
      initDroppedWordCardScale,
      initDroppedWordCardOpacity,
    ]).start();
  }, []);

  // Values
  const wordCardScale = useRef(new Animated.Value(1)).current;
  const wordCardPosition = useRef(new Animated.ValueXY()).current;
  const wordCardOpacity = useRef(new Animated.Value(1)).current;
  const btnKnowScale = wordCardPosition.y.interpolate({
    inputRange: [-SCREEN_HEIGHT / 2 + 50, -50],
    outputRange: [1.7, 1],
    extrapolate: 'clamp',
  });
  const btnDontKnowScale = wordCardPosition.y.interpolate({
    inputRange: [50, SCREEN_HEIGHT / 2 - 50],
    outputRange: [1, 1.7],
    extrapolate: 'clamp',
  });

  // PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onPressIn();
      },
      onPanResponderMove: (_, { dx, dy }) => {
        wordCardPosition.setValue({ x: dx, y: dy });
      },
      onPanResponderRelease: (_, { dy }) => {
        if (dy < -SCREEN_HEIGHT / 2 + 200) {
          onDrop();
        } else if (dy > SCREEN_HEIGHT / 2 - 200) {
          onDrop();
        } else {
          goHome();
        }
      },
    })
  ).current;

  // Animations
  const decreaseWordCardScale = useRef(
    Animated.spring(wordCardScale, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 50,
    })
  ).current;

  const initWordCardScale = useRef(
    Animated.spring(wordCardScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    })
  ).current;

  const initWordCardPosition = useRef(
    Animated.spring(wordCardPosition, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
    })
  ).current;

  const decreaseDroppingWordCardScale = useRef(
    Animated.timing(wordCardScale, {
      toValue: 0,
      useNativeDriver: true,
      duration: 200,
    })
  ).current;

  const initDroppedWordCardScale = useRef(
    Animated.timing(wordCardScale, {
      toValue: 1,
      useNativeDriver: true,
      duration: 100,
    })
  ).current;

  const decreaseDroppingWordCardOpacity = useRef(
    Animated.timing(wordCardOpacity, {
      toValue: 0,
      useNativeDriver: true,
      duration: 200,
    })
  ).current;

  const initDroppedWordCardOpacity = useRef(
    Animated.timing(wordCardOpacity, {
      toValue: 1,
      useNativeDriver: true,
      duration: 100,
    })
  ).current;

  // Functions
  const onPressIn = () => {
    decreaseWordCardScale.start();
  };

  const goHome = () => {
    Animated.parallel([initWordCardScale, initWordCardPosition]).start();
  };

  const onDrop = () => {
    Animated.parallel([
      decreaseDroppingWordCardScale,
      decreaseDroppingWordCardOpacity,
    ]).start(() => {
      nextIcon();
    });
  };

  return (
    <StViewContainer>
      <StViewEdge>
        <AniStViewWordContainer
          style={{
            transform: [{ scale: btnKnowScale }],
          }}
        >
          <StTextWord color={'green'}>알아</StTextWord>
        </AniStViewWordContainer>
      </StViewEdge>
      <StViewCenter>
        <AniStViewIconCard
          {...panResponder.panHandlers}
          style={{
            opacity: wordCardOpacity,
            transform: [
              ...wordCardPosition.getTranslateTransform(),
              { scale: wordCardScale },
            ],
          }}
        >
          <Ionicons name={iconNames[iconIndex]} color={'gray'} size={100} />
        </AniStViewIconCard>
      </StViewCenter>
      <StViewEdge>
        <AniStViewWordContainer
          style={{
            transform: [{ scale: btnDontKnowScale }],
          }}
        >
          <StTextWord color={'red'}>몰라</StTextWord>
        </AniStViewWordContainer>
      </StViewEdge>
    </StViewContainer>
  );
};

export default DragDrop;
