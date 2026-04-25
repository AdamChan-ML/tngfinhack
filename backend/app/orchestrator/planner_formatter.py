import re
from typing import Iterable

from app.models.schemas import PlannerCompact, PlannerMilestone, PlannerStage


def _clean_line(text: str) -> str:
    text = re.sub(r"\*{1,2}", "", text)
    text = text.replace("✅", "").replace("❗", "").replace("💡", "")
    text = re.sub(r"^\s*[-•]\s*", "", text)
    text = re.sub(r"^\s*\d+[\.)]\s*", "", text)
    text = re.sub(r"\s+", " ", text).strip(" -:\n\t")
    return text


def _split_sentences(text: str) -> list[str]:
    cleaned = re.sub(r"\s+", " ", text).strip()
    if not cleaned:
        return []
    parts = re.split(r"(?<=[.!?])\s+", cleaned)
    return [p.strip() for p in parts if p.strip()]


def _extract_bullets(text: str) -> list[str]:
    bullets: list[str] = []
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        if line.startswith(("-", "•", "✅", "❗")) or re.match(r"^\d+[\.)]\s", line):
            cleaned = _clean_line(line)
            if cleaned:
                bullets.append(cleaned)
    return bullets


def _take_unique(items: Iterable[str], limit: int) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for item in items:
        normalized = item.strip().lower()
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        result.append(item.strip())
        if len(result) >= limit:
            break
    return result


def _map_facility(text: str) -> tuple[str | None, str | None]:
    lower = text.lower()

    if any(token in lower for token in ("go+", "buffer", "emergency", "autosave", "auto-save", "weekly save")):
        return "GO+", "Open GO+"
    if any(token in lower for token in ("gopinjam", "cashloan", "cash loan", "loan")):
        return "GOpinjam", "Open CashLoan"
    if any(token in lower for token in ("goinvest", "invest", "investment", "asnb", "emas", "principal", "e-trade")):
        return "GOinvest", "Open GOinvest"
    if any(token in lower for token in ("goinsure", "insure", "insurance", "protection", "coverage")):
        return "GOinsure", "Open GOinsure"

    return None, None


def _build_stages(plan: str) -> list[PlannerStage]:
    stage_defs = [
        ("Short-Term", "1-2 months"),
        ("Mid-Term", "3-6 months"),
        ("Pre-Loan", "before borrowing"),
    ]
    bullets = _extract_bullets(plan)
    if not bullets:
        return [
            PlannerStage(
                title="Short-Term",
                timeframe="1-2 months",
                steps=["Start a weekly GO+ auto-save and track progress."],
            )
        ]

    chunk = max(len(bullets) // len(stage_defs), 1)
    stages: list[PlannerStage] = []
    for idx, (title, timeframe) in enumerate(stage_defs):
        start = idx * chunk
        end = start + chunk
        stage_steps = bullets[start:end] if idx < len(stage_defs) - 1 else bullets[start:]
        if not stage_steps:
            continue
        stages.append(
            PlannerStage(
                title=title,
                timeframe=timeframe,
                steps=_take_unique((_clean_line(s) for s in stage_steps), 3),
            )
        )

    return stages or [
        PlannerStage(
            title="Short-Term",
            timeframe="1-2 months",
            steps=_take_unique((_clean_line(s) for s in bullets), 3),
        )
    ]


def build_compact_planner(
    *,
    goal: str,
    score: int,
    insights: str,
    risk: str,
    growth: str,
    plan: str,
    final_advice: str,
) -> PlannerCompact:
    insight_summary = _split_sentences(insights)
    risk_summary = _split_sentences(risk)
    growth_summary = _split_sentences(growth)
    advice_summary = _split_sentences(final_advice)

    quick_summary = _take_unique(
        [
            _clean_line(insight_summary[0]) if insight_summary else "",
            _clean_line(risk_summary[0]) if risk_summary else "",
            _clean_line(growth_summary[0]) if growth_summary else "",
        ],
        3,
    )

    guardrail_candidates = _extract_bullets(risk) + _extract_bullets(final_advice)
    guardrails = _take_unique((_clean_line(item) for item in guardrail_candidates), 4)
    if not guardrails and risk_summary:
        guardrails = _take_unique((_clean_line(s) for s in risk_summary[:2]), 2)

    milestone_candidates = _extract_bullets(plan) + _extract_bullets(growth) + _extract_bullets(final_advice)
    milestone_lines = _take_unique((_clean_line(item) for item in milestone_candidates), 4)
    if not milestone_lines:
        milestone_lines = [
            "Set weekly GO+ auto-save.",
            "Build RM1,000 emergency buffer.",
            "Test repayment discipline for 3 months.",
            "Reassess affordability before borrowing.",
        ]

    milestones: list[PlannerMilestone] = []
    for idx, line in enumerate(milestone_lines):
        facility, action_label = _map_facility(line)
        milestones.append(
            PlannerMilestone(
                title=line[:90],
                hint="Keep this action consistent each week.",
                status="in_progress" if idx == 0 else "pending",
                optional=False,
                facility=facility,
                action_label=action_label,
            )
        )

    headline_source = advice_summary[0] if advice_summary else (quick_summary[0] if quick_summary else "Plan ready")
    headline = _clean_line(headline_source)[:140]

    return PlannerCompact(
        headline=headline,
        goal=goal,
        progress=0,
        score=score,
        quick_summary=quick_summary,
        guardrails=guardrails,
        milestones=milestones,
        stages=_build_stages(plan),
    )
