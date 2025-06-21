import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f5f5f5', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 16 }}>Welcome to IzziJobs!</Text>
      <Text style={{ color: '#333', marginBottom: 16 }}>
        Find short-term gigs like gardening or post jobs!
      </Text>
      <Button
        mode="contained"
        style={{ marginTop: 16, backgroundColor: '#48d22b' }}
        onPress={() => navigation.navigate('Auth')}
        accessibilityLabel="Get started with IzziJobs"
      >
        Get Started
      </Button>
    </View>
  );
}