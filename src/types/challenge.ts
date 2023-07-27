import { Ionicons } from '@expo/vector-icons';

export type Word = {
  icon: keyof typeof Ionicons.glyphMap;
  ko: string;
  en: string;
};

export type WordDict = {
  [key: string]: Word;
};

export type LayoutRect<T> = {
  topLeft: T;
  topRight: T;
  bottomLeft: T;
  bottomRight: T;
};
