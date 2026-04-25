import { create } from "zustand";
import { DeliveryJob, DeliveryStatus } from "@swift-route/types";

interface DeliveryJobsState {
  // properties
  jobs: DeliveryJob[];
  prevJobs: DeliveryJob[] | null;
  loading: boolean;
  error: string | null;

  // actions
  setJobs: (jobs: DeliveryJob[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  advanceJobStatus: (id: string, status: DeliveryStatus) => void;
  revertJobStatus: (error: string) => void;
}

export const useDeliveryJobsStore = create<DeliveryJobsState>((set, get) => ({
  // properties
  jobs: [],
  prevJobs: null,
  loading: false,
  error: null,

  // actions
  setJobs: (jobs) => set({ jobs }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  advanceJobStatus: (id, status) => {
    const jobs = get().jobs;
    set({
      prevJobs: jobs,
      jobs: jobs.map((job) => job.id === id ? { ...job, status } : job),
    });
  },
  revertJobStatus: (error) => {
    const prevJobs = get().prevJobs;
    if (!prevJobs) return;
    set({
      jobs: prevJobs,
      prevJobs: null,
      error,
    });
  },
}));
