import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { 
  View, Text, StyleSheet, Modal, 
  TouchableOpacity, TextInput, SafeAreaView, 
  Platform, KeyboardAvoidingView, ActivityIndicator,
  ScrollView, Animated
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Audio } from 'expo-audio';
import Button from './Button'; 
import { LinearGradient } from 'expo-linear-gradient'; 
import { GEMINI_API_KEY } from '@env';

const MOODS_DATA = {
  'Feliz': { 
    icon: 'smile', text: 'Feliz', color: '#10B981', colorLight: '#E0F3F0',
    context: 'Me sinto bem e positivo' 
  },
  'Tranquilo': { 
    icon: 'coffee', text: 'Tranquilo', color: '#8B5CF6', colorLight: '#F3E8FF',
    context: 'Equilibrado e calmo' 
  },
  'Cansado': { 
    icon: 'meh', text: 'Cansado', color: '#EC4899', colorLight: '#FCE7F3',
    context: 'Com pouca energia' 
  },
  'Ansioso': { 
    icon: 'zap', text: 'Ansioso', color: '#F97316', colorLight: '#FFF7E0',
    context: 'Preocupado ou agitado' 
  },
  'Estressado': { 
    icon: 'frown', text: 'Estressado', color: '#EF4444', colorLight: '#FEEEEE',
    context: 'Sob pressão ou tensão' 
  },
  'Triste': { 
    icon: 'cloud-drizzle', text: 'Triste', color: '#3B82F6', colorLight: '#EFF6FF',
    context: 'Melancólico ou desanimado' 
  },
};
const MOODS_LIST = Object.values(MOODS_DATA);

const STRESS_TIPS = [
  { id: '1', text: 'Respire Conscientemente', sub: 'Faça 3 respirações profundas e lentas', icon: 'wind', color: '#E0F9FF' },
  { id: '2', text: 'Faça uma Pausa', sub: 'Levante e caminhe por 5 minutos', icon: 'coffee', color: '#FFF7E0' },
  { id: '3', text: 'Ouça Música Relaxante', sub: 'Sons da natureza ou música suave', icon: 'music', color: '#F3E8FF' },
  { id: '4', text: 'Conecte-se com a Natureza', sub: 'Olhe pela janela ou saia ao ar livre', icon: 'sun', color: '#FEF9C3' },
  { id: '5', text: 'Pratique Gratidão', sub: 'Pense em 3 coisas pelas quais é grato', icon: 'heart', color: '#FEEEEE' },
];

function formatDuration(millis) {
  const seconds = Math.floor((millis / 1000) % 60);
  return `0:${seconds < 10 ? '0' : ''}${seconds}`;
}

const RenderTextView = memo(({
  selectedMood, onMoodSelect, text, onTextChange, loading, onSave
}) => {
  const currentMoodData = selectedMood ? MOODS_DATA[selectedMood] : null;

  return (
    <>
      <Text style={styles.sectionTitle}>Como você está se sentindo?</Text>
      
      <View style={styles.moodGrid}>
        {MOODS_LIST.map((mood) => {
          const isSelected = selectedMood === mood.text;
          return (
            <TouchableOpacity 
              key={mood.text} 
              style={[
                styles.moodButton, 
                isSelected && { borderColor: mood.color, backgroundColor: mood.colorLight }
              ]}
              onPress={() => onMoodSelect(mood.text)}
            >
              <Feather name={mood.icon} size={28} color={isSelected ? mood.color : '#555'} />
              <Text style={[styles.moodText, isSelected && { color: mood.color }]}>
                {mood.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {currentMoodData && (
        <View style={[
          styles.contextBox, 
          { borderColor: currentMoodData.color, backgroundColor: currentMoodData.colorLight }
        ]}>
          <Text style={[styles.contextText, { color: currentMoodData.color }]}>
            {currentMoodData.context}
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Quer adicionar mais contexto? (opcional)</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Ex: Tenho muitos prazos hoje, mas estou me organizando bem..."
        placeholderTextColor="#999"
        multiline
        value={text}
        onChangeText={onTextChange}
        maxLength={280}
      />
      <Text style={styles.charCount}>{text.length} caracteres</Text>

      <TouchableOpacity
        onPress={onSave}
        disabled={loading}
        style={{width: '100%'}}
      >
        <LinearGradient
          colors={['#00A389', '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.analysisButton, loading && styles.analysisButtonDisabled]}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.analysisButtonText}>Analisar Sentimento</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </>
  );
});

const RenderVoiceView = memo(({
  isRecording, duration, onStartRecord, onStopRecord
}) => (
  <View style={styles.voiceContainer}>
    {!isRecording ? (
      <>
        <Text style={styles.subtitle}>Descreva seu dia ou como está se sentindo. Fale por pelo menos 5 segundos.</Text>
        <View style={styles.micCircle}>
          <Feather name="mic" size={40} color="#00A389" />
        </View>
        <Text style={styles.statusText}>Pronto para ouvir você</Text>
        <TouchableOpacity style={styles.recordButton} onPress={onStartRecord}>
          <Feather name="mic" size={40} color="white" />
        </TouchableOpacity>
        <Text style={styles.statusSubtext}>Toque para começar a gravar</Text>
      </>
    ) : (
      <>
        <Text style={styles.subtitle}>Gravando sua análise de voz...</Text>
        <Ionicons name="pulse-outline" size={100} color="#00A389" style={{ marginVertical: 24 }}/> 
        <View style={styles.timerChip}>
          <View style={styles.timerDot} />
          <Text style={styles.timerText}>{formatDuration(duration)}</Text>
        </View>
        <TouchableOpacity style={styles.stopButton} onPress={() => onStopRecord(true)}>
          <Ionicons name="stop" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.statusSubtext}>Toque para parar a gravação</Text>
      </>
    )}
  </View>
));

const RenderAnalysisResultView = memo(({ onClose, onStartExercise, analysisResult }) => {
  
  if (analysisResult.type === 'balanced' || analysisResult.type === 'positive') {
    return (
      <View style={styles.resultViewContainer}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close-circle" size={32} color="#BBB" />
        </TouchableOpacity>
        <Text style={styles.title}>Resultado da Análise</Text>
        <View style={[styles.iconCircle, { backgroundColor: '#E0F3F0'}]}>
          <Feather name="smile" size={40} color="#00A389" />
        </View>
        <Text style={styles.statusText}>{analysisResult.title}</Text>
        <Text style={styles.subtitle}>{analysisResult.text}</Text>
        
        <View style={[styles.card, {backgroundColor: '#E6FFFA'}]}>
          <Text style={styles.cardTitle}>Continue assim! Tenha um dia produtivo.</Text>
          <View style={styles.tipList}>
            <Text style={styles.tipItem}>✨ Mantenha essa energia positiva</Text>
            <Text style={styles.tipItem}>☕ Que tal uma pausa de 5 minutos?</Text>
            <Text style={styles.tipItem}>💪 Você está indo bem!</Text>
          </View>
        </View>

        <Button
          title="Concluir"
          onPress={onClose}
          style={{ width: '100%', marginTop: 20, backgroundColor: '#00A389' }}
        />
      </View>
    );
  }

  return (
    <View style={styles.resultViewContainer}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close" size={24} color="#555" />
      </TouchableOpacity>
      <Text style={styles.title}>Resultado da Análise</Text>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.iconCircle, { backgroundColor: '#FFF7E0'}]}>
          <Feather name="alert-triangle" size={40} color="#F97316" />
        </View>
        <Text style={styles.statusText}>{analysisResult.title}</Text>
        <Text style={styles.subtitle}>
          {analysisResult.text}
        </Text>

        <Text style={styles.sectionTitle}>Dicas para se acalmar</Text>
        
        {STRESS_TIPS.map((item) => (
          <View key={item.id} style={[styles.suggestionCard, { backgroundColor: item.color }]}>
            <Feather name={item.icon} size={24} color="#333" />
            <View style={styles.suggestionTextContainer}>
              <Text style={styles.suggestionTitle}>{item.text}</Text>
              <Text style={styles.suggestionSub}>{item.sub}</Text>
            </View>
          </View>
        ))}

        <View style={[styles.card, {backgroundColor: '#E6FFFA'}]}>
          <Feather name="wind" size={24} color="#00A389" />
          <Text style={[styles.cardTitle, {marginTop: 10}]}>Recomendação Especial</Text>
          <Text style={styles.cardSubtitle}>
            Um exercício de respiração de 2 minutos pode reduzir significativamente sua ansiedade e tristeza.
          </Text>
          <TouchableOpacity
            onPress={onStartExercise}
            style={{width: '100%'}}
          >
            <LinearGradient
              colors={['#00A389', '#3B82F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.analysisButton}
            >
              <Ionicons name="play-outline" size={20} color="white" style={{ marginRight: 10 }} />
              <Text style={styles.analysisButtonText}>Começar Exercício</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Button
        title="Fechar"
        onPress={onClose}
        variant="secondary"
        style={{ width: '100%', marginTop: 20 }}
      />
    </View>
  );
});

const RenderSelectorView = memo(({
  mode, onModeChange, onClose, ...props 
}) => (
  <View style={styles.resultViewContainer}>
    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
      <Ionicons name="close-circle" size={32} color="#BBB" />
    </TouchableOpacity>
    <Text style={styles.title}>Check-in Diário</Text>
    <View style={styles.toggleContainer}>
      <TouchableOpacity 
        style={[styles.toggleButton, mode === 'voz' && styles.toggleActive]}
        onPress={() => onModeChange('voz')}
      >
        <Feather name="mic" size={16} color={mode === 'voz' ? '#00A389' : '#666'} />
        <Text style={[styles.toggleText, mode === 'voz' && styles.toggleTextActive]}>Voz</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.toggleButton, mode === 'texto' && styles.toggleActive]}
        onPress={() => onModeChange('texto')}
      >
        <Feather name="edit-3" size={16} color={mode === 'texto' ? '#00A389' : '#666'} />
        <Text style={[styles.toggleText, mode === 'texto' && styles.toggleTextActive]}>Texto</Text>
      </TouchableOpacity>
    </View>
    {props.loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00A389" />
        <Text style={styles.loadingText}>Analisando seu sentimento...</Text>
      </View>
    ) : (
      mode === 'texto' ? <RenderTextView {...props} /> : <RenderVoiceView {...props} />
    )}
  </View>
));

const RenderBreathingView = memo(({ onBack, onClose }) => {
  const [status, setStatus] = useState('Pronto para começar?');
  const [isExercising, setIsExercising] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.75)).current; // Inicia em 0.75 (144px / 192px)
  const timeouts = useRef([]);

  const stopAllAnimations = () => {
    scaleAnim.stopAnimation();
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  };

  const runCycle = () => {
    stopAllAnimations();
    const inspireTime = 4000;
    const holdTime = 7000;
    const expireTime = 8000;

    setStatus('Inspire');
    Animated.timing(scaleAnim, {
      toValue: 1, // Anima para 1 (192px)
      duration: inspireTime,
      useNativeDriver: true,
    }).start();

    timeouts.current.push(setTimeout(() => {
      setStatus('Segure');
    }, inspireTime));

    timeouts.current.push(setTimeout(() => {
      setStatus('Expire');
      Animated.timing(scaleAnim, {
        toValue: 0.75, // Anima de volta para 0.75 (144px)
        duration: expireTime,
        useNativeDriver: true,
      }).start();
    }, inspireTime + holdTime));

    timeouts.current.push(setTimeout(runCycle, inspireTime + holdTime + expireTime));
  };

  const startExercise = () => {
    setIsExercising(true);
    runCycle();
  };

  const stopExercise = () => {
    stopAllAnimations();
    Animated.timing(scaleAnim, { toValue: 0.75, duration: 500, useNativeDriver: true }).start();
    setStatus('Pronto para começar?');
    setIsExercising(false);
  };

  useEffect(() => {
    return () => stopAllAnimations();
  }, []);

  return (
    <View style={styles.resultViewContainer}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#555" />
        <Text style={styles.backButtonText}>Voltar para dicas</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close" size={24} color="#555" />
      </TouchableOpacity>

      <Text style={[styles.title, {marginTop: 30}]}>Respiração 4-7-8 Guiada</Text>
      <Text style={styles.cardSubtitle}>
        2 minutos • Técnica comprovada para reduzir ansiedade
      </Text>
      
      <View style={styles.breathingContainer}>
        <View style={styles.outerCircle}>
          <Animated.View style={[
            styles.innerCircle, 
            { transform: [{ scale: scaleAnim }] }
          ]}>
            <Text style={styles.promoText}>{status}</Text>
          </Animated.View>
        </View>
      </View>

      {!isExercising ? (
        <TouchableOpacity
          onPress={startExercise}
          style={{width: '100%'}}
        >
          <LinearGradient
            colors={['#00A389', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.analysisButton}
          >
            <Ionicons name="play-outline" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={styles.analysisButtonText}>Iniciar Exercício</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <Button
          title="Parar e Concluir"
          onPress={stopExercise}
          variant="secondary"
          style={{ width: '100%', marginTop: 20 }}
        />
      )}

      <View style={styles.tipBox}>
        <Feather name="bulb" size={20} color="#666" />
        <Text style={styles.tipText}>
          <Text style={{fontWeight: 'bold'}}>Dica:</Text> Encontre um lugar tranquilo e feche os olhos durante o exercício para melhores resultados.
        </Text>
      </View>
    </View>
  );
});

// --- COMPONENTE PRINCIPAL ---

const CheckinModal = ({ visible, onClose, navigation }) => {
  const [view, setView] = useState('selector');
  const [mode, setMode] = useState('voz');
  
  const [selectedMood, setSelectedMood] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const [analysisResult, setAnalysisResult] = useState({});
  
  const timerIntervalRef = useRef(null);

  const analyzeTextWithGemini = async (userInput) => {
    setLoading(true);
    setView('selector'); 
    
    const apiKey = GEMINI_API_KEY; 
    
    if (!apiKey) {
      console.error("Chave da API do Gemini não encontrada! Verifique seu arquivo .env");
      setLoading(false);
      setAnalysisResult({
        type: 'stress',
        title: "Erro de Configuração",
        text: "A chave da API não foi configurada no app.",
      });
      setView('analysis_result');
      return;
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const systemPrompt = `
      Você é um analista de bem-estar. Seu trabalho é ler o texto de check-in de um usuário
      e retornar uma análise de sentimento em 3 níveis: 'Positivo', 'Neutro' ou 'Estressado'.
      Responda APENAS com uma dessas três palavras.
    `;

    const payload = {
      contents: [{ parts: [{ text: userInput }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Erro da API: ${response.status}`);
      }

      const result = await response.json();
      const sentiment = result.candidates[0].content.parts[0].text.trim();

      if (sentiment.includes('Estressado')) {
        setAnalysisResult({
          type: 'stress',
          title: "Sinais de tensão detectados",
          text: "Percebemos alguns sinais de tensão ou tristeza. Vamos cuidar de você.",
        });
      } else if (sentiment.includes('Positivo')) {
        setAnalysisResult({
          type: 'positive',
          title: "Que ótimo!",
          text: "Ficamos felizes em ver que você está se sentindo bem. Continue assim!",
        });
      } else {
        setAnalysisResult({
          type: 'balanced',
          title: "Você está em equilíbrio!",
          text: "Obrigado pelo check-in. Parece que você está em equilíbrio hoje.",
        });
      }
      
    } catch (error) {
      console.error("Erro ao analisar com Gemini:", error);
      setAnalysisResult({
        type: 'stress',
        title: "Erro na Análise",
        text: "Não foi possível analisar o sentimento. Verifique sua conexão.",
      });
    } finally {
      setLoading(false);
      setView('analysis_result'); 
    }
  };

  const handleClose = useCallback(() => {
    if (isRecording) {
      stopRecording(false);
    }
    setLoading(false);
    setSelectedMood(null);
    setText('');
    setRecordingDuration(0);
    setMode('voz');
    setView('selector');
    onClose();
  }, [isRecording, onClose]);

  const startRecording = useCallback(async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        alert('Você precisa permitir o acesso ao microfone para gravar.');
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); 
      
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptions.PRESET_HIGH_QUALITY);
      setRecording(newRecording);
      
      await newRecording.startAsync();
      setIsRecording(true);
      
      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1000);
      }, 1000);
    } catch (err) {
      console.error('Falha ao iniciar gravação', err);
    }
  }, []);

  const stopRecording = useCallback(async (shouldSubmit = true) => {
    if (!recording) return;
    setIsRecording(false);
    clearInterval(timerIntervalRef.current);
    setRecordingDuration(0);
    
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI(); 
    setRecording(null);
    
    if (shouldSubmit) {
      console.log('Gravação (simulada) salva em:', uri);
      setLoading(true);
      setView('selector');
      setTimeout(() => {
        setAnalysisResult({
          type: 'stress',
          title: "Sinais de tensão detectados",
          text: "Percebemos alguns sinais de tensão ou tristeza. Vamos cuidar de você.",
        });
        setLoading(false);
        setView('analysis_result');
      }, 2000); 
    }
  }, [recording]);

  const handleMoodSelect = useCallback((moodText) => {
    setSelectedMood(moodText);
    setText(`Hoje me sinto ${moodText.toLowerCase()}.`);
  }, []); 

  const handleSaveTextCheckin = useCallback(async () => {
    const inputText = text || selectedMood || '';
    if (inputText === '') return;
    
    await analyzeTextWithGemini(inputText);
    
  }, [selectedMood, text]);

  const handleStartExercise = useCallback(() => {
    setView('breathing');
  }, []);

  const handleBackToAnalysis = useCallback(() => {
    setView('analysis_result');
  }, []);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <BlurView 
        intensity={20} 
        tint={Platform.OS === 'ios' ? 'dark' : 'light'} 
        style={styles.blurView}
      >
        <KeyboardAvoidingView 
          style={styles.kavContainer} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={[
              styles.modalContent,
              (view === 'analysis_result' && analysisResult.type === 'stress') && styles.modalContentScrollable,
              (view === 'breathing') && styles.modalContentScrollable
            ]}>
              {view === 'selector' ? (
                <RenderSelectorView 
                  mode={mode}
                  onModeChange={setMode}
                  onClose={handleClose}
                  selectedMood={selectedMood}
                  onMoodSelect={handleMoodSelect} 
                  text={text}
                  onTextChange={setText} 
                  loading={loading}
                  onSave={handleSaveTextCheckin}
                  isRecording={isRecording}
                  duration={recordingDuration}
                  onStartRecord={startRecording}
                  onStopRecord={stopRecording}
                />
              ) : view === 'analysis_result' ? (
                <RenderAnalysisResultView 
                  onClose={handleClose}
                  onStartExercise={handleStartExercise}
                  analysisResult={analysisResult}
                />
              ) : (
                <RenderBreathingView
                  onClose={handleClose}
                  onBack={handleBackToAnalysis}
                />
              )}
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blurView: {
    flex: 1,
    padding: 16, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  kavContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  modalContentScrollable: {
    maxHeight: '90%', 
  },
  resultViewContainer: {
    width: '100%',
    alignItems: 'center',
    flexShrink: 1,
  },
  scrollContainer: {
    width: '100%',
    flexShrink: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: -5, 
    right: -5, 
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 22,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
    width: '90%',
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  toggleActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 8,
  },
  toggleTextActive: {
    color: '#00A389',
  },
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  moodButton: {
    width: '31%',
    alignItems: 'center',
    backgroundColor: '#F8FBFB',
    paddingVertical: 15,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: '#F0F0F0',
    marginBottom: 10,
  },
  moodButtonSelected: {
    // Cor aplicada dinamicamente
  },
  moodText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#555',
    marginTop: 8,
  },
  contextBox: {
    width: '100%',
    padding: 12,
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 15,
  },
  contextText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  textInput: {
    width: '100%',
    height: 100,
    backgroundColor: '#F8FBFB',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#F0F0F0',
    padding: 15,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    width: '100%',
    textAlign: 'left',
    marginTop: 5,
  },
  analysisButton: {
    width: '100%',
    marginTop: 15,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  analysisButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  analysisButtonDisabled: {
    opacity: 0.6,
  },

  voiceContainer: {
    alignItems: 'center',
    width: '100%',
  },
  micCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0F3F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 25,
  },
  statusSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  transcribedText: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
    marginVertical: 10,
    paddingHorizontal: 10,
    textAlign: 'center',
    minHeight: 20,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00A389', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00A389',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  stopButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EF4444', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  timerChip: {
    flexDirection: 'row',
    backgroundColor: '#FEEEEE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  timerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 8,
  },
  timerText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF7E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  card: {
    width: '100%',
    backgroundColor: '#F8FBFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0F3F0',
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  promoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#00A389',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00A389',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  promoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    padding: 10,
  },
  tipBox: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    lineHeight: 20,
  },
  tipList: {
    alignSelf: 'flex-start',
    marginTop: 15,
  },
  tipItem: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 8,
  },
  suggestionCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    alignItems: 'center',
    width: '100%',
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

  backButton: {
    position: 'absolute',
    top: -5,
    left: -5,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 4,
    fontWeight: '500',
  },
  breathingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
    width: 250,
    marginVertical: 20,
  },
  outerCircle: {
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: 'rgba(0, 163, 137, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: '#00A389',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00A389',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default CheckinModal;