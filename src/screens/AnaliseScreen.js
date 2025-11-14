import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Modal } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons'; // Feather agora é usado no placeholder
import Button from '../components/Button';

// !! NÃO PRECISAMOS MAIS DE ASSETS !!

const AnalisesScreen = () => {
  const [activeTab, setActiveTab] = useState('Semana');
  const [modalVisible, setModalVisible] = useState(false);

  // Mostra o modal assim que a tela é carregada
  useEffect(() => {
    setModalVisible(true);
  }, []);

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      {['Hoje', 'Semana', 'Mês'].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.tabActive]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* --- POP-UP / MODAL --- */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Feather name="info" size={40} color="#00A389" />
              <Text style={styles.modalTitle}>Aviso de Demonstração</Text>
              <Text style={styles.modalText}>
                Estes dados são <Text style={{fontWeight: 'bold'}}>fictícios</Text> para esta sprint.
              </Text>
              <Text style={styles.modalText}>
                O plano futuro é conectar esta tela aos seus dados reais de smartwatch (batimento cardíaco, VFC) e aos seus check-ins de voz para análises precisas.
              </Text>
              <Button title="Entendi!" onPress={() => setModalVisible(false)} style={{marginTop: 20}} />
            </View>
          </View>
        </Modal>
        {/* --- FIM DO MODAL --- */}

        <Text style={styles.mainTitle}>Análises de Humor</Text>
        <Text style={styles.mainSubtitle}>Acompanhe seu bem-estar ao longo do tempo</Text>

        {renderTabs()}

        {/* Cards de Métricas */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Humor Médio</Text>
            <Text style={styles.metricValue}>60% <Feather name="arrow-down" color="red" size={20} /></Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Energia Média</Text>
            <Text style={styles.metricValue}>57% <Feather name="arrow-down" color="red" size={20} /></Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Estresse Médio</Text>
            <Text style={styles.metricValue}>45% <Feather name="arrow-up" color="green" size={20} /></Text>
          </View>
        </View>

        {/* Card do Gráfico */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Tendências de Humor</Text>
          
          {/* --- NOVO PLACEHOLDER (SEM IMAGEM) --- */}
          <View style={styles.chartPlaceholder}>
            <Feather name="bar-chart-2" size={60} color="#E0E0E0" />
            <Text style={styles.chartPlaceholderText}>Gráfico (placeholder)</Text>
          </View>
          {/* --- FIM DO NOVO PLACEHOLDER --- */}

          <View style={styles.legendContainer}>
             <View style={styles.legendItem}>
                <View style={[styles.legendDot, {backgroundColor: '#3B82F6'}]} />
                <Text style={styles.legendText}>Energia</Text>
             </View>
             <View style={styles.legendItem}>
                <View style={[styles.legendDot, {backgroundColor: '#10B981'}]} />
                <Text style={styles.legendText}>Humor</Text>
             </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FBFB' },
  container: { padding: 20, paddingBottom: 40 },
  mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  mainSubtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#EEE',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: '#FFFFFF', shadowOpacity: 0.1, shadowRadius: 5 },
  tabText: { fontSize: 16, fontWeight: '500', color: '#666' },
  tabTextActive: { color: '#00A389', fontWeight: '600' },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0F3F0',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  metricTitle: { fontSize: 14, color: '#666', marginBottom: 8 },
  metricValue: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  chartCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0F3F0',
    padding: 20,
  },
  chartTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 20 },
  
  // --- ESTILOS DO NOVO PLACEHOLDER ---
  chartPlaceholder: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    backgroundColor: '#FAFAFA', // Fundo claro
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    marginTop: 10,
    color: '#BDBDBD', // Cor cinza clara
    fontSize: 14,
    fontWeight: '500',
  },
  // --- FIM DOS ESTILOS ---

  legendContainer: { flexDirection: 'row', justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 15 },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  legendText: { fontSize: 14, color: '#555' },
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 10,
  },
});

export default AnalisesScreen;