import React, { useContext, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserContext } from '../contexts/UserContext';
import { styles } from '../theme/styles';

const dashboardStyles = StyleSheet.create({
  card: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    width: 95,
    height: 95,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    marginBottom: 4,
  },
  itemText: {
    fontSize: 11,
    textAlign: 'center',
  },
  starRating: {
    flexDirection: 'row',
    marginTop: 4,
  },
  banner: {
    height: 40,
    backgroundColor: '#48d22b',
    justifyContent: 'center',
    paddingHorizontal: 0,
    width: Dimensions.get('window').width,
    position: 'absolute',
    top: 30,
    left: 0,
    zIndex: 1,
  },
  bannerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default function DashboardScreen({ navigation }) {
  const { user } = useContext(UserContext);
  const isJobSeeker = user?.user_metadata?.role === 'job_seeker';
  const isEmployer = user?.user_metadata?.role === 'employer';
  const rating = 3; // Placeholder rating
  const scrollX = useRef(new Animated.Value(Dimensions.get('window').width)).current;
  const screenWidth = Dimensions.get('window').width;
  const textWidth = screenWidth * 3.5;

  useEffect(() => {
    const duration = 25000; // 25 seconds for slower scrolling
    const animate = () => {
      scrollX.setValue(screenWidth);
      Animated.timing(scrollX, {
        toValue: -textWidth,
        duration,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start(() => animate());
    };
    animate();
  }, [scrollX, textWidth, screenWidth]);

  const jobSeekerBannerText = 'You are in the Top 10% of job Seekers in your community with 247 points - keep up the good work! ...... 123623 IzziJobs Users worldwide and growing!';
  const employerBannerText = 'You are managing top jobs in your community with 150 points - keep it up! ...... 123623 IzziJobs Users worldwide and growing!';

  if (isJobSeeker) {
    return (
      <View style={[styles.container, { backgroundColor: '#f5f7fa', flex: 1 }]}>
        <View style={dashboardStyles.banner}>
          <Animated.View style={{ transform: [{ translateX: scrollX }], width: textWidth }}>
            <Text style={dashboardStyles.bannerText} numberOfLines={1}>{jobSeekerBannerText}</Text>
          </Animated.View>
        </View>
        <ScrollView style={{ flex: 1, marginTop: 70 }} contentContainerStyle={[styles.scrollContent, { paddingHorizontal: 10 }]}>
          {/* Top Row: Rank, Rating */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 }}>
            <View style={dashboardStyles.card}>
              <Icon name="crown" size={35} color="#333" style={dashboardStyles.icon} />
              <Text style={dashboardStyles.itemText}>Rank</Text>
            </View>
            <View style={dashboardStyles.card}>
              <Icon name="star" size={35} color="#ff9800" style={dashboardStyles.icon} />
              <Text style={dashboardStyles.itemText}>Rating</Text>
              <View style={dashboardStyles.starRating}>
                {Array(5).fill().map((_, i) => (
                  <Icon key={i} name={i < rating ? 'star' : 'star-outline'} size={15} color="#ff9800" />
                ))}
              </View>
            </View>
          </View>

          {/* Second Row: Weather, Calendar */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 }}>
            <TouchableOpacity onPress={() => navigation.navigate('WeatherScreen')}>
              <View style={dashboardStyles.card}>
                <Icon name="weather-partly-cloudy" size={35} color="#ffeb3b" style={dashboardStyles.icon} />
                <Text style={dashboardStyles.itemText}>Weather</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('CalendarScreen')}>
              <View style={dashboardStyles.card}>
                <Icon name="calendar" size={35} color="#4caf50" style={dashboardStyles.icon} />
                <Text style={dashboardStyles.itemText}>Calendar</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Third Row: Unread, Earnings */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 }}>
            <View style={dashboardStyles.card}>
              <Icon name="chat" size={35} color="#007bff" style={dashboardStyles.icon} />
              <Text style={dashboardStyles.itemText}>Unread: 2</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('EarningsStatementScreen')}>
              <View style={dashboardStyles.card}>
                <Icon name="bank" size={35} color="#6a1b9a" style={dashboardStyles.icon} />
                <Text style={dashboardStyles.itemText}>2513</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Bottom Row: Jobs, Applied */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <TouchableOpacity onPress={() => navigation.navigate('ListOfJobsScreen')}>
              <View style={dashboardStyles.card}>
                <Icon name="briefcase" size={35} color="#ff4500" style={dashboardStyles.icon} />
                <Text style={dashboardStyles.itemText}>Jobs</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('AppliedJobsScreen')}>
              <View style={dashboardStyles.card}>
                <Icon name="file-document" size={35} color="#48d22b" style={dashboardStyles.icon} />
                <Text style={dashboardStyles.itemText}>Applied</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (isEmployer) {
    return (
      <View style={[styles.container, { backgroundColor: '#f5f7fa', flex: 1 }]}>
        <View style={dashboardStyles.banner}>
          <Animated.View style={{ transform: [{ translateX: scrollX }], width: textWidth }}>
            <Text style={dashboardStyles.bannerText} numberOfLines={1}>{employerBannerText}</Text>
          </Animated.View>
        </View>
        <ScrollView style={{ flex: 1, marginTop: 70 }} contentContainerStyle={[styles.scrollContent, { paddingHorizontal: 10 }]}>
          {/* Top Row: Weather, Calendar */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 }}>
            <TouchableOpacity onPress={() => navigation.navigate('WeatherScreen')}>
              <View style={dashboardStyles.card}>
                <Icon name="weather-partly-cloudy" size={35} color="#ffeb3b" style={dashboardStyles.icon} />
                <Text style={dashboardStyles.itemText}>Weather</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('CalendarScreen')}>
              <View style={dashboardStyles.card}>
                <Icon name="calendar" size={35} color="#4caf50" style={dashboardStyles.icon} />
                <Text style={dashboardStyles.itemText}>Calendar</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Second Row: Unread, Rating */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 }}>
            <View style={dashboardStyles.card}>
              <Icon name="chat" size={35} color="#007bff" style={dashboardStyles.icon} />
              <Text style={dashboardStyles.itemText}>Unread: 2</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('RatingScreen')}>
              <View style={dashboardStyles.card}>
                <Icon name="star" size={35} color="#ff9800" style={dashboardStyles.icon} />
                <Text style={dashboardStyles.itemText}>Rating</Text>
                <View style={dashboardStyles.starRating}>
                  {Array(5).fill().map((_, i) => (
                    <Icon key={i} name={i < rating ? 'star' : 'star-outline'} size={15} color="#ff9800" />
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Third Row: Salaries, Question Mark */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 }}>
            <TouchableOpacity onPress={() => navigation.navigate('SalariesPaid')}>
              <View style={dashboardStyles.card}>
                <Icon name="cash" size={35} color="#6a1b9a" style={dashboardStyles.icon} />
                <Text style={dashboardStyles.itemText}>Salaries</Text>
              </View>
            </TouchableOpacity>
            <View style={dashboardStyles.card}>
              <Icon name="help" size={35} color="#333" style={dashboardStyles.icon} />
              <Text style={dashboardStyles.itemText}>?</Text>
            </View>
          </View>

          {/* Bottom Row: Job Posts, Applicants */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <TouchableOpacity onPress={() => navigation.navigate('PostingJobsScreen')}>
              <View style={dashboardStyles.card}>
                <Icon name="briefcase" size={35} color="#48d22b" style={dashboardStyles.icon} />
                <Text style={dashboardStyles.itemText}>Job Posts</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ApplicantsScreen')}>
              <View style={dashboardStyles.card}>
                <Icon name="account-group" size={35} color="#ff4500" style={dashboardStyles.icon} />
                <Text style={dashboardStyles.itemText}>Applicants</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#f5f7fa', flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
      <Text>Role not recognized. Please log in or check user metadata.</Text>
    </View>
  );
}