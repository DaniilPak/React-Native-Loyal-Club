import React from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';

export async function pushAlert(info: string, subInfo: string, onPress: any) {
    Alert.alert(
        info,
        subInfo,
        [
            {
                text: 'OK',
                onPress: () => onPress(),
            },
        ],
        { cancelable: true }
    );
}

