import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image } from 'react-native';
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
            Con.DEBUG && console.log("User data not loaded yet or already scanned");
            return;
        }

        setIsScanned(true);
        console.log(event.data);

        // Add worker logic
        const workerId = event.data;
        const businessId = userData.business;

        addWorkerFromBusiness(workerId, businessId, jwtToken)
            .then(res => {
                Con.DEBUG && console.log("Successfully added a new worker: ", res);
            })
            .finally(() => {
                setTimeout(() => {
                    navigation.navigate("BusinessSettings");
                }, 1000);
            })
            .catch(err => {
                Con.DEBUG && console.log("Error with adding a new worker: ", err);
                setIsScanned(false);
            });
    };

    useEffect(() => {
        getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
            .then(asyncdata => {
                setUserData(asyncdata.userData);
                setjwtToken(asyncdata.token);
            })
            .catch(err => {
                Con.DEBUG && console.log(err);
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
            <Image
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