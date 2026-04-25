from app.agents.common import run_agent_chain


INSIGHT_INSTRUCTION = (
    "Analyze the user behavior and summarize cashflow quality, spending discipline, and savings signal."
)


def run_insight_agent(user_data: str, goal: str) -> str:
    return run_agent_chain(
        role="Insight Agent",
        instruction=INSIGHT_INSTRUCTION,
        user_data=user_data,
        goal=goal,
    )
