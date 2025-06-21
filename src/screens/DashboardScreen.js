import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utils/supabaseClient';
import { styles } from '../theme/styles';

export default function DashboardScreen({ route }) {
  const navigation = useNavigation();
  const { userId, role } = route.params || {};

  return (
    <View style={styles.container}>
      <Text>Dashboard for {role}</Text>
      {role === 'job_seeker' && (
        <TouchableOpacity onPress={() => navigation.navigate('ListOfJobs')}>
          <Text style={styles.link}>View Available Jobs</Text>
        </TouchableOpacity>
      )}
      {role === 'employer' && (
        <TouchableOpacity onPress={() => navigation.navigate('PostingJobs')}>
          <Text style={styles.link}>Post a Job</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Add to ../theme/styles.js if not present
const styles = {
  ...styles, // Keep existing styles
  link: { color: '#48d22b', padding: 10, fontSize: 16 },
};