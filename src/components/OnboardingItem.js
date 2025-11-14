import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const OnboardingItem = ({ item }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>NeuroBalance</Text>
      <Text style={styles.subTitle}>Monitore seu estresse em 60 segundos por dia</Text>
      <View style={styles.iconContainer}>
        <Text style={styles.iconPlaceholder}>{item.icon}</Text>
      </View>
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    backgroundColor: '#F8FBFB',
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00A389',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E0F3F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  iconPlaceholder: {
    fontSize: 60,
    color: '#00A389',
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 15,
  },
});

export default OnboardingItem;