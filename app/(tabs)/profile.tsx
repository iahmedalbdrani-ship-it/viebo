import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../src/hooks/useAuth';

const MOCK_PHOTOS = Array.from({ length: 6 }, (_, i) => ({ id: String(i + 1) }));

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth');
  };

  const renderPhotoItem = ({ item }: { item: { id: string } }) => (
    <LinearGradient
      colors={[Colors.primary, Colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.photoItem}
    >
      <Text style={styles.photoPlaceholder}>📸</Text>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLargeText}>👤</Text>
        </View>
        <Text style={styles.username}>Your Username</Text>
        <Text style={styles.bio}>Find your vibe with us 🎵</Text>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>18</Text>
            <Text style={styles.statLabel}>Videos</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.photosSection}>
        <Text style={styles.photosTitle}>Gallery</Text>
        <FlatList
          data={MOCK_PHOTOS}
          renderItem={renderPhotoItem}
          keyExtractor={item => item.id}
          numColumns={3}
          scrollEnabled={true}
          contentContainerStyle={styles.photosGrid}
        />
      </View>
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
  profileCard: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarLargeText: {
    fontSize: 40,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: Colors.bg2,
    borderRadius: 12,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },
  editButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  editButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: Colors.danger,
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  photosSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  photosTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  photosGrid: {
    gap: 8,
  },
  photoItem: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholder: {
    fontSize: 32,
  },
});
