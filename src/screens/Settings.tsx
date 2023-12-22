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
import { getBusinessInfoByBid, removeFcmToken } from '../utils/api';
import RedButton from '../components/RedButton';

interface SettingsProps {
  navigation: any;
  route: any;
}

function Settings({ route, navigation }: SettingsProps) {
  const accountTypeTitle = 'Тип аккаунта';
  const loyalClubAbonnementsTitle = 'Сертификаты и абонементы';
  const businessTitle = 'Бизнес';
  const quitTitle = 'Выйти';
  const deleteAccountTitle = 'Удалить аккаунт';
  const currentBusinessNameTitle = 'Бизнес';
  const statisticsTitle = 'Статистика';

  const [userData, setUserData] = useState([]);
  const [currentBusiness, setCurrentBusiness] = useState([]);

  const { signOut } = useContext(AuthContext);

  const getCurrentBusinessInfo = async (userData: any) => {
    const currentUserType = userData.type;

    // Checking if type is either 'Business' or 'Worker'
    if (currentUserType === 'Business' || currentUserType === 'Worker') {
      if (currentUserType === 'Business') {
        const fetchedBusinessInfo = await getBusinessInfoByBid(userData.business);
        setCurrentBusiness(fetchedBusinessInfo);
      } else if (currentUserType === 'Worker') {
        const fetchedBusinessInfo = await getBusinessInfoByBid(userData.workBusiness);
        setCurrentBusiness(fetchedBusinessInfo);
      }
    } else {
      console.log('Current users type is probably Client');
    }
  };

  useEffect(() => {
    getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
      .then((asyncdata) => {
        Con.DEBUG && console.log('async data settings', asyncdata.userData);
        setUserData(asyncdata.userData);

        getCurrentBusinessInfo(asyncdata.userData);
      })
      .catch((err) => {
        Con.DEBUG && console.log(err);
      });
  }, []);

  const userTypeIcon = <Ionicons name="cog-outline" size={Con.iconSize} color={Con.iconColor} />;
  const userNameIcon = <Ionicons name="person-circle-outline" size={Con.iconSize} color={Con.iconColor} />;
  const phoneIcon = <Ionicons name="phone-portrait-sharp" size={Con.iconSize} color={Con.iconColor} />;
  const currentBusinessIcon = <Ionicons name="business-outline" size={Con.iconSize} color={Con.iconColor} />;

  const businessSettingsOnPress = () => {
    navigation.navigate('BusinessSettings');
  };

  const abonnementsOnPress = () => {
    navigation.navigate('Abonnements');
  };

  const statisticsOnPress = () => {
    navigation.navigate('Statistics');
  };

  const accountDeletionOnPress = () => {
    navigation.navigate('AccountDeletion');
  };

  const signOutAlert = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this worker?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: () => {
            // Remove FCM token for not getting notifications
            removeFcmToken(userData._id);
            // Handle delete logic here
            signOut();
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
      {userData && (
        <View>
          <TextBlock text={`${accountTypeTitle}: ${userData.type}`} icon={userTypeIcon}></TextBlock>
          {userData.type == 'Business' && (
            <TextBlock
              text={`${currentBusinessNameTitle}: ${currentBusiness.name}`}
              icon={currentBusinessIcon}
            ></TextBlock>
          )}
          {userData.type == 'Worker' && (
            <TextBlock
              text={`${currentBusinessNameTitle}: ${currentBusiness.name}`}
              icon={currentBusinessIcon}
            ></TextBlock>
          )}
          <TextBlock text={`${userData.name} ${userData.surname}`} icon={userNameIcon}></TextBlock>
          <TextBlock text={`${userData.phoneNumber}`} icon={phoneIcon}></TextBlock>
          {/* Show settings only for business */}
          {userData.type == 'Business' && (
            <View style={styles.settingsContainer}>
              <NavigationRow text={businessTitle} onPress={businessSettingsOnPress} />
              <NavigationRow text={loyalClubAbonnementsTitle} onPress={abonnementsOnPress} />
              <NavigationRow text={statisticsTitle} onPress={statisticsOnPress} />
            </View>
          )}
          {/* Show settings only for workers  */}
          {userData.type == 'Worker' && (
            <View style={styles.settingsContainer}>
              <NavigationRow text={loyalClubAbonnementsTitle} onPress={abonnementsOnPress} />
            </View>
          )}
          <NavigationRow text={deleteAccountTitle} onPress={accountDeletionOnPress} />
          <RedButton title={quitTitle} onPress={signOutAlert} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  settingsContainer: {
    marginTop: 25,
  },
});

export default Settings;
