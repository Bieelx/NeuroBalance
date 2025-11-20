import React, { useState, useEffect, useRef, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Modal } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { useIsFocused } from '@react-navigation/native';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import Button from '../components/Button';

const useAgitationSensor = (isFocused) => {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState(null);
  const [level, setLevel] = useState('Calmo'); 
  
  const lastValues = useRef({ x: 0, y: 0, z: 0 });
  const isFirstReading = useRef(true);

  useEffect(() => {
    let sub;
    if (isFocused) {
      sub = Accelerometer.addListener(setData);
      setSubscription(sub);
      Accelerometer.setUpdateInterval(250);
      
      isFirstReading.current = true;
      lastValues.current = { x: 0, y: 0, z: 0 };
      
    } else {
      subscription && subscription.remove();
      setSubscription(null);
    }
    return () => sub && sub.remove();
  }, [isFocused]); 

  useEffect(() => {
    const { x, y, z } = data;

    if (isFirstReading.current) {
      lastValues.current = { x, y, z };
      isFirstReading.current = false;
      return;
    }

    const deltaX = Math.abs(x - lastValues.current.x);
    const deltaY = Math.abs(y - lastValues.current.y);
    const deltaZ = Math.abs(z - lastValues.current.z);

    const magnitude = deltaX + deltaY + deltaZ;

    lastValues.current = { x, y, z };

    if (magnitude > 0.8) {
      setLevel('Agitado');
    } else if (magnitude > 0.2) {
      setLevel('Inquieto');
    } else {
      setLevel('Calmo');
    }
  }, [data]); 

  return { level, data };
};


const DonutChart = ({ percentage, color, size = 120, strokeWidth = 15 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
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
          stroke={color}
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
    </View>
  );
};

const FakeHeartBarChart = () => {
  const barData = [20, 30, 45, 40, 50, 30, 35, 25, 40, 55, 60, 40, 30, 45, 50, 40, 35, 30, 25, 40];
  return (
    <View style={styles.barChartContainer}>
      {barData.map((height, index) => (
        <View key={index} style={[styles.bar, { height: height }]} />
      ))}
    </View>
  );
};

const SleepProgressBar = ({ label, value, total, color }) => {
  const width = (value / total) * 100;
  return (
    <View style={styles.progressContainer}>
      <Text style={styles.progressLabel}>{label}</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${width}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.progressValue}>{value}h</Text>
    </View>
  );
};

const AgitationSensorWidget = memo(({ navigation }) => {
  const isFocused = useIsFocused(); 
  const { level, data } = useAgitationSensor(isFocused);

  return (
    <View style={styles.card}>
      <Text style={styles.cardSectionTitle}>Balanço de Agitação (Demo)</Text>
      
      {level === 'Agitado' ? (
        <View style={styles.warningContainer}>
          <Feather name="alert-triangle" size={24} color="#f87171" />
          <Text style={styles.warningTitle}>Agitação Alta Detectada</Text>
          <Text style={styles.warningText}>Recomendamos uma pausa para respiração.</Text>
          <Button 
            title="Iniciar Exercício" 
            onPress={() => navigation.navigate('Breathing')}
            style={{marginTop: 15, backgroundColor: '#00A389'}} 
          />
        </View>
      ) : (
        <View style={styles.sensorBox}>
          <Text style={styles.sensorTitle}>Nível de Agitação Atual:</Text>
          <Text style={[
            styles.sensorData, 
            level === 'Inquieto' && { color: '#facc15' }
          ]}>
            {level}
          </Text>
          {level !== 'Indisponível' && (
            <Text style={styles.sensorDebug}>(X: {data.x.toFixed(2)}, Y: {data.y.toFixed(2)})</Text>
          )}
        </View>
      )}
    </View>
  );
});

const RenderConnectedView = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.mainTitle}>Saúde</Text>
      <Text style={styles.mainSubtitle}>Dados do seu Apple Watch</Text>

      <View style={styles.connectedDeviceCard}>
        <View style={styles.cardIcon}>
          <Ionicons name="watch-outline" size={24} color="#00A389" />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>Apple Watch Ultra</Text>
          <Text style={styles.cardSubtext}>16:44</Text>
        </View>
        <Ionicons name="refresh" size={24} color="#666" />
      </View>

      <View style={[styles.card, { backgroundColor: '#FFFBEB' }]}>
        <Text style={styles.cardSectionTitle}>Nível de Stress Atual</Text>
        <View style={styles.stressDonutContainer}>
          <DonutChart percentage={30} color="#F97316" size={160} strokeWidth={20} />
          <View style={styles.stressDonutText}>
            <Text style={{fontSize: 32}}>😰</Text>
            <Text style={styles.stressPercent}>30%</Text>
          </View>
        </View>
        <Text style={styles.stressLabel}>Stress Moderado</Text>
        <Text style={styles.stressSubtext}>Nível moderado de stress. Considere fazer pausas regulares.</Text>
        
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Ionicons name="heart-outline" size={24} color="#EF4444" />
            <Text style={[styles.metricLabel, {color: '#EF4444'}]}>FC Elevada</Text>
          </View>
          <View style={styles.metricItem}>
            <Ionicons name="pulse-outline" size={24} color="#10B981" />
            <Text style={[styles.metricLabel, {color: '#10B981'}]}>VFC Boa</Text>
          </View>
          <View style={styles.metricItem}>
            <Ionicons name="moon-outline" size={24} color="#3B82F6" />
            <Text style={[styles.metricLabel, {color: '#3B82F6'}]}>Sono Bom</Text>
          </View>
        </View>
      </View>

      <AgitationSensorWidget navigation={navigation} /> 

      <View style={[styles.card, { backgroundColor: '#FEEEEE' }]}>
        <Text style={styles.cardSectionTitle}>Frequência Cardíaca</Text>
        <Text style={styles.cardSubtext}>Média em repouso</Text>
        <Text style={styles.mainValue}>74 <Text style={styles.unit}>BPM</Text></Text>
        <FakeHeartBarChart />
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>Variação: 58-78 BPM</Text>
          <Text style={[styles.detailText, {color: '#10B981'}]}><Feather name="trending-up" size={14} /> Normal</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: '#F3E8FF' }]}>
        <Text style={styles.cardSectionTitle}>Sono</Text>
        <Text style={styles.cardSubtext}>Última noite</Text>
        <Text style={styles.mainValue}>7.4 <Text style={styles.unit}>horas</Text></Text>
        <SleepProgressBar label="Sono Profundo" value={2.2} total={7.4} color="#8B5CF6" />
        <SleepProgressBar label="Sono REM" value={1.6} total={7.4} color="#A78BFA" />
        <SleepProgressBar label="Sono Leve" value={3.8} total={7.4} color="#C4B5FD" />
      </View>

      <View style={[styles.card, { backgroundColor: '#E0F3F0' }]}>
        <Text style={styles.cardSectionTitle}>VFC</Text>
        <Text style={styles.cardSubtext}>Variabilidade da FC</Text>
        <Text style={styles.mainValue}>65 <Text style={styles.unit}>ms</Text></Text>
        <DonutChart percentage={75} color="#00A389" size={120} strokeWidth={15} />
        <Text style={styles.detailTitle}>Sobre VFC</Text>
        <Text style={styles.detailText}>A VFC mede a variação de tempo entre batimentos cardíacos. Valores mais altos geralmente indicam melhor saúde.</Text>
        <View style={styles.detailRow}>
          <Text style={[styles.detailText, {color: '#10B981'}]}><Feather name="trending-up" size={14} /> Excelente</Text>
          <Text style={styles.detailText}>Média: 40-60 ms</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: '#E0F3F0' }]}>
        <Text style={styles.cardSectionTitle}>Resumo de Saúde</Text>
        <Text style={styles.detailText}>Seus indicadores de saúde estão excelentes. Continue mantendo uma rotina saudável de sono e monitore seu stress.</Text>
      </View>
    </ScrollView>
  );
};

const RenderDisconnectedView = ({ onConnect }) => (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.mainTitle}>Monitor de Saúde</Text>
    <Text style={styles.mainSubtitle}>Dados sincronizados do seu smartwatch</Text>

    <View style={styles.iconCircle}>
      <Ionicons name="watch-outline" size={60} color="#00A389" />
    </View>

    <Text style={styles.connectTitle}>Conecte seu Smartwatch</Text>
    <Text style={styles.connectSubtitle}>
      Sincronize dados do seu Apple Watch, Fitbit, Garmin ou Samsung Galaxy Watch para ter insights mais precisos sobre seu bem-estar.
    </Text>

    <Button
      title="Conectar Dispositivo"
      onPress={onConnect}
      style={styles.connectButton}
    >
      <Feather name="link" size={20} color="white" style={{ marginRight: 10 }} />
    </Button>

    <View style={styles.featuresRow}>
      <View style={styles.featureBox}>
        <Feather name="check-circle" size={20} color="#00A389" />
        <Text style={styles.featureText}>Dados privados</Text>
      </View>
      <View style={styles.featureBox}>
        <Feather name="check-circle" size={20} color="#00A389" />
        <Text style={styles.featureText}>Sync automático</Text>
      </View>
    </View>
  </ScrollView>
);

const SaudeScreen = ({ navigation }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleConnect = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setIsConnected(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Feather name="watch" size={40} color="#00A389" />
            <Text style={styles.modalTitle}>Conexão Simulada</Text>
            <Text style={styles.modalText}>
              Para esta sprint, vamos gerar dados fictícios para simular a conexão com um smartwatch.
            </Text>
            <Button title="OK, gerar dados" onPress={handleCloseModal} style={{marginTop: 20}} />
          </View>
        </View>
      </Modal>

      {isConnected ? 
        <RenderConnectedView navigation={navigation} /> : 
        <RenderDisconnectedView onConnect={handleConnect} />
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FBFB' },
  container: {
    padding: 20,
    paddingBottom: 120, 
    flexGrow: 1, 
  },
  mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', alignSelf: 'flex-start' },
  mainSubtitle: { fontSize: 16, color: '#666', marginBottom: 30, alignSelf: 'flex-start' },
  
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E0F3F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center', 
  },
  connectTitle: { 
    fontSize: 22, 
    fontWeight: '600', 
    color: '#333', 
    marginBottom: 10,
    textAlign: 'center',
  },
  connectSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  connectButton: {
    backgroundColor: '#00A389',
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 16,
    width: '80%',
    alignSelf: 'center', 
    justifyContent: 'center',
  },
  featuresRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    width: '100%', 
    marginTop: 30 
  },
  featureBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0F3F0',
    minWidth: 150,
    justifyContent: 'center',
  },
  featureText: { marginLeft: 10, fontSize: 14, fontWeight: '500', color: '#555' },
  
  connectedDeviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0F3F0',
    width: '100%',
    marginBottom: 20,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F3F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardSubtext: { fontSize: 14, color: '#666', marginTop: 4 },
  card: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardSectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', alignSelf: 'center' },
  stressDonutContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    alignSelf: 'center',
  },
  stressDonutText: {
    position: 'absolute',
    alignItems: 'center',
  },
  stressPercent: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  stressLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  stressSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 15,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  mainValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    alignSelf: 'center',
  },
  unit: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#666',
  },
  barChartContainer: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  bar: {
    width: 6,
    backgroundColor: '#F87171',
    borderRadius: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    flex: 1,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    alignSelf: 'flex-start',
    marginTop: 15,
    marginBottom: 5,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 15,
  },
  progressLabel: {
    fontSize: 14,
    color: '#555',
    width: 100,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#EEE',
    borderRadius: 4,
    marginHorizontal: 10,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressValue: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  
  sensorBox: {
    alignItems: 'center',
  },
  sensorTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 10 },
  sensorData: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#00A389', 
    marginBottom: 5 
  },
  sensorDebug: { fontSize: 12, color: '#AAA', fontFamily: 'monospace' },
  
  warningContainer: {
    alignItems: 'center',
    padding: 10,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f87171',
    marginTop: 10,
  },
  warningText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  
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
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
});

export default SaudeScreen;