import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal, Animated } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import Button from '../components/Button';

const AudioWave = () => {
  const bars = Array.from({ length: 20 }, (_, i) => i);
  const animatedValues = useState(bars.map(() => new Animated.Value(0)))[0];

  useEffect(() => {
    const animateBars = () => {
      animatedValues.forEach((anim, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 200 + index * 50,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 200 + index * 50,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    };
    animateBars();
    return () => animatedValues.forEach(anim => anim.stopAnimation());
  }, []);

  return (
    <View style={styles.audioWaveContainer}>
      {bars.map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.audioBar,
            {
              height: animatedValues[index].interpolate({
                inputRange: [0, 1],
                outputRange: [10, 50],
              }),
              transform: [{ translateY: animatedValues[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0, -20], 
              })}]
            },
          ]}
        />
      ))}
    </View>
  );
};


const CheckinScreen = ({ navigation }) => {
  const [initialModalVisible, setInitialModalVisible] = useState(true);
  const [recordingModalVisible, setRecordingModalVisible] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isRecording && recordingTime !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording, recordingTime]);

  const handleStartRecording = () => {
    setRecordingModalVisible(true);
    setInitialModalVisible(false);
    setRecordingTime(0);
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setTimeout(() => {
      setRecordingModalVisible(false);
      setResultModalVisible(true);
    }, 500); 
  };

  const handleCloseAllModals = () => {
    setInitialModalVisible(false);
    setRecordingModalVisible(false);
    setResultModalVisible(false);
    navigation.goBack(); 
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.placeholderText}>Carregando Check-in...</Text>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={initialModalVisible}
        onRequestClose={handleCloseAllModals}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Check-in Diário</Text>
              <TouchableOpacity onPress={handleCloseAllModals}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.toggleButtonContainer}>
              <TouchableOpacity style={styles.toggleButtonActive}>
                <Feather name="mic" size={18} color="#00A389" style={{ marginRight: 8 }} />
                <Text style={styles.toggleButtonTextActive}>Voz</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toggleButton}>
                <Feather name="align-left" size={18} color="#666" style={{ marginRight: 8 }} />
                <Text style={styles.toggleButtonText}>Texto</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              Descreva seu dia ou como está se sentindo. Fale por pelo menos 15 segundos.
            </Text>

            <TouchableOpacity style={styles.micButton} onPress={handleStartRecording}>
              <Feather name="mic" size={40} color="white" />
            </TouchableOpacity>
            <Text style={styles.micButtonLabel}>Segure para gravar</Text>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={recordingModalVisible}
        onRequestClose={handleCloseAllModals}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Check-in Diário</Text>
              <TouchableOpacity onPress={handleCloseAllModals}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.toggleButtonContainer}>
              <TouchableOpacity style={styles.toggleButtonActive}>
                <Feather name="mic" size={18} color="#00A389" style={{ marginRight: 8 }} />
                <Text style={styles.toggleButtonTextActive}>Voz</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toggleButton}>
                <Feather name="align-left" size={18} color="#666" style={{ marginRight: 8 }} />
                <Text style={styles.toggleButtonText}>Texto</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              Descreva seu dia ou como está se sentindo. Fale por pelo menos 15 segundos.
            </Text>

            <AudioWave />
            <Text style={styles.recordingTimer}>{formatTime(recordingTime)}</Text>

            <TouchableOpacity style={styles.stopButton} onPress={handleStopRecording}>
              <Feather name="square" size={40} color="white" />
            </TouchableOpacity>
            <Text style={styles.micButtonLabel}>Toque para parar</Text>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={resultModalVisible}
        onRequestClose={handleCloseAllModals}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Resultado da Análise</Text>
              <TouchableOpacity onPress={handleCloseAllModals}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Feather name="alert-triangle" size={40} color="#FACC15" style={{ marginBottom: 15 }} />
            <Text style={styles.resultTitle}>Sinais de tensão detectados</Text>
            <Text style={styles.resultDescription}>
              Percebemos alguns sinais de tensão. Vamos fazer uma pausa rápida?
            </Text>

            <View style={styles.breathingCard}>
              <Text style={styles.breathingTitle}>Respiração 4-7-8 Guiada</Text>
              <Text style={styles.breathingSubtitle}>2 minutos • Técnica comprovada para reduzir ansiedade</Text>
              <TouchableOpacity style={styles.breathingCircle} onPress={() => {
                  setResultModalVisible(false);
                  navigation.navigate('Breathing');
                }}>
                <Text style={styles.breathingCircleText}>Pronto para começar?</Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Iniciar Exercício"
              onPress={() => {
                setResultModalVisible(false);
                navigation.navigate('Breathing');
              }}
              style={styles.startButton}
            >
              <Feather name="play" size={20} color="white" style={{ marginRight: 10 }} />
            </Button>

            <View style={styles.tipContainer}>
              <Feather name="lightbulb" size={20} color="#999" style={{ marginRight: 10 }} />
              <Text style={styles.tipText}>
                Encontre um lugar tranquilo e feche os olhos durante o exercício para melhores resultados.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FBFB' },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '90%', 
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  toggleButtonContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 25,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  toggleButtonActive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  toggleButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  toggleButtonTextActive: {
    fontSize: 16,
    color: '#00A389',
    fontWeight: '600',
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00A389',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  micButtonLabel: {
    fontSize: 15,
    color: '#888',
    marginBottom: 20,
  },
  stopButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EF4444', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  audioWaveContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    marginBottom: 20,
    width: '100%',
  },
  audioBar: {
    width: 6,
    borderRadius: 3,
    backgroundColor: '#00A389',
    marginHorizontal: 2,
  },
  recordingTimer: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  breathingCard: {
    backgroundColor: '#E0F3F0',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    alignItems: 'center',
    width: '100%',
  },
  breathingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  breathingSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  breathingCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#00A389',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8, 
  },
  breathingCircleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#00A389',
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 16,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FBFB',
    borderRadius: 12,
    padding: 15,
    marginTop: 25,
    width: '100%',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default CheckinScreen;