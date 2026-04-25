from app.agents.common import get_tng_facilities_context, run_agent_chain
from app.services.qwen_service import call_qwen


COACH_INSTRUCTION = (
    "Transform the financial plan into a simple, friendly explanation for a non-technical user."
)


def run_coach_agent(user_data: str, goal: str, plan: str) -> str:
    draft = run_agent_chain(
        role="Coach Agent",
        instruction=COACH_INSTRUCTION,
        user_data=f"User behavior: {user_data}\nPlan draft: {plan}",
        goal=goal,
    )

    tng_context = get_tng_facilities_context()
    qwen_prompt = (
        "Use the following authoritative Touch 'n Go feature reference:\n"
        f"{tng_context}\n\n"
        "Rewrite this guidance in supportive, plain-language bullet points under 120 words.\n"
        "Always use Malaysian Ringgit (MYR/RM) for monetary examples.\n"
        "Mention relevant Touch 'n Go facilities (GO+, GOinvest, GOpinjam, GOinsure) when useful.\n"
        f"Goal: {goal}\n"
        f"Draft Advice: {draft}\n"
        f"Plan: {plan}"
    )
    return call_qwen(qwen_prompt)
