import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <SafeAreaView
      edges={['bottom']}
      style={styles.safeArea}
    >
      <View style={styles.wrapper}>
        <LinearGradient
          style={styles.backgroundGradient}
          locations={[0, 0.5, 1]}
          colors={[
            'rgba(255, 255, 255, 0.9)',
            'rgba(255, 255, 255, 0.8)',
            'rgba(255, 255, 255, 0.7)',
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />

        <View style={styles.borderLayer} />
        <View style={styles.innerLayer} />

        <View style={styles.buttonsRow}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const { options } = descriptors[route.key];

            const iconName = options.tabBarIcon;

            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={[styles.tabButton, isFocused && styles.tabButtonFocused]}
                activeOpacity={0.9}
              >
                {isFocused ? (
                  <LinearGradient
                    style={styles.activeBackground}
                    locations={[0, 1]}
                    colors={[
                      'rgba(20, 184, 166, 0.12)',
                      'rgba(59, 130, 246, 0.12)',
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {iconName && (
                      <Ionicons
                        name={iconName}
                        size={26}
                        color="#009689"
                        style={styles.activeIcon}
                      />
                    )}
                    <Text style={styles.activeLabel}>{label}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.inactiveContent}>
                    {iconName && (
                      <Ionicons
                        name={iconName}
                        size={24}
                        color="#62748E"
                        style={styles.inactiveIcon}
                      />
                    )}
                    <Text style={styles.inactiveLabel}>{label}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <LinearGradient
          style={styles.topLine}
          locations={[0, 0.5, 1]}
          colors={[
            'rgba(0, 0, 0, 0)',
            'rgba(255, 255, 255, 0.6)',
            'rgba(0, 0, 0, 0)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
safeArea: {
  backgroundColor: 'transparent',
  position: 'absolute',
  bottom: 0,
  width: '100%',
},
wrapper: {
  alignSelf: 'center',
  width: 361,
  height: 78,
  marginBottom: Platform.OS === 'ios' ? 16 : 20,
  backgroundColor: 'transparent',
  overflow: 'visible',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.25,
  shadowRadius: 50,
  elevation: 30,
  borderRadius: 32,  
},
  backgroundGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  borderLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 32,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  innerLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  buttonsRow: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    height: 62,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 13,
  },
  tabButton: {
    height: 62,
    borderRadius: 20,
    width: 72,
  },
  tabButtonFocused: {
  },
  activeBackground: {
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  activeIcon: {
    marginBottom: 6,
  },
  activeLabel: {
    fontSize: 11,
    lineHeight: 17,
    letterSpacing: -0.05,
    fontWeight: '500',
    color: '#009689',
  },
  inactiveContent: {
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  inactiveIcon: {
    marginBottom: 6,
  },
  inactiveLabel: {
    fontSize: 11,
    lineHeight: 17,
    letterSpacing: -0.05,
    color: '#62748E',
  },
  topLine: {
    position: 'absolute',
    top: 0,
    height: 1,
    width: '100%',
  },
});