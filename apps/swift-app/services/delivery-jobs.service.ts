import { DeliveryJob, DeliveryStatus } from "@swift-route/types";
import api from "./api-client";

class DeliveryJobsService {
  static async getCourierJobs(courierId: string, status?: DeliveryStatus) {
    const res = await api.get<DeliveryJob[]>(`delivery-jobs`, {
      params: { courierId, status },
    });
    return res.data;
  }
  static async getJob(id: string) {
    const res = await api.get<DeliveryJob>(`delivery-jobs/${id}`);
    return res.data;
  }
  static async updateStatus(id: string, status: DeliveryStatus) {
    const res = await api.patch<DeliveryJob>(`delivery-jobs/${id}`, {
      status,
    });
    return res.data;
  }

  // APIs not included in specification
  static async getAllJobs(courierId: string, status: DeliveryStatus) {
    const res = await api.get<DeliveryJob[]>(`delivery-jobs/`, {
      params: { courierId, status },
    });
    return res.data;
  }
}

export default DeliveryJobsService;
