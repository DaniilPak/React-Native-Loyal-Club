import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from 'react-native';
import Con from '../constants';
import BlueButton from '../components/BlueButton';
import GrayButton from '../components/GrayButton';
import { getAbonnementsByUserIdAndBusinessId, getBusinessInfoByBid, getUserById, makeAnnouncement } from '../utils/api';
import { getArrayFromLocalStorage } from '../utils/async';
import { showMessage } from 'react-native-flash-message';
import NavigationRow from '../components/NavigationRow';
import { BarCodeReadEvent, RNCamera } from 'react-native-camera';
import Loading from './Loading';
import TextBlock from '../components/TextBlock';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextBlockV2 from '../components/TextBlockV2';
Ionicons.loadFont();
import { Text } from 'react-native-paper';
import NavigationRowExtended from '../components/NavigationRowExtended';
import { timeLeftUntilDate } from '../utils/helper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import EmptyListMessage from '../components/EmptyListMessage';

interface ScanAbonnementDetailsProps {
  navigation: any;
  route: any;
}

const Tab = createMaterialTopTabNavigator();

const ScanAbonnementDetails = ({ navigation, route }: ScanAbonnementDetailsProps) => {
  const { qrData } = route.params;

  return (
    <Tab.Navigator screenOptions={{ swipeEnabled: false }}>
      <Tab.Screen
        name="ActiveAbonnements"
        component={ActiveAbonnements}
        initialParams={{ navigation: navigation, qrData: qrData }}
        options={{ title: 'Активные' }}
      />
      <Tab.Screen
        name="InactiveAbonnements"
        component={InactiveAbonnements}
        initialParams={{ navigation: navigation, qrData: qrData }}
        options={{ title: 'Неактивные' }}
      />
    </Tab.Navigator>
  );
};

interface ActiveAbonnementsProps {
  route: any;
}

function ActiveAbonnements({ route }: ActiveAbonnementsProps) {
  const { navigation, qrData } = route.params;
  const clientId = qrData;

  const [client, setClient] = useState([]);
  const [abonnements, setAbonnements] = useState([]);
  const [businessDetails, setBusinessDetails] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  /// Methods
  const initFunc = async () => {
    try {
      const asyncdata = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);

      /// Get clients info
      const user = await getUserById(clientId);
      setClient(user);

      /// Get business info
      const businessId =
        asyncdata.userData.type === 'Business' ? asyncdata.userData.business : asyncdata.userData.workBusiness;
      const businessDetails = await getBusinessInfoByBid(businessId);
      setBusinessDetails(businessDetails);

      /// Get abonnement info
      const abonnements = await getAbonnementsByUserIdAndBusinessId(user._id, businessDetails._id);
      console.log('Abonnements: ', abonnements);

      const activeAbonnements = abonnements.filter((abon: any) => abon.isActive === true);
      setAbonnements(activeAbonnements);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initFunc();
  }, []);

  if (!isLoading) {
    return (
      <FlatList
        data={abonnements}
        keyExtractor={(abonnement) => abonnement._id}
        renderItem={({ item: abonnement }) => (
          <NavigationRowExtended
            text={`${abonnement.name} ${abonnement.price} ${businessDetails.currencySign}`}
            secondaryText={`${abonnement.value}/${abonnement.totalValue} ${
              abonnement.currency
            }\nдо окончания: ${timeLeftUntilDate(abonnement.endDate)}`}
            onPress={() => {
              navigation.navigate('AbonnementVisitConfirmation', {
                abonnementId: abonnement._id,
                clientId: client._id,
              });
            }}
          />
        )}
        ListEmptyComponent={<EmptyListMessage title="Нет активных абонементов" />}
        ListHeaderComponent={<Text variant="displaySmall" style>{`${client.name} ${client.surname}`}</Text>}
        ListHeaderComponentStyle={{ padding: 15 }}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    );
  } else {
    return <Loading />;
  }
}

interface InactiveAbonnements {
  route: any;
}

function InactiveAbonnements({ route }: InactiveAbonnements) {
  const { navigation, qrData } = route.params;
  const clientId = qrData;

  const [client, setClient] = useState([]);
  const [inactiveAbonnements, setInactiveAbonnements] = useState([]);
  const [businessDetails, setBusinessDetails] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  /// Methods
  const initFunc = async () => {
    const asyncdata = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);

    /// Get clients info
    const user = await getUserById(clientId);
    setClient(user);

    /// Get business info
    const businessId =
      asyncdata.userData.type === 'Business' ? asyncdata.userData.business : asyncdata.userData.workBusiness;
    const businessDetails = await getBusinessInfoByBid(businessId);
    setBusinessDetails(businessDetails);

    /// Get abonnement info
    const abonnements = await getAbonnementsByUserIdAndBusinessId(user._id, businessDetails._id);
    console.log('Abonnements: ', abonnements);

    const inactiveAbonnements = abonnements.filter((abon: any) => abon.isActive === false);
    setInactiveAbonnements(inactiveAbonnements);
  };

  useEffect(() => {
    initFunc();
  }, []);

  if (!isLoading) {
    return (
      <FlatList
        data={inactiveAbonnements}
        keyExtractor={(abonnement) => abonnement._id}
        renderItem={({ item: abonnement }) => (
          <NavigationRowExtended
            text={`${abonnement.name} ${abonnement.price} ${businessDetails.currencySign}`}
            secondaryText={`${abonnement.value}/${abonnement.totalValue} ${
              abonnement.currency
            }\nдо окончания: ${timeLeftUntilDate(abonnement.endDate)}`}
            onPress={() => {}}
          />
        )}
        ListEmptyComponent={<EmptyListMessage title="Нет неактивных абонементов" />}
        ListHeaderComponent={<Text variant="displaySmall" style>{`${client.name} ${client.surname}`}</Text>}
        ListHeaderComponentStyle={{ padding: 15 }}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    );
  } else {
    return <Loading />;
  }
}

export default ScanAbonnementDetails;
