import React, { useEffect, useRef, useState, useCallback } from "react";
import { SocketProvider } from "./src/context/SocketContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { MessageCircle, User, Calendar, Users, LayoutGrid } from "lucide-react-native";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { registerForPushNotifications, setupNotificationListeners } from "./src/services/pushNotifications";
import api from "./src/services/api";

// Auth
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";

// Main Tabs
import GroupsScreen from "./src/screens/GroupsScreen";
import ConnectionsScreen from "./src/screens/ConnectionsScreen";
import MessagesScreen from "./src/screens/MessagesScreen";
import MeetupsScreen from "./src/screens/MeetupsScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

// Stack screens
import ChatScreen from "./src/screens/ChatScreen";
import GroupDetailScreen from "./src/screens/GroupDetailScreen";
import CreateGroupScreen from "./src/screens/CreateGroupScreen";
import MemberProfileScreen from "./src/screens/MemberProfileScreen";
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

const BADGE_STYLE = { backgroundColor: "#E53E3E", color: "white", fontSize: 11 };

function MainTabs() {
  const insets = useSafeAreaInsets();
  const [counts, setCounts] = useState({ unread: 0, meetups: 0 });

  const fetchCounts = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;
      const userId = await SecureStore.getItemAsync("userId");
      const res = await api.get("/users/counts");
      const { unread, meetupInviteIds = [], meetups } = res.data;
      const meetupKey = userId ? `seen_meetups_${userId}` : "seen_meetups";
      const seenMeetupRaw = await AsyncStorage.getItem(meetupKey);
      const seenMeetupIds = seenMeetupRaw ? JSON.parse(seenMeetupRaw) : [];
      const unseenMeetups = meetupInviteIds.length > 0
        ? meetupInviteIds.filter((id) => !seenMeetupIds.includes(id)).length
        : (meetups ?? 0);
      setCounts({ unread, meetups: unseenMeetups });
    } catch (err) {}
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
      sceneContainerStyle={{ backgroundColor: "transparent" }}
      screenOptions={{
        tabBarActiveTintColor: "#2B6CB0",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopColor: "#E2E8F0",
          paddingTop: 8,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          height: 60 + (insets.bottom > 0 ? insets.bottom : 10),
        },
        headerStyle: { backgroundColor: "#2B6CB0" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      {/* ✅ Groups replaces Discover as main entry point */}
      <Tab.Screen
        name="Groups"
        component={GroupsScreen}
        options={{
          tabBarLabel: "Groups",
          title: "Community Groups",
          tabBarIcon: ({ color, size }) => <LayoutGrid color={color} size={size} />,
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
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="Meetups"
        component={MeetupsScreen}
        listeners={{ tabPress: async () => setCounts((c) => ({ ...c, meetups: 0 })) }}
        options={{
          tabBarLabel: "Meetups",
          tabBarBadge: badge(counts.meetups),
          tabBarBadgeStyle: BADGE_STYLE,
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
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
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      const { View, Text, ScrollView } = require("react-native");
      return (
        <View style={{ flex: 1, padding: 40, paddingTop: 80, backgroundColor: "#fff" }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "red", marginBottom: 16 }}>App Crashed</Text>
          <ScrollView>
            <Text style={{ fontSize: 13, color: "#333", fontFamily: "monospace" }}>
              {this.state.error?.toString()}{"\n\n"}{this.state.error?.stack}
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
      notificationSubscription.current = setupNotificationListeners(navigationRef.current);
    }
    return () => { if (notificationSubscription.current) notificationSubscription.current.remove(); };
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <SocketProvider>
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
              screenOptions={{
                animation: "slide_from_right",
                animationDuration: 200,
                gestureEnabled: true,
                headerBackTitle: "Back",
              }}>
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Signup" component={SignupScreen} options={{ title: "Create Account", headerBackTitle: "Back", ...headerStyle }} />
              <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />

              {/* Group screens */}
              <Stack.Screen name="GroupDetail" component={GroupDetailScreen} options={{ title: "Group", headerBackTitle: "Back", ...headerStyle }} />
              <Stack.Screen name="CreateGroup" component={CreateGroupScreen} options={{ title: "Create Group", headerBackTitle: "Back", ...headerStyle }} />
              <Stack.Screen name="MemberProfile" component={MemberProfileScreen} options={{ title: "Profile", headerBackTitle: "Back", ...headerStyle }} />

              {/* Other screens */}
              <Stack.Screen name="Chat" component={ChatScreen} options={({ navigation }) => ({ title: "Chat", headerBackTitle: "Back", headerBackButtonMenuEnabled: false, ...headerStyle })} />
              <Stack.Screen name="Preferences" component={PreferencesScreen} options={{ title: "Search Preferences", headerBackTitle: "Back", ...headerStyle }} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: "Edit Profile", headerBackTitle: "Back", ...headerStyle }} />
              <Stack.Screen name="MeetupDetails" component={MeetupDetailsScreen} options={{ title: "Meetup Details", headerBackTitle: "Back", headerBackButtonMenuEnabled: false, ...headerStyle }} />
              <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ title: "Profile", headerBackTitle: "Back", ...headerStyle }} />
              <Stack.Screen name="BlockedUsers" component={BlockedUsersScreen} options={{ title: "Blocked Users", headerBackTitle: "Back", ...headerStyle }} />
              <Stack.Screen name="WebView" component={WebViewScreen} options={({ route }) => ({ title: route.params?.title || "KindredPal", headerBackTitle: "Back", ...headerStyle })} />
            </Stack.Navigator>
          </NavigationContainer>
          </SocketProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}