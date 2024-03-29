import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { RNCamera, BarCodeReadEvent } from 'react-native-camera';
import Con from '../constants';
import { getUserById } from '../utils/api';
import { pushAlert } from '../utils/alert';

interface HomeScannerProps {
  navigation: any;
}

function HomeScanner({ navigation }: HomeScannerProps) {
  const cameraRef = useRef<RNCamera | null>(null);

  const handleBarCodeRead = (event: BarCodeReadEvent) => {
    const qrReadedCode = event.data;

    getUserById(qrReadedCode)
      .then((user) => {
        if (user) {
          navigation.navigate('QRDetail', { qrData: event.data });
        }
      })
      .catch((err) => {
        Con.DEBUG && console.log('Cant get user in home scanner: ', err);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tip}>Сканировать QR-код клиента</Text>
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
      <Image source={require('../../assets/qrBorder.png')} style={styles.image} />
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
