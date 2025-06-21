import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Text } from 'react-native'; // Add Text import
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserContext } from '../contexts/UserContext';
import WelcomeScreen from '../screens/WelcomeScreen';
import AuthScreen from '../screens/AuthScreen';
import JobSeekerProfileScreen from '../screens/JobSeekerProfileScreen';
import EmployerProfileScreen from '../screens/EmployerProfileScreen';
import ListOfJobsScreen from '../screens/ListOfJobsScreen';
import PostingJobsScreen from '../screens/PostingJobsScreen';
import ChatScreen from '../screens/ChatScreen';
import SettingsScreen from '../screens/SettingsScreen';

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
        name="Profile"
        component={role === 'job_seeker' ? JobSeekerProfileScreen : EmployerProfileScreen}
        initialParams={{ userId }}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Icon name="account" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={role === 'job_seeker' ? ListOfJobsScreen : PostingJobsScreen}
        initialParams={{ userId }}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <Icon name="view-dashboard" size={24} color={color} />,
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
        name="Settings"
        component={SettingsScreen}
        initialParams={{ userId }}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => <Icon name="cog" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading: authLoading } = React.useContext(UserContext);
  console.log('AppNavigator user:', user, 'authLoading:', authLoading);

  if (authLoading) {
    return <Text>Loading...</Text>; // Now this will work with the import
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}