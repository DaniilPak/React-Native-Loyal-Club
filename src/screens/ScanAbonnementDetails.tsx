import React, { useEffect, useRef, useState } from 'react';
import { View, Modal, StyleSheet, TextInput, Alert, Image, Text } from 'react-native';
import Con from '../constants';
import BlueButton from '../components/BlueButton';
import GrayButton from '../components/GrayButton';
import { makeAnnouncement } from '../utils/api';
import { getArrayFromLocalStorage } from '../utils/async';
import { showMessage } from 'react-native-flash-message';
import NavigationRow from '../components/NavigationRow';
import { BarCodeReadEvent, RNCamera } from 'react-native-camera';

interface ScanAbonnementDetailsProps {
  navigation: any;
  route: any;
}

function ScanAbonnementDetails({ route, navigation }: ScanAbonnementDetailsProps) {
  const [asyncdata, setAsyncdata] = useState([]);

  const initFunc = async () => {
    const asyncdata = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);
    setAsyncdata(asyncdata);
  };

  useEffect(() => {
    initFunc();
  }, []);

  return <View></View>;
}

const styles = StyleSheet.create({});

export default ScanAbonnementDetails;
