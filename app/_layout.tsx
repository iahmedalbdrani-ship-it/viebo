import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { UIProvider } from '../contexts/UIContext';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { AudioProvider } from '../src/contexts/AudioContext';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/colors';

function RootLayoutContent() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;
    const inTabs = segments[0] === '(tabs)';
    const inConversation = segments[0] === 'conversation';
    if (!isAuthenticated && (inTabs || inConversation)) {
      router.replace('/auth');
    } else if (isAuthenticated && !inTabs && !inConversation) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, loading]);

  return (
    <>
      {/* Stack must ALWAYS render — expo-router requires navigator to be mounted */}
      <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="index" />
        <Stack.Screen name="conversation/[id]" />
      </Stack>

      {/* Loading overlay sits on top — never replaces the Stack */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </>
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
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
