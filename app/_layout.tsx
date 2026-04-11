import React, { useEffect } from 'react';
import { Stack, useRouter, useRootNavigationState } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { AudioProvider } from '../src/contexts/AudioContext';

function RootLayoutContent() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  // Check if the navigation (Router) system is ready
  const isNavigationReady = !!rootNavigationState?.key;

  useEffect(() => {
    // Golden rule: do not move if there is loading or if Router is not ready yet
    if (loading || !isNavigationReady) return;

    // Delay navigation to next tick to ensure Stack navigator is fully mounted
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth');
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isAuthenticated, loading, isNavigationReady]);

  // To fix "Ensure the Root Layout is rendering a navigator" error
  // Must always return the Stack even while loading
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" options={{ href: null }} />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="conversation/[id]" />
      </Stack>

      {/* Loading screen appears as an "overlay" until everything is ready */}
      {(loading || !isNavigationReady) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AudioProvider>
        <StatusBar style="light" />
        <RootLayoutContent />
      </AudioProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});
