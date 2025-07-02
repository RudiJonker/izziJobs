import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert, Platform } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../utils/supabaseClient';
import { UserContext } from '../contexts/UserContext';
import { styles } from '../theme/styles';

export default function PostingJobsScreen({ route, navigation }) {
  const { user, loading: contextLoading } = useContext(UserContext);
  const { userId } = route.params || {};
  const [jobData, setJobData] = useState({
    title: '', description: '', required_skills: [], start_date: new Date(), end_date: new Date(), salary: '', location: ''
  });
  const [hours, setHours] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [skillsModalVisible, setSkillsModalVisible] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const skillOptions = [
    'General Labour', 'Domestic House Work', 'Construction', 'Washing/Cleaning', 
    'Gardening', 'Roofing', 'Cabling', 'Painting', 'Other'
  ];

  useEffect(() => {
    calculateHours();
  }, [jobData.start_date, jobData.end_date]);

  const calculateHours = () => {
    if (jobData.start_date && jobData.end_date) {
      const diffMs = jobData.end_date.getTime() - jobData.start_date.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      setHours(Math.max(0, Math.round(diffHours * 100) / 100));
    }
  };

  const toggleSkill = (skill) => {
    setJobData(prev => ({
      ...prev,
      required_skills: prev.required_skills.includes(skill)
        ? prev.required_skills.filter(s => s !== skill)
        : [...prev.required_skills, skill]
    }));
  };

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) setJobData(prev => ({ ...prev, start_date: selectedDate }));
  };

  const onStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      const newStartDate = new Date(jobData.start_date);
      newStartDate.setHours(selectedTime.getHours());
      newStartDate.setMinutes(selectedTime.getMinutes());
      setJobData(prev => ({ ...prev, start_date: newStartDate }));
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) setJobData(prev => ({ ...prev, end_date: selectedDate }));
  };

  const onEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      const newEndDate = new Date(jobData.end_date);
      newEndDate.setHours(selectedTime.getHours());
      newEndDate.setMinutes(selectedTime.getMinutes());
      setJobData(prev => ({ ...prev, end_date: newEndDate }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!jobData.title.trim()) newErrors.title = 'Job title is required';
    if (!jobData.description.trim()) newErrors.description = 'Description is required';
    if (!jobData.location.trim()) newErrors.location = 'Location is required';
    if (!jobData.salary.trim()) newErrors.salary = 'Salary is required';
    if (jobData.required_skills.length === 0) newErrors.skills = 'At least one skill is required';
    if (jobData.end_date <= jobData.start_date) newErrors.endDate = 'End time must be after start time';
    return newErrors;
  };

  const postJob = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      if (contextLoading || !user) throw new Error('User not authenticated or still loading');
      const effectiveUserId = user.id;
      console.log('Posting job with userId:', effectiveUserId);
      const { data, error } = await supabase
        .from('jobs')
        .insert([
          {
            employer_id: effectiveUserId,
            title: jobData.title,
            description: jobData.description,
            required_skills: jobData.required_skills,
            location: jobData.location,
            salary: parseFloat(jobData.salary),
            start_datetime: jobData.start_date.toISOString(),
            end_datetime: jobData.end_date.toISOString(),
            hours: hours,
            status: 'open'
          }
        ])
        .select();
      if (error) throw error;
      Alert.alert('Success', 'Job posted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Post job error:', error.message);
      Alert.alert('Error', error.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.scrollContent, { justifyContent: 'center' }]}>
      <TextInput
        label="Job Title"
        value={jobData.title}
        onChangeText={(text) => {
          setJobData(prev => ({ ...prev, title: text }));
          if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
        }}
        style={styles.input}
        error={!!errors.title}
      />
      {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
      <TextInput
        label="Job Description"
        value={jobData.description}
        onChangeText={(text) => {
          setJobData(prev => ({ ...prev, description: text }));
          if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
        }}
        style={styles.input}
        multiline
        numberOfLines={4}
        error={!!errors.description}
      />
      {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
      <TextInput
        label="Job Location"
        value={jobData.location}
        onChangeText={(text) => {
          setJobData(prev => ({ ...prev, location: text }));
          if (errors.location) setErrors(prev => ({ ...prev, location: '' }));
        }}
        style={styles.input}
        error={!!errors.location}
      />
      {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
      <TouchableOpacity
        style={[styles.pickerContainer, errors.skills && { borderColor: 'red' }]}
        onPress={() => setSkillsModalVisible(true)}
      >
        <View style={styles.pickerRow}>
          <Text style={styles.pickerText}>
            {jobData.required_skills.length > 0 ? `${jobData.required_skills.length} skill(s) selected` : 'Select Required Skills'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#000" />
        </View>
      </TouchableOpacity>
      {errors.skills && <Text style={styles.errorText}>{errors.skills}</Text>}
      {jobData.required_skills.length > 0 && (
        <View style={styles.skillsContainer}>
          {jobData.required_skills.map((skill) => (
            <View key={skill} style={styles.skillCard}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      )}
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginVertical: 12, color: '#333' }}>Schedule</Text>
      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 14, marginBottom: 8, color: '#333' }}>Start Date & Time</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={[styles.pickerContainer, { flex: 1, marginRight: 8 }]}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={styles.pickerText}>{jobData.start_date.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pickerContainer, { flex: 1, marginLeft: 8 }]}
            onPress={() => setShowStartTimePicker(true)}
          >
            <Text style={styles.pickerText}>
              {jobData.start_date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 14, marginBottom: 8, color: '#333' }}>End Date & Time</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={[styles.pickerContainer, { flex: 1, marginRight: 8 }]}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={styles.pickerText}>{jobData.end_date.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pickerContainer, { flex: 1, marginLeft: 8 }]}
            onPress={() => setShowEndTimePicker(true)}
          >
            <Text style={styles.pickerText}>
              {jobData.end_date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {errors.endDate && <Text style={styles.errorText}>{errors.endDate}</Text>}
      <View style={[styles.pickerContainer, { backgroundColor: '#f0f0f0' }]}>
        <Text style={styles.pickerText}>Duration: {hours} hours</Text>
      </View>
      <TextInput
        label="Salary Amount"
        value={jobData.salary}
        onChangeText={(text) => {
          setJobData(prev => ({ ...prev, salary: text }));
          if (errors.salary) setErrors(prev => ({ ...prev, salary: '' }));
        }}
        style={styles.input}
        keyboardType="numeric"
        error={!!errors.salary}
      />
      {errors.salary && <Text style={styles.errorText}>{errors.salary}</Text>}
      <Button mode="contained" style={styles.saveButton} onPress={postJob} disabled={loading}>
        {loading ? 'Posting...' : 'Post Job'}
      </Button>
      <Modal
        animationType="fade"
        transparent
        visible={skillsModalVisible}
        onRequestClose={() => setSkillsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#333' }}>
              Select Required Skills
            </Text>
            <ScrollView style={styles.modalScroll}>
              {skillOptions.map((skill) => (
                <TouchableOpacity
                  key={skill}
                  style={styles.modalItem}
                  onPress={() => toggleSkill(skill)}
                >
                  <Text style={styles.modalItemText}>
                    {skill} {jobData.required_skills.includes(skill) ? '✓' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button mode="contained" onPress={() => setSkillsModalVisible(false)} style={styles.doneButton}>
              Done
            </Button>
          </View>
        </View>
      </Modal>
      {showStartDatePicker && (
        <DateTimePicker
          value={jobData.start_date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onStartDateChange}
          minimumDate={new Date()}
        />
      )}
      {showStartTimePicker && (
        <DateTimePicker
          value={jobData.start_date}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onStartTimeChange}
        />
      )}
      {showEndDatePicker && (
        <DateTimePicker
          value={jobData.end_date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onEndDateChange}
          minimumDate={new Date()}
        />
      )}
      {showEndTimePicker && (
        <DateTimePicker
          value={jobData.end_date}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onEndTimeChange}
        />
      )}
    </ScrollView>
  );
}