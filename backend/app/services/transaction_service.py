import hashlib
import random
from datetime import date, timedelta
from pathlib import Path

from app.models.schemas import (
    MockTransaction,
    TransactionLinesSummaryRequest,
    TransactionLinesSummaryResponse,
    TransactionSampleSummaryRequest,
    TransactionSummaryRequest,
    TransactionSummaryResponse,
    UserBackground,
)
from app.services.qwen_service import call_qwen

INCOME_CATEGORIES = [
    "salary",
    "freelance",
    "side_hustle",
]

EXPENSE_CATEGORIES = [
    "rent",
    "utilities",
    "food",
    "transport",
    "mobile_data",
    "entertainment",
    "shopping",
    "debt_repayment",
]


def _seed_from_background(background: UserBackground) -> int:
    source = (
        f"{background.occupation}|{background.monthly_income}|{background.monthly_expenses}|"
        f"{background.savings_balance}|{background.existing_debt}|{background.risk_tolerance}|"
        f"{background.notes}"
    )
    digest = hashlib.sha256(source.encode("utf-8")).hexdigest()
    return int(digest[:16], 16)


def _build_user_data_text(
    user_background: UserBackground,
    summary_response: TransactionSummaryResponse,
) -> str:
    return (
        f"Occupation: {user_background.occupation}. "
        f"Monthly income baseline: RM {user_background.monthly_income:.2f}. "
        f"Monthly expense baseline: RM {user_background.monthly_expenses:.2f}. "
        f"Savings balance: RM {user_background.savings_balance:.2f}. "
        f"Existing debt: RM {user_background.existing_debt:.2f}. "
        f"Risk tolerance: {user_background.risk_tolerance}. "
        f"Additional notes: {user_background.notes or 'N/A'}. "
        f"Transaction summary: {summary_response.summary}"
    )


def _category_description(category: str) -> str:
    labels = {
        "salary": "Salary payout",
        "freelance": "Freelance work payment",
        "side_hustle": "Small side hustle income",
        "rent": "Housing rental payment",
        "utilities": "Utilities bill payment",
        "food": "Food and groceries",
        "transport": "Transport and commuting",
        "mobile_data": "Mobile and data plan",
        "entertainment": "Leisure and entertainment",
        "shopping": "General shopping spend",
        "debt_repayment": "Debt repayment",
    }
    return labels.get(category, category.replace("_", " ").title())


def generate_transaction_summary(
    request: TransactionSummaryRequest,
) -> TransactionSummaryResponse:
    user_background = request.user_background
    rng = random.Random(_seed_from_background(user_background))

    months = request.months
    per_month = request.transactions_per_month
    total_count = months * per_month

    start_date = date.today() - timedelta(days=months * 30)

    transactions: list[MockTransaction] = []
    total_income = 0.0
    total_expense = 0.0

    expected_income_tx = max(1, round(per_month * 0.15))

    for idx in range(total_count):
        month_index = idx // per_month
        day_offset = month_index * 30 + rng.randint(0, 29)
        tx_date = (start_date + timedelta(days=day_offset)).isoformat()

        in_month_index = idx % per_month
        if in_month_index < expected_income_tx:
            category = rng.choice(INCOME_CATEGORIES)
            amount = max(
                20.0,
                rng.gauss(user_background.monthly_income / expected_income_tx, 70),
            )
            direction = "income"
            total_income += amount
        else:
            category = rng.choice(EXPENSE_CATEGORIES)
            base_expense = user_background.monthly_expenses / max(1, per_month - expected_income_tx)
            if category == "debt_repayment" and user_background.existing_debt <= 0:
                category = rng.choice([c for c in EXPENSE_CATEGORIES if c != "debt_repayment"])
            amount = max(5.0, rng.gauss(base_expense, max(8.0, base_expense * 0.3)))
            direction = "expense"
            total_expense += amount

        transactions.append(
            MockTransaction(
                date=tx_date,
                amount=round(amount, 2),
                category=category,
                direction=direction,
                description=_category_description(category),
            )
        )

    total_income = round(total_income, 2)
    total_expense = round(total_expense, 2)
    net_cashflow = round(total_income - total_expense, 2)
    expense_ratio = round((total_expense / total_income), 3) if total_income else 0.0
    avg_monthly_savings = round(net_cashflow / months, 2)

    stability = "stable" if avg_monthly_savings >= 0 else "negative"
    debt_note = (
        "with active debt obligations"
        if user_background.existing_debt > 0
        else "with low debt pressure"
    )
    summary = (
        f"Over {months} months, estimated income RM {total_income:.2f} and expenses RM {total_expense:.2f} "
        f"produce net cashflow RM {net_cashflow:.2f} ({stability} trend), "
        f"expense ratio {expense_ratio:.2f}, and avg monthly savings RM {avg_monthly_savings:.2f}, {debt_note}."
    )

    return TransactionSummaryResponse(
        transactions=sorted(transactions, key=lambda t: t.date, reverse=True),
        total_income=total_income,
        total_expense=total_expense,
        net_cashflow=net_cashflow,
        expense_ratio=expense_ratio,
        avg_monthly_savings=avg_monthly_savings,
        summary=summary,
    )


def build_user_data_from_background(
    user_background: UserBackground,
    summary_response: TransactionSummaryResponse,
) -> str:
    return _build_user_data_text(user_background, summary_response)


def _parse_transaction_line(line: str) -> MockTransaction:
    """Parse one CSV-like line: date,amount,category,description."""
    parts = [p.strip() for p in line.split(",", 3)]
    if len(parts) != 4:
        raise ValueError(
            "Each transaction line must be: date,amount,category,description"
        )

    tx_date, amount_str, category, description = parts
    amount = float(amount_str)
    direction = "income" if amount >= 0 else "expense"

    return MockTransaction(
        date=tx_date,
        amount=round(abs(amount), 2),
        category=category,
        direction=direction,
        description=description,
    )


def summarize_transaction_lines_with_qwen(
    request: TransactionLinesSummaryRequest,
) -> TransactionLinesSummaryResponse:
    transactions = [_parse_transaction_line(line) for line in request.transaction_lines]

    total_income = round(
        sum(t.amount for t in transactions if t.direction == "income"),
        2,
    )
    total_expense = round(
        sum(t.amount for t in transactions if t.direction == "expense"),
        2,
    )
    net_cashflow = round(total_income - total_expense, 2)

    compact_lines = "\n".join(
        f"- {t.date} | {t.direction.upper()} | RM {t.amount:.2f} | {t.category} | {t.description}"
        for t in transactions[:60]
    )

    qwen_prompt = (
        "Summarize these Malaysian personal finance transactions for loan readiness and planning.\n"
        "Return concise plain text with: cashflow health, spending patterns, debt stress signals, and 3 practical next actions.\n"
        "Use RM currency style in examples.\n"
        f"Transaction count: {len(transactions)}\n"
        f"Total income: RM {total_income:.2f}\n"
        f"Total expense: RM {total_expense:.2f}\n"
        f"Net cashflow: RM {net_cashflow:.2f}\n"
        "Transactions:\n"
        f"{compact_lines}"
    )
    qwen_summary = call_qwen(qwen_prompt)

    fallback_prefix = (
        f"From {len(transactions)} transactions, income is RM {total_income:.2f}, "
        f"expenses RM {total_expense:.2f}, and net cashflow RM {net_cashflow:.2f}. "
    )
    summary = qwen_summary.strip() or (
        fallback_prefix
        + "Focus on reducing discretionary spend, building emergency savings, and paying high-interest debt first."
    )

    return TransactionLinesSummaryResponse(
        transactions=transactions,
        total_income=total_income,
        total_expense=total_expense,
        net_cashflow=net_cashflow,
        summary=summary,
    )


def load_transaction_lines_from_mock_file(file_name: str) -> list[str]:
    backend_dir = Path(__file__).resolve().parent.parent.parent
    mock_data_dir = (backend_dir / "mock_data").resolve()

    candidate = (mock_data_dir / file_name).resolve()
    if mock_data_dir not in candidate.parents or not candidate.is_file():
        raise ValueError("Requested mock data file does not exist")

    lines = [line.strip() for line in candidate.read_text(encoding="utf-8").splitlines()]
    filtered_lines = [line for line in lines if line]
    if not filtered_lines:
        raise ValueError("Mock data file is empty")

    return filtered_lines


def summarize_transaction_lines_from_mock_file(
    request: TransactionSampleSummaryRequest,
) -> TransactionLinesSummaryResponse:
    transaction_lines = load_transaction_lines_from_mock_file(request.file_name)
    return summarize_transaction_lines_with_qwen(
        TransactionLinesSummaryRequest(transaction_lines=transaction_lines)
    )
