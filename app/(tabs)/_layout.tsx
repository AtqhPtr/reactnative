import { Tabs } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Beranda',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="listdata"
          options={{
            title: 'Daftar Data',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="list.bullet" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="mapwebview"
          options={{
            title: 'Navigasi',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="globe" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favorite"
          options={{
            title: 'Favorit',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="heart.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="planner"
          options={{
            title: 'Rencana',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="calendar" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="gmap"
          options={{
            href: null,
            title: 'Gmap',
            tabBarIcon: ({ color }) => (
              <IconSymbol name="globe" size={28} color={color} />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
