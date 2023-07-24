import React, { useCallback, useRef, useState } from 'react';
import { View, Dimensions, Animated, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';

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
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.ValueXY(0)).current;
  const cardDismissRange = {
    left: (-SCREEN_WIDTH / 2) * 0.8,
    right: (SCREEN_WIDTH / 2) * 0.8,
  };
  const rotation = position.x.interpolate({
    inputRange: [cardDismissRange.left, cardDismissRange.right],
    outputRange: ['-15deg', '15deg'],
  });
  const secondCardScale = position.x.interpolate({
    inputRange: [cardDismissRange.left, 0, cardDismissRange.right],
    outputRange: [1, 0.7, 1],
    extrapolate: 'clamp',
  });

  // Animations
  const onPressIn = Animated.spring(scale, {
    toValue: 0.9,
    useNativeDriver: true,
  });

  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });

  const goCenter = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });

  const goLeft = Animated.spring(position, {
    toValue: { x: -SCREEN_WIDTH * 1.5, y: 0 },
    tension: 0.5,
    useNativeDriver: true,
  });

  const goRight = Animated.spring(position, {
    toValue: { x: SCREEN_WIDTH * 1.5, y: 0 },
    tension: 0.5,
    useNativeDriver: true,
  });

  const onPressCloseCard = useCallback(() => {
    Animated.parallel([onPressOut, goLeft]).start();
  }, []);

  const onPressCheckCard = useCallback(() => {
    Animated.parallel([onPressOut, goRight]).start();
  }, []);

  // PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => onPressIn.start(),
      onPanResponderMove: (_, { dx }) => {
        position.setValue({ x: dx, y: 0 });
      },
      onPanResponderRelease: (_, { dx }) => {
        if (dx < cardDismissRange.left) {
          onPressCloseCard();
        } else if (dx > cardDismissRange.right) {
          onPressCheckCard();
        } else {
          Animated.parallel([onPressOut, goCenter]).start();
        }
      },
    })
  ).current;

  return (
    <StViewContainer>
      <StViewCardContainer>
        <StViewAniCard
          {...panResponder.panHandlers}
          style={{
            transform: [{ scale: secondCardScale }],
          }}
        >
          <Ionicons name="beer" size={98} color="#192a56" />
        </StViewAniCard>
        <StViewAniCard
          {...panResponder.panHandlers}
          style={{
            transform: [
              { scale: scale },
              ...position.getTranslateTransform(),
              { rotateZ: rotation },
            ],
          }}
        >
          <Ionicons name="pizza" size={98} color="#192a56" />
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
