import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Animated, TouchableWithoutFeedback } from 'react-native';
import Con from '../constants';

interface BlueButtonProps {
    title: string;
    onPress: any;
    icon?: any;
    isDisabled?: boolean;
    isLoading?: boolean;
}

function BlueButton({ title, onPress, icon = null, isDisabled = false, isLoading = false }: BlueButtonProps) {
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

    if (!icon) {
        return (
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity activeOpacity={1} onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.button} onPress={onPress} disabled={isDisabled}>
                    <Text style={styles.buttonText}>{title}</Text>
                    {isLoading &&
                        <ActivityIndicator />
                    }
                </TouchableOpacity>
            </Animated.View>
        );
    } else {
        return (
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity activeOpacity={1} onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.button} onPress={onPress}>
                    <Text style={styles.buttonText}>{title}</Text>
                    {icon}
                    {isLoading &&
                        <ActivityIndicator />
                    }
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        backgroundColor: Con.AppleBlueLight,
        paddingVertical: 14,
        borderRadius: 17,
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
        marginRight: 10,
    },
});

export default BlueButton;