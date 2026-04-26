import { DEFAULT_COURIER_ID } from "@/constants/courier";
import { useEffect, useState } from "react";
import { Button, Dialog, Fieldset, Input, Label, XStack, YStack } from "tamagui";

const CourierDialogConfig = (
  { open, onOpenChange, courierId = DEFAULT_COURIER_ID, onCourierChange }:
    {
      open: boolean,
      onOpenChange: (val: boolean) => void,
      courierId?: string
      onCourierChange: (val: string) => void
    }
) => {
  const [draft, setDraft] = useState(courierId);

  useEffect(() => { setDraft(courierId); }, [courierId]);

  const handleCloseWithoutApply = () => {
    setDraft(courierId);
    onOpenChange(false);
  }

  const handleApply = () => {
    if (draft) onCourierChange(draft);
    onOpenChange(false);
  };

  return (
    <Dialog
      modal
      open={open}
      onOpenChange={onOpenChange}
    >
      <Dialog.Portal>
        <Dialog.Overlay opacity={0.5} />
        <Dialog.Content width="90%">
          <Dialog.Title>Edit Courier ID</Dialog.Title>
          <YStack gap="$4" style={{ marginTop: 20 }}>
            <Fieldset gap="$4" horizontal>
              <Label width={20} htmlFor="courierId">
                ID
              </Label>
              <Input
                flex={1}
                id="courierId"
                value={draft}
                onChangeText={setDraft}
              />
            </Fieldset>
            <XStack gap="$3" self="flex-end">

              <Dialog.Close asChild>
                <Button onPress={handleCloseWithoutApply} variant="outlined">
                  Cancel
                </Button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Button onPress={handleApply} disabled={!draft}>
                  Apply
                </Button>
              </Dialog.Close>
            </XStack>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

export default CourierDialogConfig