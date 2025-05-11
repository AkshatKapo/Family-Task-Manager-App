import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getDatabase, ref, push, get, child } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native'; // ✅ React Navigation

export default function AddTaskScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedToUserId, setAssignedToUserId] = useState('');
  const [users, setUsers] = useState([]);

  const db = getDatabase();
  const auth = getAuth();
  const navigation = useNavigation(); // ✅ replaces useRouter

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await get(child(ref(db), 'users'));
      const data = snapshot.val();
      const list = [];

      for (const key in data) {
        if (key !== auth.currentUser?.uid) {
          list.push({ id: key, name: data[key].name || 'Unnamed' });
        }
      }

      setUsers(list);
    };

    fetchUsers();
  }, []);

  const handleAddTask = async () => {
    if (!title || !assignedToUserId) {
      Alert.alert('Validation Error', 'Title and Assigned User are required.');
      return;
    }

    const newTask = {
      title,
      description,
      assignedToUserId,
      status: 'pending',
    };

    try {
      await push(ref(db, 'tasks'), newTask);
      Alert.alert('Success', 'Task added!');
      setTitle('');
      setDescription('');
      setAssignedToUserId('');

      navigation.replace('Tasks'); // ✅ React Navigation route
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Add New Task</Text>

      <TextInput
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <Text style={styles.label}>Assign To:</Text>
      <Picker
        selectedValue={assignedToUserId}
        style={styles.picker}
        onValueChange={(value) => setAssignedToUserId(value)}
      >
        <Picker.Item label="Select User" value="" />
        {users.map((user) => (
          <Picker.Item key={user.id} label={user.name} value={user.id} />
        ))}
      </Picker>

      <Button title="Add Task" onPress={handleAddTask} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 6 },
  label: { marginBottom: 5 },
  picker: { borderWidth: 1, borderRadius: 6, marginBottom: 15 },
});
