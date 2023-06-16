import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface SuccessPaymentProps {
    navigation: any;
    route: any;
}

function SuccessPayment({ route }: SuccessPaymentProps) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'black' }}>
                SuccessPayment
            </Text>
        </View>
    );
}

export default SuccessPayment;