import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    console.log('Login button clicked'); // ✅ test button
  
    const auth = getAuth();
    const db = getDatabase();
  
    try {
      console.log('Trying signIn...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in success:', userCredential);
  
      const uid = userCredential.user.uid;
      console.log('Fetching user data for UID:', uid);
  
      const snapshot = await get(ref(db, 'users/' + uid));
      const userData = snapshot.val();
      console.log('User data fetched:', userData);

      if(userData){
        navigation.replace('AddTask');
      }
  
      if (!userData) {
        Alert.alert('Error', 'No user data found in the database.');
        
      }
  
      console.log('Logged in as:', userData.name, '| Role:', userData.role);
  
      if (userData.role === 'parent') {
        navigation.replace('Tasks');
      } else {
        navigation.replace('Tasks'); // or 'ChildTasks'
      }
    } catch (error) {
      console.error('🔥 Login Error:', error); // ✅ show in console
      Alert.alert('Login Failed', error.message);
    }
  };
  ;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} />
      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 12, borderRadius: 5 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  link: { marginTop: 15, color: 'blue', textAlign: 'center' },
});
