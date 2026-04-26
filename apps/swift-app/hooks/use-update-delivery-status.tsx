import DeliveryJobsService from "@/services/delivery-jobs.service";
import { useDeliveryJobsStore } from "@/store/delivery-jobs.store";
import { DeliveryStatus } from "@swift-route/types";

const useUpdateDeliveryStatus = () => {
  const { advanceJobStatus, revertJobStatus, loading, setLoading, setError, error } = useDeliveryJobsStore();

  const updateStatus = async (id: string, status: DeliveryStatus) => {
    setLoading(true);
    setError(null);

    // optimistically update status in store
    advanceJobStatus(id, status);

    // simulate slow network
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      // call backend to updaate delivery status
      await DeliveryJobsService.updateStatus(id, status);
    } catch (err) {
      // if API call fails, revert status in the store and set error message
      const errMessage = err instanceof Error ? err.message : "Failed to update delivery status.";
      setError(errMessage);
      revertJobStatus(errMessage);
    } finally {
      setLoading(false);
    }
  }

  return { updateStatus, loading, error };
}

export default useUpdateDeliveryStatus