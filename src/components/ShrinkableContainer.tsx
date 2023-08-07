import React, { useRef, useState } from 'react';
import { TouchableOpacity, Animated } from 'react-native';

const ShrinkableContainer = (props: any) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
        toValue: 0.9, // Desired smaller size
        useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
        toValue: 1, // Back to original size
        useNativeDriver: true,
        }).start();
    };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity activeOpacity={1} onPressIn={handlePressIn} onPressOut={handlePressOut} {...props}>
        {props.children}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ShrinkableContainer;
