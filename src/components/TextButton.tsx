import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import Con from '../constants';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface TextButtonProps {
    text: string;
    onPress: any;
}

function TextButton({ text, onPress }: TextButtonProps) {

    return (
        <TouchableOpacity onPress={onPress} style={styles.tipContainer}>
            <Text style={styles.textBlock}>
                {text}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    tipContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
    },
    textBlock: {
        color: Con.AppleBlueLight,
        fontSize: 18,
        alignItems: 'flex-start',
    }
});

export default TextButton;