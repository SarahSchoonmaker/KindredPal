// backend/services/notificationService.js
const { Resend } = require("resend");
const { Expo } = require("expo-server-sdk");

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;
const expo = new Expo();

const FROM_EMAIL =
  process.env.FROM_EMAIL || "KindredPal <onboarding@resend.dev>";

// ===== EMAIL NOTIFICATIONS =====

async function sendMeetupInviteEmail({ invitee, creator, meetup }) {
  if (!resend) {
    console.warn("⚠️ Resend not configured - skipping email");
    return;
  }

  const dateStr = new Date(meetup.dateTime).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = new Date(meetup.dateTime).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const locationStr = meetup.location
    ? `${meetup.location.address ? meetup.location.address + ", " : ""}${meetup.location.city}, ${meetup.location.state}`
    : "Location TBD";

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: invitee.email,
      subject: `${creator.name} invited you to a meetup on KindredPal!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #2B6CB0; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">KindredPal</h1>
          </div>
          <div style="background-color: #ffffff; padding: 32px; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="color: #2D3748; margin-top: 0;">You're Invited to a Meetup! 🎉</h2>
            <p style="color: #4A5568; font-size: 16px;">Hi ${invitee.name},</p>
            <p style="color: #4A5568; font-size: 16px;">
              <strong>${creator.name}</strong> has invited you to a meetup on KindredPal!
            </p>
            
            <div style="background-color: #EBF4FF; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #1E3A8A; margin-top: 0;">${meetup.title}</h3>
              ${meetup.description ? `<p style="color: #4A5568; margin: 8px 0;">${meetup.description}</p>` : ""}
              <p style="color: #4A5568; margin: 8px 0;">📅 <strong>${dateStr}</strong></p>
              <p style="color: #4A5568; margin: 8px 0;">🕐 <strong>${timeStr}</strong></p>
              <p style="color: #4A5568; margin: 8px 0;">📍 <strong>${locationStr}</strong></p>
            </div>

            <div style="text-align: center; margin: 32px 0;">
              <a href="https://www.kindredpal.com" 
                style="background-color: #2B6CB0; color: white; padding: 14px 32px; border-radius: 8px;
                text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
                Open KindredPal to RSVP
              </a>
            </div>

            <p style="color: #718096; font-size: 14px;">
              Open the KindredPal app to RSVP and see more details about this meetup.
            </p>
            <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
            <p style="color: #A0AEC0; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} KindredPal. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });
    console.log("✅ Meetup invite email sent to:", invitee.email);
  } catch (error) {
    console.error("❌ Failed to send meetup invite email:", error);
  }
}

async function sendMatchEmail({ user1, user2 }) {
  if (!resend) return;

  const sendTo = async (recipient, other) => {
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: recipient.email,
        subject: `You have a new connection on KindredPal! 🎉`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #2B6CB0; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">KindredPal</h1>
            </div>
            <div style="background-color: #ffffff; padding: 32px; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
              <h2 style="color: #2D3748; margin-top: 0;">It's a Match! 🎉</h2>
              <p style="color: #4A5568; font-size: 16px;">Hi ${recipient.name},</p>
              <p style="color: #4A5568; font-size: 16px;">
                You and <strong>${other.name}</strong> have connected on KindredPal! 
                Start a conversation and get to know each other.
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="https://www.kindredpal.com"
                  style="background-color: #2B6CB0; color: white; padding: 14px 32px; border-radius: 8px;
                  text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
                  Send a Message
                </a>
              </div>
              <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
              <p style="color: #A0AEC0; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} KindredPal. All rights reserved.
              </p>
            </div>
          </div>
        `,
      });
      console.log("✅ Match email sent to:", recipient.email);
    } catch (error) {
      console.error("❌ Failed to send match email:", error);
    }
  };

  await Promise.all([sendTo(user1, user2), sendTo(user2, user1)]);
}

// ===== PUSH NOTIFICATIONS =====

async function sendPushNotification({ pushTokens, title, body, data = {} }) {
  if (!pushTokens || pushTokens.length === 0) return;

  const messages = pushTokens
    .filter(({ token }) => Expo.isExpoPushToken(token))
    .map(({ token }) => ({
      to: token,
      sound: "default",
      title,
      body,
      data,
    }));

  if (messages.length === 0) return;

  try {
    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }
    console.log("✅ Push notifications sent:", messages.length);
  } catch (error) {
    console.error("❌ Push notification error:", error);
  }
}

async function sendMeetupInvitePush({ invitee, creator, meetup }) {
  if (!invitee.pushTokens || invitee.pushTokens.length === 0) return;

  await sendPushNotification({
    pushTokens: invitee.pushTokens,
    title: "New Meetup Invite! 🎉",
    body: `${creator.name} invited you to "${meetup.title}"`,
    data: { type: "meetup_invite", meetupId: meetup._id.toString() },
  });
}

async function sendMatchPush({ user1, user2 }) {
  await Promise.all([
    sendPushNotification({
      pushTokens: user1.pushTokens || [],
      title: "New Connection! 🎉",
      body: `You and ${user2.name} connected on KindredPal!`,
      data: { type: "new_match", userId: user2._id.toString() },
    }),
    sendPushNotification({
      pushTokens: user2.pushTokens || [],
      title: "New Connection! 🎉",
      body: `You and ${user1.name} connected on KindredPal!`,
      data: { type: "new_match", userId: user1._id.toString() },
    }),
  ]);
}

async function sendMessagePush({ recipient, sender, message }) {
  if (!recipient.pushTokens || recipient.pushTokens.length === 0) return;

  await sendPushNotification({
    pushTokens: recipient.pushTokens,
    title: `${sender.name}`,
    body: message.length > 100 ? message.substring(0, 97) + "..." : message,
    data: { type: "new_message", userId: sender._id.toString() },
  });
}

module.exports = {
  sendMeetupInviteEmail,
  sendMatchEmail,
  sendMeetupInvitePush,
  sendMatchPush,
  sendMessagePush,
};
