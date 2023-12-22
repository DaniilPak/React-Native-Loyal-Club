import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import Con from '../constants';
import { getArrayFromLocalStorage } from '../utils/async';
import TextBlock from '../components/TextBlock';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import NavigationRow from '../components/NavigationRow';
import GrayButton from '../components/GrayButton';
import { AuthContext } from '../contexts/AuthContext';
import { getBusinessBaseStatistics, getBusinessInfoByBid, removeFcmToken } from '../utils/api';
import RedButton from '../components/RedButton';
import TextBlockV2 from '../components/TextBlockV2';

interface StatisticsProps {
  navigation: any;
  route: any;
}

function Statistics({ route, navigation }: StatisticsProps) {
  const [userData, setUserData] = useState([]);
  const [currentBusinessBaseStat, setCurrentBusinessBaseStat] = useState([]);

  useEffect(() => {
    getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
      .then((asyncdata) => {
        Con.DEBUG && console.log('async data Statistics', asyncdata.userData);
        setUserData(asyncdata.userData);

        const currentBusinessId = asyncdata.userData.business;

        // Get business statistics
        getBusinessBaseStatistics(currentBusinessId).then((bstat) => {
          console.log('Bstat: ', bstat);
          setCurrentBusinessBaseStat(bstat);
        });
      })
      .catch((err) => {
        Con.DEBUG && console.log(err);
      });
  }, []);

  return (
    <ScrollView>
      <TextBlockV2 text={`Оставлено отзывов: ${currentBusinessBaseStat?.rewardedActionsLength || 0}`} />
      {currentBusinessBaseStat?.workerStatistics &&
        currentBusinessBaseStat.workerStatistics.map((worker, index) => (
          <TextBlockV2 key={index} text={`${worker.workerName}: ${worker.workerStat}`} />
        ))}
      {currentBusinessBaseStat?.voucherStatistics &&
        currentBusinessBaseStat.voucherStatistics.map((voucher, index) => (
          <TextBlockV2 key={index} text={`${voucher.voucherCode}: ${voucher.usedStat}`} />
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({});

export default Statistics;
