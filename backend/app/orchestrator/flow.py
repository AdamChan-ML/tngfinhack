import logging
from concurrent.futures import ThreadPoolExecutor

from app.agents.coach import run_coach_agent
from app.agents.growth import run_growth_agent
from app.agents.insight import run_insight_agent
from app.agents.planner import run_planner_agent
from app.agents.risk import run_risk_agent
from app.models.schemas import AnalyzeUserResponse
from app.orchestrator.planner_formatter import build_compact_planner
from app.services.aws_service import compute_score

logger = logging.getLogger(__name__)


def analyze_user_flow(user_data: str, goal: str, transaction_summary: str) -> AnalyzeUserResponse:
    logger.info("Starting orchestration for goal=%s", goal)

    insights = run_insight_agent(user_data=user_data, goal=goal)

    with ThreadPoolExecutor(max_workers=2) as executor:
        risk_future = executor.submit(run_risk_agent, user_data, goal)
        growth_future = executor.submit(run_growth_agent, user_data, goal)
        risk = risk_future.result()
        growth = growth_future.result()

    plan = run_planner_agent(
        user_data=user_data,
        goal=goal,
        insights=insights,
        risk=risk,
        growth=growth,
    )

    final_advice = run_coach_agent(user_data=user_data, goal=goal, plan=plan)
    score = compute_score(user_data)
    planner = build_compact_planner(
        goal=goal,
        score=score,
        insights=insights,
        risk=risk,
        growth=growth,
        plan=plan,
        final_advice=final_advice,
    )

    logger.info("Finished orchestration with score=%s", score)
    return AnalyzeUserResponse(
        insights=insights,
        risk=risk,
        growth=growth,
        plan=plan,
        final_advice=final_advice,
        transaction_summary=transaction_summary,
        score=score,
        planner=planner,
    )
