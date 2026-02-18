import React, { memo } from "react";
import { TouchableOpacity } from "react-native";
import { Card, Avatar, Text } from "react-native-paper";

const MessageItem = memo(({ match, onPress }) => (
  <TouchableOpacity onPress={() => onPress(match)}>
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Avatar.Image size={56} source={{ uri: match.profilePhoto }} />
        <View style={styles.messageInfo}>
          <Text variant="titleMedium">{match.name}</Text>
          {match.lastMessage && (
            <Text variant="bodySmall" numberOfLines={1}>
              {match.lastMessage}
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  </TouchableOpacity>
));

export default MessageItem;
