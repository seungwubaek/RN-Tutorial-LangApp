import { Animated } from 'react-native';
import styled from 'styled-components/native';

export const SLOT_PADDING = 30;
export const SLOT_SIZE = 120;
const SLOT_HIGHLIGHTER_SIZE = 120;

export const StViewWordSlotContainer = styled.View<{
  containerPosition: string;
}>`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: ${(props) =>
    props.containerPosition === 'top' ? 'flex-end' : 'flex-start'};
  padding: 0 ${SLOT_PADDING}px;
`;

const StViewWordSlot = styled.View`
  width: ${SLOT_SIZE}px;
  height: ${SLOT_SIZE}px;
  justify-content: center;
  align-items: center;
`;

export const AniStViewWordSlot =
  Animated.createAnimatedComponent(StViewWordSlot);

const StViewSlotIconWrapper = styled.View``;

export const AniStViewSlotIconWrapper = Animated.createAnimatedComponent(
  StViewSlotIconWrapper
);

const StViewWordSlotHighlighter = styled.View`
  width: ${SLOT_HIGHLIGHTER_SIZE}px;
  height: ${SLOT_HIGHLIGHTER_SIZE}px;
  background-color: ${({ theme }) => theme.challDragWordSlotHighligher};
  position: absolute;
  border-radius: ${SLOT_HIGHLIGHTER_SIZE / 2}px;
`;

export const AniStViewWordSlotHighlighter = Animated.createAnimatedComponent(
  StViewWordSlotHighlighter
);
