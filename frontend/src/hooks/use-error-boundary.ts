import { useCallback } from "react";

/**
 * Custom hook for programmatic error handling
 * Useful for async operations and form validation
 */
export function useErrorBoundary() {
  const captureError = useCallback((error: Error) => {
    // This will trigger the nearest ErrorBoundary
    throw error;
  }, []);

  return { captureError };
}

/**
 * Hook for handling async errors in components
 */
export function useAsyncError() {
  const { captureError } = useErrorBoundary();

  const handleAsyncError = useCallback(
    (error: unknown) => {
      if (error instanceof Error) {
        captureError(error);
      } else {
        captureError(new Error(String(error)));
      }
    },
    [captureError]
  );

  return { handleAsyncError };
}
