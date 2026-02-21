import React from "react";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import {
  Heart,
  MessageCircle,
  User,
  Calendar,
  Users,
} from "lucide-react-native";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import ALL screens directly (no lazy loading)
import LoginScreen from "./src/screens/LoginScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import SignupScreen from "./src/screens/SignupScreen";
import DiscoverScreen from "./src/screens/DiscoverScreen";
import InterestedScreen from "./src/screens/InterestedScreen";
import MessagesScreen from "./src/screens/MessagesScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ChatScreen from "./src/screens/ChatScreen";
import MeetupsScreen from "./src/screens/MeetupsScreen";
import MeetupDetailsScreen from "./src/screens/MeetupsDetailScreen";
import WebViewScreen from "./src/screens/WebViewScreen";
import UserProfileScreen from "./src/screens/UserProfileScreen";
import PreferencesScreen from "./src/screens/PreferencesScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import BlockedUsersScreen from "./src/screens/BlockedUsersScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// KindredPal theme
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#2B6CB0",
    secondary: "#68A57D",
    background: "#F7FAFC",
  },
};

// Create QueryClient for caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Loading component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#2B6CB0" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

// Main tabs after login
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#2B6CB0",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopColor: "#E2E8F0",
          height: 85,
          paddingBottom: 25,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: "#2B6CB0",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarLabel: "Discover",
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="Interested"
        component={InterestedScreen}
        options={{
          tabBarLabel: "Interested",
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarLabel: "Messages",
          tabBarIcon: ({ color, size }) => (
            <MessageCircle color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Meetups"
        component={MeetupsScreen}
        options={{
          tabBarLabel: "Meetups",
          tabBarIcon: ({ color, size }) => (
            <Calendar color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator>
            {/* Auth Screens */}
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{
                title: "Create Account",
                headerStyle: { backgroundColor: "#2B6CB0" },
                headerTintColor: "#fff",
              }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{
                title: "Reset Password",
                headerStyle: { backgroundColor: "#2B6CB0" },
                headerTintColor: "#fff",
              }}
            />

            {/* Main App with Tabs */}
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />

            {/* Other screens */}
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{
                title: "Chat",
                headerStyle: { backgroundColor: "#2B6CB0" },
                headerTintColor: "#fff",
              }}
            />

            <Stack.Screen
              name="UserProfile"
              component={UserProfileScreen}
              options={{
                title: "Profile",
                headerStyle: { backgroundColor: "#2B6CB0" },
                headerTintColor: "#fff",
              }}
            />

            <Stack.Screen
              name="Preferences"
              component={PreferencesScreen}
              options={{
                title: "Search Preferences",
                headerStyle: { backgroundColor: "#2B6CB0" },
                headerTintColor: "#fff",
              }}
            />

            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{
                title: "Edit Profile",
                headerStyle: { backgroundColor: "#2B6CB0" },
                headerTintColor: "#fff",
              }}
            />

            <Stack.Screen
              name="BlockedUsers"
              component={BlockedUsersScreen}
              options={{
                title: "Blocked Users",
                headerStyle: { backgroundColor: "#2B6CB0" },
                headerTintColor: "#fff",
              }}
            />

            <Stack.Screen
              name="MeetupDetails"
              component={MeetupDetailsScreen}
              options={{
                title: "Meetup Details",
                headerStyle: { backgroundColor: "#2B6CB0" },
                headerTintColor: "#fff",
              }}
            />

            <Stack.Screen
              name="WebView"
              component={WebViewScreen}
              options={({ route }) => ({
                title: route.params?.title || "Loading...",
                headerStyle: { backgroundColor: "#2B6CB0" },
                headerTintColor: "#fff",
                headerBackTitle: "Back",
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
  },
  loadingText: {
    marginTop: 16,
    color: "#666",
    fontSize: 16,
  },
});