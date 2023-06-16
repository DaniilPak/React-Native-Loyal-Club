import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Con from '../constants';

interface BlueButtonProps {
    title: string;
    onPress: any;
    icon?: any;
}

function BlueButton({ title, onPress, icon = null }: BlueButtonProps) {

    if (!icon) {
        return (
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
        );
    } else {
        return (
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.buttonText}>{title}</Text>
                {icon}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        backgroundColor: Con.AppleBlueLight,
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
        marginRight: 10,
    },
});

export default BlueButton;