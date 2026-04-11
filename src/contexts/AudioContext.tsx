import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import { Audio } from 'expo-av';

interface AudioContextType {
  currentId: string | null;
  isPlaying: boolean;
  progress: number; // 0 to 1
  currentPosition: number; // seconds
  totalDuration: number; // seconds
  playVoiceNote: (id: string, uri: string) => Promise<void>;
  pauseAudio: () => Promise<void>;
  resumeAudio: () => Promise<void>;
  stopAudio: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const stopAudio = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (_) {}
      soundRef.current = null;
    }
    setCurrentId(null);
    setIsPlaying(false);
    setProgress(0);
    setCurrentPosition(0);
    setTotalDuration(0);
  }, []);

  const playVoiceNote = useCallback(async (id: string, uri: string) => {
    // Unload any existing sound
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (_) {}
      soundRef.current = null;
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    setCurrentId(id);
    setIsPlaying(true);
    setProgress(0);
    setCurrentPosition(0);

    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true },
      (status) => {
        if (status.isLoaded) {
          const dur = (status.durationMillis ?? 0) / 1000;
          const pos = (status.positionMillis ?? 0) / 1000;
          setTotalDuration(dur);
          setCurrentPosition(pos);
          setProgress(dur > 0 ? pos / dur : 0);
          if (status.didJustFinish) {
            setIsPlaying(false);
            setProgress(0);
            setCurrentPosition(0);
          }
        }
      }
    );
    soundRef.current = sound;
  }, []);

  const pauseAudio = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    }
  }, []);

  const resumeAudio = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  }, []);

  return (
    <AudioContext.Provider
      value={{
        currentId,
        isPlaying,
        progress,
        currentPosition,
        totalDuration,
        playVoiceNote,
        pauseAudio,
        resumeAudio,
        stopAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
};
