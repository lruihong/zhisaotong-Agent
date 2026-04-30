from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from agent.react_agent import ReactAgent


app = FastAPI(title="智扫通机器人智能客服 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 开发阶段先放开
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = ReactAgent()


class ChatRequest(BaseModel):
    message: str


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/chat/stream")
def chat_stream(req: ChatRequest):
    def generate():
        for chunk in agent.execute_stream(req.message):
            yield chunk

    return StreamingResponse(generate(), media_type="text/plain; charset=utf-8")