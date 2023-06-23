import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Image, Dimensions } from 'react-native';
import { RNCamera, BarCodeReadEvent } from 'react-native-camera';
import { getArrayFromLocalStorage } from '../utils/async';
import Con from '../constants';
import { addWorkerFromBusiness } from '../utils/api';

interface AddWorkerScannerProps {
    navigation: any;
}

function AddWorkerScanner({ navigation }: AddWorkerScannerProps) {
    const cameraRef = useRef<RNCamera | null>(null);
    const [userData, setUserData] = useState([]);
    const [jwtToken, setjwtToken] = useState('');

    const [isScanned, setIsScanned] = useState(false);

    const handleBarCodeRead = (event: BarCodeReadEvent) => {
        if (!userData || isScanned) {
            console.log("User data not loaded yet or already scanned");
            return;
        }

        setIsScanned(true);
        console.log(event.data);

        // Add worker logic
        const workerId = event.data;
        const businessId = userData.business;

        addWorkerFromBusiness(workerId, businessId, jwtToken)
            .then(res => {
                console.log("Successfully added a new worker: ", res);
            })
            .finally(() => {
                setTimeout(() => {
                    navigation.navigate("BusinessSettings");
                }, 1000);
            })
            .catch(err => {
                console.log("Error with adding a new worker: ", err);
                setIsScanned(false);
            });
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

    useEffect(() => {
        getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
            .then(asyncdata => {
                setUserData(asyncdata.userData);
                setjwtToken(asyncdata.token);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <View style={styles.container}>
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
        height: '35%',
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        zIndex: 1,
    },
    overlayBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '35%',
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        zIndex: 1,
    },
    overlayLeftSide: {
        position: 'absolute',
        top: '35%',
        left: 0,
        width: '21.5%',
        height: '30%',
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        zIndex: 1,
    },
    overlayRightSide: {
        position: 'absolute',
        top: '35%',
        right: 0,
        width: '21.5%',
        height: '30%',
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

export default AddWorkerScanner;