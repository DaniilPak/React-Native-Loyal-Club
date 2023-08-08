import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, Animated } from 'react-native';
import Con from '../constants';

interface GrayButtonProps {
    title: string;
    onPress: any;
}

function GrayButton({ title, onPress }: GrayButtonProps) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95, // Desired smaller size
            useNativeDriver: true,
            speed: 120,
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
            <TouchableOpacity activeOpacity={1} onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.button} onPress={onPress}>
                <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Con.AppleGrayLight,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        alignSelf: 'center',
        marginTop: 25,
    },
    buttonText: {
        color: 'white',
        fontSize: 19,
        fontWeight: '600',
    },
});

export default GrayButton;