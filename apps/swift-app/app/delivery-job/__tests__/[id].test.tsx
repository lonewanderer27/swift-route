import { render } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import { COURIER_IDS, JOB_IDS, deliveryJobsStore } from "@swift-route/seed-data";
import { useDeliveryJobsStore } from "@/store/delivery-jobs.store";
import DeliveryJobsService from "@/services/delivery-jobs.service";
import DeliveryJobDetails from "@/app/delivery-job/[id]";

// Mocking dependencies
jest.mock("expo-router", () => ({
  Stack: { Screen: () => null },
  useLocalSearchParams: jest.fn(),
}));

// Mocking react-native-safe-area-context to avoid issues with insets during testing
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ bottom: 0 }),
}));

// Mocking the DeliveryJobsService API calls during testing
jest.mock("../../../services/delivery-jobs.service", () => ({
  __esModule: true,
  default: { updateStatus: jest.fn() },
}));

// Mocking the toast function to prevent actual toast notifications during testing
const mockToastError = jest.fn();
jest.mock("@tamagui/toast/v2", () => ({
  Toast: Object.assign(
    ({ children }: { children: React.ReactNode }) => children,
    {
      Viewport: () => null,
      List: () => null,
      Item: () => null,
    }
  ),
  toast: { error: mockToastError },
}));

// Mocking Tamagui components to prevent rendering issues during testing
jest.mock("tamagui", () => {
  const React = require("react");
  const { View } = require("react-native");
  const pass = ({ children, ...props }: any) => React.createElement(View, props, children);
  return {
    Button: pass,
    Spinner: (props: any) => React.createElement(View, props),
    YStack: pass,
    XStack: pass,
    Separator: () => null,
  };
});

// Setting up the test environment before each test case
beforeEach(() => {
  // Let's use one of JK's assigned job IDs for testing purposes
  const courierId = COURIER_IDS.jungkook;
  const jobId = JOB_IDS.jk_assigned;

  /*
    Since we used JK's assigned job ID, we need to ensure
    that the mock data only contains JK's jobs.
  */
  const mockJobs = deliveryJobsStore.filter((job) => job.courier.id === courierId);

  // Using fake timers to control time-based functions during testing
  jest.useFakeTimers();

  // Reset mocks and state before each test case to ensure a clean slate
  mockToastError.mockClear();

  // Reset the mock implementation of the 
  // updateStatus function to ensure it doesn't interfere with other tests
  (DeliveryJobsService.updateStatus as jest.Mock).mockReset();

  // Mocking the useLocalSearchParams hook to return the job ID we specifically chose
  (useLocalSearchParams as jest.Mock).mockReturnValue({ id: jobId });

  // Setting the delivery jobs store state to contain only the mock jobs for JK
  useDeliveryJobsStore.setState({
    jobs: mockJobs,
    loading: false,
    error: null,
    prevJobs: null,
  });
});

afterEach(() => {
  jest.useRealTimers();
});

describe("DeliveryJobDetails", () => {
  it("renders without crashing", () => {
    render(<DeliveryJobDetails />);
  });
});
