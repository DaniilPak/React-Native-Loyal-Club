import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRScreenProps {
    navigation: any;
}

function QRScreen({ navigation }: QRScreenProps) {

    const qrValue = '61236asdasdasjdjasd82382183';

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <QRCode
                value={qrValue}
                size={200}
                color='black'
                backgroundColor='white'
            />
        </View>
    );
}

export default QRScreen;
