import posthog from "posthog-js"

if (
  typeof window !== "undefined" &&
  typeof window.localStorage !== "undefined" &&
  typeof window.localStorage.getItem === "function"
) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ph",
    ui_host: "https://eu.posthog.com",
    defaults: "2025-05-24",
    capture_exceptions: true, // This enables capturing exceptions using Error Tracking, set to false if you don't want this
    debug: process.env.NODE_ENV === "development",
  });
}
