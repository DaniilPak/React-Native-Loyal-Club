import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
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

    const [isScanned, setIsScanned] = useState(false);

    const handleBarCodeRead = (event: BarCodeReadEvent) => {
        if (userData && !isScanned) {
            console.log(event.data);

            setIsScanned(true);

            // Add worker logic
            const workerId = event.data;
            const businessId = userData.business;

            addWorkerFromBusiness(workerId, businessId)
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
        } else {
            console.log("User data not loaded yet");
        }
    };
    useEffect(() => {
        getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
            .then(asyncdata => {
                setUserData(asyncdata.userData);
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
            <View style={styles.overlayTop} />
            <View style={styles.overlayBottom} />
            <View style={styles.overlayLeftSide} />
            <View style={styles.overlayRightSide} />
            <View style={styles.square}>
                <Image source={require('../../assets/qrBorder.png')} style={styles.image} />
            </View>
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
    square: {
        zIndex: 3,
        alignItems: 'center',
        justifyContent: 'center',
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