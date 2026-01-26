import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  Alert,
} from "react-native";
import {
  Text,
  Card,
  Button,
  IconButton,
  ActivityIndicator,
} from "react-native-paper";
import { Heart, X } from "lucide-react-native";
import { userAPI, swipeAPI } from "../services/api";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function DiscoverScreen({ navigation }) {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const position = new Animated.ValueXY();

  // Fetch real users from API
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      console.log("📥 Fetching real users from API...");
      const response = await userAPI.getDiscover();
      console.log("✅ Found", response.data.length, "users");
      setProfiles(response.data);
    } catch (error) {
      console.error("❌ Error fetching profiles:", error);
      Alert.alert("Error", "Could not load profiles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        forceSwipe("right");
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        forceSwipe("left");
      } else {
        resetPosition();
      }
    },
  });

  const forceSwipe = (direction) => {
    const x = direction === "right" ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction) => {
    const profile = profiles[currentIndex];

    if (direction === "right") {
      handleLike(profile);
    } else {
      handlePass(profile);
    }

    position.setValue({ x: 0, y: 0 });
    setCurrentIndex(currentIndex + 1);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const handleLike = async (profile) => {
    try {
      console.log("❤️ Liked:", profile.name);
      const response = await swipeAPI.like(profile._id);

      // Check if it's a match!
      if (response.data.match) {
        Alert.alert(
          "🎉 It's a Match!",
          `You and ${profile.name} liked each other!`,
          [
            { text: "Keep Swiping", style: "cancel" },
            {
              text: "Send Message",
              onPress: () => navigation.navigate("Messages"),
            },
          ],
        );
      }
    } catch (error) {
      console.error("Error liking user:", error);
    }
  };

  const handlePass = async (profile) => {
    try {
      console.log("✖️ Passed:", profile.name);
      await swipeAPI.pass(profile._id);
    } catch (error) {
      console.error("Error passing user:", error);
    }
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ["-30deg", "0deg", "30deg"],
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  const renderCard = (profile, index) => {
    if (index < currentIndex) {
      return null;
    }

    if (index === currentIndex) {
      return (
        <Animated.View
          key={profile._id}
          style={[styles.cardContainer, getCardStyle()]}
          {...panResponder.panHandlers}
        >
          <Card style={styles.card}>
            <Card.Cover
              source={{ uri: profile.profilePhoto }}
              style={styles.photo}
            />
            <Card.Content style={styles.content}>
              <Text variant="headlineMedium" style={styles.name}>
                {profile.name}, {profile.age}
              </Text>
              <Text variant="bodyMedium" style={styles.location}>
                📍 {profile.city}, {profile.state}
              </Text>
              <Text variant="bodyMedium" style={styles.bio} numberOfLines={2}>
                {profile.bio}
              </Text>
              {profile.causes && profile.causes.length > 0 && (
                <View style={styles.tags}>
                  {profile.causes.slice(0, 3).map((cause, i) => (
                    <View key={i} style={styles.tag}>
                      <Text style={styles.tagText}>{cause}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Card.Content>
          </Card>
        </Animated.View>
      );
    }

    // Show next card behind current one
    return (
      <View key={profile._id} style={[styles.cardContainer, styles.nextCard]}>
        <Card style={styles.card}>
          <Card.Cover
            source={{ uri: profile.profilePhoto }}
            style={styles.photo}
          />
        </Card>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2B6CB0" />
        <Text style={styles.loadingText}>Finding your matches...</Text>
      </View>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineMedium" style={styles.emptyTitle}>
          That's everyone for now! 🎉
        </Text>
        <Text variant="bodyLarge" style={styles.emptyText}>
          Check back later for more matches
        </Text>
        <Button
          mode="contained"
          onPress={() => {
            setCurrentIndex(0);
            fetchProfiles();
          }}
          style={styles.button}
        >
          Refresh
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {profiles.map((profile, index) => renderCard(profile, index)).reverse()}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <IconButton
          icon={() => <X color="#E53E3E" size={32} />}
          mode="contained"
          containerColor="white"
          size={60}
          onPress={() => forceSwipe("left")}
          style={styles.passButton}
        />
        <IconButton
          icon={() => <Heart color="#48BB78" size={32} />}
          mode="contained"
          containerColor="white"
          size={60}
          onPress={() => forceSwipe("right")}
          style={styles.likeButton}
        />
      </View>

      {/* Swipe Hint */}
      <View style={styles.hint}>
        <Text style={styles.hintText}>← Swipe or tap buttons →</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
  },
  loadingText: {
    marginTop: 20,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F7FAFC",
  },
  emptyTitle: {
    textAlign: "center",
    marginBottom: 16,
    color: "#2B6CB0",
  },
  emptyText: {
    textAlign: "center",
    marginBottom: 32,
    color: "#666",
  },
  button: {
    marginTop: 16,
  },
  cardContainer: {
    position: "absolute",
    width: SCREEN_WIDTH - 40,
    height: "68%",
    top: 70,
    left: 20,
  },
  nextCard: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
  },
  photo: {
    height: "55%",
  },
  content: {
    padding: 16,
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    color: "#2d2d2d",
    marginBottom: 4,
  },
  location: {
    color: "#666",
    marginBottom: 8,
  },
  bio: {
    color: "#333",
    lineHeight: 20,
    marginBottom: 12,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: "#2B6CB0",
    fontSize: 12,
    fontWeight: "600",
  },
  actions: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 40,
  },
  passButton: {
    borderWidth: 2,
    borderColor: "#E53E3E",
  },
  likeButton: {
    borderWidth: 2,
    borderColor: "#48BB78",
  },
  hint: {
    position: "absolute",
    bottom: 130,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  hintText: {
    color: "#999",
    fontSize: 14,
  },
});
