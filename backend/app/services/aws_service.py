import logging
import re
from typing import Iterable

logger = logging.getLogger(__name__)


def _keyword_hits(text: str, words: Iterable[str]) -> int:
    lower = text.lower()
    return sum(1 for w in words if w in lower)


def compute_score(user_data: str) -> int:
    """Compute a demo-friendly financial health score.

    In production, this can call AWS analytics services (e.g., Lambda/SageMaker).
    """
    risk_words = [
        "late payment",
        "debt",
        "overdue",
        "default",
        "borrow",
        "gambling",
        "unstable",
    ]
    healthy_words = [
        "savings",
        "budget",
        "stable",
        "consistent income",
        "discipline",
        "invest",
        "emergency fund",
    ]

    digits = [int(x) for x in re.findall(r"\d+", user_data)]
    volatility_penalty = min(15, len(digits) * 2)

    base = 60
    base -= _keyword_hits(user_data, risk_words) * 6
    base += _keyword_hits(user_data, healthy_words) * 5
    base -= volatility_penalty

    score = max(0, min(100, base))
    logger.info("Computed financial score=%s", score)
    return score
