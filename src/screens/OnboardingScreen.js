import React, { useRef, useState } from 'react';
import { View, FlatList, StyleSheet, Dimensions, Animated, TouchableOpacity, Text } from 'react-native';
import OnboardingItem from '../components/OnboardingItem';
import Button from '../components/Button';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: '🎤',
    title: 'Fale como se sente',
    description: 'Compartilhe seus sentimentos de forma rápida e privada usando sua voz ou texto.',
  },
  {
    id: '2',
    icon: '🧠',
    title: 'Nossa IA analisa sua voz',
    description: 'Identificamos sinais de estresse e tensão para entender seu estado emocional.',
  },
  {
    id: '3',
    icon: '☕',
    title: 'Receba uma micro-pausa',
    description: 'Ações imediatas e práticas para aliviar o estresse no seu dia de trabalho.',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Auth');
    }
  };

  const skipOnboarding = () => {
    navigation.replace('Auth');
  };

  const goBack = () => {
    if (currentIndex > 0) {
      slidesRef.current.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 3 }}>
        <FlatList
          data={slides}
          renderItem={({ item }) => <OnboardingItem item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      <View style={styles.paginationContainer}>
        {slides.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              style={[styles.dot, { width: dotWidth, opacity }]}
              key={i.toString()}
            />
          );
        })}
      </View>

      <View style={styles.buttonContainer}>
        {currentIndex > 0 && (
          <Button
            title="Anterior"
            onPress={goBack}
            variant="secondary"
            style={styles.navButton}
            textStyle={styles.navButtonText}
          />
        )}
        <Button
          title={currentIndex === slides.length - 1 ? 'Começar' : 'Próximo'}
          onPress={scrollTo}
          style={[styles.navButton, currentIndex === 0 && styles.fullWidthButton]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FBFB',
  },
  paginationContainer: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00A389',
    marginHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 40,
    marginTop: 20,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  fullWidthButton: {
    flex: 1,
    marginHorizontal: 0,
  },
});

export default OnboardingScreen;