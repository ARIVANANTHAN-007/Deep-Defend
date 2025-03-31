import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>DeepDefend</Text>
        <TouchableOpacity>
          <Image source={require('../assets/images/logo.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Welcome Message */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome Name!</Text>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Image source={require('../assets/images/search.png')} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton}>
          <Image source={require('../assets/images/upload-file.png')} style={styles.addIcon} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image source={require('../assets/images/speak.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  icon: {
    width: 24,
    height: 24,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  addButton: {
    backgroundColor: 'black',
    width: 66,
    height: 66,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFD700',
  },
  addIcon: {
    width: 32,
    height: 32,
  },
});
