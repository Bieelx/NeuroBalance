import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons'; 
import { auth } from '../../firebaseConfig';
import Button from '../components/Button'; 

const getUserName = () => {
  if (auth.currentUser) {
    if (auth.currentUser.isAnonymous) {
      return 'Visitante';
    }
    const emailName = auth.currentUser.email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  }
  return 'Alex';
};

const HomeScreen = ({ navigation }) => {
  const userName = getUserName();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.greeting}>Boa tarde</Text>
          </View>
        </View>

        {}
        <View style={styles.promptContainer}>
          <Text style={styles.promptTitle}>Olá, {userName}</Text>
          <Text style={styles.promptSubtitle}>Como você está se sentindo agora?</Text>
        </View>

        {}
        {}
        <Button
          title="Fazer Check-in de 60s"
          onPress={() => navigation.navigate('Checkin')}
          style={styles.checkinButton}
          textStyle={styles.checkinButtonText}
        >
          {}
          <Feather name="mic" size={24} color="white" style={{ marginRight: 12 }} />
        </Button>
        
        {}
        <TouchableOpacity onPress={() => navigation.navigate('Checkin')}>
          <Text style={styles.textLink}>ou prefiro digitar</Text>
        </TouchableOpacity>

        {}
        <View style={styles.infoCard}>
          <View style={styles.cardIcon}>
            <Feather name="calendar" size={24} color="#00A389" />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Seu próximo check-in</Text>
            <Text style={styles.cardSubtitle}>Faça um check-in diário para acompanhar seu bem-estar e receber recomendações.</Text>
          </View>
        </View>

        {}
        <View style={styles.footer}>
          <Ionicons name="lock-closed-outline" size={14} color="#666" />
          <Text style={styles.footerText}>Seus dados são privados e seguros</Text>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FBFB',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00A389',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  // Prompt
  promptContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  promptTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  promptSubtitle: {
    fontSize: 16,
    color: '#666',
  },

  checkinButton: {

    backgroundColor: '#00A389', 
    flexDirection: 'row', 
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
  },
  checkinButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  textLink: {
    color: '#00A389',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0F3F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F3F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 20, 
    alignSelf: 'center',
  },
  footerText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666',
  },
});

export default HomeScreen;