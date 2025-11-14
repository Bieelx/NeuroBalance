import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { useIsFocused } from '@react-navigation/native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import Button from '../components/Button';

const useAgitationSensor = (isFocused) => {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState(null);
  const [level, setLevel] = useState('Calmo');

  useEffect(() => {
    if (isFocused) {
      const sub = Accelerometer.addListener(setData);
      setSubscription(sub);
      Accelerometer.setUpdateInterval(500); 
    } else {
      subscription && subscription.remove();
      setSubscription(null);
    }
    return () => subscription && subscription.remove();
  }, [isFocused]); 

  useEffect(() => {
    const { x, y, z } = data;
    const magnitude = Math.sqrt(x * x + y * y + (z - 1) * (z - 1));
    
    if (magnitude > 0.5) setLevel('Agitado');
    else if (magnitude > 0.1) setLevel('Inquieto');
    else setLevel('Calmo');
  }, [data]); 

  return { level, data };
};

const SaudeScreen = () => {
  const isFocused = useIsFocused(); 
  const { level, data } = useAgitationSensor(isFocused);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <Text style={styles.mainTitle}>Monitor de Saúde</Text>
        <Text style={styles.mainSubtitle}>Dados sincronizados do seu smartwatch</Text>

        <View style={styles.iconCircle}>
          <FontAwesome5 name="watch" size={60} color="#00A389" />
        </View>

        <Text style={styles.connectTitle}>Conecte seu Smartwatch</Text>
        <Text style={styles.connectSubtitle}>
          Sincronize dados do seu Apple Watch, Fitbit, Garmin ou Samsung Galaxy Watch para ter insights mais precisos sobre seu bem-estar.
        </Text>

        <Button
          title="Conectar Dispositivo"
          onPress={() => {}} 
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


        <View style={styles.divider} />


        <Text style={styles.sectionTitle}>Balanço de Agitação (Demo)</Text>
        <Text style={styles.sectionSubtitle}>Sensor do telefone está lendo o seu movimento agora.</Text>

        <View style={styles.sensorBox}>
          <Text style={styles.sensorTitle}>Nível de Agitação Atual:</Text>
          <Text style={styles.sensorData}>{level}</Text>
          <Text style={styles.sensorDebug}>(X: {data.x.toFixed(2)}, Y: {data.y.toFixed(2)})</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FBFB' },
  container: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40, // Espaço extra no final
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
  },
  connectTitle: { fontSize: 22, fontWeight: '600', color: '#333', marginBottom: 10 },
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
  },
  featuresRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 30 },
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
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    width: '90%',
    marginVertical: 40,
  },
  sectionTitle: { fontSize: 22, fontWeight: '600', color: '#333', marginBottom: 10 },
  sectionSubtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 },
  sensorBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0F3F0',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sensorTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 10 },
  sensorData: { fontSize: 28, fontWeight: 'bold', color: '#00A389', marginBottom: 5 },
  sensorDebug: { fontSize: 12, color: '#AAA', fontFamily: 'monospace' },
});

export default SaudeScreen;