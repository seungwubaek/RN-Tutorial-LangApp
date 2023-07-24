import { Animated } from 'react-native';
import styled from 'styled-components/native';

export const StViewContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #00a8ff;
`;

export const StViewCardContainer = styled.View`
  flex: 2.5;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 50px;
`;

export const StViewCard = styled.View`
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

export const StViewCardControlContainer = styled.View`
  flex: 1;
  flex-direction: row;
  margin: 0;
  gap: 20px;
  justify-content: center;
  align-items: flex-start;
`;

export const StBtnCardControl = styled.TouchableOpacity``;

export const StViewAniCard = Animated.createAnimatedComponent(StViewCard);
