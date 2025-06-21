import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { styles } from '../theme/styles';

export default function ChatScreen({ route }) {
  const { userId } = route.params;
  return (
    <View style={styles.container}>
      <Text>Chat Screen (User ID: {userId})</Text>
      <Button mode="contained" onPress={() => alert('Location pin-drop TBD')}>
        Send Location
      </Button>
    </View>
  );
}