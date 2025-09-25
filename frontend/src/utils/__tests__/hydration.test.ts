import {
  isClient,
  isServer,
  safeWindow,
  useHydration,
  waitForHydration,
  suppressHydrationWarning,
} from "../hydration";

// Mock document
const mockDocument = {
  readyState: "loading",
  body: {
    hasAttribute: jest.fn(),
    removeAttribute: jest.fn(),
  },
};

// Mock window
const mockWindow = {
  location: { href: "http://localhost:3000" },
  innerWidth: 1024,
  innerHeight: 768,
};

// Store original values
const originalDocument = global.document;
const originalWindow = global.window;

describe("hydration utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up mocks before each test
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.document = mockDocument as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.window = mockWindow as any;
    // Reset document state
    mockDocument.readyState = "loading";
  });

  afterEach(() => {
    // Restore original values after each test
    global.document = originalDocument;
    global.window = originalWindow;
  });

  describe("isClient", () => {
    it("returns true when window is defined", () => {
      expect(isClient()).toBe(true);
    });
  });

  describe("isServer", () => {
    it("returns false when window is defined", () => {
      expect(isServer()).toBe(false);
    });
  });

  describe("safeWindow", () => {
    it("executes function and returns result when on client", () => {
      const fn = jest.fn(() => "client result");
      const fallback = "server fallback";

      const result = safeWindow(fn, fallback);

      expect(fn).toHaveBeenCalled();
      expect(result).toBe("client result");
    });

    it("returns fallback when function throws error", () => {
      const fn = jest.fn(() => {
        throw new Error("Test error");
      });
      const fallback = "error fallback";

      const result = safeWindow(fn, fallback);

      expect(fn).toHaveBeenCalled();
      expect(result).toBe("error fallback");
    });
  });

  describe("useHydration", () => {
    it("returns true when document is ready", () => {
      mockDocument.readyState = "complete";
      expect(useHydration()).toBe(true);
    });
  });

  describe("waitForHydration", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("resolves immediately when document is already complete", async () => {
      mockDocument.readyState = "complete";

      const result = await waitForHydration();
      expect(result).toBe(true);
    });

    it("waits for document to become complete", async () => {
      mockDocument.readyState = "loading";

      const promise = waitForHydration();

      // Should not resolve yet
      jest.advanceTimersByTime(50);
      let resolved = false;
      promise.then(() => {
        resolved = true;
      });
      expect(resolved).toBe(false);

      // Document becomes complete
      mockDocument.readyState = "complete";
      jest.advanceTimersByTime(100);

      const result = await promise;
      expect(result).toBe(true);
    });

    it("polls every 100ms until complete", async () => {
      mockDocument.readyState = "loading";

      const promise = waitForHydration();

      // First poll - still loading
      jest.advanceTimersByTime(100);
      let resolved = false;
      promise.then(() => {
        resolved = true;
      });
      expect(resolved).toBe(false);

      // Second poll - still loading
      jest.advanceTimersByTime(100);
      expect(resolved).toBe(false);

      // Third poll - becomes complete
      mockDocument.readyState = "complete";
      jest.advanceTimersByTime(100);

      const result = await promise;
      expect(result).toBe(true);
    });
  });
});
