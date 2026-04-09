import React from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'glass';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  fullWidth?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  fullWidth = true,
}) => {
  const pressScale = useSharedValue(1);

  const handlePressIn = () => {
    pressScale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    pressScale.value = withTiming(1, { duration: 100 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const isDisabled = disabled || loading;

  const renderContent = () => (
    <View style={styles.content}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.text, variant === 'secondary' && styles.secondaryText]}>
        {loading ? 'Loading...' : title}
      </Text>
    </View>
  );

  if (variant === 'glass') {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
      >
        <Animated.View style={[animatedStyle, fullWidth && styles.fullWidth]}>
          <BlurView intensity={80} style={styles.glassButton}>
            <View
              style={{
                borderWidth: 1,
                borderColor: Colors.primary,
                borderRadius: 12,
                paddingVertical: 14,
                paddingHorizontal: 20,
                opacity: isDisabled ? 0.5 : 1,
              }}
            >
              {renderContent()}
            </View>
          </BlurView>
        </Animated.View>
      </Pressable>
    );
  }

  if (variant === 'secondary') {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
      >
        <Animated.View style={[animatedStyle, fullWidth && styles.fullWidth]}>
          <View
            style={[
              styles.button,
              styles.secondaryButton,
              isDisabled && styles.disabledButton,
            ]}
          >
            {renderContent()}
          </View>
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
    >
      <Animated.View style={[animatedStyle, fullWidth && styles.fullWidth]}>
        <LinearGradient
          colors={[Colors.primary, Colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.button, isDisabled && styles.disabledButton]}
        >
          {renderContent()}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
  disabledButton: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 18,
  },
  text: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryText: {
    color: Colors.primary,
  },
  fullWidth: {
    width: '100%',
  },
});
