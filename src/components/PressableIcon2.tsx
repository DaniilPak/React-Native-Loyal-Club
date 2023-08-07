import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Con from '../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
MaterialCommunityIcons.loadFont();

interface PressableIcon2Props {
    onPress: any;
    icon: string;
}

function PressableIcon2({ onPress, icon }: PressableIcon2Props) {
    const iconSize = 22;
    const iconColor = Con.AppleBlueLight;

    return (
        <TouchableOpacity style={{ paddingRight: 15 }} onPress={onPress}>
            <MaterialCommunityIcons name={icon} size={iconSize} color={iconColor} />
        </TouchableOpacity>
    );
}

export default PressableIcon2;