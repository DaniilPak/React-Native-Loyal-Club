import React, { useEffect, useRef, useState } from 'react';
import { View, Modal, StyleSheet, TextInput, Alert, Image, Text } from 'react-native';
import Con from '../constants';
import BlueButton from '../components/BlueButton';
import GrayButton from '../components/GrayButton';
import { getUserById, makeAnnouncement } from '../utils/api';
import { getArrayFromLocalStorage } from '../utils/async';
import { showMessage } from 'react-native-flash-message';
import NavigationRow from '../components/NavigationRow';
import { BarCodeReadEvent, RNCamera } from 'react-native-camera';
import { pushAlert } from '../utils/alert';

interface ScanAbonnementProps {
  navigation: any;
  route: any;
}

function ScanAbonnement({ route, navigation }: ScanAbonnementProps) {
  const cameraRef = useRef<RNCamera | null>(null);
  const [isReaded, setIsReaded] = useState(false);

  const handleBarCodeRead = (event: BarCodeReadEvent) => {
    if (isReaded) {
      Con.DEBUG && console.log('Qr is readed');
      return;
    }

    console.log('event.data', event.data);

    const qrReadedCode = event.data;

    getUserById(qrReadedCode)
      .then((user) => {
        console.log('User got: ', user);

        if (user) {
          navigation.navigate('ScanAbonnementDetails', { qrData: event.data });
        }
      })
      .catch((err) => {
        console.log('Cant get user in home scanner: ', err);

        // User not found
        setIsReaded(true);

        pushAlert('QR-код не зарегистрирован в системе', 'Пожалуйста, попробуйте действительный QR-код', () => {
          setIsReaded(false);
        });
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tip}>Отсканируйте QR клиента для поиска абонемента</Text>
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
    width: Con.width * 0.8,
    textAlign: 'center',
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

export default ScanAbonnement;
