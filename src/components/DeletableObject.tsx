import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import Con from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import { TouchableOpacity } from 'react-native-gesture-handler';

interface DeletableObjectProps {
    text: string;
    onDelete: any;
}

function DeletableObject({ text, onDelete }: DeletableObjectProps) {
    const rowIconSize = 20;

    const rowIcon = <Ionicons name="person-remove-outline" size={rowIconSize} color={Con.AppleRedLight} />

    return (
        <TouchableOpacity onPress={onDelete}>
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

export default DeletableObject;