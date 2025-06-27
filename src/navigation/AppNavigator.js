import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserContext } from '../contexts/UserContext';
import WelcomeScreen from '../screens/WelcomeScreen';
import AuthScreen from '../screens/AuthScreen';
import JobSeekerProfileScreen from '../screens/JobSeekerProfileScreen';
import EmployerProfileScreen from '../screens/EmployerProfileScreen';
import ListOfJobsScreen from '../screens/ListOfJobsScreen';
import AppliedJobsScreen from '../screens/AppliedJobsScreen';
import ChatScreen from '../screens/ChatScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import WeatherScreen from '../screens/WeatherScreen';
import CalendarScreen from '../screens/CalendarScreen';
import EarningsStatementScreen from '../screens/EarningsStatementScreen';
import PostingJobsScreen from '../screens/PostingJobsScreen';
import ApplicantsScreen from '../screens/ApplicantsScreen';
import RatingScreen from '../screens/RatingScreen';
import SalariesPaid from '../screens/SalariesPaid'; // Added

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function MainTabs({ route }) {
  const { userId, role } = route.params || { userId: null, role: 'job_seeker' };
  console.log('MainTabs userId:', userId, 'role:', role);
  return (
    <Tab.Navigator
      activeColor="#48d22b"
      inactiveColor="#666"
      barStyle={{ backgroundColor: 'transparent', borderTopWidth: 1, borderTopColor: '#ccc' }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        initialParams={{ userId }}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        initialParams={{ userId }}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color }) => <Icon name="chat" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={role === 'job_seeker' ? JobSeekerProfileScreen : EmployerProfileScreen}
        initialParams={{ userId }}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Icon name="account" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        initialParams={{ userId }}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => <Icon name="cog" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Share"
        component={SettingsScreen}
        initialParams={{ userId }}
        options={{
          tabBarLabel: 'Share',
          tabBarIcon: ({ color }) => <Icon name="share" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading: authLoading } = React.useContext(UserContext);
  console.log('AppNavigator user:', user, 'authLoading:', authLoading);

  if (authLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Main' : 'Welcome'}>
        {!user ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Auth" component={AuthScreen} options={{ title: 'Sign Up / Log In' }} />
          </>
        ) : (
          <Stack.Screen
            name="Main"
            component={MainTabs}
            initialParams={{ userId: user.id, role: user.user_metadata.role || 'job_seeker' }}
            options={{ headerShown: false }}
          />
        )}
        <Stack.Screen name="ListOfJobsScreen" component={ListOfJobsScreen} options={{ title: 'Available Jobs' }} />
        <Stack.Screen name="AppliedJobsScreen" component={AppliedJobsScreen} options={{ title: 'Applied Jobs' }} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: 'Chat' }} />
        <Stack.Screen name="WeatherScreen" component={WeatherScreen} options={{ title: 'Weather' }} />
        <Stack.Screen name="CalendarScreen" component={CalendarScreen} options={{ title: 'Calendar' }} />
        <Stack.Screen name="EarningsStatementScreen" component={EarningsStatementScreen} options={{ title: 'Earnings' }} />
        <Stack.Screen name="PostingJobsScreen" component={PostingJobsScreen} options={{ title: 'Post a Job' }} />
        <Stack.Screen name="ApplicantsScreen" component={ApplicantsScreen} options={{ title: 'Applicants' }} />
        <Stack.Screen name="RatingScreen" component={RatingScreen} options={{ title: 'Rating' }} />
        <Stack.Screen name="SalariesPaid" component={SalariesPaid} options={{ title: 'Salaries Paid' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}