import * as React from 'react';
import { View, Text, Alert } from 'react-native';
import { TextInput, Button, RadioButton } from 'react-native-paper';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('job_seeker');
  const [isSignup, setIsSignup] = useState(true);

  const handleAuth = async () => {
    try {
      let user;
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { role } },
        });
        if (error) throw error;
        user = data.user;

        const { error: profileError } = await supabase
          .from('users')
          .insert([{ id: user.id, email, role }]);
        if (profileError) throw profileError;
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        user = data.user;
      }

      // Navigate to Main tab navigator with userId and role
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main', params: { userId: user.id, role: user.user_metadata.role || role } }],
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f5f5f5', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 16 }}>
        {isSignup ? 'Sign Up' : 'Log In'}
      </Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={{ marginBottom: 16, backgroundColor: '#fff' }}
        keyboardType="email-address"
        autoCapitalize="none"
        accessibilityLabel="Email input"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        style={{ marginBottom: 16, backgroundColor: '#fff' }}
        secureTextEntry
        accessibilityLabel="Password input"
      />
      {isSignup && (
        <>
          <Text style={{ marginBottom: 8, color: '#333' }}>I am a:</Text>
          <RadioButton.Group onValueChange={setRole} value={role}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton value="job_seeker" />
              <Text>Job Seeker</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton value="employer" />
              <Text>Employer</Text>
            </View>
          </RadioButton.Group>
        </>
      )}
      <Button
        mode="contained"
        style={{ marginTop: 16, backgroundColor: '#48d22b' }}
        onPress={handleAuth}
        accessibilityLabel={isSignup ? 'Sign up' : 'Log in'}
      >
        {isSignup ? 'Sign Up' : 'Log In'}
      </Button>
      <Button
        onPress={() => setIsSignup(!isSignup)}
        style={{ marginTop: 8 }}
        accessibilityLabel={isSignup ? 'Switch to log in' : 'Switch to sign up'}
      >
        {isSignup ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
      </Button>
    </View>
  );
}