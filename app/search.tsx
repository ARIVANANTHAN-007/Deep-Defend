"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Image } from "react-native"
import { Search, ArrowLeft, Filter, File, Clock } from "react-native-feather"
import { useNavigation } from "@react-navigation/native"

// Sample data for search results
const sampleResults = [
  {
    id: "1",
    title: "Financial Report 2023.pdf",
    preview: "Contains quarterly financial data and projections...",
    date: "2 days ago",
  },
  {
    id: "2",
    title: "Project Proposal.pdf",
    preview: "Detailed project timeline and resource allocation...",
    date: "1 week ago",
  },
  {
    id: "3",
    title: "Legal Contract.pdf",
    preview: "Terms and conditions for the partnership agreement...",
    date: "2 weeks ago",
  },
  {
    id: "4",
    title: "Meeting Minutes.pdf",
    preview: "Discussion points from the board meeting on March 15...",
    date: "1 month ago",
  },
]

export default function SearchScreen() {
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState(sampleResults)

interface SearchResult {
    id: string
    title: string
    preview: string
    date: string
}

const handleSearch = (text: string): void => {
    setSearchQuery(text)
    // Filter results based on search query
    if (text) {
        const filtered: SearchResult[] = sampleResults.filter(
            (item) =>
                item.title.toLowerCase().includes(text.toLowerCase()) ||
                item.preview.toLowerCase().includes(text.toLowerCase()),
        )
        setResults(filtered)
    } else {
        setResults(sampleResults)
    }
}

  const renderItem = ({ item }: { item: { id: string; title: string; preview: string; date: string } }) => (
    <TouchableOpacity style={styles.resultItem}>
      <View style={styles.fileIconContainer}>
        <File stroke="#FFD700" width={24} height={24} />
      </View>
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <Text style={styles.resultPreview}>{item.preview}</Text>
        <View style={styles.resultMeta}>
          <Clock stroke="#AAAAAA" width={12} height={12} />
          <Text style={styles.resultDate}>{item.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft stroke="#FFD700" width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Search PDFs</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search stroke="#AAAAAA" width={20} height={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by keyword or phrase"
            placeholderTextColor="#AAAAAA"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter stroke="#FFD700" width={20} height={20} />
        </TouchableOpacity>
      </View>

      {/* Recent Searches */}
      {!searchQuery && (
        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <View style={styles.recentTags}>
            <TouchableOpacity style={styles.recentTag}>
              <Text style={styles.recentTagText}>financial data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recentTag}>
              <Text style={styles.recentTagText}>contract terms</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recentTag}>
              <Text style={styles.recentTagText}>project timeline</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Results */}
      <View style={styles.resultsContainer}>
        {searchQuery ? (
          <>
            <Text style={styles.sectionTitle}>Results ({results.length})</Text>
            <FlatList
              data={results}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.resultsList}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.emptyStateImage} />
            <Text style={styles.emptyStateText}>Enter keywords to search through your PDF documents</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    color: "#FFD700",
    fontSize: 24,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
  },
  searchInput: {
    flex: 1,
    color: "white",
    marginLeft: 10,
    fontSize: 16,
  },
  filterButton: {
    width: 50,
    height: 50,
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  recentContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  recentTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  recentTag: {
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  recentTagText: {
    color: "#CCCCCC",
    fontSize: 14,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsList: {
    paddingBottom: 20,
  },
  resultItem: {
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  resultPreview: {
    color: "#CCCCCC",
    fontSize: 14,
    marginBottom: 8,
  },
  resultMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultDate: {
    color: "#AAAAAA",
    fontSize: 12,
    marginLeft: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  emptyStateText: {
    color: "#AAAAAA",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
})

