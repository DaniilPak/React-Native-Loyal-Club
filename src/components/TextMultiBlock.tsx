import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import Con from '../constants';

interface TextMultiBlockProps {
    text1: string;
    text2: string;
    text4: string;

    switcher: any;
    value2: string;
    value4: string;
}

function TextMultiBlock({ text1, text2, text4, switcher, value2, value4 }: TextMultiBlockProps) {

    return (
        <View style={styles.mainContainer}>
            <View style={styles.textBlockContainer}>
                <Text style={styles.textBlockOption}>
                    {text1}
                </Text>
                <Text style={styles.textBlockValue}>
                    {switcher}
                </Text>
            </View>
            <View style={styles.textBlockContainer}>
                <Text style={styles.textBlockOption}>
                    {text2}
                </Text>
                <Text style={styles.textBlockValue}>
                    {value2}
                </Text>
            </View>
            <View style={styles.textBlockContainer}>
                <Text style={styles.textBlockOption}>
                    {text4}
                </Text>
                <Text style={styles.textBlockValue}>
                    {value4}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        marginTop: 50,
    },
    textBlockContainer: {
        width: '100%',
        height: 60,
        backgroundColor: 'white',
        padding: 17,
        flexDirection: 'row',
    },
    textBlockOption: {
        flex: 4,
        color: 'black',
        fontSize: 16,
        alignItems: 'flex-start'
    },
    textBlockValue: {
        flex: 1,
        alignItems: 'flex-end',
        color: 'black',
        fontSize: 16,
    },
});

export default TextMultiBlock;