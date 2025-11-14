import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import Button from '../components/Button';
import Input from '../components/Input';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError('Por favor, preencha o e-mail e a palavra-passe.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (firebaseError) {
      if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password' || firebaseError.code === 'auth/invalid-credential') {
        setError('E-mail ou palavra-passe inválidos.');
      } else {
        setError('Ocorreu um erro ao fazer login.');
      }
      console.error('Erro de Login:', firebaseError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInAnonymously(auth);
    } catch (firebaseError) {
      setError('Ocorreu um erro ao tentar o login anónimo.');
      console.error('Erro de Login Anónimo:', firebaseError.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bem-vindo de volta!</Text>
      <Text style={styles.subtitle}>Faça login para continuar.</Text>

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
        placeholder="Sua palavra-passe"
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#00A389" />
        ) : (
          <>
            <Button
              title="Entrar"
              onPress={handleLogin}
              disabled={loading}
              style={{ marginBottom: 15 }}
            />
            <Button
              title="Entrar como Anónimo (Demo)"
              onPress={handleAnonymousLogin}
              disabled={loading}
              variant="secondary"
            />
          </>
        )}
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>
          Não tem conta? <Text style={styles.linkTextBold}>Crie uma</Text>
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

export default LoginScreen;