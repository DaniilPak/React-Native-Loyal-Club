import React, { useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import Con from '../constants';

interface HalfScreenButtonProps {
  title: string;
  onPress: any;
}

const HalfScreenButton = ({ title, onPress }: HalfScreenButtonProps) => {
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
    width: Con.width * 0.425,
    marginHorizontal: 10,
    height: 135,
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
    fontSize: 18,
    padding: 20,
  },
});

export default HalfScreenButton;
