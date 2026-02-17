const { Expo } = require("expo-server-sdk");

// Create a new Expo SDK client
const expo = new Expo();

/**
 * Send push notifications to an array of Expo push tokens
 * @param {Array} pushTokens - Array of Expo push token strings
 * @param {String} title - Notification title
 * @param {String} body - Notification body
 * @param {Object} data - Additional data to send with notification
 */
const sendPushNotification = async (pushTokens, title, body, data = {}) => {
  // Filter valid Expo push tokens
  const validTokens = pushTokens.filter((token) => Expo.isExpoPushToken(token));

  if (validTokens.length === 0) {
    console.log("No valid push tokens to send to");
    return;
  }

  // Create the messages
  const messages = validTokens.map((token) => ({
    to: token,
    sound: "default",
    title: title,
    body: body,
    data: data,
  }));

  // Chunk messages for efficient delivery
  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  // Send notifications
  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  }

  return tickets;
};

module.exports = { sendPushNotification };
