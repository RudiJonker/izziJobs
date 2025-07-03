import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function AppliedJobDetailScreen({ route }) {
  const { job } = route.params || {};
  const navigation = useNavigation();
  const jobNumber = job.job_reference.replace('JOB-', '');

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{job.title}: JOB #{jobNumber}</Text>
        <Text>Location: Beacon Bay (Placeholder)</Text>
        <Text>Date: {new Date(job.start_datetime).toLocaleDateString('en-ZA')}</Text>
        <Text>Time: {new Date(job.start_datetime).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })} - 
          {new Date(job.end_datetime).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</Text>
        <Text>Duration: {job.hours} Hours</Text>
        <Text>Description: {job.description}</Text>
        <Text>Pay: R{job.salary}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('AppliedJobsScreen')}>
          <Text style={styles.backText}>Back to Applied Jobs</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10 },
  content: { padding: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  backButton: { marginTop: 20, padding: 10, backgroundColor: '#1E90FF', borderRadius: 5, alignItems: 'center' }, // Changed to blue
  backText: { color: '#fff', fontWeight: 'bold' },
});