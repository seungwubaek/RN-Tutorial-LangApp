import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { styled, useTheme } from 'styled-components/native';

// Screens
import CardSlide from '~/screens/CardSlide/CardSlide';
import DragDrop from '~/screens/DragDrop/DragDrop';
import ChallengeDragNDrop from '~/screens/ChallengeDragNDrop';

// Types
import { RootTabParamList } from '~/types/react-navigation';

// Styles
const StViewDragDropIcons = styled.View`
  flex-direction: row;
`;

const Nav = createBottomTabNavigator<RootTabParamList>();

const Root = () => {
  const theme = useTheme();

  // Values
  const NAV_HEIGHT = 70;

  return (
    <Nav.Navigator
      screenOptions={{
        unmountOnBlur: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBarBackground,
          paddingVertical: 5,
          height: NAV_HEIGHT,
        },
        tabBarActiveTintColor: theme.tabBarLabelTint,
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '500',
          paddingBottom: 5,
        },
      }}
    >
      <Nav.Screen
        name="CardSlide"
        component={CardSlide}
        initialParams={{ navHeight: NAV_HEIGHT }}
        options={{
          title: 'Card Slide',
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="albums-outline" size={size} color={color} />;
          },
        }}
      />
      <Nav.Screen
        name="DragDrop"
        component={DragDrop}
        initialParams={{ navHeight: NAV_HEIGHT }}
        options={{
          title: 'Drag & Drop',
          tabBarActiveBackgroundColor: theme.tabBarBackground,
          tabBarInactiveBackgroundColor: theme.tabBarBackground,
          tabBarIcon: ({ color, size }) => {
            return (
              <StViewDragDropIcons>
                <Ionicons
                  name="log-out-outline"
                  size={size / 1.2}
                  color={color}
                  style={{ transform: [{ rotate: '-90deg' }] }}
                />
                <Ionicons
                  name="log-out-outline"
                  size={size / 1.2}
                  color={color}
                  style={{ transform: [{ rotate: '90deg' }] }}
                />
              </StViewDragDropIcons>
            );
          },
        }}
      />
      <Nav.Screen
        name="ChallengeDragNDrop"
        component={ChallengeDragNDrop}
        initialParams={{ navHeight: NAV_HEIGHT }}
        options={{
          title: 'Challenge',
          tabBarIcon: ({ color, size }) => {
            return (
              <Ionicons
                name="american-football-outline"
                size={size}
                color={color}
              />
            );
          },
        }}
      />
    </Nav.Navigator>
  );
};

export default Root;
