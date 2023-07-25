import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Con from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();

interface PressableIconProps {
    onPress: any;
    icon: string;
}

function PressableIcon({ onPress, icon }: PressableIconProps) {
    const iconSize = 22;
    const iconColor = Con.AppleBlueLight;

    return (
        <TouchableOpacity style={{ padding: 15 }} onPress={onPress}>
            <Ionicons name={icon} size={iconSize} color={iconColor} />
        </TouchableOpacity>
    );
}

export default PressableIcon;