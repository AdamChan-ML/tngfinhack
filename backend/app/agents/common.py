import logging
import json
from functools import lru_cache
from pathlib import Path

from langchain.prompts import PromptTemplate

from app.services.qwen_service import call_qwen

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def get_tng_facilities_context() -> str:
    """Load Touch 'n Go facilities context from file for prompt grounding."""
    knowledge_path = Path(__file__).resolve().parent.parent / "knowledge" / "tng_facilities.json"

    fallback = (
        "Touch 'n Go eWallet (Malaysia) features to use in guidance:\n"
        "- GO+: small-balance savings and emergency buffer habit\n"
        "- GOinvest: long-term investing after basic emergency savings\n"
        "- GOpinjam: cash loan only when affordable and necessary\n"
        "- GOinsure: protection planning for financial shocks\n"
        "Always show amounts in Malaysian Ringgit (MYR), e.g. RM100, RM250/month."
    )

    try:
        payload = json.loads(knowledge_path.read_text(encoding="utf-8"))
        return json.dumps(payload, ensure_ascii=False, indent=2)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Failed loading TNG facilities context from %s: %s", knowledge_path, exc)
        return fallback


def run_agent_chain(*, role: str, instruction: str, user_data: str, goal: str) -> str:
    """Run one agent prompt flow using LangChain prompt templating + QWEN inference."""
    try:
        tng_context = get_tng_facilities_context()
        prompt = PromptTemplate(
            input_variables=["user_data", "goal", "tng_context"],
            partial_variables={"role": role, "instruction": instruction},
            template=(
                "You are the {role} in a financial inclusion multi-agent system.\n"
                "Instruction: {instruction}\n"
                "Product Context (authoritative, persistent):\n{tng_context}\n"
                "Hard requirements:\n"
                "- Ground recommendations in available Touch 'n Go facilities when relevant.\n"
                "- Use Malaysian Ringgit (MYR/RM) in all monetary examples.\n"
                "- Be explicit about risk for loans/investments; do not promise returns.\n"
                "User Data: {user_data}\n"
                "Goal: {goal}\n"
                "Respond concisely and practically."
            ),
        )
        rendered = prompt.format(user_data=user_data, goal=goal, tng_context=tng_context)
        return call_qwen(rendered)
    except Exception as exc:  # noqa: BLE001
        logger.exception("QWEN %s execution failed: %s", role, exc)
        return (
            f"[{role}] Focus on reducing irregular expenses and improving savings rhythm "
            f"before taking on new credit for goal: {goal}."
        )
