import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { styled, useTheme } from 'styled-components/native';

// Screens
import CardSlide from '~/screens/CardSlide/CardSlide';
import DragDrop from '~/screens/DragDrop/DragDrop';
import Challenge from '~/screens/Challenge/Challenge';

// Types
import { RootTabParamList } from '~/types/react-navigation';

// Styles

const StViewDragDropIcons = styled.View`
  flex-direction: row;
`;

const Nav = createBottomTabNavigator<RootTabParamList>();

const Root = () => {
  const theme = useTheme();

  return (
    <Nav.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBarBackground,
          height: 60,
        },
        tabBarActiveTintColor: theme.tabBarLabelTint,
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '500',
        },
      }}
    >
      <Nav.Screen
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="albums-outline" size={size} color={color} />;
          },
        }}
        name="CardSlide"
        component={CardSlide}
      />
      <Nav.Screen
        options={{
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
        name="DragDrop"
        component={DragDrop}
      />
      <Nav.Screen
        options={{
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
        name="Challenge"
        component={Challenge}
      />
    </Nav.Navigator>
  );
};

export default Root;
