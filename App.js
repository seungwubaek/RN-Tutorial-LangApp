import React, { useCallback, useRef, useState } from 'react';
import { Dimensions, Animated, Easing } from 'react-native';
import styled from 'styled-components/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Styled

const StViewContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StPressable = styled.Pressable``;

const StView = styled.View`
  background-color: tomato;
  width: 200px;
  height: 200px;
`;

const AniStView = Animated.createAnimatedComponent(StView);

export default function App() {
  const position = useRef(
    new Animated.ValueXY({
      x: -SCREEN_WIDTH / 2 + 100,
      y: -SCREEN_HEIGHT / 2 + 100,
    })
  ).current;

  const moveTopLeft = () => {
    return Animated.timing(position, {
      toValue: { x: -SCREEN_WIDTH / 2 + 100, y: -SCREEN_HEIGHT / 2 + 100 },
      useNativeDriver: false,
    });
  };

  const moveBottomLeft = () => {
    return Animated.timing(position, {
      toValue: { x: -SCREEN_WIDTH / 2 + 100, y: SCREEN_HEIGHT / 2 - 100 },
      useNativeDriver: false,
    });
  };

  const moveBottomRight = () => {
    return Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH / 2 - 100, y: SCREEN_HEIGHT / 2 - 100 },
      useNativeDriver: false,
    });
  };

  const moveTopRight = () => {
    return Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH / 2 - 100, y: -SCREEN_HEIGHT / 2 + 100 },
      useNativeDriver: false,
    });
  };

  const moveUp = () => {
    console.log('Pressed');
    Animated.loop(
      Animated.sequence([
        moveBottomLeft(),
        moveBottomRight(),
        moveTopRight(),
        moveTopLeft(),
      ])
    ).start(() => {
      console.log('Loop cycle end once');
    });
  };

  const opacity = position.y.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [1, 0.5, 1],
  });

  const borderRadius = position.y.interpolate({
    inputRange: [-300, 300],
    outputRange: [100, 0],
  });

  const bdColor = position.y.interpolate({
    inputRange: [-300, 300],
    outputRange: ['rgb(255, 99, 71)', 'rgb(71, 166, 255)'],
  });

  return (
    <StViewContainer>
      <StPressable onPress={moveUp}>
        <AniStView
          style={{
            backgroundColor: bdColor,
            borderRadius,
            opacity,
            transform: [...position.getTranslateTransform()],
          }}
        />
      </StPressable>
    </StViewContainer>
  );
}
