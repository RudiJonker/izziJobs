import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../theme/styles';

export default function PostingJobsScreen({ route }) {
  const { userId } = route.params || {};
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currency, setCurrency] = useState('ZAR');

  const skillOptions = [
    'General Labour',
    'Domestic House Work',
    'Construction',
    'Washing/Cleaning',
    'Gardening',
    'Roofing',
    'Cabling',
    'Painting',
    'Other',
  ];

  useEffect(() => {
    if (userId) {
      const countryCode = '+27'; // Hardcoded for testing
      setCurrency(countryCode === '+27' ? 'ZAR' : '$');
    }
  }, [userId]);

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Post a New Job</Text>
      <TextInput
        style={[styles.input, { width: '100%' }]}
        placeholder="Job Title"
        value="Test Job"
      />
      <TouchableOpacity
        style={styles.pickerContainer}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.pickerRow}>
          <Text style={styles.pickerText}>
            {selectedSkills.length > 0 ? `${selectedSkills.length} skill(s) selected` : 'Select Skills'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#000000" />
        </View>
      </TouchableOpacity>
      <TextInput
        style={[styles.input, { width: '100%' }]}
        placeholder="Description"
        value="Test description"
      />
      <TextInput
        style={[styles.input, { width: '100%' }]}
        placeholder="Location"
        value="Beacon Bay"
      />
      <TextInput
        style={[styles.input, { width: '100%' }]}
        placeholder={`Pay (e.g., ${currency}50)`}
        value={`${currency}50`}
      />
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
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
                      {skill} {selectedSkills.includes(skill) ? '✓' : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <TouchableOpacity
        style={[styles.saveButton, { width: '100%', alignItems: 'center' }]}
        onPress={() => console.log('Job submitted with ID: 12345')}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Submit Job</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}