import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { RNCamera, BarCodeReadEvent } from 'react-native-camera';

interface HomeScannerProps {
    navigation: any;
}

function HomeScanner({ navigation }: HomeScannerProps) {
    const cameraRef = useRef<RNCamera | null>(null);

    const handleBarCodeRead = (event: BarCodeReadEvent) => {
        console.log(event.data);

        navigation.navigate("QRDetail", { qrData: event.data });
    };

    return (
        <View style={styles.container}>
            <RNCamera
                ref={cameraRef}
                style={styles.preview}
                type={RNCamera.Constants.Type.back}
                onBarCodeRead={handleBarCodeRead}
                captureAudio={false}
                androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
            />
            <View style={styles.rectangle} />
            <View style={styles.overlay} />
            <View style={styles.square} />
        </View>
    );
}

const radius = 10;

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    square: {
        position: 'absolute',
        height: 250,
        width: 250,
        alignSelf: 'center',
        zIndex: 1,
        borderRadius: radius,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    rectangle: {
        position: 'absolute',
        height: 250,
        width: 250,
        borderWidth: 3,
        borderRadius: radius,
        borderColor: '#00FF00',
        alignSelf: 'center',
        zIndex: 1
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        color: 'white',
    },
});

export default HomeScanner;