import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import Con from '../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface NavigationRowProps {
    text: string;
    onPress: any;
}

function NavigationRow({ text, onPress }: NavigationRowProps) {
    const rowIconSize = 20;

    const rowIcon = <MaterialIcons name="arrow-forward-ios" size={rowIconSize} color={Con.AppleGrayLight} />

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.textBlockContainer}>
                <Text style={styles.textBlock}>
                    {text}
                </Text>
                <View style={styles.iconStyle}>
                    {rowIcon}
                </View>
            </View>
        </TouchableOpacity>
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
        padding: 17,
        flexDirection: 'row',
    },
    textBlock: {
        color: 'black',
        fontSize: 16,
        alignItems: 'flex-start'
    }
});

export default NavigationRow;