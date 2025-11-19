import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import Button from '../components/Button';

const BreathingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Ionicons name="close" size={32} color="#333" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.title}>Respiração Guiada</Text>
        <Text style={styles.subtitle}>Uma pausa de 1 minuto para reequilibrar.</Text>
        
        <View style={styles.animationCircle}>
           <Feather name="wind" size={80} color="#00A389" />
        </View>

        <Text style={styles.instruction}>Inspire... Expire...</Text>
        
        <Button
          title="Concluir"
          onPress={() => navigation.goBack()}
          style={{ width: '80%' }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FBFB' },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 60,
  },
  animationCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E0F3F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  instruction: {
    fontSize: 22,
    fontWeight: '500',
    color: '#555',
    marginBottom: 60,
  },
});

export default BreathingScreen;