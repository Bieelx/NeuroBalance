import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const CheckinScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Check-in</Text>
      <Text style={styles.subtitle}>Aqui é onde vamos colocar os emojis e o input de texto.</Text>
      <Button title="Voltar para Home" onPress={() => navigation.goBack()} />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00A389',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
});

export default CheckinScreen;