from app.agents.common import run_agent_chain


GROWTH_INSTRUCTION = (
    "Suggest realistic improvements such as micro-savings, repayment discipline, and healthy financial habits."
)


def run_growth_agent(user_data: str, goal: str) -> str:
    return run_agent_chain(
        role="Growth Agent",
        instruction=GROWTH_INSTRUCTION,
        user_data=user_data,
        goal=goal,
    )
