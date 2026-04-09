import React, { useEffect } from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';

interface FloatingIconProps {
  icon: string;
  size?: number;
  glowColor?: string;
  onPress?: () => void;
}

export const FloatingIcon: React.FC<FloatingIconProps> = ({
  icon,
  size = 40,
  glowColor = Colors.primary,
  onPress,
}) => {
  const floatOffset = useSharedValue(0);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    // Continuous floating animation
    floatOffset.value = withRepeat(
      withTiming(10, {
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [floatOffset]);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: floatOffset.value,
      },
      {
        scale: pressScale.value,
      },
    ],
  }));

  const handlePress = () => {
    pressScale.value = withTiming(0.85, { duration: 150 }, () => {
      pressScale.value = withTiming(1, { duration: 150 });
    });
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => {
        pressScale.value = 0.85;
      }}
      onPressOut={() => {
        pressScale.value = withTiming(1, { duration: 150 });
      }}
    >
      <Animated.View style={[floatingStyle, { alignItems: 'center' }]}>
        {/* Glow effect */}
        <View
          style={{
            position: 'absolute',
            width: size + 20,
            height: size + 20,
            borderRadius: (size + 20) / 2,
            backgroundColor: glowColor,
            opacity: 0.15,
          }}
        />

        {/* Icon container with gradient */}
        <LinearGradient
          colors={[glowColor, Colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: size + 10,
            height: size + 10,
            borderRadius: (size + 10) / 2,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          <Text style={{ fontSize: size, lineHeight: size }}>{icon}</Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({});
