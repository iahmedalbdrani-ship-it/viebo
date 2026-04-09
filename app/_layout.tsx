import { Stack } from 'expo-router';
import { UIProvider } from '../contexts/UIContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <UIProvider>
      <StatusBar hidden={false} />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </UIProvider>
  );
}
