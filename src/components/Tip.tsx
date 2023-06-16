import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import Con from '../constants';

interface TipProps {
    text: string;
}

function Tip({ text }: TipProps) {

    return (
        <View style={styles.tipContainer}>
            <Text style={styles.textBlock}>
                {text}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    tipContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
    },
    textBlock: {
        color: 'black',
        fontSize: 14,
        alignItems: 'flex-start'
    }
});

export default Tip;