import logging
import os

import requests

logger = logging.getLogger(__name__)


def call_qwen(prompt: str) -> str:
    """Call Alibaba Qwen API (mock-friendly)."""
    api_key = os.getenv("QWEN_API_KEY", "").strip()
    endpoint = os.getenv(
        "QWEN_API_URL",
        "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    )
    model = os.getenv("QWEN_MODEL", "qwen-plus")

    if not api_key:
        logger.warning("QWEN_API_KEY not set; using local mock response.")
        return (
            "Here is a friendly plan: start with a small weekly savings habit, "
            "repay high-interest debt first, and review progress monthly."
        )

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You are a supportive financial coach."},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.4,
    }

    try:
        response = requests.post(endpoint, json=payload, headers=headers, timeout=120)
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"].strip()
    except Exception as exc:  # noqa: BLE001
        logger.exception("Qwen request failed; falling back to mock response: %s", exc)
        return (
            "I created a simple path for your goal: improve cashflow discipline, "
            "build a safety buffer, and apply when your score trend improves."
        )
