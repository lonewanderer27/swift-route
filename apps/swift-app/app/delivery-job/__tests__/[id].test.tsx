import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import { toast } from "@tamagui/toast/v2";
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
jest.mock("@/services/delivery-jobs.service", () => ({
  __esModule: true,
  default: { updateStatus: jest.fn() },
}));

// Mocking the toast module to prevent actual toasts from showing 
// during tests and to allow us to assert calls to toast.error.
jest.mock("@tamagui/toast/v2", () => ({
  Toast: Object.assign(
    ({ children }: { children: React.ReactNode }) => children,
    {
      Viewport: () => null,
      List: () => null,
      Item: () => null,
    }
  ),
  toast: { error: jest.fn() },
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

  // Reset mocks and state before each test case to ensure a clean slate.
  // toast.error here is the jest.fn() defined in the mock factory above,
  // accessed through the mocked module import at the top of this file.
  (toast.error as jest.Mock).mockClear();

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
    const { UNSAFE_getByProps } = render(<DeliveryJobDetails />);

    // Locate the label element by its id prop we set earlier.
    const label = UNSAFE_getByProps({ id: "update-status-label" });

    // "Mark as Picked Up" is the ACTION_LABEL for DeliveryStatus.ASSIGNED.
    // Finding it confirms the component reads the job's status and maps it to the correct label.
    expect(label.props.children).toBe("Mark as Picked Up");
  });

  it("should disable the button and show a spinner while the status update is in flight", async () => {
    // Return a promise that never resolves so the loading state stays true for the duration of the test.
    // This lets us check the UI while it is loading without the update ever completing.
    (DeliveryJobsService.updateStatus as jest.Mock).mockReturnValue(new Promise(() => { }));

    // Render the screen and use UNSAFE_getByProps to locate elements by their props 
    // since the Tamagui Button and Spinner shims don't support testIDs.
    const { UNSAFE_getByProps } = render(<DeliveryJobDetails />);

    // Locate the action button by its id prop (preserved on the shimmed View).
    const btn = UNSAFE_getByProps({ id: "update-status-btn" });

    // Simulate the courier tapping the button to trigger the status update.
    fireEvent.press(btn);

    await waitFor(() => {
      // The Spinner mounts inside the button while loading is true.
      expect(UNSAFE_getByProps({ id: "update-status-spinner" })).toBeTruthy();

      // The button must be disabled so the courier cannot fire duplicate updates.
      expect(btn.props.disabled).toBe(true);
    });
  });

  it("should show an error toast and re-enable the button when the API call fails", async () => {
    // Reject with a specific message so we can assert the exact text surfaced to the courier.
    const errorMessage = "Network error";
    (DeliveryJobsService.updateStatus as jest.Mock).mockRejectedValue(
      new Error(errorMessage),
    );

    /*
      At this point, since the API call is mocked to reject when the button is pressed.
      It has been propagated to the catch block in the hook,
      which calls setError with the error message and then revertJobStatus.

      The screen watches the error field through useEffect.. and calls toast.error when it is set.
      and that is what we we will assert in this test.
    */

    // Render the screen and use UNSAFE_getByProps to locate elements by their props 
    // since the Tamagui Button and Spinner shims don't support testIDs.
    const { UNSAFE_getByProps } = render(<DeliveryJobDetails />);

    // Locate the action button by its id prop we set earlier.
    const btn = UNSAFE_getByProps({ id: "update-status-btn" });

    // Simulate advancement of job status by tapping the button.
    fireEvent.press(btn);

    await waitFor(() => {
      // The component's useEffect watches the error field and calls toast.error when it is set.
      // Asserting the spy confirms the error message is propagated all the way to the UI layer.
      expect(toast.error as jest.Mock).toHaveBeenCalledWith(
        "Error",
        expect.objectContaining({ description: errorMessage }),
      );

      // Once the catch block finishes, setLoading(false) is called.
      // The button must be interactive again so the courier can retry.
      expect(btn.props.disabled).toBe(false);
    });
  });

  it("should transition the job's status through the full lifecycle: assigned → in-transit → delivered", async () => {
    // Both button presses will succeed — the optimistic store updates stick on each transition.
    (DeliveryJobsService.updateStatus as jest.Mock).mockResolvedValue(undefined);

    const { UNSAFE_getByProps } = render(<DeliveryJobDetails />);

    const btn = UNSAFE_getByProps({ id: "update-status-btn" });
    const label = UNSAFE_getByProps({ id: "update-status-label" });

    // Initial state should be ASSIGNED, so the button label must be "Mark as Picked Up".
    expect(label.props.children).toBe("Mark as Picked Up");

    // Transition 1: ASSIGNED → IN_TRANSIT
    fireEvent.press(btn);

    await waitFor(() => {
      // The optimistic update changed the store to IN_TRANSIT, so the next action label must appear.
      expect(label.props.children).toBe("Mark as Delivered");

      // loading is false after the API resolves and the job is not yet DELIVERED,
      // so the button must be interactive again for the next press.
      expect(btn.props.disabled).toBe(false);
    });

    // Transition 2: IN_TRANSIT → DELIVERED

    // Simulate the courier tapping "Mark as Delivered".
    // advanceJobStatus fires immediately, setting the store to DELIVERED.
    fireEvent.press(btn);

    await waitFor(() => {
      // The item has now been delivered, this should be the last status update.
      expect(label.props.children).toBe("Delivered");

      // so the button stays permanently disabled — there is no further action for a delivered job.
      expect(btn.props.disabled).toBe(true);
    });
  });
});
