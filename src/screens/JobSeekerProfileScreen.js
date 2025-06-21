import * as React from 'react';
import { View, Text, ScrollView, Image, Alert, Platform, TouchableOpacity, Modal } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../utils/supabaseClient';
import { Alert as RNAlert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../theme/styles';

export default function JobSeekerProfileScreen({ route }) {
  const { userId } = route.params || {};
  const navigation = useNavigation();
  const [profile, setProfile] = useState({ name: '', phone: '', location: '', profile_pic: null, skills: [], bio: '' });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const skillOptions = [
    'General Labour', 'Domestic House Work', 'Construction', 'Washing/Cleaning', 'Gardening', 'Roofing', 'Cabling', 'Painting', 'Other',
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const effectiveUserId = userId || '73b5b857-2107-41f4-bce4-f6961fa2d285';
      const { data, error } = await supabase
        .from('users')
        .select('name, mobile_number, location, profile_pic, skills, bio')
        .eq('id', effectiveUserId)
        .single();
      if (error) console.log('Error fetching profile:', error.message);
      else {
        console.log('Fetched profile data:', data);
        setProfile({
          name: data?.name || '',
          phone: data?.mobile_number || '',
          location: data?.location || '',
          profile_pic: data?.profile_pic ? data.profile_pic : null,
          skills: data?.skills || [],
          bio: data?.bio || '',
        });
        if (data.profile_pic) {
          const fileName = data.profile_pic.split('/').pop();
          const { data: urlData, error: urlError } = await supabase.storage
            .from('profiles')
            .createSignedUrl(data.profile_pic, 60 * 60);
          if (urlError) {
            console.log('Signed URL Error:', urlError.message);
            setProfile((prev) => ({ ...prev, profile_pic: null }));
          } else {
            setProfile((prev) => ({ ...prev, profile_pic: urlData.signedUrl }));
          }
        }
      }
      setLoading(false);
    };
    fetchProfile();
    if (Platform.OS !== 'web') {
      ImagePicker.requestMediaLibraryPermissionsAsync().then(({ status }) => {
        if (status !== 'granted') Alert.alert('Permission Required', 'Please allow access to your photos.');
      });
    }
  }, [userId]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.5 });
    if (!result.canceled) {
      setLoading(true);
      try {
        const file = result.assets[0];
        const fileUri = file.uri;
        console.log('Selected image URI:', fileUri);
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        console.log('Original file size:', fileInfo.size, 'bytes');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) throw new Error('No active session');
        const effectiveUserId = userId || '73b5b857-2107-41f4-bce4-f6961fa2d285';
        const fileName = `${effectiveUserId}/profile-pic-${Date.now()}.jpg`;
        const fileExt = fileUri.split('.').pop().toLowerCase();
        const mimeType = fileExt === 'jpg' || fileExt === 'jpeg' ? 'image/jpeg' : fileExt === 'png' ? 'image/png' : 'image/jpeg';
        console.log('Uploading to Supabase with MIME type:', mimeType);

        const uploadResponse = await FileSystem.uploadAsync(
          `https://hceoednqxvubealrjhkf.supabase.co/storage/v1/object/profiles/${fileName}`,
          fileUri,
          { headers: { 'Content-Type': mimeType, 'Authorization': `Bearer ${session.access_token}` }, httpMethod: 'PUT', uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT }
        );
        if (uploadResponse.status !== 200) throw new Error(`Upload failed: ${uploadResponse.body}`);
        console.log('Upload successful, response:', uploadResponse.body);
        const { data: urlData, error: signedUrlError } = await supabase.storage.from('profiles').createSignedUrl(fileName, 60 * 60);
        if (signedUrlError) throw new Error('Failed to generate signed URL');
        console.log('Signed URL:', urlData.signedUrl);
        await supabase.from('users').update({ profile_pic: fileName }).eq('id', effectiveUserId);
        setProfile((prev) => ({ ...prev, profile_pic: urlData.signedUrl }));
        RNAlert.alert('Success', 'Profile picture uploaded!');
      } catch (error) {
        console.log('Image Pick Error:', error.message);
        RNAlert.alert('Error', `Network request failed: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!profile.name.trim()) newErrors.name = 'Name is required';
    if (!profile.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\+?[1-9]\d{9,14}$/.test(profile.phone)) newErrors.phone = 'Invalid phone number';
    if (!profile.location.trim()) newErrors.location = 'Targeted Job Location is required';
    return newErrors;
  };

  const saveProfile = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    console.log('Saving profile with:', { name: profile.name, phone: profile.phone, location: profile.location, skills: profile.skills, bio: profile.bio });
    try {
      const effectiveUserId = userId || '73b5b857-2107-41f4-bce4-f6961fa2d285';
      const { data, error } = await supabase
        .from('users')
        .update({ name: profile.name, mobile_number: profile.phone, location: profile.location, skills: profile.skills, bio: profile.bio })
        .eq('id', effectiveUserId)
        .select();
      if (error) {
        console.log('Supabase update error:', error.message, error.code, error.details);
        throw error;
      }
      console.log('Profile updated successfully:', data);
      RNAlert.alert('Success', 'Profile updated!');
    } catch (error) {
      RNAlert.alert('Error', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      RNAlert.alert('Error', error.message);
    }
  };

  const toggleSkill = (skill) => {
    setProfile((prev) =>
      prev.skills.includes(skill)
        ? { ...prev, skills: prev.skills.filter((s) => s !== skill) }
        : { ...prev, skills: [...prev.skills, skill] }
    );
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.scrollContent, { justifyContent: 'center' }]}>
      {/* Removed <Text style={styles.title}>Job Seeker Profile</Text> */}
      <TouchableOpacity onPress={pickImage} style={styles.profilePicContainer}>
        <Image
          source={profile.profile_pic ? { uri: profile.profile_pic } : { uri: '../../assets/default-avatar.png' }}
          style={styles.profilePic}
          onError={(e) => console.log('Image Load Error:', e.nativeEvent.error)}
        />
      </TouchableOpacity>
      <TextInput
        label="Name"
        value={profile.name}
        onChangeText={(text) => { setProfile({ ...profile, name: text }); if (errors.name) setErrors({ ...errors, name: '' }); }}
        style={styles.input}
        error={!!errors.name}
      />
      {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
      <TextInput
        label="Phone Number"
        value={profile.phone}
        onChangeText={(text) => { setProfile({ ...profile, phone: text }); if (errors.phone) setErrors({ ...errors, phone: '' }); }}
        style={styles.input}
        keyboardType="phone-pad"
        error={!!errors.phone}
      />
      {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
      <TextInput
        label="Targeted Job Location"
        value={profile.location}
        onChangeText={(text) => { setProfile({ ...profile, location: text }); if (errors.location) setErrors({ ...errors, location: '' }); }}
        style={styles.input}
        error={!!errors.location}
      />
      {errors.location ? <Text style={styles.errorText}>{errors.location}</Text> : null}
      <TouchableOpacity
        style={styles.pickerContainer}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.pickerRow}>
          <Text style={styles.pickerText}>
            {profile.skills.length > 0 ? `${profile.skills.length} skill(s) selected` : 'Select Skills'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#000000" />
        </View>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView style={styles.modalScroll}>
              {skillOptions.map((skill) => (
                <TouchableOpacity
                  key={skill}
                  style={styles.modalItem}
                  onPress={() => toggleSkill(skill)}
                >
                  <Text style={styles.modalItemText}>
                    {skill} {profile.skills.includes(skill) ? '✓' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button mode="contained" onPress={() => setModalVisible(false)} style={styles.doneButton}>
              Done
            </Button>
          </View>
        </View>
      </Modal>
      <View style={styles.skillsContainer}>
        {profile.skills.map((skill) => (
          <View key={skill} style={styles.skillCard}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>
      <TextInput
        label="Bio (optional)"
        value={profile.bio}
        onChangeText={(text) => setProfile({ ...profile, bio: text })}
        style={styles.input}
        multiline
        numberOfLines={4}
      />
      <Button mode="contained" style={styles.saveButton} onPress={saveProfile} accessibilityLabel="Save profile">
        Save
      </Button>
      <Button mode="outlined" style={styles.logoutButton} onPress={handleLogout} accessibilityLabel="Logout">
        Logout
      </Button>
    </ScrollView>
  );
}