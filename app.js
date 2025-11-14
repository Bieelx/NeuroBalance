import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

// Importa as Nossas Telas
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import CheckinScreen from './src/screens/ChekinScreen'; 

// --- NOVO ---
// Importa o nosso novo Navegador de Abas
import AppTabs from './src/navigation/AppTabs';

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00A389" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // --- STACK UTILIZADOR AUTENTICADO (MODIFICADO) ---
          <>
            {/* A tela principal agora é o conjunto de Abas */}
            <Stack.Screen name="AppTabs" component={AppTabs} />
            
            {/* A tela de Checkin abre 'por cima' das abas */}
            <Stack.Screen name="Checkin" component={CheckinScreen} />
          </>
        ) : (
          // --- STACK UTILIZADOR NÃO AUTENTICADO ---
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FBFB',
  }
});