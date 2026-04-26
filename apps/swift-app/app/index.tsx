import { Stack, useRouter } from "expo-router";
import { Avatar } from 'tamagui'
import { FlatList, Text, View } from "react-native";
import { useCourierStore } from "@/store/courier.store";
import { useEffect, useState } from "react";
import CourierDialogConfig from "@/components/CourierDialogConfig";
import useDeliveryJobs from "@/hooks/use-delivery-jobs";
import { DEFAULT_COURIER_ID } from "@/constants/courier";
import DeliveryJobCard from "@/components/DeliveryJobCard";

export default function Index() {
  const { courierId, setCourierId } = useCourierStore();
  const { jobs, loading, error, refetch } = useDeliveryJobs(courierId ?? DEFAULT_COURIER_ID);
  const [configOpen, setConfigOpen] = useState(false);
  const handleProfile = () => setConfigOpen((prev) => !prev);

  const router = useRouter();
  const handleJob = (id: string) => {
    router.push(`/delivery-job/${id}`);
  }

  useEffect(() => {
    if (courierId) refetch();
  }, [courierId])

  return (
    <>
      <Stack.Screen
        options={{
          title: "Delivery Jobs",
          headerRight: () =>
            <Avatar circular size="$3" onPress={handleProfile}>
              <Avatar.Image src={require("../assets/images/motorcyclist.png")} />
              <Avatar.Fallback bg="$blue10" />
            </Avatar>
        }}
      />
      <CourierDialogConfig
        open={configOpen}
        onOpenChange={setConfigOpen}
        courierId={courierId ?? DEFAULT_COURIER_ID}
        onCourierChange={setCourierId}
      />
      <View style={{ flex: 1 }}
      >
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <DeliveryJobCard {...item} onPress={() => handleJob(item.id)} />}
          contentContainerStyle={{ paddingVertical: 8 }}
          refreshing={loading}
          onRefresh={refetch}
          ListEmptyComponent={() => (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 }}>
              <Text style={{ fontSize: 16, color: "#888" }}>{error ?? "No delivery jobs found."}</Text>
            </View>
          )}
        />
      </View>
    </>
  );
}
