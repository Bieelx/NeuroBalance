import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

const suggestions = [
  { id: '1', text: 'Pausa para Café em Equipe', sub: 'Agende uma pausa de 15 minutos.', icon: 'coffee', color: '#FFF7E0' },
  { id: '2', text: 'Sessão de Respiração Guiada', sub: 'Organize uma sessão coletiva de 5 min.', icon: 'wind', color: '#E0F9FF' },
  { id: '3', text: 'Check-in Individual (Opcional)', sub: 'Lembre a equipe dos canais de ajuda.', icon: 'message-square', color: '#FEEEEE' },
  { id: '4', text: 'Redistribuir Tarefas', sub: 'Revise prazos e equilibre a carga.', icon: 'calendar', color: '#E6FFFA' },
];

const TeamReportScreen = ({ navigation }) => {
  const percentage = 58;
  const size = 200;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stress da Equipe</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.subtitle}>Visão geral do bem-estar coletivo</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nível de Stress Médio</Text>
          <Text style={styles.cardSubtitle}>Baseado nos últimos check-ins da equipe</Text>

          { }
          <View style={styles.donutContainer}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <Circle
                stroke="#F0F0F0"
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
              />
              <Circle
                stroke="#F97316"
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </Svg>
            <View style={styles.donutTextContainer}>
              <Text style={styles.donutPercent}>{percentage}%</Text>
              <Text style={styles.donutLabel}>Moderado</Text>
            </View>
          </View>
          { }

          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>5</Text>
              <Text style={styles.metricLabel}>Membros</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: '#f87171' }]}>2</Text>
              <Text style={styles.metricLabel}>Stress Alto</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>5</Text>
              <Text style={styles.metricLabel}>Check-ins Hoje</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, styles.warningCard]}>
          <Feather name="alert-triangle" size={24} color="#D97706" />
          <View style={styles.warningTextContainer}>
            <Text style={styles.warningTitle}>Atenção Necessária</Text>
            <Text style={styles.warningText}>
              2 membros da equipe reportaram níveis elevados de stress.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Sugestões para Aliviar o Stress</Text>
        
        {suggestions.map((item) => (
          <View key={item.id} style={[styles.suggestionCard, { backgroundColor: item.color }]}>
            <Feather name={item.icon} size={24} color="#333" />
            <View style={styles.suggestionTextContainer}>
              <Text style={styles.suggestionTitle}>{item.text}</Text>
              <Text style={styles.suggestionSub}>{item.sub}</Text>
            </View>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FBFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  container: {
    padding: 20,
    paddingBottom: 120, 
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0F3F0',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 20,
  },
  
  donutContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  donutTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutPercent: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  donutLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 25,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  warningCard: {
    backgroundColor: '#FEF9C3',
    borderColor: '#FDE68A',
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#713F12',
  },
  warningText: {
    fontSize: 14,
    color: '#713F12',
    marginTop: 4,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    marginTop: 10,
  },
  suggestionCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    alignItems: 'center',
  },
  suggestionTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  suggestionSub: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});

export default TeamReportScreen;