import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import Button from '../components/Button';
import Input from '../components/Input';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As palavras-passe não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (firebaseError) {
      if (firebaseError.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else if (firebaseError.code === 'auth/invalid-email') {
        setError('O formato do e-mail é inválido.');
      } else {
        setError('Ocorreu um erro ao criar a conta.');
      }
      console.error('Erro de Registo:', firebaseError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <Text style={styles.subtitle}>Comece a sua jornada de bem-estar.</Text>

      {error && <Text style={styles.generalError}>{error}</Text>}

      <Input
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="exemplo@email.com"
        keyboardType="email-address"
      />

      <Input
        label="Palavra-passe"
        value={password}
        onChangeText={setPassword}
        placeholder="Pelo menos 6 caracteres"
        secureTextEntry
      />

      <Input
        label="Confirmar Palavra-passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Repita a palavra-passe"
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#00A389" />
        ) : (
          <Button
            title="Criar Conta"
            onPress={handleRegister}
            disabled={loading}
          />
        )}
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>
          Já tem conta? <Text style={styles.linkTextBold}>Faça Login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FBFB',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00A389',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  generalError: {
    color: '#E53E3E',
    backgroundColor: '#FFF1F1',
    borderWidth: 1,
    borderColor: '#E53E3E',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 30,
  },
  linkText: {
    fontSize: 16,
    color: '#555',
  },
  linkTextBold: {
    fontWeight: 'bold',
    color: '#00A389',
  },
});

export default RegisterScreen;