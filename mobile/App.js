import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { Compass, MessageCircle, User, Calendar, Users, UserSearch } from "lucide-react-native";

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
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Interested"
        component={LikesYouScreen}
        options={{
          tabBarLabel: "Interested",
          tabBarIcon: ({ color, size }) => <UserSearch color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Connections"
        component={ConnectionsScreen}
        options={{
          tabBarLabel: "Connections",
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
          title: "My Connections",
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarLabel: "Messages",
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Meetups"
        component={MeetupsScreen}
        options={{
          tabBarLabel: "Meetups",
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

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator>
          {/* Auth */}
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

          {/* Main App */}
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />

          {/* Stack Screens */}
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
  );
}