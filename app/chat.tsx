"use client"

import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import { useEffect, useRef, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { ArrowLeft, File, MessageSquare, Plus, Send, X } from "react-native-feather"
import BASE_URL from "../lib/config"; // Adjust the import path as necessary

// Sample messages for the chat
const initialMessages = [
  {
    id: "1",
    type: "system",
    text: "Welcome to DeepDefend PDF Chatbot. Select a PDF to ask questions about it.",
  },
]

// Define types for route params
type ChatbotScreenParams = {
  file?: {
    name: string;
  };
};

export default function ChatbotScreen() {
  const navigation = useNavigation()
  const route = useRoute<RouteProp<Record<string, ChatbotScreenParams>, string>>()
  const [messages, setMessages] = useState(initialMessages)
  const [inputText, setInputText] = useState("")
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedFile, setSelectedFile] = useState<{ name: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [availableFiles, setAvailableFiles] = useState<Array<{
    name: string;
    size?: number;
    indexed?: boolean;
  }>>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false)
  const flatListRef = useRef<FlatList>(null)

  // Check if a file was passed from the upload screen
  useEffect(() => {
    if (route.params && route.params.file) {
      const file = route.params.file
      setSelectedFile({
        name: file.name,
      })

      // Add system message about the file
      const fileMessage = {
        id: Date.now().toString(),
        type: "system",
        text: `File "${file.name}" selected. You can now ask questions about this document.`,
      }

      setMessages((prev) => [...prev, fileMessage])
    }
  }, [route.params])

  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true })
    }
  }, [messages])
  const fetchAvailableFiles = async () => {
    setIsLoadingFiles(true);
    try {
      const response = await fetch(`${BASE_URL}/dashboard/files`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch files: ${response.status}`);
      }
  
      const data = await response.json();
      
      // Extract file data from the response
      if (data.files && Array.isArray(data.files)) {
        // Map the files to the format our app expects
        interface FileData {
          file_name: string;
          file_size: number;
          indexed: boolean;
        }

        interface AvailableFile {
          name: string;
          size: number;
          indexed: boolean;
        }

        const files: AvailableFile[] = data.files.map((file: FileData) => ({
          name: file.file_name,
          size: file.file_size,
          indexed: file.indexed,
        }));
        setAvailableFiles(files);
      } else {
        console.error("Unexpected response format:", data);
        setAvailableFiles([]);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      Alert.alert("Error", "Failed to fetch available files");
      setAvailableFiles([]);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSend = async () => {
    if (inputText.trim() === "" || !selectedFile) return

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      text: inputText,
    }

    setMessages((prev) => [...prev, userMessage])
    const query = inputText
    setInputText("")
    setIsLoading(true)

    try {
      // Call the chat API endpoint
      const response = await fetch(
        `${BASE_URL}/dashboard/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file_name: selectedFile.name,
            query: query,
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      console.log(response);
      // First, get the response text
      const data = await response.text();

      // Parse the JSON if the response is in JSON format
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        // Handle non-JSON response
        parsedData = { text: data };
      }

      // Create a structured bot response
      const botResponse = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: parsedData.response || parsedData.text || data,
      };

      console.log("Bot response:", botResponse);
      setMessages((prev) => [...prev, botResponse])
        } catch (error) {
      console.error("Error calling chat API:", error)

      // Add error message
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: "Sorry, I encountered an error processing your request. Please try again later.",
      }

      setMessages((prev) => [...prev, errorMessage])
      Alert.alert("Error", "Failed to get a response from the server")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectFile = (file: { name: string }) => {
    setSelectedFile(file)
    setModalVisible(false)

    // Add system message about the file
    const fileMessage = {
      id: Date.now().toString(),
      type: "system",
      text: `File "${file.name}" selected. You can now ask questions about this document.`,
    }

    setMessages((prev) => [...prev, fileMessage])
  }

  const openFileSelector = () => {
    fetchAvailableFiles()
    setModalVisible(true)
  }

  type Message = {
    id: string
    type: "user" | "bot" | "system"
    text: string
  }

  const normalizedMessages: Message[] = messages.map((msg) => ({
    ...msg,
    type: msg.type === "system" || msg.type === "user" || msg.type === "bot" ? msg.type : "user", // Default to "user"
  }))

  const renderMessage = ({ item }: { item: Message }) => {
    switch (item.type) {
      case "user":
        return (
          <View style={styles.userMessageContainer}>
            <View style={styles.userMessage}>
              <Text style={styles.userMessageText}>{item.text}</Text>
            </View>
          </View>
        )
      case "bot":
        return (
          <View style={styles.botMessageContainer}>
            <View style={styles.botIconContainer}>
              <MessageSquare stroke="#FFD700" width={16} height={16} />
            </View>
            <View style={styles.botMessage}>
              <Text style={styles.botMessageText}>{item.text}</Text>
            </View>
          </View>
        )
      case "system":
        return (
          <View style={styles.systemMessageContainer}>
            <Text style={styles.systemMessageText}>{item.text}</Text>
          </View>
        )
      default:
        return null
    }
  }

  const renderFileItem = ({ item }: { item: { name: string } }) => (
    <TouchableOpacity style={styles.fileItem} onPress={() => handleSelectFile(item)}>
      <View style={styles.fileOptionIcon}>
        <File stroke="#FFD700" width={24} height={24} />
      </View>
      <Text style={styles.fileItemText}>{item.name}</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft stroke="#FFD700" width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.title}>PDF Chatbot</Text>
        {selectedFile && (
          <TouchableOpacity style={styles.fileButton} onPress={openFileSelector}>
            <File stroke="#FFD700" width={20} height={20} />
          </TouchableOpacity>
        )}
      </View>

      {/* Selected File Indicator */}
      {selectedFile && (
        <View style={styles.selectedFileBar}>
          <File stroke="#FFD700" width={16} height={16} />
          <Text style={styles.selectedFileName}>{selectedFile.name}</Text>
          <TouchableOpacity onPress={() => setSelectedFile(null)} style={styles.removeFileButton}>
            <X stroke="#AAAAAA" width={16} height={16} />
          </TouchableOpacity>
        </View>
      )}

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={normalizedMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#FFD700" />
          <Text style={styles.loadingText}>Processing your question...</Text>
        </View>
      )}

      {/* Input Area */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
        <View style={styles.inputContainer}>
          {!selectedFile && (
            <TouchableOpacity style={styles.uploadButton} onPress={openFileSelector}>
              <Plus stroke="#FFD700" width={24} height={24} />
            </TouchableOpacity>
          )}
          <TextInput
            style={styles.input}
            placeholder="Ask about your PDF..."
            placeholderTextColor="#AAAAAA"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() === "" || !selectedFile || isLoading ? styles.sendButtonDisabled : {},
            ]}
            onPress={handleSend}
            disabled={inputText.trim() === "" || !selectedFile || isLoading}
          >
            <Send
              stroke={inputText.trim() === "" || !selectedFile || isLoading ? "#555555" : "#000000"}
              width={20}
              height={20}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* File Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select PDF Document</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                <X stroke="#AAAAAA" width={24} height={24} />
              </TouchableOpacity>
            </View>

            {isLoadingFiles ? (
              <View style={styles.loadingFilesContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={styles.loadingFilesText}>Loading files...</Text>
              </View>
            ) : availableFiles.length > 0 ? (
              <FlatList
                data={availableFiles}
                renderItem={renderFileItem}
                keyExtractor={(item, index) => `file-${index}`}
                contentContainerStyle={styles.filesList}
              />
            ) : (
              <View style={styles.noFilesContainer}>
                <Text style={styles.noFilesText}>No PDF files available</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    color: "#FFD700",
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  fileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedFileBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 15,
  },
  selectedFileName: {
    color: "#CCCCCC",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  removeFileButton: {
    padding: 5,
  },
  messagesList: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  userMessageContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 15,
  },
  userMessage: {
    backgroundColor: "#FFD700",
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxWidth: "80%",
  },
  userMessageText: {
    color: "black",
    fontSize: 16,
  },
  botMessageContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start",
  },
  botIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  botMessage: {
    backgroundColor: "#2A2A2A",
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxWidth: "80%",
  },
  botMessageText: {
    color: "white",
    fontSize: 16,
  },
  systemMessageContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  systemMessageText: {
    color: "#AAAAAA",
    fontSize: 14,
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  loadingText: {
    color: "#CCCCCC",
    marginLeft: 10,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
    backgroundColor: "#1A1A1A",
  },
  uploadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "white",
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: "#333333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalCloseButton: {
    padding: 5,
  },
  filesList: {
    paddingBottom: 20,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  fileItemText: {
    color: "white",
    fontSize: 16,
    flex: 1,
  },
  fileOptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  loadingFilesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  loadingFilesText: {
    color: "#CCCCCC",
    marginTop: 15,
    fontSize: 16,
  },
  noFilesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  noFilesText: {
    color: "#AAAAAA",
    fontSize: 16,
  },
})