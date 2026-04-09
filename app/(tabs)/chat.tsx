import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  online: boolean;
}

const MOCK_CHATS: ChatItem[] = [
  {
    id: '1',
    name: 'Alex',
    lastMessage: 'Hey! How are you?',
    timestamp: '2m',
    online: true,
  },
  {
    id: '2',
    name: 'Jordan',
    lastMessage: 'See you tomorrow! 🎉',
    timestamp: '1h',
    online: false,
  },
  {
    id: '3',
    name: 'Casey',
    lastMessage: 'That sounds amazing!',
    timestamp: '3h',
    online: true,
  },
];

export default function ChatScreen() {
  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity style={styles.chatItem}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name[0]}</Text>
        </View>
        {item.online && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.chatContent}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      <FlatList
        data={MOCK_CHATS}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        scrollEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 4,
    alignItems: 'center',
    backgroundColor: Colors.bg2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.bg2,
  },
  chatContent: {
    flex: 1,
  },
  chatName: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  lastMessage: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  timestamp: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginLeft: 8,
  },
});
