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
import { removeFcmToken } from '../utils/api';
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

  const [userData, setUserData] = useState([]);

  const { signOut } = useContext(AuthContext);

  useEffect(() => {
    getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
      .then((asyncdata) => {
        Con.DEBUG && console.log('async data settings', asyncdata.userData);
        setUserData(asyncdata.userData);
      })
      .catch((err) => {
        Con.DEBUG && console.log(err);
      });
  }, []);

  const userTypeIcon = <Ionicons name="cog-outline" size={Con.iconSize} color={Con.iconColor} />;
  const userNameIcon = <Ionicons name="person-circle-outline" size={Con.iconSize} color={Con.iconColor} />;
  const phoneIcon = <Ionicons name="phone-portrait-sharp" size={Con.iconSize} color={Con.iconColor} />;

  const businessSettingsOnPress = () => {
    navigation.navigate('BusinessSettings');
  };

  const abonnementsOnPress = () => {
    navigation.navigate('Abonnements');
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
    <View style={{ flex: 1 }}>
      {userData && (
        <View>
          <TextBlock text={`${accountTypeTitle}: ${userData.type}`} icon={userTypeIcon}></TextBlock>
          <TextBlock text={`${userData.name} ${userData.surname}`} icon={userNameIcon}></TextBlock>
          <TextBlock text={`${userData.phoneNumber}`} icon={phoneIcon}></TextBlock>
          {/* Show settings only for business */}
          {userData.type == 'Business' && (
            <View style={styles.settingsContainer}>
              <NavigationRow text={businessTitle} onPress={businessSettingsOnPress} />
              <NavigationRow text={loyalClubAbonnementsTitle} onPress={abonnementsOnPress} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  settingsContainer: {
    marginTop: 25,
  },
});

export default Settings;
