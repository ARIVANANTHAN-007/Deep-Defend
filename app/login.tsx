import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.237.229:8000/auth/login', {
        email,
        password,
      });
      if (response.status === 200) {
        Alert.alert('Success', 'Login Successful');
        router.push('/dashboard');
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    } catch (error) {
      console.log('Your Error', error);
      Alert.alert('Error', 'Failed to login. Please check your credentials.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo and Title */}
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>PDF BOT</Text>
      <Text style={styles.tagline}>Tagline, Tagline Tagline</Text>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Email ID"
        placeholderTextColor="#555"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#555"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Separator */}
      <View style={styles.separatorContainer}>
        <View style={styles.separator} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.separator} />
      </View>

      {/* Signup Button */}
      <TouchableOpacity style={styles.signupButton} onPress={() => router.push('/signup')}>
        <Text style={styles.signupText}>Sign up</Text>
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
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tagline: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#ddd',
    color: 'black',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#FEE440',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 15,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#444',
  },
  orText: {
    color: '#aaa',
    marginHorizontal: 10,
  },
  signupButton: {
    width: '100%',
    backgroundColor: '#FEE440',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  signupText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
