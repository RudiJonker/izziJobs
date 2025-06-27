import React from 'react';
import { View, Text } from 'react-native';

export default function RatingScreen({ route }) {
  const { userId } = route.params || {};
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Rating Screen (Placeholder) - User ID: {userId || 'Not provided'}</Text>
    </View>
  );
}