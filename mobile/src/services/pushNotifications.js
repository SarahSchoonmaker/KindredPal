// Push notifications temporarily disabled for preview build
// Will be re-enabled before App Store production build

export const registerForPushNotifications = async () => {
  console.log("Push notifications disabled in preview build");
  return null;
};

export const savePushToken = async () => {
  return null;
};

export const sendPushNotification = async () => {
  return null;
};

export default {
  registerForPushNotifications,
  savePushToken,
  sendPushNotification,
};