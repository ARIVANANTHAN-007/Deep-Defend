import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from "react-native"
import { Search, Upload, MessageSquare, User, Shield } from "react-native-feather"
import { useRouter } from 'expo-router'

export default function DashboardScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>DeepDefend</Text>
          <Text style={styles.subtitle}>Document Security</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <User stroke="#FFD700" width={24} height={24} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.welcomeContainer}>
          <Shield stroke="#FFD700" width={60} height={60} />
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.welcomeSubtext}>Your documents are secure</Text>
        </View>

        {/* Feature Cards */}
        <View style={styles.featureContainer}>
          <Text style={styles.sectionTitle}>What would you like to do?</Text>

          <View style={styles.cardRow}>
            <TouchableOpacity style={styles.featureCard} onPress={() => router.push("/search")}>
              <View style={styles.iconContainer}>
                <Search stroke="#000" width={28} height={28} />
              </View>
              <Text style={styles.cardTitle}>Search PDFs</Text>
              <Text style={styles.cardDescription}>Find content within your documents</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard} onPress={() => router.push("/upload")}>
              <View style={styles.iconContainer}>
                <Upload stroke="#000" width={28} height={28} />
              </View>
              <Text style={styles.cardTitle}>Upload & Scan</Text>
              <Text style={styles.cardDescription}>Securely upload and analyze PDFs</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.featureCard, styles.chatbotCard]}
            onPress={() => router.push("/chat")}
          >
            <View style={styles.iconContainer}>
              <MessageSquare stroke="#000" width={28} height={28} />
            </View>
            <Text style={styles.cardTitle}>PDF Chatbot</Text>
            <Text style={styles.cardDescription}>Ask questions about your documents</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/search")}>
          <Search stroke="#000" width={24} height={24} />
          <Text style={styles.navText}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chatButton} onPress={() => router.push("/chat")}>
          <MessageSquare stroke="#FFD700" width={28} height={28} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/upload")}>
          <Upload stroke="#000" width={24} height={24} />
          <Text style={styles.navText}>Upload</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const { width } = Dimensions.get("window")
const cardWidth = (width - 60) / 2

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    color: "#FFD700",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#CCCCCC",
    fontSize: 14,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingVertical: 20,
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  welcomeText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 15,
  },
  welcomeSubtext: {
    color: "#AAAAAA",
    fontSize: 16,
    marginTop: 5,
  },
  featureContainer: {
    flex: 1,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  featureCard: {
    width: cardWidth,
    backgroundColor: "#FFD700",
    borderRadius: 16,
    padding: 15,
    elevation: 4,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  chatbotCard: {
    width: "100%",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 12,
    opacity: 0.8,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFD700",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: "black",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  chatButton: {
    backgroundColor: "black",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFD700",
    elevation: 5,
  },
})

