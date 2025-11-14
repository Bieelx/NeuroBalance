import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import SaudeScreen from '../screens/SaudeScreen';
import AnalisesScreen from '../screens/AnaliseScreen';
import ConfigScreen from '../screens/ConfigScreen';
import { CustomTabBar } from '../components/CustomTabBar';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Início"
        component={HomeScreen}
        options={{
          tabBarIcon: 'home-outline',
        }}
      />
      <Tab.Screen
        name="Saúde"
        component={SaudeScreen}
        options={{
          tabBarIcon: 'pulse-outline',
        }}
      />
      <Tab.Screen
        name="Análises"
        component={AnalisesScreen}
        options={{
          tabBarIcon: 'bar-chart-outline',
        }}
      />
      <Tab.Screen
        name="Config"
        component={ConfigScreen}
        options={{
          tabBarIcon: 'settings-outline',
        }}
      />
    </Tab.Navigator>
  );
}