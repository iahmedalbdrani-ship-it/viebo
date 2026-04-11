import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/colors';

export default function SplashScreen() {
  // Routing is handled by _layout.tsx based on auth state.
  // This screen is just the initial splash shown until navigation decides where to go.
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logo}>
          <View style={styles.logoCircle}>
            <View style={styles.logoDot} />
          </View>
        </View>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
  },
  logo: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
});
