// src/screens/AuthScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Button from '../components/Button'; 

const AuthScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>

      
      <Text style={styles.welcomeText}>Bem-vindo ao NeuroBalance!</Text>
      <Text style={styles.subtitleText}>Sua jornada para um bem-estar mental começa aqui.</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Fazer Login"
          onPress={() => navigation.navigate('Login')} 
          style={styles.button}
        />
        <Button
          title="Criar Conta"
          onPress={() => navigation.navigate('Register')} 
          variant="secondary"
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FBFB',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00A389',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 26,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  button: {
    marginBottom: 15,
  },
});

export default AuthScreen;