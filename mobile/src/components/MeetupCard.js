import React, { memo } from "react";
import { TouchableOpacity } from "react-native";
import { Card, Text } from "react-native-paper";
import { Calendar, Clock, MapPin } from "lucide-react-native";

const MeetupCard = memo(({ meetup, onPress }) => (
  <TouchableOpacity onPress={() => onPress(meetup._id)}>
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium">{meetup.title}</Text>
        <View style={styles.details}>
          <Calendar size={18} color="#2B6CB0" />
          <Text>{formatDate(meetup.dateTime)}</Text>
        </View>
      </Card.Content>
    </Card>
  </TouchableOpacity>
));

export default MeetupCard;
