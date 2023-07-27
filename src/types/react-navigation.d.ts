import {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';

// Navigation
export type ScreenCommonParams = {
  navHeight?: number;
};

export type RootTabParamList = {
  CardSlide: ScreenCommonParams;
  DragDrop: ScreenCommonParams;
  Challenge: ScreenCommonParams;
};

export type TabScreenProps<T extends keyof RootTabParamList> =
  BottomTabScreenProps<RootTabParamList, T>;
