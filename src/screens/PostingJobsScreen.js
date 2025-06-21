import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../theme/styles'; // Updated path

export default function PostingJobsScreen({ route }) {
  const { userId } = route.params;
  return (
    <View style={styles.container}>
      <Text>Post a Job (User ID: {userId})</Text>
    </View>
  );
}