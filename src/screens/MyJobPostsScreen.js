import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { supabase } from '../utils/supabaseClient';
import { styles } from '../theme/styles';

export default function MyJobPostsScreen({ route, navigation }) {
  const { userId } = route.params || {};
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const effectiveUserId = userId || '73b5b857-2107-41f4-bce4-f6961fa2d285';
      const { data, error } = await supabase
        .from('jobs')
        .select('id, job_reference, title, description, required_skills, location, salary, start_datetime, end_datetime, hours, status')
        .eq('employer_id', effectiveUserId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch jobs: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleEditJob = (jobId) => {
    Alert.alert('Info', `Edit job with ID: ${jobId} (Edit screen not yet implemented)`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.scrollContent, { justifyContent: 'center' }]}>
      {loading ? (
        <Text style={{ textAlign: 'center', color: '#333' }}>Loading...</Text>
      ) : jobs.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#333' }}>No jobs posted yet.</Text>
      ) : (
        jobs.map((job) => (
          <Card key={job.id} style={[styles.input, { padding: 16, marginBottom: 16 }]}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>{job.title}</Text>
            <Text style={{ fontSize: 14, color: '#333', marginTop: 4 }}>Ref: {job.job_reference}</Text>
            <Text style={{ fontSize: 14, color: '#333', marginTop: 4 }}>Location: {job.location}</Text>
            <Text style={{ fontSize: 14, color: '#333', marginTop: 4 }}>Skills: {job.required_skills.join(', ')}</Text>
            <Text style={{ fontSize: 14, color: '#333', marginTop: 4 }}>Salary: {job.salary}</Text>
            <Text style={{ fontSize: 14, color: '#333', marginTop: 4 }}>
              Schedule: {new Date(job.start_datetime).toLocaleString()} - {new Date(job.end_datetime).toLocaleString()}
            </Text>
            <Text style={{ fontSize: 14, color: '#333', marginTop: 4 }}>Hours: {job.hours}</Text>
            <Text style={{ fontSize: 14, color: '#333', marginTop: 4 }}>Status: {job.status}</Text>
            <Button
              mode="contained"
              style={[styles.saveButton, { marginTop: 12 }]}
              onPress={() => handleEditJob(job.id)}
            >
              Edit Job
            </Button>
          </Card>
        ))
      )}
    </ScrollView>
  );
}