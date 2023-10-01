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

interface ScanAbonnementDetailsProps {
  navigation: any;
  route: any;
}

function ScanAbonnementDetails({ route, navigation }: ScanAbonnementDetailsProps) {
  const { qrData } = route.params;
  const clientId = qrData;

  const [asyncdata, setAsyncdata] = useState([]);
  const [client, setClient] = useState([]);
  const [abonnements, setAbonnements] = useState([]);
  const [inactiveAbonnements, setInactiveAbonnements] = useState([]);
  const [businessDetails, setBusinessDetails] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  /// Methods
  const goToAbonnementVisitConfirmation = (abonnementId: string) => {
    navigation.navigate('AbonnementVisitConfirmation', { abonnementId });
  };

  const initFunc = async () => {
    const asyncdata = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);
    setAsyncdata(asyncdata);

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
    const inactiveAbonnements = abonnements.filter((abon: any) => abon.isActive === false);

    setAbonnements(activeAbonnements);
    setInactiveAbonnements(inactiveAbonnements);
  };

  useEffect(() => {
    initFunc();
  }, []);

  if (!isLoading) {
    return (
      <KeyboardAvoidingView style={styles.keyboardAvoidingViewStyle} enabled keyboardVerticalOffset={100}>
        <ScrollView style={styles.scrollViewStyle} contentContainerStyle={{ paddingBottom: 50 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <Text variant="displaySmall" style={{ padding: 10 }}>{`${client.name} ${client.surname}`}</Text>
              <Text variant="headlineMedium" style={{ padding: 10, color: Con.AppleGreenLight }}>
                Активные
              </Text>
              {abonnements.map((abonnement) => (
                <NavigationRowExtended
                  key={abonnement._id}
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
              ))}

              <Text variant="headlineMedium" style={{ padding: 10, color: Con.AppleRedLight }}>
                Истекшие
              </Text>
              {inactiveAbonnements.map((abonnement) => (
                <NavigationRowExtended
                  key={abonnement._id}
                  text={`${abonnement.name} ${abonnement.price} ${businessDetails.currencySign}`}
                  secondaryText={`${abonnement.value}/${abonnement.totalValue} ${abonnement.currency}`}
                  onPress={() => {}}
                />
              ))}
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  } else {
    return <Loading />;
  }
}

const styles = StyleSheet.create({
  keyboardAvoidingViewStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  scrollViewStyle: {
    flex: 1,
  },
  inputContainer: {
    marginTop: 10,
  },
  input: {
    width: '100%',
    height: 60,
    backgroundColor: 'white',
    textAlign: 'center',
    color: 'black',
    fontSize: 30,
  },
  tipText: {
    marginTop: 10,
    color: 'gray',
    fontSize: 15,
    padding: 10,
  },
});

export default ScanAbonnementDetails;
