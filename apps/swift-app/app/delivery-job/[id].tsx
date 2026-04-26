import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import useDeliveryJob from "@/hooks/use-delivery-job";

export default function DeliveryJobDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const job = useDeliveryJob(id);

  return (
    <>
      <Stack.Screen options={{ title: "Job Details" }} />
      <View style={{ flex: 1, padding: 16 }}>
        <Text>{job?.id ?? "Loading..."}</Text>
      </View>
    </>
  );
}
