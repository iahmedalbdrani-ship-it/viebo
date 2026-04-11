import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
} from 'react-native';
import { Audio } from 'expo-av';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

const NUM_BARS = 40;
const SLIDE_CANCEL_THRESHOLD = -80;

interface Props {
  onSend: (uri: string, duration: number) => void;
  onCancel: () => void;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function VoiceNoteRecorder({ onSend, onCancel }: Props) {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const durationRef = useRef(0);
  const cancelledRef = useRef(false);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [waveform, setWaveform] = useState<number[]>(Array(NUM_BARS).fill(0.15));
  const [cancelled, setCancelled] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideX = useRef(new Animated.Value(0)).current;
  const rippleAnim = useRef(new Animated.Value(1)).current;
  const rippleOpacity = useRef(new Animated.Value(0.4)).current;

  // Ripple pulse while recording
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(rippleAnim, { toValue: 1.6, duration: 800, useNativeDriver: true }),
            Animated.timing(rippleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(rippleOpacity, { toValue: 0, duration: 800, useNativeDriver: true }),
            Animated.timing(rippleOpacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
          ]),
        ])
      ).start();
    } else {
      rippleAnim.setValue(1);
      rippleOpacity.setValue(0.4);
    }
  }, [isRecording]);

  const startRecording = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      onCancel();
      return;
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    });

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync({
      ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
      isMeteringEnabled: true,
    });

    recording.setOnRecordingStatusUpdate((status) => {
      if (status.isRecording && status.metering !== undefined) {
        const normalized = Math.max(0, Math.min(1, (status.metering + 60) / 60));
        setWaveform((prev) => {
          const next = [...prev.slice(1), Math.max(0.1, normalized)];
          return next;
        });
      }
    });

    await recording.startAsync();
    recordingRef.current = recording;
    setIsRecording(true);
    setDuration(0);

    durationRef.current = 0;
    timerRef.current = setInterval(() => {
      durationRef.current += 1;
      setDuration(durationRef.current);
    }, 1000);

    Animated.spring(scaleAnim, {
      toValue: 1.2,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  const stopRecording = async (send: boolean) => {
    if (!recordingRef.current) return;

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      setIsRecording(false);

      if (send && uri && !cancelledRef.current) {
        onSend(uri, durationRef.current);
      } else {
        onCancel();
      }
    } catch (_) {
      onCancel();
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startRecording();
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          slideX.setValue(gestureState.dx);
        }
        if (gestureState.dx < SLIDE_CANCEL_THRESHOLD) {
          cancelledRef.current = true;
          setCancelled(true);
        } else {
          cancelledRef.current = false;
          setCancelled(false);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        slideX.setValue(0);
        const shouldCancel = gestureState.dx < SLIDE_CANCEL_THRESHOLD;
        cancelledRef.current = shouldCancel;
        stopRecording(!shouldCancel);
        setCancelled(false);
      },
    })
  ).current;

  const slideOpacity = slideX.interpolate({
    inputRange: [SLIDE_CANCEL_THRESHOLD, 0],
    outputRange: [0.3, 1],
    extrapolate: 'clamp',
  });

  return (
    <BlurView intensity={90} style={styles.container}>
      <LinearGradient
        colors={['rgba(15, 15, 26, 0.95)', 'rgba(26, 26, 46, 0.98)']}
        style={styles.inner}
      >
        {/* Waveform */}
        <Animated.View style={[styles.waveformContainer, { opacity: slideOpacity }]}>
          <View style={styles.waveform}>
            {waveform.map((val, idx) => {
              const progress = idx / NUM_BARS;
              // Gradient color interpolation from silver to violet
              const r = Math.round(192 + (108 - 192) * progress);
              const g = Math.round(192 + (59 - 192) * progress);
              const b = Math.round(192 + (255 - 192) * progress);
              const color = isRecording ? `rgb(${r},${g},${b})` : Colors.textSecondary;
              return (
                <View
                  key={idx}
                  style={[
                    styles.bar,
                    {
                      height: Math.max(4, val * 40),
                      backgroundColor: color,
                      opacity: isRecording ? 0.9 : 0.4,
                    },
                  ]}
                />
              );
            })}
          </View>

          {isRecording && (
            <View style={styles.durationRow}>
              <View style={styles.recDot} />
              <Text style={styles.durationText}>{formatDuration(duration)}</Text>
            </View>
          )}
        </Animated.View>

        {/* Slide to cancel hint */}
        {isRecording && (
          <Animated.View style={[styles.slideHint, { opacity: slideOpacity }]}>
            <MaterialIcons name="chevron-left" size={18} color={cancelled ? Colors.danger : Colors.textSecondary} />
            <Text style={[styles.slideHintText, cancelled && { color: Colors.danger }]}>
              {cancelled ? 'Release to cancel' : 'Slide left to cancel'}
            </Text>
          </Animated.View>
        )}

        {/* Controls row */}
        <View style={styles.controls}>
          {/* Cancel button (not recording) */}
          {!isRecording && (
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <MaterialIcons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}

          {/* Mic button */}
          <Animated.View
            {...panResponder.panHandlers}
            style={[styles.micWrapper, { transform: [{ scale: scaleAnim }] }]}
          >
            <Animated.View
              style={[
                styles.ripple,
                {
                  transform: [{ scale: rippleAnim }],
                  opacity: rippleOpacity,
                },
              ]}
            />
            <LinearGradient
              colors={isRecording ? [Colors.danger, '#FF6B9D'] : [Colors.primary, Colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.micButton}
            >
              <MaterialIcons
                name={isRecording ? 'stop' : 'mic'}
                size={28}
                color="#fff"
              />
            </LinearGradient>
          </Animated.View>

          {/* Send confirmation when recording */}
          {isRecording && (
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={() => stopRecording(true)}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sendGradient}
              >
                <MaterialIcons name="send" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Hint text when not recording */}
        {!isRecording && (
          <Text style={styles.hintText}>Hold mic to record</Text>
        )}
      </LinearGradient>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  inner: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(108, 59, 255, 0.3)',
  },
  waveformContainer: {
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 60,
    justifyContent: 'center',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    gap: 2,
  },
  bar: {
    width: 3,
    borderRadius: 2,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  recDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.danger,
  },
  durationText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  slideHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  slideHintText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginTop: 8,
  },
  cancelBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.danger,
  },
  micButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  sendGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintText: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '500',
  },
});
