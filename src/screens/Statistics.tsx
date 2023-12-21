import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Con from '../constants';
import { getArrayFromLocalStorage } from '../utils/async';
import TextBlock from '../components/TextBlock';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import NavigationRow from '../components/NavigationRow';
import GrayButton from '../components/GrayButton';
import { AuthContext } from '../contexts/AuthContext';
import { getBusinessInfoByBid, removeFcmToken } from '../utils/api';
import RedButton from '../components/RedButton';

interface StatisticsProps {
  navigation: any;
  route: any;
}

function Statistics({ route, navigation }: StatisticsProps) {
  const [userData, setUserData] = useState([]);
  const [currentBusiness, setCurrentBusiness] = useState([]);

  useEffect(() => {
    getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
      .then((asyncdata) => {
        Con.DEBUG && console.log('async data Statistics', asyncdata.userData);
        setUserData(asyncdata.userData);
      })
      .catch((err) => {
        Con.DEBUG && console.log(err);
      });
  }, []);

  return <View style={{ flex: 1 }}></View>;
}

const styles = StyleSheet.create({});

export default Statistics;
