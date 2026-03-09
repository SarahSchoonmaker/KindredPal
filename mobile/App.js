import React, { useEffect, useRef, useState, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import {
  Compass,
  MessageCircle,
  User,
  Calendar,
  Users,
  UserSearch,
} from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  registerForPushNotifications,
  setupNotificationListeners,
} from "./src/services/pushNotifications";
import api from "./src/services/api";

// Auth Screens
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";

// Main Screens
import DiscoverScreen from "./src/screens/DiscoverScreen";
import LikesYouScreen from "./src/screens/InterestedScreen";
import ConnectionsScreen from "./src/screens/ConnectionsScreen";
import MessagesScreen from "./src/screens/MessagesScreen";
import MeetupsScreen from "./src/screens/MeetupsScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

// Stack Screens
import ChatScreen from "./src/screens/ChatScreen";
import PreferencesScreen from "./src/screens/PreferencesScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import MeetupDetailsScreen from "./src/screens/MeetupsDetailScreen";
import UserProfileScreen from "./src/screens/UserProfileScreen";
import BlockedUsersScreen from "./src/screens/BlockedUsersScreen";
import WebViewScreen from "./src/screens/WebViewScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#2B6CB0",
    secondary: "#68A57D",
    background: "#F7FAFC",
  },
};

const headerStyle = {
  headerStyle: { backgroundColor: "#2B6CB0" },
  headerTintColor: "#fff",
  headerTitleStyle: { fontWeight: "bold" },
};

function MainTabs() {
  const [pendingMeetups, setPendingMeetups] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch current user ID once
  useEffect(() => {
    api
      .get("/auth/profile")
      .then((res) => setCurrentUserId(res.data._id))
      .catch(() => {});
  }, []);

  // Poll for pending meetup invites every 30 seconds
  useEffect(() => {
    if (!currentUserId) return;

    const fetchPendingMeetups = async () => {
      try {
        const res = await api.get("/meetups");
        const meetups = res.data || [];
        // Count meetups where user is invited but hasn't RSVP'd
        const pending = meetups.filter((meetup) => {
          const isCreator = meetup.creator?._id === currentUserId;
          if (isCreator) return false;
          const hasRsvp = meetup.rsvps?.some(
            (r) => r.user?._id === currentUserId,
          );
          const isInvited = meetup.invitedUsers?.some(
            (u) => u._id === currentUserId,
          );
          return isInvited && !hasRsvp;
        });
        setPendingMeetups(pending.length);
      } catch (err) {
        // Silently fail
      }
    };

    fetchPendingMeetups();
    const interval = setInterval(fetchPendingMeetups, 30000);
    return () => clearInterval(interval);
  }, [currentUserId]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#2B6CB0",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopColor: "#E2E8F0",
          paddingBottom: 20,
          paddingTop: 8,
          height: 70,
        },
        headerStyle: { backgroundColor: "#2B6CB0" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarLabel: "Discover",
          tabBarIcon: ({ color, size }) => (
            <Compass color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Interested"
        component={LikesYouScreen}
        options={{
          tabBarLabel: "Interested",
          tabBarIcon: ({ color, size }) => (
            <UserSearch color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Connections"
        component={ConnectionsScreen}
        options={{
          tabBarLabel: "Connections",
          title: "My Connections",
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
          tabBarBadge: pendingMeetups > 0 ? pendingMeetups : undefined,
          tabBarBadgeStyle: {
            backgroundColor: "#E53E3E",
            color: "white",
            fontSize: 11,
          },
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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      const { View, Text, ScrollView } = require("react-native");
      return (
        <View
          style={{
            flex: 1,
            padding: 40,
            paddingTop: 80,
            backgroundColor: "#fff",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "red",
              marginBottom: 16,
            }}
          >
            App Crashed
          </Text>
          <ScrollView>
            <Text
              style={{ fontSize: 13, color: "#333", fontFamily: "monospace" }}
            >
              {this.state.error?.toString()}
              {"\n\n"}
              {this.state.error?.stack}
            </Text>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const navigationRef = useRef(null);
  const notificationSubscription = useRef(null);

  useEffect(() => {
    registerForPushNotifications();
    if (navigationRef.current) {
      notificationSubscription.current = setupNotificationListeners(
        navigationRef.current,
      );
    }
    return () => {
      if (notificationSubscription.current) {
        notificationSubscription.current.remove();
      }
    };
  }, []);

  return (
    <ErrorBoundary>
      <PaperProvider theme={theme}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ title: "Create Account", ...headerStyle }}
            />
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{ title: "Chat", ...headerStyle }}
            />
            <Stack.Screen
              name="Preferences"
              component={PreferencesScreen}
              options={{ title: "Search Preferences", ...headerStyle }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{ title: "Edit Profile", ...headerStyle }}
            />
            <Stack.Screen
              name="MeetupDetails"
              component={MeetupDetailsScreen}
              options={{ title: "Meetup Details", ...headerStyle }}
            />
            <Stack.Screen
              name="UserProfile"
              component={UserProfileScreen}
              options={{ title: "Profile", ...headerStyle }}
            />
            <Stack.Screen
              name="BlockedUsers"
              component={BlockedUsersScreen}
              options={{ title: "Blocked Users", ...headerStyle }}
            />
            <Stack.Screen
              name="WebView"
              component={WebViewScreen}
              options={({ route }) => ({
                title: route.params?.title || "KindredPal",
                ...headerStyle,
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </ErrorBoundary>
  );
}
