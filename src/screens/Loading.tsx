import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import Con from '../constants';
import BlueButton from '../components/BlueButton';

interface LoadingProps {
    navigation: any;
    route: any;
}

function Loading({ route, navigation }: LoadingProps) {

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={Con.AppleBlueLight} />
        </View>
    );
}

export default Loading;