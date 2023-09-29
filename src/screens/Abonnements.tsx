import React, { useEffect, useState } from 'react';
import { View, Modal, StyleSheet, TextInput, Alert } from 'react-native';
import Con from '../constants';
import BlueButton from '../components/BlueButton';
import GrayButton from '../components/GrayButton';
import { makeAnnouncement } from '../utils/api';
import { getArrayFromLocalStorage } from '../utils/async';
import { showMessage } from 'react-native-flash-message';
import NavigationRow from '../components/NavigationRow';

interface AbonnementsProps {
  navigation: any;
  route: any;
}

function Abonnements({ route, navigation }: AbonnementsProps) {
  const scanAbonnement = 'Сканировать абонемент';
  const showAllAbonnements = 'Все абонементы';
  const addNewAbonnement = 'Создать абонемент';

  const [asyncdata, setAsyncdata] = useState([]);

  const initFunc = async () => {
    const asyncdata = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);
    setAsyncdata(asyncdata);
  };

  /// Redirections
  const goToScanAbonnement = () => {
    navigation.navigate('ScanAbonnement');
  };

  const goToShowAllAbonnements = () => {
    navigation.navigate('AllAbonnements');
  };

  const goToCreateAbonnement = () => {
    navigation.navigate('CreateAbonnement');
  };

  useEffect(() => {
    initFunc();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.settingsContainer}>
        <NavigationRow text={scanAbonnement} onPress={goToScanAbonnement} />
        <NavigationRow text={showAllAbonnements} onPress={goToShowAllAbonnements} />
        <NavigationRow text={addNewAbonnement} onPress={goToCreateAbonnement} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  settingsContainer: {
    marginTop: 25,
  },
});

export default Abonnements;
