import React, { useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import Con from '../constants';

interface SocialButtonProps {
  title: string;
  onPress: any;
}

const SocialButton = ({ title, onPress }: SocialButtonProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95, // Desired smaller size
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1, // Back to original size
      useNativeDriver: true,
      speed: 120,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.button}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    borderRadius: Con.universalBorderRadius,
    marginHorizontal: 5,
    marginTop: 15,

    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 0.5,
    elevation: 50,
  },
  buttonText: {
    color: 'black',
    fontSize: 15,
    padding: 10,
  },
});

export default SocialButton;
