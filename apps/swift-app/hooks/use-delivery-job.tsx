import { useDeliveryJobsStore } from "@/store/delivery-jobs.store";

const useDeliveryJob = (jobId: string) => {
  return useDeliveryJobsStore((state) =>
    state.jobs.find((job) => job.id === jobId))
}

export default useDeliveryJob;