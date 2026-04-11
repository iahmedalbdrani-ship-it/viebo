import React, { useEffect, useRef } from 'react';
import { Stack, useRouter, useRootNavigationState, useSegments } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { AudioProvider } from '../src/contexts/AudioContext';
import { Colors } from '../constants/colors';

function RootLayoutContent() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();
  const isFirstRender = useRef(true);

  const isNavigationReady = !!rootNavigationState?.key;

  useEffect(() => {
    if (loading || !isNavigationReady) return;

    // Skip first render to ensure Stack is fully mounted before navigating
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const inTabs = segments[0] === '(tabs)';
    const inAuth = segments[0] === 'auth';
    const inConversation = segments[0] === 'conversation';

    // Only navigate if not already at the target destination
    if (isAuthenticated && !inTabs && !inConversation) {
      router.replace('/(tabs)');
    } else if (!isAuthenticated && !inAuth) {
      router.replace('/auth');
    }
  }, [isAuthenticated, loading, isNavigationReady, segments]);

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="conversation/[id]" />
      </Stack>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <AudioProvider>
            <StatusBar style="light" />
            <RootLayoutContent />
          </AudioProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});
