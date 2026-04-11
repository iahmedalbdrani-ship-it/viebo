import React, { useEffect } from 'react';
import { Stack, useRouter, useRootNavigationState } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { UIProvider } from '../contexts/UIContext';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { AudioProvider } from '../src/contexts/AudioContext';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/colors';

function RootLayoutContent() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Guard: checks if the navigation system is ready
  const rootNavigationState = useRootNavigationState();
  const isNavigationReady = rootNavigationState?.key;

  useEffect(() => {
    // If system is still loading or router is not ready, do nothing
    if (loading || !isNavigationReady) return;

    // Now we are certain the router is completely ready to switch
    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      router.replace('/auth');
    }
  }, [isAuthenticated, loading, isNavigationReady]);

  // Important: in SDK 54, must always return a navigation structure (Stack or Slot)
  // even if showing a loading indicator on top of it
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" options={{ href: null }} />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="conversation/[id]" />
      </Stack>

      {/* If app is loading, show Loading layer on top of the Stack */}
      {(loading || !isNavigationReady) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </View>
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

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});
