import { CustomText } from "@/components";
import { useAuth } from "@/hooks";
import useTheme from "@/hooks/useThemeColor";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Dimensions, Image, StyleSheet, View, Animated } from "react-native";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");

export default function Index() {
  const { theme } = useTheme();
  const animatedValues = [
    useRef(new Animated.Value(30)).current,
    useRef(new Animated.Value(30)).current,
    useRef(new Animated.Value(30)).current,
  ];

  useEffect(() => {
    let activeDot = 0;

    const intervalId = setInterval(() => {
      Animated.timing(animatedValues[activeDot], {
        toValue: 50,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        const previousDot = activeDot === 0 ? 2 : activeDot - 1;
        Animated.timing(animatedValues[previousDot], {
          toValue: 30,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });

      activeDot = (activeDot + 1) % 3;

      if (activeDot === 0) {
        clearInterval(intervalId);
        router.replace("/(tabs)");
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, [router, animatedValues]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Image
        source={require("../assets/images/background-1.jpg")}
        style={styles.image}
      />
      <CustomText style={styles.entryTxt}>
        {" "}
        Your one stop to managing your finances 
      </CustomText>

      <View style={styles.dotContainer}>
        {animatedValues.map((animatedValue, index) => (
          <Animated.View
            key={index}
            style={{
              width: animatedValue,
              height: 5,
              borderRadius: 10,
              backgroundColor: "#4A5DFF",
              marginHorizontal: 5,
            }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingBottom: 30,
    width: WIDTH,
    height: HEIGHT,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: HEIGHT * 0.6,
    borderRadius: 20,
  },
  entryTxt: {
    fontSize: 25,
    textAlign: "center",
  },
  dotContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
