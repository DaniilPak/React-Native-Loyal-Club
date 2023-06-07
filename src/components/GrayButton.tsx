import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Con from '../constants';

interface GrayButtonProps {
    title: string;
    onPress: any;
}

function GrayButton({ title, onPress }: GrayButtonProps) {

    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Con.AppleGrayLight,
        paddingVertical: 13,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        alignSelf: 'center',
        marginTop: 25,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default GrayButton;