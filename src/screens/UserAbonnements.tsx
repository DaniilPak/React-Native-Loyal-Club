import React, { useEffect, useState } from 'react';
import { View, Modal, StyleSheet, TextInput, Alert } from 'react-native';
import Con from '../constants';
import BlueButton from '../components/BlueButton';
import GrayButton from '../components/GrayButton';
import { makeAnnouncement } from '../utils/api';
import { getArrayFromLocalStorage } from '../utils/async';
import { showMessage } from 'react-native-flash-message';
import NavigationRow from '../components/NavigationRow';

interface UserAbonnementsProps {
  navigation: any;
  route: any;
}

function UserAbonnements({ route, navigation }: UserAbonnementsProps) {
  const showAllUserAbonnements = 'Все абонементы';
  const addNewAbonnement = 'Создать абонемент';

  const [asyncdata, setAsyncdata] = useState([]);

  const initFunc = async () => {
    const asyncdata = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);
    setAsyncdata(asyncdata);
  };

  useEffect(() => {
    initFunc();
  }, []);

  return <View style={{ flex: 1 }}></View>;
}

const styles = StyleSheet.create({});

export default UserAbonnements;
