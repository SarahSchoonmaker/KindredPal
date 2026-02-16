const { Expo } = require("expo-server-sdk");

// Create a new Expo SDK client
const expo = new Expo();

/**
 * Send push notification to a user
 * @param {Array} pushTokens - Array of push token objects
 * @param {String} title - Notification title
 * @param {String} body - Notification body
 * @param {Object} data - Additional data to send with notification
 */
async function sendPushNotification(pushTokens, title, body, data = {}) {
  // Filter valid Expo push tokens
  const messages = pushTokens
    .filter((pt) => Expo.isExpoPushToken(pt.token))
    .map((pt) => ({
      to: pt.token,
      sound: "default",
      title: title,
      body: body,
      data: data,
      badge: 1,
    }));

  if (messages.length === 0) {
    logger.info("⚠️ No valid push tokens to send to");
    return;
  }

  // Chunk messages for batch processing
  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  logger.info(`📤 Sending ${messages.length} push notifications...`);

  // Send notifications
  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      logger.error("❌ Error sending push notification:", error);
    }
  }

  // Handle receipts (optional - for production monitoring)
  const receiptIds = tickets
    .filter((ticket) => ticket.id)
    .map((ticket) => ticket.id);

  if (receiptIds.length > 0) {
    const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

    for (const chunk of receiptIdChunks) {
      try {
        const receipts = await expo.getPushNotificationReceiptsAsync(chunk);

        for (const receiptId in receipts) {
          const { status, details } = receipts[receiptId];

          if (status === "error") {
            logger.error(
              `❌ Push notification error for ${receiptId}:`,
              details,
            );
          }
        }
      } catch (error) {
        logger.error("❌ Error fetching receipts:", error);
      }
    }
  }

  logger.info("✅ Push notifications sent successfully");
}

module.exports = { sendPushNotification };
