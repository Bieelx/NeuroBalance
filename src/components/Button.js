import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ title, onPress, variant = 'primary', style, textStyle, disabled = false }) => {
  const buttonStyles = [
    styles.baseButton,
    variant === 'primary' && styles.primaryButton,
    variant === 'secondary' && styles.secondaryButton,
    disabled && styles.disabledButton,
    style,
  ];

  const buttonTextStyles = [
    styles.baseText,
    variant === 'primary' && styles.primaryText,
    variant === 'secondary' && styles.secondaryText,
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity style={buttonStyles} onPress={onPress} disabled={disabled}>
      <Text style={buttonTextStyles}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12, 
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  primaryButton: {
    backgroundColor: '#00A389', 
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#00A389',
  },
  disabledButton: {
    backgroundColor: '#C5E8E0',
    borderColor: '#C5E8E0',
  },
  baseText: {
    fontSize: 18,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#00A389',
  },
  disabledText: {
    color: '#84B8AE',
  },
});

export default Button;