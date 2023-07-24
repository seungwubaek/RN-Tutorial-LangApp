import React, { useCallback, useRef, useState } from 'react';
import { View, Dimensions, Animated, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';

import icons from './assets/icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Styled

const StViewContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #00a8ff;
`;

const StViewCardContainer = styled.View`
  flex: 2.5;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 50px;
`;

const StViewCard = styled.View`
  width: 300px;
  height: 300px;
  background-color: #ffffff;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  // Android
  elevation: 3;
  // iOS
  // https://ethercreative.github.io/react-native-shadow-generator/
  /* shadow-color: '#000000';
  shadow-offset: 0px 1px;
  shadow-opacity: 0.22;
  shadow-radius: 2.22px; */
  position: absolute;
`;

const StViewCardControlContainer = styled.View`
  flex: 1;
  flex-direction: row;
  margin: 0;
  gap: 20px;
  justify-content: center;
  align-items: flex-start;
`;

const StBtnCardControl = styled.TouchableOpacity``;

const StViewAniCard = Animated.createAnimatedComponent(StViewCard);

export default function App() {
  // Values
  const frontCardScale = useRef(new Animated.Value(1)).current;
  const frontCardPosition = useRef(new Animated.ValueXY(0)).current;
  const cardDismissRange = {
    left: (-SCREEN_WIDTH / 2) * 0.8,
    right: (SCREEN_WIDTH / 2) * 0.8,
  };
  const rotation = frontCardPosition.x.interpolate({
    inputRange: [cardDismissRange.left, cardDismissRange.right],
    outputRange: ['-15deg', '15deg'],
  });
  const secondCardScale = frontCardPosition.x.interpolate({
    inputRange: [cardDismissRange.left, 0, cardDismissRange.right],
    outputRange: [1, 0.7, 1],
    extrapolate: 'clamp',
  });

  // Animations
  const decreaseFrontCardScale = Animated.spring(frontCardScale, {
    toValue: 0.9,
    useNativeDriver: true,
  });

  const initFrontCardScale = Animated.spring(frontCardScale, {
    toValue: 1,
    useNativeDriver: true,
  });

  const goCenter = Animated.spring(frontCardPosition, {
    toValue: 0,
    useNativeDriver: true,
  });

  const goLeft = Animated.spring(frontCardPosition, {
    toValue: { x: -SCREEN_WIDTH * 1.5, y: 0 },
    tension: 0.5,
    useNativeDriver: true,
    restDisplacementThreshold: 200,
    restSpeedThreshold: 200,
  });

  const goRight = Animated.spring(frontCardPosition, {
    toValue: { x: SCREEN_WIDTH * 1.5, y: 0 },
    tension: 0.5,
    useNativeDriver: true,
  });

  const [index, setIndex] = useState(0);

  const onPressedCard = useCallback(() => {
    frontCardPosition.setValue({ x: 0, y: 0 });
    decreaseFrontCardScale.start();
  }, []);

  const onDismissCard = useCallback(() => {
    setIndex((prev) => prev + 1);
    frontCardScale.setValue(1);
    frontCardPosition.setValue({ x: 0, y: 0 });
  }, []);

  const onPressCloseCard = useCallback(() => {
    Animated.parallel([initFrontCardScale, goLeft]).start(onDismissCard);
  }, []);

  const onPressCheckCard = useCallback(() => {
    Animated.parallel([initFrontCardScale, goRight]).start(onDismissCard);
  }, []);

  // PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => onPressedCard(),
      onPanResponderMove: (_, { dx }) => {
        frontCardPosition.setValue({ x: dx, y: 0 });
      },
      onPanResponderRelease: (_, { dx }) => {
        if (dx < cardDismissRange.left) {
          onPressCloseCard();
        } else if (dx > cardDismissRange.right) {
          onPressCheckCard();
        } else {
          Animated.parallel([initFrontCardScale, goCenter]).start();
        }
      },
    })
  ).current;

  return (
    <StViewContainer>
      <StViewCardContainer>
        {/* Second Card */}
        <StViewAniCard
          {...panResponder.panHandlers}
          style={{
            transform: [{ scale: secondCardScale }],
          }}
        >
          <Ionicons name={icons[index + 1]} size={98} color="#192a56" />
        </StViewAniCard>
        {/* Front Card */}
        <StViewAniCard
          {...panResponder.panHandlers}
          style={{
            transform: [
              { scale: frontCardScale },
              ...frontCardPosition.getTranslateTransform(),
              { rotateZ: rotation },
            ],
          }}
        >
          <Ionicons name={icons[index]} size={98} color="#192a56" />
        </StViewAniCard>
      </StViewCardContainer>
      <StViewCardControlContainer>
        <StBtnCardControl onPress={() => onPressCloseCard()}>
          <Ionicons name="close-circle" size={48} color="white" />
        </StBtnCardControl>
        <StBtnCardControl onPress={() => onPressCheckCard()}>
          <Ionicons name="checkmark-circle" size={48} color="white" />
        </StBtnCardControl>
      </StViewCardControlContainer>
    </StViewContainer>
  );
}
