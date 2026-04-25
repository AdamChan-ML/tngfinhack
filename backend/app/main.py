import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.analyze import router as analyze_router
from app.routes.transactions import router as transaction_router


def configure_logging() -> None:
    level = os.getenv("LOG_LEVEL", "INFO").upper()
    logging.basicConfig(
        level=level,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    )


configure_logging()

app = FastAPI(
    title="Financial Inclusion AI Orchestration Platform",
    version="1.0.0",
    description="Hackathon-ready multi-agent backend with AWS scoring and Alibaba Qwen coaching.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router)
app.include_router(transaction_router)


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}
