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
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
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

const BADGE_STYLE = {
  backgroundColor: "#E53E3E",
  color: "white",
  fontSize: 11,
};

function MainTabs() {
  const [counts, setCounts] = useState({
    unread: 0,
    interested: 0,
    meetups: 0,
  });

  const fetchCounts = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      // Get userId for per-user seen key scoping
      const userId = await SecureStore.getItemAsync("userId");

      const res = await api.get("/users/counts");
      const { unread, interested, meetupInviteIds = [], meetups } = res.data;

      // ✅ Per-user seen keys — persist across logout/login for same user
      const meetupKey = userId ? `seen_meetups_${userId}` : "seen_meetups";

      const seenMeetupRaw = await AsyncStorage.getItem(meetupKey);
      const seenMeetupIds = seenMeetupRaw ? JSON.parse(seenMeetupRaw) : [];
      const unseenMeetups =
        meetupInviteIds.length > 0
          ? meetupInviteIds.filter((id) => !seenMeetupIds.includes(id)).length
          : (meetups ?? 0);

      setCounts({ unread, interested, meetups: unseenMeetups });
    } catch (err) {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, [fetchCounts]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") fetchCounts();
    });
    return () => sub.remove();
  }, [fetchCounts]);

  const badge = (n) => (n > 0 ? (n > 99 ? "99+" : n) : undefined);

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
        listeners={{
          tabPress: () => setCounts((c) => ({ ...c, interested: 0 })),
        }}
        options={{
          tabBarLabel: "Interested",
          tabBarBadge: badge(counts.interested),
          tabBarBadgeStyle: BADGE_STYLE,
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
        listeners={{ tabPress: () => setCounts((c) => ({ ...c, unread: 0 })) }}
        options={{
          tabBarLabel: "Messages",
          tabBarBadge: badge(counts.unread),
          tabBarBadgeStyle: BADGE_STYLE,
          tabBarIcon: ({ color, size }) => (
            <MessageCircle color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Meetups"
        component={MeetupsScreen}
        listeners={{
          tabPress: async () => {
            // ✅ When tab is pressed, immediately clear badge in UI
            // MeetupsScreen will update AsyncStorage when it loads
            setCounts((c) => ({ ...c, meetups: 0 }));
          },
        }}
        options={{
          tabBarLabel: "Meetups",
          tabBarBadge: badge(counts.meetups),
          tabBarBadgeStyle: BADGE_STYLE,
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
      if (notificationSubscription.current)
        notificationSubscription.current.remove();
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
