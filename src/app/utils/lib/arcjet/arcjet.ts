import arcjet, {
  detectBot,
  fixedWindow,
  shield,
  validateEmail,
} from "@arcjet/next";

// Initialize Arcjet with the validation rules
export const ajEmail = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    validateEmail({
      mode: process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
      block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
    }),
  ],
});

export const ajMiddleware = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({
      mode: "LIVE",
    }),
    fixedWindow({
      mode: process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
      window: "1h",
      max: 1000,
    }),
    detectBot({
      mode: process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
  ],
});
