import 'styled-components/native';

declare module 'styled-components/native' {
  export interface DefaultTheme {
    mode: string;
    headerBackground: string;
    headerText: string;
    tabBarBackground: string;
    tabBarLabelTint: string;
    tabBarLabelInactive: string;
    // Tab - Card
    cardMainBackground: string;
    // Tab - DragDrop
    dragMainBackground: string;
    dragMainText: string;
    dragSubText: string;
    dragCardBackground: string;
    // Tab - Challenge
    challMainBackground1: string;
    challMainBackground2: string;
    challMainBackground3: string;
    challDragWordSlotHighligher: string;
    challDragQuestion: string;
  }
}
