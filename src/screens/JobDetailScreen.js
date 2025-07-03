import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utils/supabaseClient';

export default function JobDetailScreen({ route }) {
  const { job } = route.params || {};
  const navigation = useNavigation();
  const jobNumber = job.job_reference.replace('JOB-', '');

  const handleApply = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('No authenticated user');

      const { data: existingApp } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', job.id)
        .eq('applicant_id', user.id)
        .single();

      if (existingApp) {
        Alert.alert('Notice', 'It looks like you already applied for this job.');
        return;
      }

      const { error } = await supabase.from('applications').insert({
        job_id: job.id,
        applicant_id: user.id,
      });
      if (error) throw error;

      Alert.alert('Success', 'Application submitted!', [
        { text: 'OK', onPress: () => navigation.navigate('ListOfJobsScreen') },
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

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
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
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
  backButton: { marginTop: 10, padding: 10, backgroundColor: '#1E90FF', borderRadius: 5, alignItems: 'center' }, // Changed to blue
  backText: { color: '#fff', fontWeight: 'bold' },
});