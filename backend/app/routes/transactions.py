from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    TransactionLinesSummaryRequest,
    TransactionLinesSummaryResponse,
    TransactionSampleSummaryRequest,
    TransactionSummaryRequest,
    TransactionSummaryResponse,
)
from app.services.transaction_service import (
    generate_transaction_summary,
    summarize_transaction_lines_from_mock_file,
    summarize_transaction_lines_with_qwen,
)

router = APIRouter(tags=["transactions"])


@router.post("/transaction-summary", response_model=TransactionSummaryResponse)
def transaction_summary(payload: TransactionSummaryRequest) -> TransactionSummaryResponse:
    return generate_transaction_summary(payload)


@router.post(
    "/transaction-summary-lines",
    response_model=TransactionLinesSummaryResponse,
)
def transaction_summary_lines(
    payload: TransactionLinesSummaryRequest,
) -> TransactionLinesSummaryResponse:
    return summarize_transaction_lines_with_qwen(payload)


@router.post(
    "/transaction-summary-sample",
    response_model=TransactionLinesSummaryResponse,
)
def transaction_summary_sample(
    payload: TransactionSampleSummaryRequest,
) -> TransactionLinesSummaryResponse:
    try:
        return summarize_transaction_lines_from_mock_file(payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
