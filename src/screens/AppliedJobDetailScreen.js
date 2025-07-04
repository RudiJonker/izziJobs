import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utils/supabaseClient';

export default function AppliedJobDetailScreen({ route }) {
  const { job } = route.params || {};
  const navigation = useNavigation();
  const jobNumber = job.job_reference.replace('JOB-', '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ensure user data is loaded if needed
    initializeUserData();
  }, []);

  const initializeUserData = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();
    if (!userData) {
      await supabase.from('users').insert({
        id: user.id,
        name: user.user_metadata?.name || 'Unknown',
        bio: user.user_metadata?.bio || 'No bio available',
      });
    }
  };

  const handleApply = async () => {
    setLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        Alert.alert('Error', 'Please log in to apply.');
        return;
      }

      const { data: existing } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', job.id)
        .eq('applicant_id', user.id)
        .eq('status', 'pending');
      if (existing.length > 0) {
        Alert.alert('Already Applied', 'You have already applied for this job.');
        return;
      }

      const { error } = await supabase.from('applications').insert({
        job_id: job.id,
        applicant_id: user.id,
        status: 'pending',
      });
      if (error) throw error;

      Alert.alert('Success', 'Application submitted!');
      navigation.navigate('AppliedJobsScreen');
    } catch (error) {
      console.error('Apply error:', error.message);
      Alert.alert('Error', 'Failed to apply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <TouchableOpacity 
          style={styles.applyButton} 
          onPress={handleApply}
          disabled={loading}
        >
          <Text style={styles.applyText}>{loading ? 'Applying...' : 'Apply'}</Text>
        </TouchableOpacity>
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
  applyButton: { 
    marginTop: 20, 
    padding: 10, 
    backgroundColor: '#1E90FF', 
    borderRadius: 5, 
    alignItems: 'center',
    marginBottom: 10,
  },
  applyText: { color: '#fff', fontWeight: 'bold' },
  backButton: { 
    marginTop: 10, 
    padding: 10, 
    backgroundColor: '#1E90FF', 
    borderRadius: 5, 
    alignItems: 'center' 
  },
  backText: { color: '#fff', fontWeight: 'bold' },
});