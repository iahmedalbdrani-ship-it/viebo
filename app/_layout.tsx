import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { UIProvider } from '../contexts/UIContext';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { AudioProvider } from '../src/contexts/AudioContext';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/colors';

function RootLayoutContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.bg,
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="conversation/[id]" />
        </>
      ) : (
        <>
          <Stack.Screen name="auth" />
          <Stack.Screen name="index" />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AudioProvider>
        <UIProvider>
          <StatusBar hidden={false} />
          <RootLayoutContent />
        </UIProvider>
      </AudioProvider>
    </AuthProvider>
  );
}
