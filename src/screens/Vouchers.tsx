import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Alert, ScrollView, FlatList } from 'react-native';
import Con from '../constants';
import { getArrayFromLocalStorage } from '../utils/async';
import TextBlock from '../components/TextBlock';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import NavigationRow from '../components/NavigationRow';
import GrayButton from '../components/GrayButton';
import { AuthContext } from '../contexts/AuthContext';
import { getBusinessBaseStatistics, getBusinessInfoByBid, getBusinessVouchers, removeFcmToken } from '../utils/api';
import RedButton from '../components/RedButton';
import TextBlockV2 from '../components/TextBlockV2';
import BlueButton from '../components/BlueButton';
import ReceiptRow from '../components/ReceiptRow';
import { timeLeftUntilDate } from '../utils/helper';

interface VouchersProps {
  navigation: any;
  route: any;
}

function Vouchers({ route, navigation }: VouchersProps) {
  const rowIconSize = 20;
  const white = 'white';
  const addIcon = <Ionicons name="person-add" size={rowIconSize} color={white} />;

  const [userData, setUserData] = useState([]);
  const [businessVouchers, setBusinessVouchers] = useState([]);

  const addVoucher = () => {
    navigation.navigate('VoucherCreation');
  };

  useEffect(() => {
    getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
      .then((asyncdata) => {
        setUserData(asyncdata.userData);

        const currentBusinessId: string = asyncdata.userData.business;

        getBusinessVouchers(currentBusinessId, asyncdata.token).then((bvouchers) => {
          setBusinessVouchers(bvouchers);
        });
      })
      .catch((err) => {
        Con.DEBUG && console.log(err);
      });
  }, []);

  const renderItem = function ({ item }: any) {
    return (
      <ReceiptRow
        text={`${item.voucherCode}`}
        secondaryText={`Истекает через: ${timeLeftUntilDate(item.expirationDate)}`}
        value={`${item.voucherBonusAmount}`}
        valueSecondary={``}
        valueThird={``}
        onPress={() => {}}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <BlueButton title="Создать ваучер" onPress={addVoucher} icon={addIcon} />

      {businessVouchers.length > 0 && (
        <View style={{ marginTop: 15 }}>
          <FlatList data={businessVouchers} renderItem={renderItem} keyExtractor={(item) => item._id} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});

export default Vouchers;
