// mobile/src/services/pushNotifications.js
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { authAPI } from "./api";

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications() {
  try {
    // Check existing permissions
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request if not already granted
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("⚠️ Push notification permission not granted");
      return null;
    }

    // Get push token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: "ca627fdc-87ee-477f-af2b-eb4fa419a8eb", // from app.json
    });

    const token = tokenData.data;
    console.log("📱 Push token:", token);

    // Save token to backend
    await savePushToken(token);

    return token;
  } catch (error) {
    console.error("❌ Error registering for push notifications:", error);
    return null;
  }
}

async function savePushToken(token) {
  try {
    await authAPI.savePushToken({
      token,
      device: Platform.OS,
    });
    console.log("✅ Push token saved to backend");
  } catch (error) {
    console.error("❌ Error saving push token:", error);
  }
}

export function setupNotificationListeners(navigation) {
  // Handle notification tap when app is in background/closed
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const data = response.notification.request.content.data;
      console.log("📱 Notification tapped:", data);

      if (data?.type === "meetup_invite" && data?.meetupId) {
        navigation.navigate("MeetupDetails", { meetupId: data.meetupId });
      } else if (data?.type === "new_match" && data?.userId) {
        navigation.navigate("UserProfile", { userId: data.userId });
      } else if (data?.type === "new_message" && data?.userId) {
        navigation.navigate("Messages");
      }
    },
  );

  return subscription;
}
