import { useCallback } from "react";

interface ErrorLoggerOptions {
  service?: string;
  context?: Record<string, unknown>;
}

export function useErrorLogger() {
  const logError = useCallback((error: Error, options?: ErrorLoggerOptions) => {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      service: options?.service || "frontend",
      context: options?.context,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error logged:", errorInfo);
    }

    // In production, you would send this to your error reporting service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    if (process.env.NODE_ENV === "production") {
      // TODO: Implement error reporting service integration
      // Example: Sentry.captureException(error, { extra: errorInfo })
    }
  }, []);

  return { logError };
}
