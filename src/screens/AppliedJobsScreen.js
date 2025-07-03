import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utils/supabaseClient';

export default function AppliedJobsScreen({ route }) {
  const { userId } = route.params || {};
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchAppliedJobs();
  }, [userId]);

  const fetchAppliedJobs = async () => {
    setLoading(true);
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    try {
      const { data: applications, error: appError } = await supabase
        .from('applications')
        .select('job_id')
        .eq('applicant_id', user.id)
        .eq('status', 'pending');
      if (appError) throw appError;

      const jobIds = applications.map(app => app.job_id);
      const { data: jobs, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .in('id', jobIds);
      if (jobError) throw jobError;

      setAppliedJobs(jobs || []);
    } catch (error) {
      console.error('Error fetching applied jobs:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('AppliedJobDetailScreen', { job: item })}>
      <View style={styles.jobItem}>
        <Text>{item.title}: R{item.salary}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : appliedJobs.length === 0 ? (
        <Text>No applied jobs yet.</Text>
      ) : (
        <FlatList
          data={appliedJobs}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Dashboard')}>
        <Text style={styles.backText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10 },
  list: { paddingBottom: 20 },
  jobItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  backButton: { marginTop: 20, padding: 10, backgroundColor: '#1E90FF', borderRadius: 5, alignItems: 'center', marginHorizontal: 20 }, // Added marginHorizontal: 20
  backText: { color: '#fff', fontWeight: 'bold' },
});