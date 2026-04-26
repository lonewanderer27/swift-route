import DeliveryJobsService from "@/services/delivery-jobs.service";
import { useDeliveryJobsStore } from "@/store/delivery-jobs.store";
import { DeliveryStatus } from "@swift-route/types";

const useUpdateDeliveryStatus = () => {
  const { advanceJobStatus, revertJobStatus, loading } = useDeliveryJobsStore();

  const updateStatus = async (id: string, status: DeliveryStatus) => {
    // optimistically update status in store
    advanceJobStatus(id, status);

    try {
      // call backend to updaate delivery status
      await DeliveryJobsService.updateStatus(id, status);
    } catch (err) {
      // if API call fails, revert status in the store and set error message
      const errMessage = err instanceof Error ? err.message : "Failed to update delivery status.";
      revertJobStatus(errMessage);
    }
  }

  return { updateStatus, loading };
}

export default useUpdateDeliveryStatus