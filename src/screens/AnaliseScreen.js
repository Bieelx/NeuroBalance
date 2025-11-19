import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Modal, Animated } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import Svg, { Path, Polygon, Rect, G } from 'react-native-svg';
import { useIsFocused } from '@react-navigation/native';
import Button from '../components/Button';

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const DADOS_ENERGIA = [75, 76, 45, 43, 55, 52, 42];
const DADOS_HUMOR = [60, 55, 75, 48, 58, 48, 55];
const DADOS_ESTRESSE = [55, 38, 42, 60, 45, 35, 65];

const CHART_HEIGHT = 150;
const CHART_WIDTH = 300;

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

const getSvgCoordinates = (data) => {
  return data.map((point, i) => {
    const x = (i / (data.length - 1)) * CHART_WIDTH;
    const y = CHART_HEIGHT - (point / 100) * CHART_HEIGHT;
    return { x, y };
  });
};

const createCurvedPath = (points) => {
  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p1 = points[i - 1];
    const p2 = points[i];
    const cp1x = p1.x + (p2.x - p1.x) / 2;
    const cp1y = p1.y;
    const cp2x = p1.x + (p2.x - p1.x) / 2;
    const cp2y = p2.y;
    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return path;
};

const createCurvedArea = (points) => {
  const path = createCurvedPath(points);
  return `${path} L ${CHART_WIDTH},${CHART_HEIGHT} L 0,${CHART_HEIGHT} Z`;
};

const FakeLineChart = ({ animation }) => {
  const clipWidth = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, CHART_WIDTH]
  });

  const pointsEnergia = getSvgCoordinates(DADOS_ENERGIA);
  const pathEnergia = createCurvedPath(pointsEnergia);
  const areaEnergia = createCurvedArea(pointsEnergia);
  
  const pointsHumor = getSvgCoordinates(DADOS_HUMOR);
  const pathHumor = createCurvedPath(pointsHumor);
  const areaHumor = createCurvedArea(pointsHumor);

  return (
    <View style={styles.chartContainer}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        <G>
          <Animated.View style={{width: clipWidth, overflow: 'hidden'}}>
            <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
              <AnimatedPath d={areaEnergia} fill="#3B82F6" fillOpacity={0.1} />
              <AnimatedPath d={pathEnergia} stroke="#3B82F6" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <AnimatedPath d={areaHumor} fill="#10B981" fillOpacity={0.1} />
              <AnimatedPath d={pathHumor} stroke="#10B981" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </Animated.View>
        </G>
      </Svg>
      <View style={styles.axisLabels}>
        {DIAS_SEMANA.map(dia => <Text key={dia} style={styles.axisLabel}>{dia}</Text>)}
      </View>
    </View>
  );
};

const FakeBarChart = ({ data, animation }) => {
  const barWidth = 20;
  const barMargin = (CHART_WIDTH - (data.length * barWidth)) / (data.length - 1);

  return (
    <View style={styles.chartContainer}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        <G>
          {data.map((value, index) => {
            const barHeight = (value / 100) * CHART_HEIGHT;
            const x = index * (barWidth + barMargin);
            const y = CHART_HEIGHT - barHeight;

            const animatedHeight = animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, barHeight]
            });
            const animatedY = animation.interpolate({
              inputRange: [0, 1],
              outputRange: [CHART_HEIGHT, y]
            });

            return (
              <AnimatedRect
                key={index}
                x={x}
                y={animatedY}
                width={barWidth}
                height={animatedHeight}
                fill="#F97316"
                rx={4}
              />
            );
          })}
        </G>
      </Svg>
      <View style={styles.axisLabels}>
        {DIAS_SEMANA.map(dia => <Text key={dia} style={styles.axisLabel}>{dia}</Text>)}
      </View>
    </View>
  );
};

const AnalisesScreen = () => {
  const [activeTab, setActiveTab] = useState('Semana');
  const [modalVisible, setModalVisible] = useState(false);
  
  const isFocused = useIsFocused();
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setModalVisible(true);
  }, []);
  
  useEffect(() => {
    if (isFocused) {
      animation.setValue(0);
      Animated.timing(animation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [isFocused, activeTab]);

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

        <Text style={styles.mainTitle}>Análises de Humor</Text>
        <Text style={styles.mainSubtitle}>Acompanhe seu bem-estar ao longo do tempo</Text>

        {renderTabs()}

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Humor Médio</Text>
            <Text style={styles.metricValue}>57% <Feather name="arrow-down" color="red" size={20} /></Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Energia Média</Text>
            <Text style={styles.metricValue}>55% <Feather name="arrow-down" color="red" size={20} /></Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Estresse Médio</Text>
            <Text style={styles.metricValue}>50% <Feather name="arrow-up" color="green" size={20} /></Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Tendências de Humor</Text>
          <FakeLineChart animation={animation} />
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

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Níveis de Estresse</Text>
          <FakeBarChart data={DADOS_ESTRESSE} animation={animation} />
        </View>
        
        <View style={styles.insightsCard}>
          <Feather name="check-circle" size={24} color="#00A389" />
          <View style={styles.insightsContent}>
            <Text style={styles.insightsTitle}>Insights do Período</Text>
            <Text style={styles.insightsText}>• Seu humor está equilibrado.</Text>
            <Text style={styles.insightsText}>• Seus níveis de estresse estão controlados. Ótimo trabalho!</Text>
            <Text style={styles.insightsText}>• Você fez check-ins em 5 de 7 dias.</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FBFB' },
  container: { 
    padding: 20, 
    paddingBottom: 120, 
  },
  mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  mainSubtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
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
  tabActive: { backgroundColor: '#FFFFFF', shadowOpacity: 0.1, shadowRadius: 5, elevation: 2 },
  tabText: { fontSize: 16, fontWeight: '500', color: '#666' },
  tabTextActive: { color: '#00A389', fontWeight: '600' },
  metricsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0F3F0',
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  metricTitle: { fontSize: 14, color: '#666', marginBottom: 8 },
  metricValue: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  chartCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0F3F0',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 20 },
  chartContainer: {
    width: '100%',
    alignItems: 'center',
  },
  axisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
  },
  axisLabel: {
    fontSize: 12,
    color: '#999',
  },
  legendContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center',
    marginTop: 20,
  },
  legendItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginHorizontal: 15 
  },
  legendDot: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    marginRight: 8 
  },
  legendText: { fontSize: 14, color: '#555' },
  insightsCard: {
    backgroundColor: '#E6FFFA',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
  },
  insightsContent: {
    flex: 1,
    marginLeft: 15,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  insightsText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 8,
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