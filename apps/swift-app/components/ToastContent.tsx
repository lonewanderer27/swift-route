import {
  Toast,
  useToastItem,
  type ToastT,
} from '@tamagui/toast/v2'
import { Button, XStack, YStack } from "tamagui"

const ToastContent = ({ toast: t }: { toast: ToastT }) => {
  const { handleClose } = useToastItem()

  const title = typeof t.title === 'function' ? t.title() : t.title
  const description =
    typeof t.description === 'function' ? t.description() : t.description

  return (
    <YStack flex={1} gap="$0.5">
      {title && (
        <Toast.Title fontWeight="600" size="$3">
          {title}
        </Toast.Title>
      )}
      {description && (
        <Toast.Description color="$color9" size="$2">
          {description}
        </Toast.Description>
      )}
    </YStack>
  )
}

export default ToastContent