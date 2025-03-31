import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />

      {/* Title & Tagline */}
      <Text style={styles.title}>PDF BOT</Text>
      <Text style={styles.tagline}>Tagline, Tagline Tagline</Text>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>Let’s Get Started!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 144,
    height: 144,
    marginBottom: 24,
  },
  title: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 50,
  },
  tagline: {
    color: '#D1D5DB',
    fontSize: 18,
    marginTop: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  button: {
    marginTop: 40,
    backgroundColor: '#FFD700',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '600',
  },
});
