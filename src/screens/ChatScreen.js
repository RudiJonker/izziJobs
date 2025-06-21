import * as React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../utils/supabaseClient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from '../theme/styles'; // Ensure this file exists

export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { jobId, jobSeekerId, jobTitle } = route.params || {};
  const [message, setMessage] = React.useState('');
  const [locationLink, setLocationLink] = React.useState('');
  const [messages, setMessages] = React.useState([]); // Placeholder for your message data
  const [canChat, setCanChat] = React.useState(false);
  const [jobCompleted, setJobCompleted] = React.useState(false);

  React.useEffect(() => {
    const checkJobStatus = async () => {
      const { data } = await supabase
        .from('jobs')
        .select('status')
        .eq('id', jobId)
        .single();
      if (data) {
        setCanChat(data.status === 'accepted' || data.status === 'completed');
        setJobCompleted(data.status === 'completed');
      }
    };
    checkJobStatus();

    // Placeholder: Fetch messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: true });
      setMessages(data || []);
    };
    fetchMessages();
  }, [jobId]);

  const sendMessage = async () => {
    if (!message && !locationLink || !canChat) return;
    const { data: { user } } = await supabase.auth.getUser();
    const content = locationLink ? `Location: ${locationLink}` : message;
    const { error } = await supabase
      .from('messages')
      .insert({ job_id: jobId, sender_id: user.id, content });
    if (error) console.log('Message error:', error.message);
    else {
      setMessage('');
      setLocationLink('');
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: true });
      setMessages(data || []);
    }
  };

  const sendLocation = async () => {
    if (!canChat) return;
    // Simulate pin drop (replace with actual geolocation or manual input)
    const latitude = -26.2041; // Example: Pretoria, SA
    const longitude = 28.0473;
    // Generate Google Maps URL (WhatsApp-style)
    const googleMapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
    // Optionally, save to job_locations (if needed)
    await supabase
      .from('job_locations')
      .insert({ job_id: jobId, latitude, longitude });
    setLocationLink(googleMapsLink);
  };

  return (
    <View style={styles.container}>
      {canChat ? (
        <>
          <ScrollView style={styles.chatContainer}>
            {messages.map((msg, index) => (
              <Text key={index} style={styles.message}>
                {msg.content}
              </Text>
            ))}
          </ScrollView>
          <View style={styles.inputContainer}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              style={styles.input}
              placeholder="Type a message..."
              editable={canChat}
            />
            <TouchableOpacity onPress={sendMessage} disabled={!canChat}>
              <Ionicons name="send" size={24} color={canChat ? '#48d22b' : '#ccc'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={sendLocation} disabled={!canChat}>
              <Ionicons name="location" size={24} color={canChat ? '#48d22b' : '#ccc'} />
            </TouchableOpacity>
            {jobCompleted && (
              <TouchableOpacity
                onPress={() => navigation.navigate('Rating', { jobSeekerId, jobTitle })}
                style={styles.ratingButton}
              >
                <Ionicons name="star" size={24} color="#ffd700" />
                <Text>Rate Job</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : (
        <Text>Chat unavailable until job is accepted.</Text>
      )}
    </View>
  );
}