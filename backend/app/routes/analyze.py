from fastapi import APIRouter

from app.models.schemas import (
    AnalyzeUserRequest,
    AnalyzeUserResponse,
    TransactionLinesSummaryRequest,
    TransactionSummaryRequest,
)
from app.orchestrator.flow import analyze_user_flow
from app.services.transaction_service import (
    build_user_data_from_background,
    generate_transaction_summary,
    summarize_transaction_lines_with_qwen,
)

router = APIRouter(tags=["analysis"])


@router.post("/analyze-user", response_model=AnalyzeUserResponse)
def analyze_user(payload: AnalyzeUserRequest) -> AnalyzeUserResponse:
    summary_response = generate_transaction_summary(
        request=TransactionSummaryRequest(
            user_background=payload.user_background,
            months=payload.months,
            transactions_per_month=payload.transactions_per_month,
        )
    )
    summary_text = payload.transaction_summary or summary_response.summary
    if payload.transaction_lines:
        lines_summary = summarize_transaction_lines_with_qwen(
            TransactionLinesSummaryRequest(transaction_lines=payload.transaction_lines)
        )
        summary_text = payload.transaction_summary or lines_summary.summary

    normalized_user_data = build_user_data_from_background(
        user_background=payload.user_background,
        summary_response=summary_response,
    )

    if payload.transaction_lines:
        normalized_user_data = (
            f"{normalized_user_data} "
            f"Detailed transaction data summary (QWEN): {summary_text}"
        )
    elif payload.transaction_summary:
        normalized_user_data = normalized_user_data.replace(
            summary_response.summary,
            payload.transaction_summary,
        )
    return analyze_user_flow(
        user_data=normalized_user_data,
        goal=payload.goal,
        transaction_summary=summary_text,
    )
