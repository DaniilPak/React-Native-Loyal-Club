import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { getArrayFromLocalStorage } from '../utils/async';
import Con from '../constants';
import BlueButton from '../components/BlueButton';
import ShrinkableContainer from '../components/ShrinkableContainer';

interface QRScreenProps {
  navigation: any;
}

function QRScreen({ navigation }: QRScreenProps) {
  const [qr, setQr] = useState('');
  const [greeting, setGreeting] = useState('');
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const asyncdata = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);
        const userData = asyncdata.userData;

        if (!userData) {
          return;
        }

        Con.DEBUG && console.log('My async data token', userData._id);
        setQr(userData._id);
        setUserData(userData);

        setCurrentGreeting();
      } catch (err) {
        Con.DEBUG && console.log(err);
      }
    }

    function setCurrentGreeting() {
      const currentHour = new Date().getHours();
      let greeting = 'Добрый вечер';

      if (currentHour < 12) {
        greeting = 'Доброе утро';
      } else if (currentHour < 18) {
        greeting = 'Добрый день';
      }

      setGreeting(greeting);
    }

    fetchData();
  }, []);

  const myLoyaltyCards = 'Мои карты лояльности';

  const showMyLoyaltyCards = () => {
    navigation.navigate('MyLoyaltyCards');
  };

  const qrSize = Con.width * 0.5;

  return (
    <View style={styles.parentStyle}>
      {qr && (
        <View>
          <View style={styles.labelContainer}>
            {userData && (
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.greeting}>{greeting}, </Text>
                <Text style={styles.tip}>
                  {userData.name} {userData.surname}!
                </Text>
              </View>
            )}
            <Text style={styles.tip}>Покажите свой QR сотруднику</Text>
          </View>
          <ShrinkableContainer>
            <View style={styles.mainContainer}>
              <QRCode value={qr} size={qrSize} color="black" backgroundColor="white" />
            </View>
          </ShrinkableContainer>
        </View>
      )}
      <View style={styles.lowerContainer}>
        <BlueButton title={myLoyaltyCards} onPress={showMyLoyaltyCards} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelContainer: {
    paddingTop: 25,
    paddingBottom: 25,
  },
  greeting: {
    color: 'black',
    fontSize: 18,
    marginVertical: 10,
  },
  tip: {
    color: 'black',
    fontSize: 18,
    marginVertical: 10,
  },
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'center',

    width: Con.width * 0.9,
    paddingTop: 25,
    paddingBottom: 25,
    backgroundColor: 'white',
    borderRadius: 25,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  lowerContainer: {
    flex: 1,
    width: '100%',
  },
  parentStyle: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default QRScreen;
