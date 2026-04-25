const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://13.229.124.39:8000").replace(/\/$/, "");

const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_SUMMARY_TIMEOUT_MS = Number(import.meta.env.VITE_TX_SUMMARY_TIMEOUT_MS || 15000);
const DEFAULT_ANALYZE_TIMEOUT_MS = Number(import.meta.env.VITE_ANALYZE_TIMEOUT_MS || 90000);
const DEFAULT_SAMPLE_FILE_NAME = "transaction_lines_sample.txt";

const buildTimeoutSignal = (timeoutMs) => {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(timeoutMs);
  }

  return undefined;
};

async function postJson(path, payload, timeoutMs = DEFAULT_TIMEOUT_MS) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: buildTimeoutSignal(timeoutMs),
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(`Planner API ${path} timed out after ${Math.round(timeoutMs / 1000)}s`);
    }
    throw error;
  }

  if (!response.ok) {
    let errorDetail;
    try {
      const errorPayload = await response.json();
      errorDetail = errorPayload?.detail || "";
    } catch {
      errorDetail = "";
    }

    const suffix = errorDetail ? `: ${errorDetail}` : "";
    throw new Error(`Planner API ${path} failed with status ${response.status}${suffix}`);
  }

  return response.json();
}

export async function getTransactionSummarySample({
  fileName = DEFAULT_SAMPLE_FILE_NAME,
  timeoutMs = DEFAULT_TIMEOUT_MS,
} = {}) {
  return postJson(
    "/transaction-summary-sample",
    { file_name: fileName },
    timeoutMs,
  );
}

export async function analyzeUserGoal({
  goal,
  userBackground,
  sampleFileName = DEFAULT_SAMPLE_FILE_NAME,
  timeoutMs,
  summaryTimeoutMs = timeoutMs ?? DEFAULT_SUMMARY_TIMEOUT_MS,
  analyzeTimeoutMs = timeoutMs ?? DEFAULT_ANALYZE_TIMEOUT_MS,
  months = 3,
  transactionsPerMonth = 18,
}) {
  const txSummary = await getTransactionSummarySample({
    fileName: sampleFileName,
    timeoutMs: summaryTimeoutMs,
  });

  return postJson(
    "/analyze-user",
    {
      goal,
      user_background: userBackground,
      transaction_summary: txSummary.summary,
      months,
      transactions_per_month: transactionsPerMonth,
    },
    analyzeTimeoutMs,
  );
}

export function getPlannerApiBaseUrl() {
  return API_BASE_URL;
}
