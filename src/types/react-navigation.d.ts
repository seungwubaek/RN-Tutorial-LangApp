import {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';

// Navigation
export type RootTabParamList = {
  CardSlide: undefined;
  DragDrop: undefined;
  Challenge: undefined;
};

export type TabScreenProps<T extends keyof RootTabParamList> =
  BottomTabScreenProps<RootTabParamList, T>;
