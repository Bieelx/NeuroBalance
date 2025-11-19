import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { auth } from '../../firebaseConfig';
import CheckinModal from '../components/CheckinModal';
import { LinearGradient } from 'expo-linear-gradient';

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

// Componente para os "pontos" de sequência
const StreakDots = () => (
  <View style={styles.dotsContainer}>
    <View style={[styles.dot, styles.dotActive]} />
    <View style={[styles.dot, styles.dotActive]} />
    <View style={[styles.dot, styles.dotActive]} />
    <View style={[styles.dot, styles.dotActive]} />
    <View style={[styles.dot, styles.dotActive]} />
    <View style={styles.dot} />
    <View style={styles.dot} />
  </View>
);

const HomeScreen = ({ navigation }) => {
  const userName = getUserName();
  const [checkinModalVisible, setCheckinModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <CheckinModal 
        visible={checkinModalVisible} 
        onClose={() => setCheckinModalVisible(false)}
        navigation={navigation}
      />

      <View style={styles.container}>
        
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.greeting}>Boa tarde</Text>
          </View>
        </View>

        <View style={styles.promptContainer}>
          <Text style={styles.promptTitle}>Olá, {userName}</Text>
          <Text style={styles.promptSubtitle}>Como você está se sentindo agora?</Text>
        </View>

        <TouchableOpacity 
          style={styles.actionButtonBase}
          onPress={() => setCheckinModalVisible(true)}
        >
          <LinearGradient
            colors={['#10B981', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <View style={styles.buttonIconWrapper}>
              <Feather name="mic" size={24} color="white" />
            </View>
            <Text style={styles.checkinButtonText}>Fazer Check-in de 60s</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setCheckinModalVisible(true)}
        >
          <Text style={styles.textLink}>ou prefiro digitar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.actionButtonBase, 
            styles.teamButton 
          ]} 
          onPress={() => navigation.navigate('TeamReport')}
        >
          <View style={styles.buttonContentWrapper}>
            <View style={[styles.buttonIconWrapper, styles.teamIconWrapper]}>
              <MaterialCommunityIcons name="account-group-outline" size={24} color="#7C3AED" />
            </View>
            <Text style={styles.teamButtonText}>Analisar Stress da Equipe</Text>
          </View>
        </TouchableOpacity>

        {/* --- NOVO CARD DE FREQUÊNCIA --- */}
        <View style={styles.streakCard}>
          <Text style={styles.streakNumber}>5</Text>
          <Text style={styles.streakLabel}>dias de sequência</Text>
          <StreakDots />
          <View style={styles.streakDivider} />
          <View style={styles.streakMetrics}>
            <View style={styles.streakMetricItem}>
              <Text style={styles.streakMetricValue}>18</Text>
              <Text style={styles.streakMetricLabel}>ESTE MÊS</Text>
            </View>
            <View style={styles.streakMetricItem}>
              <Text style={styles.streakMetricValue}>60%</Text>
              <Text style={styles.streakMetricLabel}>TAXA</Text>
            </View>
          </View>
        </View>
        {/* --- FIM DO NOVO CARD --- */}

        <View style={styles.infoCard}>
          <View style={styles.cardIcon}>
            <Feather name="calendar" size={24} color="#00A389" />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Seu próximo check-in</Text>
            <Text style={styles.cardSubtitle}>Faça um check-in diário para acompanhar seu bem-estar e receber recomendações.</Text>
          </View>
        </View>

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
    paddingBottom: 100, // Aumentar padding inferior
  },
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

  actionButtonBase: {
    width: '100%',
    height: 80, 
    borderRadius: 24, 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonGradient: {
    height: '100%',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    paddingHorizontal: 20,
  },
  buttonContentWrapper: {
    height: '100%',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    paddingHorizontal: 20,
  },
  buttonIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    marginRight: 15,
  },
  checkinButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  teamButton: {
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  teamIconWrapper: {
    backgroundColor: 'rgba(124, 58, 237, 0.1)', 
  },
  teamButtonText: {
    color: '#7C3AED', 
    fontSize: 18,
    fontWeight: '600',
  },

  textLink: {
    color: '#00A389',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
    marginTop: -5,
    marginBottom: 20, 
  },

  // --- ESTILOS DO CARD DE FREQUÊNCIA ---
  streakCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0F3F0',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00A389',
  },
  streakLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  dotsContainer: {
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0F3F0',
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: '#00A389',
  },
  streakDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    width: '100%',
    marginVertical: 20,
  },
  streakMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  streakMetricItem: {
    alignItems: 'center',
  },
  streakMetricValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  streakMetricLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontWeight: '500',
  },
  // --- FIM DOS ESTILOS ---

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
    marginTop: 10,
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
    justifyContent: 'center', // Centraliza o footer
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 20, // Padding vertical
    marginTop: 'auto', // Empurra para o final
  },
  footerText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666',
  },
});

export default HomeScreen;