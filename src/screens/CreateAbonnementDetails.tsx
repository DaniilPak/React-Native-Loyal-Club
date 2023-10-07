import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Con from '../constants';
import BlueButton from '../components/BlueButton';
import { createAbonnement, getBusinessInfoByBid, getUserById } from '../utils/api';
import { getArrayFromLocalStorage } from '../utils/async';
import { showMessage } from 'react-native-flash-message';
import Loading from './Loading';
import TextBlock from '../components/TextBlock';
import { TextInputMask } from 'react-native-masked-text';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import { Picker } from '@react-native-picker/picker';

interface CreateAbonnementDetailsProps {
  navigation: any;
  route: any;
}

function CreateAbonnementDetails({ route, navigation }: CreateAbonnementDetailsProps) {
  const { qrData } = route.params;
  const clientId = qrData;

  const createAbonnementButtonTitle = 'Создать абонемент';

  const abonnementCurrencies = [
    { label: 'Visit', value: 'visit' },
    { label: 'Credit', value: 'credit' },
  ];

  const [client, setClient] = useState([]);
  const [asyncdata, setAsyncdata] = useState([]);
  const [businessDetails, setBusinessDetails] = useState([]);
  const [currencySign, setCurrencySign] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [buttonIsLoading, setButtonIsLoading] = useState(false);
  const [abonnementCurrenciesState, setAbonnementCurrenciesState] = useState(abonnementCurrencies);

  const [abonnementValue, setAbonnementValue] = useState(0);
  const [abonnementCurrency, setAbonnementCurrency] = useState('');
  const [daysBeforeExpiration, setDaysBeforeExpiration] = useState(0);
  const [costOfAbonnement, setCostOfAbonnement] = useState('0');
  const [abonnementName, setAbonnementName] = useState('');

  const iconSize = 25;
  const iconColor = Con.AppleBlueLight;
  const personIcon = <Ionicons name="person-circle-outline" size={iconSize} color={iconColor} />;

  const confirmCreatingAbonnement = async () => {
    const costOfAbonnementWithoutCurrencySign = costOfAbonnement.replace(/[^0-9]/g, '');
    const numberFormattedCostOfAbonnement = parseInt(costOfAbonnementWithoutCurrencySign);

    const errors = validateForm(
      abonnementValue,
      abonnementCurrency,
      daysBeforeExpiration,
      numberFormattedCostOfAbonnement,
      abonnementName
    );

    if (errors.length > 0) {
      showMessage({
        message: 'Ошибка',
        description: errors[0],
        type: 'warning',
      });

      return;
    }

    setButtonDisabled(true);
    setButtonIsLoading(true);

    const startDate: Date = new Date();
    const endDate: Date = new Date(startDate);
    endDate.setDate(startDate.getDate() + daysBeforeExpiration);

    createAbonnement(
      abonnementName,
      businessDetails.name,
      abonnementCurrency,
      numberFormattedCostOfAbonnement,
      abonnementValue,
      startDate,
      endDate,
      clientId,
      businessDetails._id,
      asyncdata.userData._id,
      businessDetails.currencySign,
      asyncdata.token
    )
      .then((receiptResponse) => {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'SuccessAbonnementCreation',
              params: {
                receiptResponse: receiptResponse,
              },
            },
          ],
        });
      })
      .catch((err) => {
        Con.DEBUG && console.log('Error with creating abonnement', err);
      });
  };

  enum abonnementErrorTypes {
    abonnementValueException = 'Введите количество единиц',
    abonnementCurrencyException = 'Выберите валюту абонемента',
    daysBeforeExpirationException = 'Введите срок действия абонемента',
    costOfAbonnement = 'Введите стоимость абонемента',
    abonnementName = 'Введите имя абонемента',
  }

  const validateForm = (
    abonnementValue: number,
    abonnementCurrency: string,
    daysBeforeExpiration: number,
    costOfAbonnement: number,
    abonnementName: string
  ) => {
    const errors: any[] = [];

    if (abonnementValue === 0) {
      errors.push(abonnementErrorTypes.abonnementValueException);
    }

    if (!abonnementCurrency.trim()) {
      errors.push(abonnementErrorTypes.abonnementCurrencyException);
    }

    if (daysBeforeExpiration === 0) {
      errors.push(abonnementErrorTypes.daysBeforeExpirationException);
    }

    if (costOfAbonnement === 0) {
      errors.push(abonnementErrorTypes.costOfAbonnement);
    }

    if (!abonnementName.trim()) {
      errors.push(abonnementErrorTypes.abonnementName);
    }

    return errors;
  };

  const handleAbonnementValueChange = (value: string) => {
    if (value.trim() !== '') {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }

    setAbonnementValue(parseInt(value));
  };

  const handleAbonnementCurrencyChange = (text: string) => {
    setAbonnementCurrency(text);
  };

  const handleDaysBeforeExpirationChange = (value: string) => {
    setDaysBeforeExpiration(parseInt(value));
  };

  const handleCostOfAbonnementChange = (text: string) => {
    setCostOfAbonnement(text);
  };

  const handleAbonnementNameChange = (text: string) => {
    setAbonnementName(text);
  };

  const initFunc = async () => {
    try {
      const asyncdata = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);
      setAsyncdata(asyncdata);

      const user = await getUserById(clientId);
      setClient(user);

      const businessId =
        asyncdata.userData.type === 'Business' ? asyncdata.userData.business : asyncdata.userData.workBusiness;
      const businessDetails = await getBusinessInfoByBid(businessId);
      const businessCurrency = businessDetails.currencySign;

      setBusinessDetails(businessDetails);
      setCurrencySign(businessCurrency);

      const businessStandardCurrency = { label: businessCurrency, value: businessCurrency };
      setAbonnementCurrenciesState(abonnementCurrencies.concat(businessStandardCurrency));
      setAbonnementCurrency(abonnementCurrencies[0].value);
    } catch (err) {
      Con.DEBUG && console.log(err);
    } finally {
      setIsLoading(false);
    }
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
              <TextBlock text={`Клиент: ${client.name} ${client.surname}`} icon={personIcon}></TextBlock>
              {/* Abonnement value input */}
              <View style={styles.inputContainer}>
                <Text style={styles.tipText}>Количество ед.</Text>
                <TextInputMask
                  type="custom" // Specify the type as 'custom' for your own masking pattern
                  options={{
                    mask: '999999999', // Customize the mask pattern for days (you can adjust it)
                  }}
                  value={abonnementValue.toString()} // Pass your input value here
                  onChangeText={handleAbonnementValueChange} // Handle the input change
                  keyboardType="numeric" // Set the keyboard type to numeric
                  placeholder={`Количество ед.`}
                  placeholderTextColor={'gray'}
                  style={styles.input}
                />
              </View>

              {/* Abonnement value selector picker */}
              <View style={styles.inputContainer}>
                <Text style={styles.tipText}>Валюта абонемента</Text>
                <Picker
                  selectedValue={abonnementCurrency}
                  onValueChange={(itemValue, itemIndex) => handleAbonnementCurrencyChange(itemValue)}
                  style={styles.input}
                >
                  {abonnementCurrenciesState.map((abonnementCurrency) => (
                    <Picker.Item
                      key={abonnementCurrency.value}
                      label={abonnementCurrency.label}
                      value={abonnementCurrency.value}
                    />
                  ))}
                </Picker>
              </View>

              {/* Days Before Expiration */}
              <View style={styles.inputContainer}>
                <Text style={styles.tipText}>Срок действия в днях</Text>
                <TextInputMask
                  type="custom" // Specify the type as 'custom' for your own masking pattern
                  options={{
                    mask: '9999', // Customize the mask pattern for days (you can adjust it)
                  }}
                  value={daysBeforeExpiration.toString()} // Assuming daysBeforeExpiration is a number
                  onChangeText={handleDaysBeforeExpirationChange}
                  keyboardType="numeric"
                  placeholder="Срок действия (в днях)"
                  placeholderTextColor={'gray'}
                  style={styles.input}
                />
              </View>

              {/* Cost of the Abonnement */}
              <View style={styles.inputContainer}>
                <Text style={styles.tipText}>Стоимость абонемента</Text>
                <TextInputMask
                  type="money"
                  options={{
                    precision: 0,
                    separator: '.',
                    delimiter: ' ',
                    unit: currencySign,
                    suffixUnit: '',
                  }}
                  value={costOfAbonnement.toString()} // Assuming costOfAbonnement is a number
                  onChangeText={handleCostOfAbonnementChange}
                  keyboardType="numeric"
                  placeholder="Цена абонемента"
                  placeholderTextColor={'gray'}
                  style={styles.input}
                />
              </View>

              {/* Description */}
              <View style={styles.inputContainer}>
                <Text style={styles.tipText}>Название абонемента</Text>
                <TextInput
                  value={abonnementName}
                  onChangeText={(text) => handleAbonnementNameChange(text)}
                  placeholder="Название"
                  placeholderTextColor={'gray'}
                  style={styles.input}
                />

                <BlueButton
                  title={`${createAbonnementButtonTitle}`}
                  onPress={confirmCreatingAbonnement}
                  isLoading={buttonIsLoading}
                  isDisabled={buttonDisabled}
                  isShadowDisabled={false}
                />
              </View>
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

export default CreateAbonnementDetails;
