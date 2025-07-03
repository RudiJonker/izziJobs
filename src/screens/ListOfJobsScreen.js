import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utils/supabaseClient';

export default function ListOfJobsScreen({ route }) {
  const { userId } = route.params || {};
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('jobs').select('*');
    if (error) console.error('Error fetching jobs:', error.message);
    else setJobs(data || []);
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('JobDetailScreen', { job: item })}>
      <View style={styles.jobItem}>
        <Text>{item.title}: R{item.salary}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={jobs}
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