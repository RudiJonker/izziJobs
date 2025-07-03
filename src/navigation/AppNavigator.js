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
import AppliedJobsScreen from '../screens/AppliedJobsScreen'; // Add this import
import AppliedJobDetailScreen from '../screens/AppliedJobDetailScreen'; // Add this import
import ChatScreen from '../screens/ChatScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import WeatherScreen from '../screens/WeatherScreen';
import CalendarScreen from '../screens/CalendarScreen';
import EarningsStatementScreen from '../screens/EarningsStatementScreen';
import PostingJobsScreen from '../screens/PostingJobsScreen';
import ApplicantsScreen from '../screens/ApplicantsScreen';
import RatingScreen from '../screens/RatingScreen';
import SalariesPaid from '../screens/SalariesPaid';
import MyJobPostsScreen from '../screens/MyJobPostsScreen';
import JobDetailScreen from '../screens/JobDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function HomeStack({ userId, role }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        initialParams={{ userId, role }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ListOfJobsScreen"
        component={ListOfJobsScreen}
        initialParams={{ userId }}
        options={{ title: 'Available Jobs' }}
      />
      <Stack.Screen
        name="AppliedJobsScreen" // Add this screen
        component={AppliedJobsScreen}
        initialParams={{ userId }}
        options={{ title: 'Applied Jobs' }}
      />
      <Stack.Screen
        name="AppliedJobDetailScreen" // Add this screen
        component={AppliedJobDetailScreen}
        options={{ title: 'Applied Job Details' }}
      />
      <Stack.Screen
        name="WeatherScreen"
        component={WeatherScreen}
        initialParams={{ userId }}
        options={{ title: 'Weather' }}
      />
      <Stack.Screen
        name="CalendarScreen"
        component={CalendarScreen}
        initialParams={{ userId }}
        options={{ title: 'Calendar' }}
      />
      <Stack.Screen
        name="EarningsStatementScreen"
        component={EarningsStatementScreen}
        initialParams={{ userId }}
        options={{ title: 'Earnings' }}
      />
      <Stack.Screen
        name="PostingJobsScreen"
        component={PostingJobsScreen}
        initialParams={{ userId }}
        options={{ title: 'Post a Job' }}
      />
      <Stack.Screen
        name="ApplicantsScreen"
        component={ApplicantsScreen}
        initialParams={{ userId }}
        options={{ title: 'Applicants' }}
      />
      <Stack.Screen
        name="RatingScreen"
        component={RatingScreen}
        initialParams={{ userId }}
        options={{ title: 'Rating' }}
      />
      <Stack.Screen
        name="SalariesPaid"
        component={SalariesPaid}
        initialParams={{ userId }}
        options={{ title: 'Salaries Paid' }}
      />
      <Stack.Screen
        name="MyJobPosts"
        component={MyJobPostsScreen}
        initialParams={userId}
        options={{ title: 'My Jobs' }}
      />
      <Stack.Screen
        name="JobDetailScreen"
        component={JobDetailScreen}
        initialParams={{ userId }}
        options={{ title: 'Job Details' }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack({ userId, role }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={role === 'job_seeker' ? JobSeekerProfileScreen : EmployerProfileScreen}
        initialParams={{ userId }}
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
}

function ChatStack({ userId }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        initialParams={{ userId }}
        options={{ title: 'Chat' }}
      />
    </Stack.Navigator>
  );
}

function SettingsStack({ userId }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        initialParams={{ userId }}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
}

function ShareStack({ userId }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ShareScreen"
        component={SettingsScreen}
        initialParams={{ userId }}
        options={{ title: 'Share' }}
      />
    </Stack.Navigator>
  );
}

function MainTabs({ route }) {
  const { userId, role } = route?.params || {};
  const fallbackUserId = route?.params?.user?.id || userId;
  const fallbackRole = route?.params?.user?.user_metadata?.role || role || 'job_seeker';
  console.log('MainTabs userId:', fallbackUserId, 'role:', fallbackRole);

  return (
    <Tab.Navigator
      activeColor="#48d22b"
      inactiveColor="#666"
      barStyle={{ backgroundColor: 'transparent', borderTopWidth: 1, borderTopColor: '#ccc' }}
    >
      <Tab.Screen
        name="Home"
        children={() => <HomeStack userId={fallbackUserId} role={fallbackRole} />}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Chat"
        children={() => <ChatStack userId={fallbackUserId} />}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color }) => <Icon name="chat" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        children={() => <ProfileStack userId={fallbackUserId} role={fallbackRole} />}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Icon name="account" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        children={() => <SettingsStack userId={fallbackUserId} />}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => <Icon name="cog" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Share"
        children={() => <ShareStack userId={fallbackUserId} />}
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
      <Stack.Navigator initialRouteName={user ? 'MainTabs' : 'Welcome'}>
        {!user ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Auth" component={AuthScreen} options={{ title: 'Sign Up / Log In' }} />
          </>
        ) : (
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            initialParams={{ user }}
            options={{ headerShown: false }}
          />
        )}
        <Stack.Screen
          name="Main"
          component={MainTabs}
          initialParams={{ user }}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JobDetailScreen"
          component={JobDetailScreen}
          initialParams={{ user }}
          options={{ title: 'Job Details' }}
        />
        <Stack.Screen
          name="AppliedJobsScreen"
          component={AppliedJobsScreen}
          initialParams={{ user }}
          options={{ title: 'Applied Jobs' }}
        />
        <Stack.Screen
          name="AppliedJobDetailScreen"
          component={AppliedJobDetailScreen}
          options={{ title: 'Applied Job Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}