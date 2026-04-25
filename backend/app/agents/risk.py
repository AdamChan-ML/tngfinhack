from app.agents.common import run_agent_chain


RISK_INSTRUCTION = (
    "Provide a conservative risk review for loan readiness. Highlight debt stress, repayment fragility, and caution points."
)


def run_risk_agent(user_data: str, goal: str) -> str:
    return run_agent_chain(
        role="Risk Agent",
        instruction=RISK_INSTRUCTION,
        user_data=user_data,
        goal=goal,
    )
