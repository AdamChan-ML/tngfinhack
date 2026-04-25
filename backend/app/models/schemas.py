from pydantic import BaseModel, Field


class UserBackground(BaseModel):
    occupation: str = Field(..., min_length=2)
    monthly_income: float = Field(..., ge=0)
    monthly_expenses: float = Field(..., ge=0)
    savings_balance: float = Field(default=0, ge=0)
    existing_debt: float = Field(default=0, ge=0)
    risk_tolerance: str = Field(default="medium", description="low, medium, or high")
    notes: str = Field(
        default="",
        description="Optional free-text background details, such as family commitments",
    )


class TransactionSummaryRequest(BaseModel):
    user_background: UserBackground
    months: int = Field(default=3, ge=1, le=12)
    transactions_per_month: int = Field(default=18, ge=5, le=120)


class MockTransaction(BaseModel):
    date: str
    amount: float
    category: str
    direction: str = Field(description="income or expense")
    description: str


class TransactionSummaryResponse(BaseModel):
    transactions: list[MockTransaction] = Field(default_factory=list)
    total_income: float
    total_expense: float
    net_cashflow: float
    expense_ratio: float
    avg_monthly_savings: float
    summary: str


class TransactionLinesSummaryRequest(BaseModel):
    transaction_lines: list[str] = Field(
        ..., min_length=1, description="One transaction per line in CSV format"
    )


class TransactionLinesSummaryResponse(BaseModel):
    transactions: list[MockTransaction] = Field(default_factory=list)
    total_income: float
    total_expense: float
    net_cashflow: float
    summary: str


class TransactionSampleSummaryRequest(BaseModel):
    file_name: str = Field(
        default="transaction_lines_sample.txt",
        description="Filename in backend/mock_data containing one transaction line per row",
    )


class AnalyzeUserRequest(BaseModel):
    user_background: UserBackground
    goal: str = Field(..., min_length=3, description="User financial goal")
    transaction_summary: str | None = Field(
        default=None,
        description="Optional summary text returned from /transaction-summary",
    )
    transaction_lines: list[str] = Field(
        default_factory=list,
        description="Optional one-line-per-transaction records to summarize with QWEN",
    )
    months: int = Field(
        default=3,
        ge=1,
        le=12,
        description="Number of months of mock transactions for summary generation",
    )
    transactions_per_month: int = Field(
        default=18,
        ge=5,
        le=120,
        description="Approximate number of generated transactions per month",
    )


class PlannerMilestone(BaseModel):
    title: str
    hint: str
    status: str = Field(default="pending", description="in_progress or pending")
    optional: bool = False
    facility: str | None = Field(
        default=None,
        description="Mapped TNG facility: GO+, GOinvest, GOpinjam, or GOinsure",
    )
    action_label: str | None = Field(
        default=None,
        description="Short CTA label for UI action button/icon",
    )


class PlannerStage(BaseModel):
    title: str
    timeframe: str
    steps: list[str] = Field(default_factory=list)


class PlannerCompact(BaseModel):
    headline: str
    goal: str
    progress: int = Field(default=0, ge=0, le=100)
    score: int = Field(..., ge=0, le=100)
    quick_summary: list[str] = Field(default_factory=list)
    guardrails: list[str] = Field(default_factory=list)
    milestones: list[PlannerMilestone] = Field(default_factory=list)
    stages: list[PlannerStage] = Field(default_factory=list)


class AnalyzeUserResponse(BaseModel):
    insights: str
    risk: str
    growth: str
    plan: str
    final_advice: str
    transaction_summary: str
    score: int = Field(..., ge=0, le=100)
    planner: PlannerCompact
