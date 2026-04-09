import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  online: boolean;
  initials: string;
  unread: number;
}

const MOCK_CHATS: ChatItem[] = [
  {
    id: '1',
    name: 'Alex',
    lastMessage: 'Hey! How are you?',
    timestamp: '2m',
    online: true,
    initials: 'A',
    unread: 2,
  },
  {
    id: '2',
    name: 'Jordan',
    lastMessage: 'See you tomorrow! 🎉',
    timestamp: '1h',
    online: false,
    initials: 'J',
    unread: 0,
  },
  {
    id: '3',
    name: 'Casey',
    lastMessage: 'That sounds amazing!',
    timestamp: '3h',
    online: true,
    initials: 'C',
    unread: 1,
  },
  {
    id: '4',
    name: 'Morgan',
    lastMessage: 'Can we chat later?',
    timestamp: '5h',
    online: false,
    initials: 'M',
    unread: 0,
  },
  {
    id: '5',
    name: 'Taylor',
    lastMessage: 'Haha that\'s so funny 😂',
    timestamp: '1d',
    online: true,
    initials: 'T',
    unread: 0,
  },
];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();

  const getAvatarGradient = (initials: string) => {
    const colors = [
      ['#FF6B9D', '#FFA348'],
      ['#6C3BFF', '#9D4EDD'],
      ['#00D4FF', '#0099CC'],
      ['#FF006E', '#FB5607'],
      ['#FFBE0B', '#FB5607'],
    ];
    const index = initials.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity
      style={styles.chatItemContainer}
      activeOpacity={0.8}
    >
      <BlurView intensity={80} style={styles.blurContainer}>
        <LinearGradient
          colors={['rgba(108, 59, 255, 0.1)', 'rgba(157, 78, 221, 0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.chatItem}
        >
          {/* Avatar with gradient */}
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={getAvatarGradient(item.initials)}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{item.initials}</Text>
            </LinearGradient>

            {/* Online indicator */}
            {item.online && (
              <View style={styles.onlineIndicator} />
            )}
          </View>

          {/* Chat info */}
          <View style={styles.chatContent}>
            <View style={styles.nameRow}>
              <Text style={styles.chatName}>{item.name}</Text>
              {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unread}</Text>
                </View>
              )}
            </View>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
          </View>

          {/* Timestamp */}
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </LinearGradient>
      </BlurView>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[Colors.bg, Colors.bg2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
          <View style={styles.headerSubtitle}>
            <Text style={styles.subtitleText}>Find your vibe</Text>
          </View>
        </View>

        {/* Chat List */}
        <FlatList
          data={MOCK_CHATS}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + 20 },
          ]}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    flexDirection: 'row',
  },
  subtitleText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chatItemContainer: {
    marginVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  blurContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4AFF6F',
    borderWidth: 2.5,
    borderColor: Colors.bg2,
    shadowColor: '#4AFF6F',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  chatContent: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    justifyContent: 'space-between',
  },
  chatName: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  lastMessage: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  timestamp: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginLeft: 12,
    fontWeight: '500',
    minWidth: 40,
    textAlign: 'right',
  },
});
