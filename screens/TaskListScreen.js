import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native'; // ✅ React Navigation

export default function TaskListScreen() {
  const [tasks, setTasks] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigation = useNavigation();

  useEffect(() => {
    const db = getDatabase();
    const tasksRef = ref(db, 'tasks');

    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      const userTasks = [];

      for (const key in data) {
        if (data[key].assignedToUserId === currentUser?.uid) {
          userTasks.push({ id: key, ...data[key] });
        }
      }

      setTasks(userTasks);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login'); // ✅ route to login after logout
    } catch (error) {
      Alert.alert('Logout Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />

      <Button title="Add Task" onPress={() => navigation.navigate('AddTask')} />
      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  taskCard: { padding: 15, borderWidth: 1, borderRadius: 8, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold' },
});
