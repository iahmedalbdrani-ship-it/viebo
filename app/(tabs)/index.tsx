import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';

interface VideoCard {
  id: string;
  title: string;
  author: string;
  likes: number;
  comments: number;
}

const MOCK_VIDEOS: VideoCard[] = [
  { id: '1', title: 'Beach Vibes', author: 'Alex', likes: 234, comments: 12 },
  { id: '2', title: 'City Life', author: 'Jordan', likes: 456, comments: 23 },
  { id: '3', title: 'Mountain Peak', author: 'Casey', likes: 789, comments: 45 },
];

export default function FeedScreen() {
  const renderVideoCard = ({ item }: { item: VideoCard }) => (
    <View style={styles.card}>
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.author}>by {item.author}</Text>
        </View>
      </LinearGradient>
      <View style={styles.stats}>
        <TouchableOpacity style={styles.stat}>
          <Text style={styles.statText}>❤️ {item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stat}>
          <Text style={styles.statText}>💬 {item.comments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
      </View>
      <FlatList
        data={MOCK_VIDEOS}
        renderItem={renderVideoCard}
        keyExtractor={item => item.id}
        scrollEnabled={true}
        contentContainerStyle={styles.list}
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
    paddingVertical: 12,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.bg2,
  },
  gradient: {
    height: 200,
    justifyContent: 'flex-end',
    padding: 16,
  },
  cardContent: {
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  author: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  stat: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.bg3,
  },
  statText: {
    color: Colors.text,
    fontSize: 14,
    textAlign: 'center',
  },
});
