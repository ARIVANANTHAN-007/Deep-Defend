"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from "react-native"
import { Search, ArrowLeft, File } from "react-native-feather"
import { useNavigation } from "@react-navigation/native"
import { useRouter } from 'expo-router';
import BASE_URL from "../lib/config"; // Adjust the import path as necessary


// Define the types for our API response
interface SearchMatch {
  file_name: string
  snippet: string
  score: number
}

interface SearchResponse {
  matches: SearchMatch[]
}

export default function SearchScreen() {
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchMatch[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([

  ])
  const router = useRouter();


  // Function to call the backend API
  const searchPdfs = async (query: string) => {
    console.log("Searching PDFs with query:", query)
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${BASE_URL}/dashboard/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error("Search request failed")
      }

      const data: SearchResponse = await response.json()
      setResults(data.matches)

      // Add to recent searches if not already there
      if (!recentSearches.includes(query) && query.trim()) {
        setRecentSearches((prev) => [query, ...prev.slice(0, 2)])
      }
    } catch (error) {
      console.error("Error searching PDFs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (text: string) => {
    setSearchQuery(text)
  }

  const handleSubmitSearch = () => {
    searchPdfs(searchQuery)
  }

  const handleRecentSearch = (query: string) => {
    setSearchQuery(query)
    searchPdfs(query)
  }


  const renderItem = ({ item }: { item: SearchMatch }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => {}}>
      <View style={styles.fileIconContainer}>
        <File stroke="#FFD700" width={24} height={24} />
      </View>
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle}>{item.file_name}</Text>
        <Text style={styles.resultPreview}>{item.snippet}</Text>
        <View style={styles.resultMeta}>
          <Text style={styles.resultScore}>Score: {(item.score * 100).toFixed(1)}%</Text>
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
            onSubmitEditing={handleSubmitSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSubmitSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Searches */}
      {!results.length && !isLoading && (
        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <View style={styles.recentTags}>
            {recentSearches.map((tag, index) => (
              <TouchableOpacity key={index} style={styles.recentTag} onPress={() => handleRecentSearch(tag)}>
                <Text style={styles.recentTagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Results */}
      <View style={styles.resultsContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.loadingText}>Searching documents...</Text>
          </View>
        ) : results.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Results ({results.length})</Text>
            <FlatList
              data={results}
              renderItem={renderItem}
              keyExtractor={(item, index) => `${item.file_name}-${index}`}
              contentContainerStyle={styles.resultsList}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : searchQuery ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No results found. Try different keywords.</Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
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
  searchButton: {
    backgroundColor: "#FFD700",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    paddingHorizontal: 15,
    height: 50,
  },
  searchButtonText: {
    color: "#121212",
    fontWeight: "bold",
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
  resultScore: {
    color: "#FFD700",
    fontSize: 12,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#CCCCCC",
    marginTop: 15,
    fontSize: 16,
  },
  emptyStateText: {
    color: "#AAAAAA",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
})
