import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import Con from '../constants';

function Loading() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color={Con.AppleBlueLight} />
    </View>
  );
}

export default Loading;
