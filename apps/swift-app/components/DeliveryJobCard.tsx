import { STATUS_CONFIG, PACKAGE_ICON } from "@/constants/delivery-job";
import { DeliveryJob, DeliveryStatus } from "@swift-route/types";
import { Card, XStack, YStack, Text, Separator } from "tamagui";

interface DeliveryJobCardProps extends DeliveryJob {
  onPress?: () => void;
}

const DeliveryJobCard = ({ pickupAddress, dropoffAddress, packageType, status, onPress }: DeliveryJobCardProps) => {
  const badge = STATUS_CONFIG[status];
  const label = packageType.charAt(0).toUpperCase() + packageType.slice(1);

  return (
    <Card
      border="0.5px solid gray"
      onPress={onPress}
      style={{ marginVertical: 8, marginHorizontal: 16 }}>
      <Card.Header>
        <XStack gap="$2" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <Text fontSize="$3" fontWeight="600">
            {PACKAGE_ICON[packageType]} {label}
          </Text>
          <Text
            fontSize="$2"
            fontWeight="700"
            style={{
              backgroundColor: badge.bg,
              color: badge.color,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius:999,
            }}
          >
            {badge.label}
          </Text>
        </XStack>
      </Card.Header>

      <Separator />

      <YStack gap="$3" style={{ padding: 12 }}>
        <YStack gap="$1">
          <Text fontSize="$1" fontWeight="700" color="$color10" style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
            Pickup
          </Text>
          <Text fontSize="$3" numberOfLines={1} ellipsizeMode="tail">
            {pickupAddress}
          </Text>
        </YStack>

        <YStack gap="$1">
          <Text fontSize="$1" fontWeight="700" color="$color10" style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
            Dropoff
          </Text>
          <Text fontSize="$3" numberOfLines={1} ellipsizeMode="tail">
            {dropoffAddress}
          </Text>
        </YStack>
      </YStack>
    </Card>
  );
};

export default DeliveryJobCard;