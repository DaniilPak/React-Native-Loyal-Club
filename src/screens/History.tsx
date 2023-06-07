import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface SettingsProps {
    navigation: any;
    route: any;
}

function History({ route }: SettingsProps) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'black' }}>
                History
            </Text>
        </View>
    );
}

export default History;