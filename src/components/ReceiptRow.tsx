import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import Con from '../constants';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface ReceiptRowProps {
    text: string;
    secondaryText: string;
    value: string;
    valueSecondary: string;
    valueThird: string;
    onPress: any;
}

function ReceiptRow({ text, secondaryText, value, valueSecondary, valueThird, onPress }: ReceiptRowProps) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.buttonContainer}>
                <View style={styles.textBlockContainer}>
                    <Text style={styles.textBlock}>
                        {text}
                    </Text>
                    <View style={styles.iconStyle}>
                        <Text style={styles.mainPayment}>
                            {value}
                        </Text>
                    </View>
                </View>

                <View style={styles.textBlockContainer}>
                    <Text style={styles.textBlockSecondary}>
                        {secondaryText}
                    </Text>
                    <View style={styles.iconStyle}>
                        <Text style={styles.bonusGiven}>
                            {valueSecondary}
                        </Text>
                        <Text style={styles.bonusMinus}>
                            {valueThird}
                        </Text>
                    </View>

                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    mainPayment: {
        color: 'black',
        fontSize: 18,
    },
    bonusGiven: {
        color: Con.AppleGreenLight,
        fontSize: 13
    },
    bonusMinus: {
        color: Con.AppleRedLight,
        fontSize: 13,
    },
    iconStyle: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    buttonContainer: {
        width: '100%',
        height: 80,
        backgroundColor: 'white',
        padding: 17,
    },
    textBlockContainer: {
        flexDirection: 'row',
    },
    textBlock: {
        color: 'black',
        fontSize: 16,
        alignItems: 'flex-start'
    },
    textBlockSecondary: {
        color: Con.AppleGrayLight,
        fontSize: 14,
    }
});

export default ReceiptRow;