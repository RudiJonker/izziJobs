import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utils/supabaseClient';

export default function DashboardScreen({ route }) {
  const { userId, role } = route.params || {};
  const navigation = useNavigation();
  const [appliedCount, setAppliedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppliedCount();
  }, [userId]);

  const fetchAppliedCount = async () => {
    setLoading(true);
    const user = (await supabase.auth.getUser()).data.user;
    if (!user || role !== 'employer') return;

    try {
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id')
        .eq('employer_id', user.id);
      if (jobsError) throw jobsError;

      const jobIds = jobs.map(job => job.id);
      if (jobIds.length === 0) {
        setAppliedCount(0);
        return;
      }

      const { count, error } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .in('job_id', jobIds)
        .eq('status', 'pending');
      if (error) throw error;

      setAppliedCount(count || 0);
    } catch (error) {
      console.error('Error fetching applied count:', error.message);
      setAppliedCount(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          {role === 'job_seeker' && (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('AppliedJobsScreen')}
            >
              <Text style={styles.cardTitle}>Applied Jobs</Text>
              <Text style={styles.cardText}>6 Applications</Text> {/* Static for now, will update dynamically */}
            </TouchableOpacity>
          )}
          {role === 'employer' && (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('ApplicantsScreen')}
            >
              <Text style={styles.cardTitle}>Applicants</Text>
              <Text style={styles.cardText}>{appliedCount} Applications</Text>
            </TouchableOpacity>
          )}
          {/* Other existing cards can remain as placeholders or functional links */}
          <TouchableOpacity style={styles.card} onPress={() => {}}>
            <Text style={styles.cardTitle}>Weather</Text>
            <Text style={styles.cardText}>Placeholder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => {}}>
            <Text style={styles.cardTitle}>Calendar</Text>
            <Text style={styles.cardText}>Placeholder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => {}}>
            <Text style={styles.cardTitle}>Earnings</Text>
            <Text style={styles.cardText}>Placeholder</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardText: { fontSize: 16, color: '#666' },
});