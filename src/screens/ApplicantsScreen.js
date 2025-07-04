import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utils/supabaseClient';

export default function ApplicantsScreen({ route }) {
  const { userId } = route.params || {};
  const [applicants, setApplicants] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null); // Track the open card
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchApplicants();
  }, [userId]);

  const fetchApplicants = async () => {
    setLoading(true);
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    try {
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id')
        .eq('employer_id', user.id);
      if (jobsError) throw jobsError;

      const jobIds = jobs.map(job => job.id);
      if (jobIds.length === 0) {
        setApplicants([]);
        return;
      }

      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select('id, job_id, status, jobs (job_reference), applicant_id')
        .in('job_id', jobIds)
        .eq('status', 'pending');
      if (applicationsError) throw applicationsError;

      if (applicationsData && applicationsData.length > 0) {
        const userIds = applicationsData.map(app => app.applicant_id);
        const { data: usersData, error: usersError, status } = await supabase
          .from('users')
          .select('id, name, bio, profile_pic')
          .in('id', userIds);
        if (usersError) console.error('Users query error:', usersError.message);
        console.log('Fetched users data:', JSON.stringify(usersData, null, 2));

        let usersMap = {};
        if (usersData) {
          const usersWithSignedUrls = await Promise.all(usersData.map(async (user) => {
            let signedUrl = null;
            try {
              const { data, error } = await supabase.storage
                .from('profiles')
                .createSignedUrl(user.profile_pic, 3600); // URL valid for 1 hour
              if (error) {
                console.error(`Signed URL error for ${user.profile_pic}:`, error.message);
              } else {
                signedUrl = data?.signedUrl;
              }
            } catch (err) {
              console.error(`Unexpected error for ${user.profile_pic}:`, err.message);
            }
            return { ...user, signedUrl };
          }));
          usersMap = usersWithSignedUrls.reduce((acc, user) => ({
            ...acc,
            [user.id]: user,
          }), {});
        }
        console.log('Users map:', JSON.stringify(usersMap, null, 2));

        const enrichedData = applicationsData.map(app => ({
          ...app,
          users: usersMap[app.applicant_id] || null,
        }));
        console.log('Enriched applicants data:', JSON.stringify(enrichedData, null, 2));
        setApplicants(enrichedData);
      } else {
        setApplicants([]);
      }
    } catch (error) {
      console.error('Error fetching applicants:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const user = item.users || {};
    const rating = '☆☆☆☆☆';
    const name = user.name || 'Unknown';
    const bio = user.bio || 'No bio available';
    const jobRef = item.jobs?.job_reference || 'N/A';
    const profilePicUrl = user.signedUrl ? { uri: user.signedUrl } : null;

    return (
      <View>
        <TouchableOpacity onPress={() => setExpandedItem(item)} style={styles.item}>
          <Text>{rating} {name} - {jobRef}</Text>
        </TouchableOpacity>
        {expandedItem === item && (
          <View style={styles.card}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setExpandedItem(null)}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            {profilePicUrl && <Image source={profilePicUrl} style={styles.profilePic} />}
            <Text style={styles.cardText}>{name}</Text>
            <Text style={styles.cardText}>{bio}</Text>
            <Text style={styles.cardText}>{item.status}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : applicants.length === 0 ? (
        <Text>No applicants yet.</Text>
      ) : (
        <FlatList
          data={applicants}
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
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  card: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
  },
  closeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
  profilePic: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  cardText: { fontSize: 16, marginVertical: 5 },
  backButton: { marginTop: 20, padding: 10, backgroundColor: '#1E90FF', borderRadius: 5, alignItems: 'center', marginHorizontal: 20 },
  backText: { color: '#fff', fontWeight: 'bold' },
});