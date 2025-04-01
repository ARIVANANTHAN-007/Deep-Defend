"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { ArrowLeft, Send, File, X, Plus, MessageSquare } from "react-native-feather"
import { useNavigation } from "@react-navigation/native"

// Sample messages for the chat
const initialMessages = [
  {
    id: "1",
    type: "system",
    text: "Welcome to DeepDefend PDF Chatbot. Upload a PDF to ask questions about it.",
  },
]

export default function ChatbotScreen() {
  const navigation = useNavigation()
  const [messages, setMessages] = useState(initialMessages)
  const [inputText, setInputText] = useState("")
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; type: string } | null>(null)
  const flatListRef = useRef<FlatList>(null)

  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true })
    }
  }, [messages])

  const handleSend = () => {
    if (inputText.trim() === "") return

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      text: inputText,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")

    // Simulate bot response after a delay
    setTimeout(() => {
      let botResponse

      if (!selectedFile) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          text: "Please upload a PDF document first so I can answer questions about it.",
        }
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          text: `Based on the content of ${selectedFile.name}, I can provide the following information: This is a simulated response as if I've analyzed the document. The document contains information about financial projections, market analysis, and strategic planning for the next fiscal year.`,
        }
      }

      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  const handleFileSelect = () => {
    // Simulate file selection
    const newFile = {
      name: "Business Report.pdf",
      size: "3.2 MB",
      type: "application/pdf",
    }

    setSelectedFile(newFile)
    setModalVisible(false)

    // Add system message about the file
    const fileMessage = {
      id: Date.now().toString(),
      type: "system",
      text: `File "${newFile.name}" uploaded successfully. You can now ask questions about this document.`,
    }

    setMessages((prev) => [...prev, fileMessage])
  }

  type Message = {
    id: string;
    type: "user" | "bot" | "system";
    text: string;
  };
  const normalizedMessages: Message[] = messages.map((msg) => ({
    ...msg,
    type: msg.type === "system" || msg.type === "user" || msg.type === "bot" ? msg.type : "user", // Default to "user"
  }));
  
  
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft stroke="#FFD700" width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.title}>PDF Chatbot</Text>
        {selectedFile && (
          <TouchableOpacity style={styles.fileButton} onPress={() => setModalVisible(true)}>
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


      {/* Input Area */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
        <View style={styles.inputContainer}>
          {!selectedFile && (
            <TouchableOpacity style={styles.uploadButton} onPress={() => setModalVisible(true)}>
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
            style={[styles.sendButton, inputText.trim() === "" ? styles.sendButtonDisabled : {}]}
            onPress={handleSend}
            disabled={inputText.trim() === ""}
          >
            <Send stroke={inputText.trim() === "" ? "#555555" : "#000000"} width={20} height={20} />
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

            <View style={styles.fileOptions}>
              <TouchableOpacity style={styles.fileOption} onPress={handleFileSelect}>
                <View style={styles.fileOptionIcon}>
                  <File stroke="#FFD700" width={24} height={24} />
                </View>
                <Text style={styles.fileOptionText}>Browse Files</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.fileOption} onPress={handleFileSelect}>
                <View style={styles.fileOptionIcon}>
                  <File stroke="#FFD700" width={24} height={24} />
                </View>
                <Text style={styles.fileOptionText}>Recent Documents</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.fileOption} onPress={handleFileSelect}>
                <View style={styles.fileOptionIcon}>
                  <File stroke="#FFD700" width={24} height={24} />
                </View>
                <Text style={styles.fileOptionText}>Sample Documents</Text>
              </TouchableOpacity>
            </View>
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
  fileOptions: {
    marginTop: 20,
  },
  fileOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
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
  fileOptionText: {
    color: "white",
    fontSize: 16,
  },
})

