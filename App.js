import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  // Função para carregar as tarefas salvas no armazenamento
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('tasks');
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        }
      } catch (error) {
        console.error("Erro ao carregar as tarefas", error);
      }
    };
    loadTasks();
  }, []);

  // Função para salvar as tarefas no armazenamento
  const saveTasks = async (tasksToSave) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasksToSave));
    } catch (error) {
      console.error("Erro ao salvar as tarefas", error);
    }
  };

  const addTask = () => {
    if (task.trim()) {
      const newTask = { id: Date.now().toString(), text: task.trim() };
      const newTasks = [...tasks, newTask];
      setTasks(newTasks);
      setTask('');
      saveTasks(newTasks); // Salva as tarefas após adicionar uma nova
    }
  };

  const deleteTask = (taskId) => {
    const newTasks = tasks.filter((t) => t.id !== taskId);
    setTasks(newTasks);
    saveTasks(newTasks); // Salva as tarefas após deletar uma tarefa
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Procrastinarei</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskText}>{item.text}</Text>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <View style={styles.deleteButton}>
                <Ionicons name="trash" size={25} color="red" />
              </View>
            </TouchableOpacity>
          </View>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="Adicione uma nova tarefa"
        value={task}
        onChangeText={setTask}
      />

      <Pressable onPress={addTask} style={styles.button}>
        <Text style={styles.buttonText}>Vou fazer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#fff',
    paddingTop: 50
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 40
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 2,
    paddingLeft: 8,
    marginBottom: 10,
    borderRadius: 12,
  },
  button: {
    borderWidth: 2, 
    borderColor: "black",
    height: 40, 
    borderRadius: 12, 
    marginTop: 6,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: { 
    fontSize: 12,
    textAlign: 'center'
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 9,
    marginBottom: 5,
  },
  taskText: {
    fontSize: 18,
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
