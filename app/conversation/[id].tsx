import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import VoiceNotePlayer from '../../components/VoiceNotePlayer';
import VoiceNoteRecorder from '../../components/VoiceNoteRecorder';
import { supabase, isSupabaseConfigured } from '../../src/config/supabase';

interface Message {
  id: string;
  type: 'text' | 'voice';
  content?: string;
  voiceUri?: string;
  voiceDuration?: number;
  isMine: boolean;
  timestamp: string;
}

const MOCK_CHATS: Record<string, { name: string; initials: string }> = {
  '1': { name: 'Alex', initials: 'A' },
  '2': { name: 'Jordan', initials: 'J' },
  '3': { name: 'Casey', initials: 'C' },
  '4': { name: 'Morgan', initials: 'M' },
  '5': { name: 'Taylor', initials: 'T' },
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    type: 'text',
    content: 'Hey! What are you up to?',
    isMine: false,
    timestamp: '10:42 AM',
  },
  {
    id: 'm2',
    type: 'voice',
    voiceUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    voiceDuration: 8,
    isMine: true,
    timestamp: '10:43 AM',
  },
  {
    id: 'm3',
    type: 'text',
    content: 'That sounds amazing! 🔥',
    isMine: false,
    timestamp: '10:44 AM',
  },
  {
    id: 'm4',
    type: 'voice',
    voiceUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    voiceDuration: 15,
    isMine: false,
    timestamp: '10:45 AM',
  },
  {
    id: 'm5',
    type: 'text',
    content: 'Let me send you a voice message 👇',
    isMine: true,
    timestamp: '10:46 AM',
  },
];

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [text, setText] = useState('');
  const [showRecorder, setShowRecorder] = useState(false);
  const recorderSlide = useRef(new Animated.Value(300)).current;

  const chat = MOCK_CHATS[id ?? '1'] ?? { name: 'Chat', initials: '?' };

  const avatarColors: Record<string, string[]> = {
    A: ['#FF6B9D', '#FFA348'],
    J: ['#6C3BFF', '#9D4EDD'],
    C: ['#00D4FF', '#0099CC'],
    M: ['#FF006E', '#FB5607'],
    T: ['#FFBE0B', '#FB5607'],
    '?': ['#6C3BFF', '#9D4EDD'],
  };
  const gradientColors = avatarColors[chat.initials] ?? ['#6C3BFF', '#9D4EDD'];

  useEffect(() => {
    if (showRecorder) {
      Animated.spring(recorderSlide, {
        toValue: 0,
        friction: 8,
        tension: 60,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(recorderSlide, {
        toValue: 300,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [showRecorder]);

  const sendText = () => {
    if (!text.trim()) return;
    const msg: Message = {
      id: `m${Date.now()}`,
      type: 'text',
      content: text.trim(),
      isMine: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, msg]);
    setText('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleVoiceSend = async (uri: string, duration: number) => {
    setShowRecorder(false);

    let finalUri = uri;
    if (isSupabaseConfigured) {
      try {
        const fileName = `voice-notes/${Date.now()}.m4a`;
        const blob = await fetch(uri).then((r) => r.blob());
        const { data } = await supabase.storage.from('voice-notes').upload(fileName, blob, {
          contentType: 'audio/m4a',
          upsert: false,
        });
        if (data) {
          const { data: urlData } = supabase.storage.from('voice-notes').getPublicUrl(data.path);
          finalUri = urlData.publicUrl;
        }
      } catch (err) {
        // Use local URI on upload failure
      }
    }

    const msg: Message = {
      id: `m${Date.now()}`,
      type: 'voice',
      voiceUri: finalUri,
      voiceDuration: duration,
      isMine: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, msg]);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageRow, item.isMine ? styles.messageRowMine : styles.messageRowOther]}>
      {item.type === 'voice' ? (
        <VoiceNotePlayer
          id={item.id}
          uri={item.voiceUri!}
          duration={item.voiceDuration ?? 0}
          isMine={item.isMine}
        />
      ) : (
        <BlurView intensity={60} style={[styles.bubble, item.isMine ? styles.bubbleMine : styles.bubbleOther]}>
          <Text style={[styles.bubbleText, item.isMine ? styles.bubbleTextMine : styles.bubbleTextOther]}>
            {item.content}
          </Text>
        </BlurView>
      )}
      <Text style={[styles.msgTime, item.isMine && { textAlign: 'right' }]}>{item.timestamp}</Text>
    </View>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <LinearGradient colors={[Colors.bg, Colors.bg2]} style={styles.bg}>
        {/* Header */}
        <BlurView intensity={80} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back-ios" size={20} color={Colors.text} />
          </TouchableOpacity>

          <LinearGradient
            colors={gradientColors as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerAvatar}
          >
            <Text style={styles.headerAvatarText}>{chat.initials}</Text>
          </LinearGradient>

          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{chat.name}</Text>
            <Text style={styles.headerStatus}>● Online</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerIconBtn}>
              <MaterialIcons name="phone" size={22} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconBtn}>
              <MaterialIcons name="videocam" size={22} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </BlurView>

        {/* Messages */}
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={insets.top + 60}
        >
          <FlatList
            ref={listRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(m) => m.id}
            contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 80 }]}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => listRef.current?.scrollToEnd()}
          />

          {/* Input bar */}
          <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
            <BlurView intensity={90} style={styles.inputBlur}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Message..."
                  placeholderTextColor={Colors.textSecondary}
                  value={text}
                  onChangeText={setText}
                  multiline
                  maxLength={500}
                />
                {text.trim() ? (
                  <TouchableOpacity style={styles.sendBtn} onPress={sendText}>
                    <LinearGradient
                      colors={[Colors.primary, Colors.accent]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.sendGradient}
                    >
                      <MaterialIcons name="send" size={18} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.micBtn}
                    onPress={() => setShowRecorder(true)}
                  >
                    <LinearGradient
                      colors={[Colors.primary, Colors.secondary]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.sendGradient}
                    >
                      <MaterialIcons name="mic" size={18} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </BlurView>
          </View>
        </KeyboardAvoidingView>

        {/* Voice Recorder Overlay */}
        {showRecorder && (
          <View style={styles.recorderOverlay}>
            <TouchableOpacity
              style={styles.recorderBackdrop}
              onPress={() => setShowRecorder(false)}
              activeOpacity={1}
            />
            <Animated.View
              style={[
                styles.recorderSheet,
                { transform: [{ translateY: recorderSlide }] },
              ]}
            >
              <VoiceNoteRecorder
                onSend={handleVoiceSend}
                onCancel={() => setShowRecorder(false)}
              />
            </Animated.View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  bg: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  backBtn: {
    padding: 8,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  headerStatus: {
    color: '#4AFF6F',
    fontSize: 12,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(108, 59, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 6,
  },
  messageRow: {
    marginVertical: 3,
  },
  messageRowMine: {
    alignItems: 'flex-end',
  },
  messageRowOther: {
    alignItems: 'flex-start',
  },
  bubble: {
    borderRadius: 18,
    overflow: 'hidden',
    maxWidth: '75%',
  },
  bubbleMine: {
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  bubbleTextMine: {
    color: Colors.text,
    backgroundColor: 'rgba(108, 59, 255, 0.4)',
  },
  bubbleTextOther: {
    color: Colors.text,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },
  msgTime: {
    color: Colors.textSecondary,
    fontSize: 10,
    marginTop: 3,
    marginHorizontal: 4,
    fontWeight: '500',
  },
  inputBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  inputBlur: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  textInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
    maxHeight: 100,
    paddingVertical: 6,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  micBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  sendGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recorderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  recorderBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  recorderSheet: {
    marginHorizontal: 0,
  },
});
