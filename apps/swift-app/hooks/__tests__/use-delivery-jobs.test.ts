import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { DeliveryJob } from "@swift-route/types";
import { COURIER_IDS, deliveryJobsStore } from "@swift-route/seed-data";
import { useDeliveryJobsStore } from "@/store/delivery-jobs.store";
import DeliveryJobsService from "@/services/delivery-jobs.service";
import useDeliveryJobs from "@/hooks/use-delivery-jobs";

jest.mock("@/services/delivery-jobs.service", () => ({
  getCourierJobs: jest.fn(),
}));

beforeEach(() => {
  useDeliveryJobsStore.setState({
    jobs: [],
    loading: false,
    error: null,
    prevJobs: null,
  });
});

describe("useDeliveryJobs", () => {
  // Use Sophia's jobs for testing
  const courierId = COURIER_IDS.sophia;
  const sophiaJobs = deliveryJobsStore.filter(
    (job) => job.courier.id === courierId,
  );

  it("should populate store with jobs on success", async () => {
    // Mock the service to return Sophia's jobs
    (DeliveryJobsService.getCourierJobs as jest.Mock).mockResolvedValue(
      sophiaJobs,
    );

    // execute the hook
    renderHook(() => useDeliveryJobs(courierId));

    // verify that we have indeed value in the store after the promise resolves
    await waitFor(() => {
      const state = useDeliveryJobsStore.getState();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.jobs).toHaveLength(sophiaJobs.length);
      state.jobs.forEach((job) => expect(job.courier.id).toBe(courierId));
    });
  });

  it("should set its loading state to true while fetching, then false when done", async () => {
    // Create a deferred promise to control when it resolves
    let resolveDeferred!: (jobs: DeliveryJob[]) => void;
    const deferred = new Promise<DeliveryJob[]>((resolve) => {
      resolveDeferred = resolve;
    });
    (DeliveryJobsService.getCourierJobs as jest.Mock).mockReturnValue(deferred);

    // execute the hook
    renderHook(() => useDeliveryJobs(courierId));

    // Initially, loading should be true
    expect(useDeliveryJobsStore.getState().loading).toBe(true);

    // Resolve the promise to Sophia's jobs
    act(() => resolveDeferred(sophiaJobs));

    // After resolving, loading should eventually become false
    await waitFor(() => {
      expect(useDeliveryJobsStore.getState().loading).toBe(false);
    });
  });

  it("should set the error message and the jobs shall be empty on failure", async () => {
    // Mock the service to reject with an API error
    (DeliveryJobsService.getCourierJobs as jest.Mock).mockRejectedValue(
      /*
        Message from the backend is not propagated to the UI at the moment
        so we are free to set any message here.

        Ideally it should be the same message
        as the one we set in the catch block of the hook.
      */
      new Error("Network error"),
    );

    // execute the hook
    renderHook(() => useDeliveryJobs(courierId));

    await waitFor(() => {
      const state = useDeliveryJobsStore.getState();
      /*
        "Failed to load delivery jobs" is the error message we set in the catch block of the hook,
        not the original error message from the service, which we cannot get at the moment.

        Things to improve perhaps? ...yet not needed for demo anyway
      */
      expect(state.error).toBe("Failed to load delivery jobs.");
      expect(state.loading).toBe(false);
      expect(state.jobs).toHaveLength(0);
    });
  });
});
