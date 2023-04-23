import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { RNCamera, BarCodeReadEvent } from 'react-native-camera';
import QRCode from 'react-native-qrcode-svg';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="HomeTab" component={HomeStack} />
        <Tab.Screen name="QR Scanner" component={QRScannerScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

interface HomeScreenProps {
  navigation: any;
}

function HomeScreen({ navigation }: HomeScreenProps) {
  const cameraRef = useRef<RNCamera | null>(null);
  const [scanned, setScanned] = useState(false);

  const handleBarCodeRead = (event: BarCodeReadEvent) => {
    if (!scanned) {
      setScanned(true);
      // handle the scanned data here
      console.log(event.data);
    }
  };

  useEffect(() => {
    setScanned(false);
  }, []);

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        onBarCodeRead={handleBarCodeRead}
        captureAudio={false}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      />
      <View style={styles.rectangleContainer}>
        <View style={styles.rectangle} />
      </View>
      <Text style={styles.text}>Scan QR code</Text>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
});


interface QRScannerScreenProps {
  navigation: any;
}

function QRScannerScreen({ navigation }: QRScannerScreenProps) {

  const qrValue = 'https://example.com';

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <QRCode
        value={qrValue}
        size={200}
        color='black'
        backgroundColor='white'
      />
    </View>
  );
}

interface DetailsScreenProps {
  navigation: any;
  route: any;
}

function DetailsScreen({ route }: DetailsScreenProps) {
  const { qrData } = route.params;
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{qrData}</Text>
    </View>
  );
}

export default App;
