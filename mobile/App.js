import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import {
  Platform,
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
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import api from "./src/services/api";

// Eagerly load auth screens (needed immediately)
import LoginScreen from "./src/screens/LoginScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import SignupScreen from "./src/screens/SignupScreen";

// Lazy load main app screens (loaded when needed)
const DiscoverScreen = lazy(() => import("./src/screens/DiscoverScreen"));
const InterestedScreen = lazy(() => import("./src/screens/InterestedScreen"));
const MessagesScreen = lazy(() => import("./src/screens/MessagesScreen"));
const ProfileScreen = lazy(() => import("./src/screens/ProfileScreen"));
const ChatScreen = lazy(() => import("./src/screens/ChatScreen"));
const MeetupsScreen = lazy(() => import("./src/screens/MeetupsScreen"));
const MeetupDetailsScreen = lazy(
  () => import("./src/screens/MeetupsDetailScreen"),
);
const WebViewScreen = lazy(() => import("./src/screens/WebViewScreen"));
const UserProfileScreen = lazy(() => import("./src/screens/UserProfileScreen"));
const PreferencesScreen = lazy(() => import("./src/screens/PreferencesScreen"));
const EditProfileScreen = lazy(() => import("./src/screens/EditProfileScreen"));
const BlockedUsersScreen = lazy(
  () => import("./src/screens/BlockedUsersScreen"),
);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Configure how notifications are displayed
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

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
        options={{
          tabBarLabel: "Discover",
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
        }}
      >
        {() => (
          <Suspense fallback={<LoadingScreen />}>
            <DiscoverScreen />
          </Suspense>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Interested"
        options={{
          tabBarLabel: "Interested",
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      >
        {() => (
          <Suspense fallback={<LoadingScreen />}>
            <InterestedScreen />
          </Suspense>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Messages"
        options={{
          tabBarLabel: "Messages",
          tabBarIcon: ({ color, size }) => (
            <MessageCircle color={color} size={size} />
          ),
        }}
      >
        {() => (
          <Suspense fallback={<LoadingScreen />}>
            <MessagesScreen />
          </Suspense>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Meetups"
        options={{
          tabBarLabel: "Meetups",
          tabBarIcon: ({ color, size }) => (
            <Calendar color={color} size={size} />
          ),
        }}
      >
        {() => (
          <Suspense fallback={<LoadingScreen />}>
            <MeetupsScreen />
          </Suspense>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      >
        {() => (
          <Suspense fallback={<LoadingScreen />}>
            <ProfileScreen />
          </Suspense>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
        savePushToken(token);
      }
    });

    // Listen for notifications when app is in foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("📨 Notification received:", notification);
      });

    // Listen for notification taps
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("👆 Notification tapped:", response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#2B6CB0",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("❌ Failed to get push token");
        return;
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("✅ Push token:", token);
    } else {
      console.log("⚠️ Must use physical device for Push Notifications");
    }

    return token;
  };

  const savePushToken = async (token) => {
    try {
      const authToken = await SecureStore.getItemAsync("token");
      if (authToken && token) {
        await api.post("/users/push-token", {
          token,
          device: Platform.OS,
        });
        console.log("✅ Push token saved to backend");
      }
    } catch (error) {
      console.error("❌ Error saving push token:", error);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator>
            {/* Auth Screens - NOT lazy loaded (needed immediately) */}
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

            {/* Lazy loaded screens */}
            <Stack.Screen
              name="Chat"
              options={{
                title: "Chat",
                headerStyle: { backgroundColor: "#2B6CB0" },
                headerTintColor: "#fff",
              }}
            >
              {(props) => (
                <Suspense fallback={<LoadingScreen />}>
                  <ChatScreen {...props} />
                </Suspense>
              )}
            </Stack.Screen>

            <Stack.Screen
              name="UserProfile"
              options={{
                title: "Profile",
                headerStyle: { backgroundColor: "#2B6CB0" },
                headerTintColor: "#fff",
              }}
            >
              {(props) => (
                <Suspense fallback={<LoadingScreen />}>
                  <UserProfileScreen {...props} />
                </Suspense>
              )}
            </Stack.Screen>

            <Stack.Screen
              name="Preferences"
              options={{
                title: "Search Preferences",
                headerStyle: { backgroundColor: "#2B6CB0" },
                headerTintColor: "#fff",
              }}
            >
              {(props) => (
                <Suspense fallback={<LoadingScreen />}>
                  <PreferencesScreen {...props} />
                </Suspense>
              )}
            </Stack.Screen>

            <Stack.Screen
              name="EditProfile"
              options={{
                title: "Edit Profile",
                headerStyle: { backgroundColor: "#2B6CB0" },
                headerTintColor: "#fff",
              }}
            >
              {(props) => (
                <Suspense fallback={<LoadingScreen />}>
                  <EditProfileScreen {...props} />
                </Suspense>
              )}
            </Stack.Screen>

            <Stack.Screen
              name="BlockedUsers"
              options={{
                title: "Blocked Users",
                headerStyle: { backgroundColor: "#2B6CB0" },
                headerTintColor: "#fff",
              }}
            >
              {(props) => (
                <Suspense fallback={<LoadingScreen />}>
                  <BlockedUsersScreen {...props} />
                </Suspense>
              )}
            </Stack.Screen>

            <Stack.Screen
              name="MeetupDetails"
              options={{
                title: "Meetup Details",
                headerStyle: { backgroundColor: "#2B6CB0" },
                headerTintColor: "#fff",
              }}
            >
              {(props) => (
                <Suspense fallback={<LoadingScreen />}>
                  <MeetupDetailsScreen {...props} />
                </Suspense>
              )}
            </Stack.Screen>

            <Stack.Screen
              name="WebView"
              options={({ route }) => ({
                title: route.params?.title || "Loading...",
                headerStyle: { backgroundColor: "#2B6CB0" },
                headerTintColor: "#fff",
                headerBackTitle: "Back",
              })}
            >
              {(props) => (
                <Suspense fallback={<LoadingScreen />}>
                  <WebViewScreen {...props} />
                </Suspense>
              )}
            </Stack.Screen>
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
