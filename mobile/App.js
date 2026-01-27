import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { Heart, MessageCircle, User, Calendar } from "lucide-react-native";
import PreferencesScreen from "./src/screens/PreferencesScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";

// Screens
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import DiscoverScreen from "./src/screens/DiscoverScreen";
import MessagesScreen from "./src/screens/MessagesScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ChatScreen from "./src/screens/ChatScreen";
import MeetupsScreen from "./src/screens/MeetupsScreen";
import MeetupDetailsScreen from "./src/screens/MeetupsDetailScreen";

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
          height: 60,
          paddingBottom: 8,
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

          {/* Main App with Tabs */}
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />

          {/* Individual Chat Screen */}
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
            name="MeetupDetails"
            component={MeetupDetailsScreen}
            options={{
              title: "Meetup Details",
              headerStyle: { backgroundColor: "#2B6CB0" },
              headerTintColor: "#fff",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
