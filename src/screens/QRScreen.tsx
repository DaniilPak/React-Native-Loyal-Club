import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { getArrayFromLocalStorage } from '../utils/async';
import Con from '../constants';
import BlueButton from '../components/BlueButton';
import ShrinkableContainer from '../components/ShrinkableContainer';
import PressableIcon from '../components/PressableIcon.';
import PressableIcon2 from '../components/PressableIcon2';

interface QRScreenProps {
  navigation: any;
}

function QRScreen({ navigation }: QRScreenProps) {
  const [qr, setQr] = useState('');
  const [greeting, setGreeting] = useState('');
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY)
      .then((asyncdata) => {
        Con.DEBUG && console.log('My async data token', asyncdata.userData._id);
        setQr(asyncdata.userData._id);
        setUserData(asyncdata.userData);

        // If user is Worker or Business
        // then allow him functions
        const isAdmin = asyncdata.userData.type == 'Business' || asyncdata.userData.type == 'Worker';

        if (isAdmin) {
          // Allow business functions
          navigation.setOptions({
            headerRight: () => (
              <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                <PressableIcon
                  onPress={() => {
                    navigation.navigate('History');
                  }}
                  icon="book-outline"
                />
                <View style={{ width: 5 }}></View>
                <PressableIcon2
                  onPress={() => {
                    navigation.navigate('Scan QR');
                  }}
                  icon="qrcode-scan"
                />
              </View>
            ),
          });
        }
      })
      .catch((err) => {
        Con.DEBUG && console.log(err);
      });

    // Assign greeting
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      setGreeting('Good morning');
    } else if (currentHour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  const myLoyaltyCards = 'My loyalty cards';

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
              <Text style={styles.tip}>
                {greeting}, {userData.name} {userData.surname}!
              </Text>
            )}
            <Text style={styles.tip}>Show Your Personal QR to the Worker</Text>
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
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 25,
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
    shadowRadius: 25,
    elevation: 25,
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
