import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/src/constants/colors";
import "./global.css";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: "fade",
        }}
      />
    </>
  );
}
