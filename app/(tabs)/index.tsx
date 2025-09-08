import { ThemedText } from "@/components/ThemedText";
import React, { useState } from "react";
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from "react-native";

const { width } = Dimensions.get("window");

const images = [
  { id: "1", uri: require("../../assets/images/auto.png") },
  { id: "2", uri: require("../../assets/images/lavadora.png") },
  { id: "3", uri: require("../../assets/images/microondas.png") },
];

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <ThemedText type="title" style={{ fontSize: 20, textAlign: "center", marginTop: 40 }}>
        Tus Productos
      </ThemedText>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ marginTop: 20 }}
      >
        {images.map((item) => (
          <Image key={item.id} source={item.uri} style={styles.image} />
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {images.map((_, idx) => (
          <Text
            key={idx}
            style={[
              styles.dot,
              { color: idx === activeIndex ? "#2563eb" : "#ccc" },
            ]}
          >
            ●
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: width,
    height: 250,
    resizeMode: "cover",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  dot: {
    fontSize: 20,
    marginHorizontal: 4,
  },
});