import { Stack } from 'expo-router';
import { UIProvider } from '../contexts/UIContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <UIProvider>
      <StatusBar barStyle="light-content" backgroundColor="#08080F" />
      <Stack
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </UIProvider>
  );
}
