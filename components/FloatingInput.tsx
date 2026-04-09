import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  Animated,
  Easing,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../constants/colors';

interface FloatingInputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: string;
  secureTextEntry?: boolean;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  error,
  icon,
  value,
  onFocus: onFocusProps,
  onBlur: onBlurProps,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const labelPosition = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.timing(labelPosition, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    onFocusProps?.(e);
  };

  const handleBlur = (e: any) => {
    if (!value) {
      setIsFocused(false);
      Animated.timing(labelPosition, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }
    onBlurProps?.(e);
  };

  const labelTop = labelPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 8],
  });

  const labelSize = labelPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  return (
    <View style={styles.container}>
      <BlurView intensity={70} style={styles.blurView}>
        <View
          style={[
            styles.inputContainer,
            isFocused && styles.inputFocused,
            error && styles.inputError,
          ]}
        >
          {icon && <Text style={styles.icon}>{icon}</Text>}

          <View style={styles.inputWrapper}>
            <Animated.Text
              style={[
                styles.label,
                {
                  top: labelTop,
                  fontSize: labelSize,
                },
              ]}
            >
              {label}
            </Animated.Text>

            <TextInput
              {...rest}
              value={value}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholderTextColor={Colors.textSecondary}
              style={styles.input}
            />
          </View>
        </View>
      </BlurView>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  blurView: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    minHeight: 56,
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(108, 59, 255, 0.08)',
  },
  inputError: {
    borderColor: Colors.danger,
    backgroundColor: 'rgba(255, 51, 102, 0.05)',
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
    color: Colors.primary,
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  label: {
    color: Colors.textSecondary,
    fontWeight: '500',
    position: 'absolute',
    left: 0,
    paddingHorizontal: 4,
  },
  input: {
    color: Colors.text,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
