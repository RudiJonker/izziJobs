import React from 'react';
import { View, Text } from 'react-native';

export default function ApplicantsScreen({ route }) {
  const { userId } = route.params || {};
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Applicants Screen (Placeholder) - User ID: {userId || 'Not provided'}</Text>
    </View>
  );
}