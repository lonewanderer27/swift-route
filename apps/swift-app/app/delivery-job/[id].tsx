import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Separator, XStack, YStack } from "tamagui";
import useDeliveryJob from "@/hooks/use-delivery-job";
import { STATUS_CONFIG, PACKAGE_ICON } from "@/constants/delivery-job";
import { DeliveryStatus } from "@swift-route/types";

const ACTION_LABEL: Record<DeliveryStatus, string> = {
  [DeliveryStatus.ASSIGNED]: "Mark as Picked Up",
  [DeliveryStatus.IN_TRANSIT]: "Mark as Delivered",
  [DeliveryStatus.DELIVERED]: "Delivered",
};

const NEXT_STATUS_STYLE: Record<DeliveryStatus, { bg: string; color: string } | null> = {
  [DeliveryStatus.ASSIGNED]: { bg: STATUS_CONFIG[DeliveryStatus.IN_TRANSIT].bg, color: STATUS_CONFIG[DeliveryStatus.IN_TRANSIT].color },
  [DeliveryStatus.IN_TRANSIT]: { bg: STATUS_CONFIG[DeliveryStatus.DELIVERED].bg, color: STATUS_CONFIG[DeliveryStatus.DELIVERED].color },
  [DeliveryStatus.DELIVERED]: null,
};

const SectionLabel = ({ children }: { children: string }) => (
  <Text style={{ fontSize: 11, fontWeight: "700", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>
    {children}
  </Text>
);

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

export default function DeliveryJobDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const job = useDeliveryJob(id);

  if (!job) {
    return (
      <>
        <Stack.Screen options={{ title: "Job Details" }} />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 16, color: "#888" }}>Job not found.</Text>
        </View>
      </>
    );
  }

  const insets = useSafeAreaInsets();
  const badge = STATUS_CONFIG[job.status];
  const actionLabel = ACTION_LABEL[job.status];
  const actionStyle = NEXT_STATUS_STYLE[job.status];
  const isDelivered = job.status === DeliveryStatus.DELIVERED;

  return (
    <>
      <Stack.Screen options={{ title: "Job Details" }} />
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 20 }}>

          <YStack gap="$2">
            <SectionLabel>Status</SectionLabel>
            <XStack>
              <Text style={{
                fontSize: 13, fontWeight: "700",
                backgroundColor: badge.bg, color: badge.color,
                paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999,
              }}>
                {badge.label}
              </Text>
            </XStack>
          </YStack>

          <Separator />

          <YStack gap="$2">
            <SectionLabel>Package Type</SectionLabel>
            <Text style={{ fontSize: 15 }}>
              {PACKAGE_ICON[job.packageType]} {job.packageType.charAt(0).toUpperCase() + job.packageType.slice(1)}
            </Text>
          </YStack>

          <Separator />

          <YStack gap="$2">
            <SectionLabel>Pickup Address</SectionLabel>
            <Text style={{ fontSize: 15 }}>{job.pickupAddress}</Text>
          </YStack>

          <YStack gap="$2">
            <SectionLabel>Dropoff Address</SectionLabel>
            <Text style={{ fontSize: 15 }}>{job.dropoffAddress}</Text>
          </YStack>

          {job.notes.length > 0 && (
            <>
              <Separator />
              <YStack gap="$2">
                <SectionLabel>Notes</SectionLabel>
                {job.notes.map((n) => (
                  <Text key={n.id} style={{ fontSize: 15 }}>• {n.note}</Text>
                ))}
              </YStack>
            </>
          )}

          <Separator />

          <YStack gap="$2">
            <SectionLabel>Ordered</SectionLabel>
            <Text style={{ fontSize: 15 }}>{formatDate(job.createdAt)}</Text>
          </YStack>

          <YStack gap="$2">
            <SectionLabel>Last Modified</SectionLabel>
            <Text style={{ fontSize: 15 }}>{formatDate(job.updatedAt)}</Text>
          </YStack>

        </ScrollView>

        <View style={{ padding: 16, paddingBottom: 16 + insets.bottom, borderTopWidth: 1, borderTopColor: "#E5E7EB" }}>
          <Button
            size="$5"
            disabled={isDelivered}
            style={actionStyle ? { backgroundColor: actionStyle.bg } : undefined}
          >
            <Text style={{ fontWeight: "700", color: actionStyle ? actionStyle.color : "#888" }}>
              {actionLabel}
            </Text>
          </Button>
        </View>
      </View>
    </>
  );
}
