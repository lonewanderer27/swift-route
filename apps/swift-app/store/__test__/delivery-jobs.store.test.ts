import { DeliveryStatus } from "@swift-route/types";
import { useDeliveryJobsStore } from "../delivery-jobs.store";
import { deliveryJobsStore, JOB_IDS } from "@swift-route/seed-data";

// Resets the store to a known state so tests don't affect each other
beforeEach(() => {
  // get jobs from seed data and set to store before each test
  const jobs = deliveryJobsStore;

  // set the store state with the jobs from seed data
  useDeliveryJobsStore.setState({
    jobs: jobs,
    loading: false,
    error: null,
    prevJobs: null,
  });
});

// Optimistic update
it("should update job status optimistically", () => {
  // Let's use Sophia's assigned job for this test
  const jobId = JOB_IDS.sophia_assigned;

  // Advance Sophia's job status to IN_TRANSIT
  useDeliveryJobsStore
    .getState()
    .advanceJobStatus(jobId, DeliveryStatus.IN_TRANSIT);

  // We expect the job status to be updated immediately in the store
  const job = useDeliveryJobsStore.getState().jobs.find((j) => j.id === jobId);
  expect(job).toBeDefined();
  expect(job!.status).toBe(DeliveryStatus.IN_TRANSIT);
});

// Rollback on failure
it("should rollback job status on failure", () => {
  const jobId = JOB_IDS.sophia_assigned;

  // Mock the API call to fail
  const originalAdvanceJobStatus =
    useDeliveryJobsStore.getState().advanceJobStatus;

  // Override the advanceJobStatus function to simulate an API failure for this specific job
  useDeliveryJobsStore.setState({
    advanceJobStatus: (id: string, newStatus: DeliveryStatus) => {
      // Simulate error for Sophia's job
      if (id === jobId) {
        throw new Error("API failure");
      }

      // For other jobs, call the original function
      return originalAdvanceJobStatus(id, newStatus);
    },
  });

  // Try to advance the job status and expect it to throw
  expect(() =>
    useDeliveryJobsStore.getState().advanceJobStatus(
      jobId,
      DeliveryStatus.IN_TRANSIT,
    )
  ).toThrow("API failure");

  // We expect the job status to be rolled back to its original state (ASSIGNED)
  const job = useDeliveryJobsStore.getState().jobs.find((j) => j.id === jobId);
  expect(job).toBeDefined();
  expect(job!.status).toBe(DeliveryStatus.ASSIGNED);
});
