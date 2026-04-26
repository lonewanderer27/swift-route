import { useEffect } from "react";
import { useSharedValue, withRepeat, withTiming, useAnimatedStyle } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { Card, XStack, YStack, Separator } from "tamagui";
import { DimensionValue, View } from "react-native";

const Block = ({ width, height, borderRadius = 4 }: { width: DimensionValue; height: number; borderRadius?: number }) => (
  <View style={{ width, height, borderRadius, backgroundColor: "#E5E7EB" }} />
);

const DeliveryJobCardLoader = () => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.4, { duration: 900 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={animatedStyle}>
      <Card border="0.5px solid gray" style={{ marginVertical: 8, marginHorizontal: 16 }}>
        <Card.Header>
          <XStack gap="$2" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <Block width={120} height={16} />
            <Block width={70} height={22} borderRadius={999} />
          </XStack>
        </Card.Header>

        <Separator />

        <YStack gap="$3" style={{ padding: 12 }}>
          <YStack gap="$1">
            <Block width={40} height={10} />
            <Block width="80%" height={14} />
          </YStack>

          <YStack gap="$1">
            <Block width={45} height={10} />
            <Block width="65%" height={14} />
          </YStack>
        </YStack>
      </Card>
    </Animated.View>
  );
};

export default DeliveryJobCardLoader;
