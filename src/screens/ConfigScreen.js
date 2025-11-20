import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { Feather, Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';

const getUserInfo = () => {
  if (auth.currentUser) {
    if (auth.currentUser.isAnonymous) {
      return { name: 'Visitante', letter: 'V' };
    }
    const emailName = auth.currentUser.email.split('@')[0];
    const name = emailName.charAt(0).toUpperCase() + emailName.slice(1);
    const letter = name.charAt(0).toUpperCase();
    return { name, letter };
  }
  return { name: 'Alex', letter: 'A' }; 
};

const ConfigScreen = () => {
  const { name, letter } = getUserInfo();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Configurações</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{letter}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userSince}>Membro desde Nov 2024</Text>
          </View>
        </View>

        <View style={styles.settingsCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <Feather name="bell" size={20} color="#00A389" />
            </View>
            <Text style={styles.cardTitle}>Notificações</Text>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.itemText}>Lembretes de check-in</Text>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#C5E8E0" }}
              thumbColor={notificationsEnabled ? "#00A389" : "#f4f3f4"}
              ios_backgroundColor="#E0E0E0"
              onValueChange={setNotificationsEnabled}
              value={notificationsEnabled}
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.itemText}>Horário do lembrete</Text>
            <Text style={styles.itemValue}>09:00</Text>
          </View>
        </View>

        <View style={styles.settingsCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <Feather name="shield" size={20} color="#00A389" />
            </View>
            <Text style={styles.cardTitle}>Privacidade e Segurança</Text>
          </View>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.itemText}>Política de Privacidade</Text>
            <Feather name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.itemText}>Termos de Uso</Text>
            <Feather name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.itemText}>Gerenciar Dados</Text>
            <Feather name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <Button
          title="Sair da Conta"
          onPress={handleLogout}
          style={styles.logoutButton}
          textStyle={styles.logoutButtonText}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FBFB' },
  container: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center', 
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0F3F0',
    marginBottom: 25,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00A389',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userSince: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  settingsCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0F3F0',
    padding: 20,
    marginBottom: 25,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F3F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  itemText: {
    fontSize: 16,
    color: '#555',
  },
  itemValue: {
    fontSize: 16,
    color: '#00A389',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E53E3E',  
  },
  logoutButtonText: {
    color: '#E53E3E',  
  },
});

export default ConfigScreen;