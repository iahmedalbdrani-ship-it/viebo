import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors } from '../constants/colors';
import { GlassButton } from '../components/GlassButton';
import { FloatingInput } from '../components/FloatingInput';
import { FloatingIcon } from '../components/FloatingIcon';
import { useAuth } from '../src/hooks/useAuth';
import { validateEmail, validatePassword } from '../src/utils/validation';

type AuthMode = 'signin' | 'signup';

export default function AuthScreen() {
  const router = useRouter();
  const { signIn, signUp, error, loading, clearError } = useAuth();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const handleSignIn = async () => {
    clearError();
    setEmailError('');
    setPasswordError('');

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (!emailValidation.valid) {
      setEmailError(emailValidation.error || '');
      return;
    }

    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.error || '');
      return;
    }

    const result = await signIn(email, password);
    if (result.success) {
      router.replace('/(tabs)');
    }
  };

  const handleSignUp = async () => {
    clearError();
    setEmailError('');
    setPasswordError('');
    setConfirmError('');

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (!emailValidation.valid) {
      setEmailError(emailValidation.error || '');
      return;
    }

    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.error || '');
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      return;
    }

    if (!username.trim()) {
      return;
    }

    const result = await signUp(email, password, username);
    if (result.success) {
      // Navigate to email verification or directly to app
      router.replace('/(tabs)');
    }
  };

  return (
    <LinearGradient
      colors={[Colors.bg, Colors.bg2]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header with floating icons */}
        <View style={styles.header}>
          <View style={styles.iconsContainer}>
            <FloatingIcon icon="🎵" size={32} />
            <FloatingIcon icon="✨" size={32} glowColor={Colors.secondary} />
            <FloatingIcon icon="🌈" size={32} glowColor={Colors.accent} />
          </View>

          <Text style={styles.title}>Viebo</Text>
          <Text style={styles.subtitle}>Find Your Vibe</Text>
        </View>

        {/* Form Container */}
        <BlurView intensity={85} style={styles.blurContainer}>
          <View style={styles.formContainer}>
            {/* Mode Tabs */}
            <View style={styles.modeTabs}>
              <TouchableOpacity
                style={[
                  styles.modeTab,
                  mode === 'signin' && styles.modeTabActive,
                ]}
                onPress={() => {
                  setMode('signin');
                  clearError();
                }}
              >
                <Text style={[
                  styles.modeTabText,
                  mode === 'signin' && styles.modeTabTextActive,
                ]}>
                  Sign In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeTab,
                  mode === 'signup' && styles.modeTabActive,
                ]}
                onPress={() => {
                  setMode('signup');
                  clearError();
                }}
              >
                <Text style={[
                  styles.modeTabText,
                  mode === 'signup' && styles.modeTabTextActive,
                ]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>❌ {error}</Text>
              </View>
            )}

            {/* Form Inputs */}
            <View style={styles.inputsContainer}>
              {mode === 'signup' && (
                <FloatingInput
                  label="Username"
                  icon="👤"
                  value={username}
                  onChangeText={setUsername}
                  editable={!loading}
                  autoCapitalize="none"
                />
              )}

              <FloatingInput
                label="Email Address"
                icon="📧"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError('');
                }}
                error={emailError}
                editable={!loading}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <FloatingInput
                label="Password"
                icon="🔒"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError('');
                }}
                error={passwordError}
                secureTextEntry
                editable={!loading}
              />

              {mode === 'signup' && (
                <FloatingInput
                  label="Confirm Password"
                  icon="🔒"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setConfirmError('');
                  }}
                  error={confirmError}
                  secureTextEntry
                  editable={!loading}
                />
              )}
            </View>

            {/* Buttons */}
            <View style={styles.buttonsContainer}>
              <GlassButton
                title={loading ? 'Loading...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
                onPress={mode === 'signin' ? handleSignIn : handleSignUp}
                disabled={loading}
                fullWidth
              />

              <GlassButton
                title="Sign In with Google"
                onPress={() => {}}
                variant="glass"
                icon="🔗"
                disabled={loading}
                fullWidth
              />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {mode === 'signin'
                  ? "Don't have an account? "
                  : 'Already have an account? '}
              </Text>
              <TouchableOpacity onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
                <Text style={styles.footerLink}>
                  {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  blurContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  formContainer: {
    padding: 24,
    backgroundColor: 'rgba(8, 8, 15, 0.6)',
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  modeTabActive: {
    backgroundColor: 'rgba(108, 59, 255, 0.2)',
  },
  modeTabText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  modeTabTextActive: {
    color: Colors.primary,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 13,
    fontWeight: '500',
  },
  inputsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  buttonsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  footerLink: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});
