import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database'; // ✅ Fix for "set is not defined"
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('parent');
  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
  
      await set(ref(db, 'users/' + uid), {
        name: username,
        email,
        role
      });
  
      Alert.alert('Success', 'Account created successfully!');
      navigation.replace('Login');
    } catch (error) {
      console.error('Registration failed:', error);
      Alert.alert('Registration Failed', error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

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

      <Text style={styles.label}>Select Role:</Text>
      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Parent" value="parent" />
        <Picker.Item label="Child" value="child" />
      </Picker>

      <Button title="Register" onPress={handleRegister} />
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Already have an account? Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 12, borderRadius: 5 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  label: { marginBottom: 8, fontWeight: 'bold' },
  link: { marginTop: 15, color: 'blue', textAlign: 'center' },
});
