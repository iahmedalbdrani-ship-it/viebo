import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Modal, Image, Animated, Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../constants/colors';

const { width } = Dimensions.get('window');

interface Story {
  id: string;
  name: string;
  initials: string;
  time: string;
  viewed: boolean;
  gradient: [string, string];
}

const MOCK_STORIES: Story[] = [
  { id: '1', name: 'Alex',   initials: 'A', time: '2m ago',  viewed: false, gradient: ['#FF6B9D', '#FFA348'] },
  { id: '2', name: 'Jordan', initials: 'J', time: '15m ago', viewed: false, gradient: ['#6C3BFF', '#9D4EDD'] },
  { id: '3', name: 'Casey',  initials: 'C', time: '1h ago',  viewed: true,  gradient: ['#00D4FF', '#0099CC'] },
  { id: '4', name: 'Morgan', initials: 'M', time: '2h ago',  viewed: true,  gradient: ['#FF006E', '#FB5607'] },
  { id: '5', name: 'Taylor', initials: 'T', time: '3h ago',  viewed: false, gradient: ['#FFBE0B', '#FB5607'] },
  { id: '6', name: 'Riley',  initials: 'R', time: '5h ago',  viewed: true,  gradient: ['#00FF88', '#00CC6A'] },
];

const FEATURED: Story[] = [
  { id: '7', name: 'Morning Vibes',  initials: '🌅', time: '10 viewers', viewed: false, gradient: ['#FF6B9D', '#6C3BFF'] },
  { id: '8', name: 'Night Life',     initials: '🌙', time: '24 viewers', viewed: false, gradient: ['#0099CC', '#6C3BFF'] },
  { id: '9', name: 'Weekend Goals',  initials: '🎯', time: '8 viewers',  viewed: true,  gradient: ['#FF006E', '#FFBE0B'] },
];

// ─── Floating Story Bubble ───────────────────────────────────────────────────
interface StoryBubbleProps {
  story: Story;
  size?: number;
  delay?: number;
}

function StoryBubble({ story, size = 70, delay = 0 }: StoryBubbleProps) {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -7,
          duration: 2500,
          delay,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View style={[styles.storyWrapper, { transform: [{ translateY: floatAnim }] }]}>
      <TouchableOpacity activeOpacity={0.8}>
        <LinearGradient
          colors={story.viewed ? [Colors.border, Colors.border] : ['#FF6B9D', '#6C3BFF', '#00D4FF']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={[styles.storyRing, { width: size + 6, height: size + 6, borderRadius: (size + 6) / 2 }]}
        >
          <View style={[styles.storyRingInner, { width: size + 2, height: size + 2, borderRadius: (size + 2) / 2 }]}>
            <LinearGradient
              colors={story.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.storyAvatar, { width: size, height: size, borderRadius: size / 2 }]}
            >
              <Text style={[styles.storyInitials, { fontSize: size * 0.36 }]}>{story.initials}</Text>
            </LinearGradient>
          </View>
        </LinearGradient>
        <Text style={styles.storyName} numberOfLines={1}>{story.name}</Text>
        {story.time ? <Text style={styles.storyTime}>{story.time}</Text> : null}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── My Story Bubble (with upload) ──────────────────────────────────────────
interface MyStoryBubbleProps {
  image: string | null;
  onPress: () => void;
}

function MyStoryBubble({ image, onPress }: MyStoryBubbleProps) {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -7, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0,  duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View style={[styles.storyWrapper, { transform: [{ translateY: floatAnim }] }]}>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <View style={styles.myStoryContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.myStoryImage} />
          ) : (
            <View style={styles.myStoryAvatar}>
              <MaterialIcons name="person" size={30} color={Colors.textSecondary} />
            </View>
          )}
          <View style={styles.addBadge}>
            <MaterialIcons name="add" size={14} color="#fff" />
          </View>
        </View>
        <Text style={styles.storyName}>My Story</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function StoryScreen() {
  const insets = useSafeAreaInsets();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [myStoryImage, setMyStoryImage] = useState<string | null>(null);

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setShowUploadModal(false);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.8,
      allowsEditing: true,
      aspect: [9, 16],
    });
    if (!result.canceled && result.assets[0]) {
      setMyStoryImage(result.assets[0].uri);
    }
    setShowUploadModal(false);
  };

  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setShowUploadModal(false);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
      aspect: [9, 16],
    });
    if (!result.canceled && result.assets[0]) {
      setMyStoryImage(result.assets[0].uri);
    }
    setShowUploadModal(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={[Colors.bg, Colors.bg2]} style={styles.gradient}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Stories</Text>
          <TouchableOpacity style={styles.cameraBtn} onPress={() => setShowUploadModal(true)}>
            <MaterialIcons name="camera-alt" size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>

          {/* Floating story bubbles row */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesRow}>
            <MyStoryBubble image={myStoryImage} onPress={() => setShowUploadModal(true)} />
            {MOCK_STORIES.map((story, index) => (
              <StoryBubble key={story.id} story={story} delay={index * 400} />
            ))}
          </ScrollView>

          {/* New */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>New</Text>
            {MOCK_STORIES.filter(s => !s.viewed).map(story => (
              <TouchableOpacity key={story.id} activeOpacity={0.8} style={styles.listItem}>
                <BlurView intensity={60} style={styles.listBlur}>
                  <LinearGradient colors={['rgba(108,59,255,0.1)', 'rgba(0,212,255,0.05)']} style={styles.listContent}>
                    <LinearGradient colors={story.gradient} style={styles.listAvatar}>
                      <Text style={styles.listInitials}>{story.initials}</Text>
                    </LinearGradient>
                    <View style={styles.listInfo}>
                      <Text style={styles.listName}>{story.name}</Text>
                      <Text style={styles.listTime}>{story.time}</Text>
                    </View>
                    <View style={styles.newDot} />
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>

          {/* Featured */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredRow}>
              {FEATURED.map(story => (
                <TouchableOpacity key={story.id} style={styles.featuredCard} activeOpacity={0.85}>
                  <LinearGradient colors={story.gradient} style={styles.featuredGradient}>
                    <Text style={styles.featuredEmoji}>{story.initials}</Text>
                    <BlurView intensity={40} style={styles.featuredInfo}>
                      <Text style={styles.featuredName}>{story.name}</Text>
                      <Text style={styles.featuredViewers}>{story.time}</Text>
                    </BlurView>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Viewed */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Viewed</Text>
            {MOCK_STORIES.filter(s => s.viewed).map(story => (
              <TouchableOpacity key={story.id} activeOpacity={0.8} style={styles.listItem}>
                <BlurView intensity={60} style={styles.listBlur}>
                  <LinearGradient colors={['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']} style={styles.listContent}>
                    <LinearGradient colors={[Colors.border, Colors.border]} style={styles.listAvatar}>
                      <Text style={[styles.listInitials, { color: Colors.textSecondary }]}>{story.initials}</Text>
                    </LinearGradient>
                    <View style={styles.listInfo}>
                      <Text style={[styles.listName, { color: Colors.textSecondary }]}>{story.name}</Text>
                      <Text style={styles.listTime}>{story.time}</Text>
                    </View>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </LinearGradient>

      {/* Upload Modal */}
      <Modal visible={showUploadModal} transparent animationType="slide" onRequestClose={() => setShowUploadModal(false)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowUploadModal(false)}>
          <BlurView intensity={40} style={StyleSheet.absoluteFill} />
        </TouchableOpacity>

        <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
          <BlurView intensity={80} style={styles.modalBlur}>
            <LinearGradient colors={[Colors.bg2, Colors.bg3]} style={styles.modalContent}>

              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>إضافة قصة</Text>
              <Text style={styles.modalSubtitle}>اختر طريقة إضافة القصة</Text>

              <TouchableOpacity style={styles.modalOption} activeOpacity={0.8} onPress={pickFromCamera}>
                <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.modalIconBg}>
                  <MaterialIcons name="camera-alt" size={26} color="#fff" />
                </LinearGradient>
                <View style={styles.modalOptionText}>
                  <Text style={styles.modalOptionTitle}>الكاميرا</Text>
                  <Text style={styles.modalOptionSub}>التقط صورة أو فيديو الآن</Text>
                </View>
                <MaterialIcons name="chevron-right" size={22} color={Colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalOption} activeOpacity={0.8} onPress={pickFromGallery}>
                <LinearGradient colors={['#00D4FF', '#0099CC']} style={styles.modalIconBg}>
                  <MaterialIcons name="photo-library" size={26} color="#fff" />
                </LinearGradient>
                <View style={styles.modalOptionText}>
                  <Text style={styles.modalOptionTitle}>المعرض</Text>
                  <Text style={styles.modalOptionSub}>اختر من صورك</Text>
                </View>
                <MaterialIcons name="chevron-right" size={22} color={Colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowUploadModal(false)}>
                <Text style={styles.cancelText}>إلغاء</Text>
              </TouchableOpacity>

            </LinearGradient>
          </BlurView>
        </View>
      </Modal>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  gradient: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: { fontSize: 32, fontWeight: '800', color: Colors.primary, letterSpacing: 0.5 },
  cameraBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.bg3, alignItems: 'center', justifyContent: 'center',
  },
  storiesRow: { paddingHorizontal: 16, paddingVertical: 20, gap: 16, alignItems: 'flex-end' },
  storyWrapper: { alignItems: 'center', width: 80 },
  storyRing: { alignItems: 'center', justifyContent: 'center' },
  storyRingInner: { backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  storyAvatar: { alignItems: 'center', justifyContent: 'center' },
  storyInitials: { color: '#fff', fontWeight: '700' },
  storyName: { color: Colors.text, fontSize: 11, fontWeight: '600', marginTop: 6, textAlign: 'center' },
  storyTime: { color: Colors.textSecondary, fontSize: 10, marginTop: 2, textAlign: 'center' },
  myStoryContainer: {
    width: 76, height: 76, borderRadius: 38,
    alignItems: 'center', justifyContent: 'center',
  },
  myStoryAvatar: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: Colors.bg3, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed',
  },
  myStoryImage: { width: 70, height: 70, borderRadius: 35 },
  addBadge: {
    position: 'absolute', bottom: 0, right: 2,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.bg,
  },
  section: { paddingHorizontal: 16, marginTop: 4, marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 10 },
  listItem: { marginBottom: 8, borderRadius: 16, overflow: 'hidden' },
  listBlur: { borderRadius: 16, overflow: 'hidden' },
  listContent: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderRadius: 16,
  },
  listAvatar: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  listInitials: { color: '#fff', fontSize: 18, fontWeight: '700' },
  listInfo: { flex: 1 },
  listName: { color: Colors.text, fontSize: 15, fontWeight: '700' },
  listTime: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  newDot: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary,
    shadowColor: Colors.primary, shadowOpacity: 0.8, shadowRadius: 4,
  },
  featuredRow: { paddingBottom: 8, gap: 12 },
  featuredCard: { width: (width - 60) / 2, height: 180, borderRadius: 20, overflow: 'hidden' },
  featuredGradient: { flex: 1, justifyContent: 'space-between', padding: 16 },
  featuredEmoji: { fontSize: 40 },
  featuredInfo: { borderRadius: 12, overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 6 },
  featuredName: { color: '#fff', fontSize: 13, fontWeight: '700' },
  featuredViewers: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  // Modal
  modalBackdrop: { ...StyleSheet.absoluteFillObject },
  modalSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' },
  modalBlur: { borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' },
  modalContent: { paddingHorizontal: 20, paddingTop: 16 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.text, textAlign: 'center', marginBottom: 4 },
  modalSubtitle: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', marginBottom: 24 },
  modalOption: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16, padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  modalIconBg: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  modalOptionText: { flex: 1 },
  modalOptionTitle: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  modalOptionSub: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  cancelBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16,
    padding: 16, alignItems: 'center', marginTop: 4, marginBottom: 8,
  },
  cancelText: { color: Colors.danger, fontSize: 16, fontWeight: '700' },
});
