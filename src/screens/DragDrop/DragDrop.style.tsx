import { Animated } from 'react-native';
import styled from 'styled-components/native';

export const StViewContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.dragMainBackground};
`;

export const StViewEdge = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StViewWordContainer = styled.View`
  width: 100px;
  height: 100px;
  justify-content: center;
  align-items: center;
  background-color: gray;
  border-radius: 50px;
`;

export const AniStViewWordContainer =
  Animated.createAnimatedComponent(StViewWordContainer);

export const StTextWord = styled.Text<{ color: string }>`
  font-size: 38px;
  font-weight: 500;
  color: ${(props) => (props.color ? props.color : props.theme.dragMainText)};
`;

export const StViewCenter = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const StViewIconCard = styled.View`
  background-color: ${({ theme }) => theme.dragCardBackground};
  width: 120px;
  height: 120px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

export const AniStViewIconCard =
  Animated.createAnimatedComponent(StViewIconCard);
