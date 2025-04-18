"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal, FlatList, Platform, Alert } from "react-native"
import { ArrowLeft, Upload, File, CheckCircle, AlertTriangle, X } from "react-native-feather"
import { useNavigation } from "@react-navigation/native"
import * as DocumentPicker from "expo-document-picker"
import BASE_URL from "../lib/config"; // Adjust the import path as necessary

export default function UploadScreen() {
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; type: string; uri: string } | null>(
    null,
  )
  const [scanStatus, setScanStatus] = useState<null | "scanning" | "safe" | "threat">(null) // null, 'scanning', 'safe', 'threat'
  const [uploading, setUploading] = useState(false)
  const [recentFiles, setRecentFiles] = useState([
    { id: "1", name: "Guide Wire", date: "Yesterday", status: "safe" },
  ])

  const handleFileSelect = async () => {
    try {
      // Use document picker to select a file
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf"], // Limit to PDF files
        copyToCacheDirectory: true,
      })

      if (result.canceled) {
        // User canceled the picker
        setModalVisible(false)
        return
      }

      const fileInfo = result.assets[0]

      // Format file size
      const fileSizeInBytes = fileInfo.size || 0
      const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2)

      setSelectedFile({
        name: fileInfo.name,
        size: `${fileSizeInMB} MB`,
        type: fileInfo.mimeType || "application/pdf",
        uri: fileInfo.uri,
      })

      setModalVisible(false)

      // Start scanning process
      setScanStatus("scanning")

      // Send file to backend for scanning and upload
      uploadAndScanFile(fileInfo.uri, fileInfo.name)
    } catch (error) {
      console.error("Error picking document:", error)
      Alert.alert("Error", "Failed to select document")
      setModalVisible(false)
    }
  }

  const uploadAndScanFile = async (fileUri: string, fileName: string) => {
    try {
      setUploading(true)

      // Create form data for multipart/form-data request
      const formData = new FormData()

      // Add file to form data
      formData.append("file", {
        uri: Platform.OS === "ios" ? fileUri.replace("file://", "") : fileUri,
        name: fileName,
        type: "application/pdf",
      } as any)

      // Upload file to API endpoint
      const response = await fetch(
        `${BASE_URL}/dashboard/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )
      
      console.log("Response status:", response.status);
      
      // Check response status to determine if file is safe or a threat
      if (response.status === 400) {
        // Status code 400 indicates a malicious file (threat)
        setScanStatus("threat")
      } else if (response.ok) {
        // Status code 200-299 indicates successful upload (safe file)
        setScanStatus("safe")
        
        // Add to recent files if upload successful
        setRecentFiles([
          {
            id: Date.now().toString(),
            name: fileName,
            date: "Just now",
            status: "safe",
          },
          ...recentFiles,
        ])

        console.log("File uploaded successfully")
      } else {
        // Handle other error cases
        console.error("Upload failed:", await response.text())
        Alert.alert("Upload Failed", "Failed to upload the file to the server")
        resetUpload()
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      Alert.alert("Upload Error", "An error occurred while uploading the file")
      resetUpload()
    } finally {
      setUploading(false)
    }
  }

  const resetUpload = () => {
    setSelectedFile(null)
    setScanStatus(null)
  }

  const renderRecentFile = ({ item }: { item: { id: string; name: string; date: string; status: string } }) => (
    <View style={styles.recentFileItem}>
      <View style={styles.fileIconContainer}>
        <File stroke="#FFD700" width={24} height={24} />
      </View>
      <View style={styles.fileDetails}>
        <Text style={styles.fileName}>{item.name}</Text>
        <Text style={styles.fileDate}>{item.date}</Text>
      </View>
      <View style={[styles.statusIndicator, item.status === "safe" ? styles.safeStatus : styles.threatStatus]}>
        {item.status === "safe" ? (
          <CheckCircle stroke="#00C853" width={16} height={16} />
        ) : (
          <AlertTriangle stroke="#FF3D00" width={16} height={16} />
        )}
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft stroke="#FFD700" width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Upload & Scan</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {!selectedFile ? (
          <TouchableOpacity style={styles.uploadArea} onPress={() => setModalVisible(true)}>
            <View style={styles.uploadIconContainer}>
              <Upload stroke="#FFD700" width={40} height={40} />
            </View>
            <Text style={styles.uploadText}>Tap to select a PDF file</Text>
            <Text style={styles.uploadSubtext}>Files will be scanned for malicious content before uploading</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.scanningContainer}>
            <View style={styles.selectedFileContainer}>
              <View style={styles.fileIconLarge}>
                <File stroke="#FFD700" width={32} height={32} />
              </View>
              <View style={styles.selectedFileDetails}>
                <Text style={styles.selectedFileName}>{selectedFile.name}</Text>
                <Text style={styles.selectedFileSize}>{selectedFile.size}</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={resetUpload}>
                <X stroke="#AAAAAA" width={20} height={20} />
              </TouchableOpacity>
            </View>

            {scanStatus === "scanning" && (
              <View style={styles.scanningStatus}>
                <View style={styles.progressBar}>
                  <View style={styles.progressFill} />
                </View>
                <Text style={styles.scanningText}>Scanning for threats...</Text>
              </View>
            )}

            {scanStatus === "safe" && (
              <View style={styles.resultContainer}>
                <View style={[styles.resultIcon, styles.safeIcon]}>
                  <CheckCircle stroke="#00C853" width={40} height={40} />
                </View>
                <Text style={styles.resultTitle}>File is Safe</Text>
                <Text style={styles.resultText}>
                  No malicious content detected. Your file has been uploaded securely.
                </Text>
                <TouchableOpacity
                  style={[styles.actionButton]}
                  onPress={resetUpload}
                >
                  <Text style={styles.actionButtonText}>Upload Another File</Text>
                </TouchableOpacity>
              </View>
            )}

            {scanStatus === "threat" && (
              <View style={styles.resultContainer}>
                <View style={[styles.resultIcon, styles.threatIcon]}>
                  <AlertTriangle stroke="#FF3D00" width={40} height={40} />
                </View>
                <Text style={styles.resultTitle}>Threat Detected</Text>
                <Text style={styles.resultText}>
                  Potential malicious content found. This file has been blocked for your security.
                </Text>
                <TouchableOpacity style={[styles.actionButton, styles.threatButton]} onPress={resetUpload}>
                  <Text style={styles.actionButtonText}>Try Another File</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Recent Files */}
        {!selectedFile && (
          <View style={styles.recentFilesContainer}>
            <Text style={styles.sectionTitle}>Recently Scanned</Text>
            <FlatList
              data={recentFiles}
              renderItem={renderRecentFile}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.recentFilesList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>

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
              <Text style={styles.modalTitle}>Select File</Text>
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
  content: {
    flex: 1,
  },
  uploadArea: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#2A2A2A",
    borderStyle: "dashed",
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  uploadIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  uploadText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  uploadSubtext: {
    color: "#AAAAAA",
    fontSize: 14,
    textAlign: "center",
    maxWidth: "80%",
  },
  recentFilesContainer: {
    flex: 1,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  recentFilesList: {
    paddingBottom: 20,
  },
  recentFileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
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
  fileDetails: {
    flex: 1,
  },
  fileName: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  fileDate: {
    color: "#AAAAAA",
    fontSize: 12,
    marginTop: 4,
  },
  statusIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  safeStatus: {
    backgroundColor: "rgba(0, 200, 83, 0.1)",
  },
  threatStatus: {
    backgroundColor: "rgba(255, 61, 0, 0.1)",
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
  scanningContainer: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  selectedFileContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
    marginBottom: 20,
  },
  fileIconLarge: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  selectedFileDetails: {
    flex: 1,
  },
  selectedFileName: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  selectedFileSize: {
    color: "#AAAAAA",
    fontSize: 14,
    marginTop: 4,
  },
  closeButton: {
    padding: 5,
  },
  scanningStatus: {
    alignItems: "center",
    paddingVertical: 20,
  },
  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: "#2A2A2A",
    borderRadius: 3,
    marginBottom: 15,
    overflow: "hidden",
  },
  progressFill: {
    width: "60%",
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 3,
  },
  scanningText: {
    color: "#AAAAAA",
    fontSize: 16,
  },
  resultContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  resultIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  safeIcon: {
    backgroundColor: "rgba(0, 200, 83, 0.1)",
  },
  threatIcon: {
    backgroundColor: "rgba(255, 61, 0, 0.1)",
  },
  resultTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  resultText: {
    color: "#AAAAAA",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  actionButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  threatButton: {
    backgroundColor: "#FF3D00",
  },
  disabledButton: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },
})