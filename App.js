import * as React from 'react';
import { PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { UserProvider } from './src/contexts/UserContext';

export default function App() {
  const customTheme = {
    colors: {
      primary: '#48d22b',
      accent: '#ff4500',
      background: '#f5f5f5',
      text: '#333',
      error: '#b00020',
    },
  };

  return (
    <PaperProvider theme={customTheme}>
      <UserProvider>
        <AppNavigator />
      </UserProvider>
    </PaperProvider>
  );
}