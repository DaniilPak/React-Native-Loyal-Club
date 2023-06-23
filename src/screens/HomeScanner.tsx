import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Image, Dimensions, StatusBar } from 'react-native';
import { RNCamera, BarCodeReadEvent } from 'react-native-camera';
import Con from '../constants';
import { getUserById } from '../utils/api';
import { pushAlert } from '../utils/alert';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

interface HomeScannerProps {
    navigation: any;
}

function HomeScanner({ navigation }: HomeScannerProps) {
    const cameraRef = useRef<RNCamera | null>(null);
    const [isReaded, setIsReaded] = useState(false);

    const handleBarCodeRead = (event: BarCodeReadEvent) => {
        if (isReaded) {
            console.log("Qr is readed");
            return;
        }

        console.log(event.data);

        const qrReadedCode = event.data;

        getUserById(qrReadedCode)
            .then(user => {
                console.log("User got: ", user);

                if (user) {
                    navigation.navigate("QRDetail", { qrData: event.data });
                }
            })
            .catch(err => {
                console.log("Cant get user in home scanner: ", err);

                // User not found
                setIsReaded(true);

                pushAlert("QR code is not registered in system", "Please try valid QR Code", () => { setIsReaded(false) });
            })
    };

    const objectRef = useRef(null);
    const [distanceToTop, setDistanceToTop] = useState(0);
    const [distanceToBottom, setDistanceToBottom] = useState(0);
    const [distanceToLeft, setDistanceToLeft] = useState(0);
    const [distanceToRight, setDistanceToRight] = useState(0);

    const [objectWidth, setobjectWidth] = useState(0);
    const [objectHeight, setobjectHeight] = useState(0);

    const updateDistances = () => {
        if (objectRef.current) {
            objectRef.current.measure((a, b, width, height, px, py) => {
                const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

                setDistanceToTop(py);
                setDistanceToBottom(screenHeight - py - height);
                setDistanceToLeft(px);
                setDistanceToRight(screenWidth - px - width);

                setobjectHeight(height);
                setobjectWidth(width);

                console.log(px, py);
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.tip}>Scan Client's QR code</Text>
            <RNCamera
                ref={cameraRef}
                style={styles.rncamera}
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
            <View style={[styles.overlayTop, { height: distanceToTop - (200 / 3.6) }]} />
            <View style={[styles.overlayBottom, { height: distanceToTop - (200 / 3.6) }]} />
            <View style={[styles.overlayLeftSide, { width: distanceToLeft, height: objectHeight - 1, top: distanceToTop - (200 / 3.6) }]} />
            <View style={[styles.overlayRightSide, { width: distanceToRight, height: objectHeight - 1, top: distanceToTop - (200 / 3.6) }]} />
            <Image
                ref={objectRef}
                onLayout={() => { updateDistances() }}
                source={require('../../assets/qrBorder.png')}
                style={styles.image}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    tip: {
        position: 'absolute',
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
        zIndex: 5,
        top: '18%',
    },
    container: {
        flex: 1,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '33.5%',
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        zIndex: 1,
    },
    overlayBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '33.5%',
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        zIndex: 1,
    },
    overlayLeftSide: {
        position: 'absolute',
        top: '33.5%',
        left: 0,
        width: '21.5%',
        height: '33%',
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        zIndex: 1,
    },
    overlayRightSide: {
        position: 'absolute',
        top: '33.5%',
        right: 0,
        width: '21.5%',
        height: '33%',
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        zIndex: 1,
    },
    image: {
        width: Con.borderSize,
        height: Con.borderSize,
    },
    rncamera: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
});

export default HomeScanner;