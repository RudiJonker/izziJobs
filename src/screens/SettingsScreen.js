import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { styles } from '../theme/styles';

export default function ShareScreen() {
  return (
    <View style={styles.container}>
      <Text>Share Screen</Text>
      <Button mode="contained" onPress={() => alert('Share to social media TBD')}>
        Share App
      </Button>
    </View>
  );
}