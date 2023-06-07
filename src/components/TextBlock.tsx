import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import Con from '../constants';

interface TextBlockProps {
    text: string;
    icon: any;
}

function TextBlock({ text, icon }: TextBlockProps) {

    return (
        <View style={styles.textBlockContainer}>
            <Text style={styles.textBlock}>
                {text}
            </Text>
            <View style={styles.iconStyle}>
                {icon}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    iconStyle: {
        flex: 1,
        alignItems: 'flex-end'
    },
    textBlockContainer: {
        width: '100%',
        height: 60,
        backgroundColor: 'white',
        marginTop: 25,
        padding: 17,
        flexDirection: 'row',
    },
    textBlock: {
        color: 'black',
        fontSize: 16,
        alignItems: 'flex-start'
    }
});

export default TextBlock;