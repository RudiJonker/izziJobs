import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function JobDetailScreen({ route }) {
  const { job } = route.params || {};
  const navigation = useNavigation();
  const jobNumber = job.job_reference.replace('JOB-', '');

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Ad Space (Placeholder)</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{job.title}: JOB #{jobNumber}</Text>
        <Text>Location: Beacon Bay (Placeholder)</Text>
        <Text>Date: {new Date(job.start_datetime).toLocaleDateString('en-ZA')}</Text>
        <Text>Time: {new Date(job.start_datetime).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })} - 
          {new Date(job.end_datetime).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</Text>
        <Text>Duration: {job.hours} Hours</Text>
        <Text>Description: {job.description}</Text>
        <Text>Pay: R{job.salary}</Text>
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ListOfJobsScreen')}>
          <Text style={styles.backText}>Back to Jobs</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  banner: { position: 'absolute', top: 0, width: '100%', height: 40, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
  bannerText: { color: '#333' },
  content: { padding: 10, marginTop: 40 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  applyButton: { marginTop: 20, padding: 10, backgroundColor: '#48d22b', borderRadius: 5, alignItems: 'center' },
  applyText: { color: '#fff', fontWeight: 'bold' },
  backButton: { marginTop: 10, padding: 10, backgroundColor: '#666', borderRadius: 5, alignItems: 'center' },
  backText: { color: '#fff', fontWeight: 'bold' },
});