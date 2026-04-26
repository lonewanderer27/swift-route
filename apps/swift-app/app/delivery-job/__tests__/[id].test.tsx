import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
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

  it("should render bottom bar button as 'Mark as Picked Up'", () => {
    // Render the screen — beforeEach already pointed useLocalSearchParams at jk_assigned,
    // so the component loads that specific job from the store.
    const { getByText } = render(<DeliveryJobDetails />);

    // "Mark as Picked Up" is the ACTION_LABEL for DeliveryStatus.ASSIGNED.
    // Finding it confirms the component reads the job's status and maps it to the correct label.
    expect(getByText("Mark as Picked Up")).toBeTruthy();
  });

  it("should disable the button and show a spinner while the status update is in flight", async () => {
    // Return a promise that never resolves so the loading state stays true for the duration of the test.
    // This lets us assert the in-flight UI without the update ever completing.
    (DeliveryJobsService.updateStatus as jest.Mock).mockReturnValue(new Promise(() => {}));

    const { UNSAFE_getByProps } = render(<DeliveryJobDetails />);

    // Locate the action button by its id prop (preserved on the shimmed View).
    const btn = UNSAFE_getByProps({ id: "update-status-btn" });

    // Simulate the courier tapping the button to trigger the status update.
    fireEvent.press(btn);

    /*
      We deliberately added a 3s timer to simulate network latency
      and show the loading state in the UI. 
      
      So to test the loading state, we need to advance timers by 3 seconds
      to trigger the state change that happens when the API call is made.
    */
    act(() => { jest.advanceTimersByTime(3000); });

    await waitFor(() => {
      // The Spinner mounts inside the button while loading is true.
      expect(UNSAFE_getByProps({ id: "update-status-spinner" })).toBeTruthy();

      // The button must be disabled so the courier cannot fire duplicate updates.
      expect(btn.props.disabled).toBe(true);
    });
  });
});
