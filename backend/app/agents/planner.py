from app.agents.common import run_agent_chain


PLANNER_INSTRUCTION = (
    "Create a staged plan with short-term, mid-term, and pre-loan milestone actions tied to the user goal."
)


def run_planner_agent(user_data: str, goal: str, insights: str, risk: str, growth: str) -> str:
    enriched_user_data = (
        f"Original data: {user_data}\n"
        f"Insights: {insights}\n"
        f"Risk summary: {risk}\n"
        f"Growth opportunities: {growth}"
    )
    return run_agent_chain(
        role="Planner Agent",
        instruction=PLANNER_INSTRUCTION,
        user_data=enriched_user_data,
        goal=goal,
    )
