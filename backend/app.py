# backend/app.py - FastAPI + Grok API for Cipher

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from rag import retrieve, detect_injection
from groq import Groq  # pip install groq
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Cipher AI Backend")

client = Groq(api_key=os.getenv("GROQ_API_KEY"))  # Get free key at https://console.groq.com

class ChatRequest(BaseModel):
    message: str
    page: str = "unknown"

@app.post("/chat")
async def chat(request: ChatRequest):
    if detect_injection(request.message):
        return {"response": "⚠ Prompt injection attempt detected. Request blocked for security."}

    # Retrieve relevant context from RAG
    retrieved = retrieve(request.message, k=3)
    context = "\n\n".join([r["text"] for r in retrieved])

    # Build prompt for Grok
    system_prompt = f"""
You are Cipher, Akhil Akash Bindla's intelligent portfolio assistant.
Answer only using the provided knowledge.
Current page: {request.page}
Context:
{context}

Respond naturally, professionally, and helpfully.
Attach relevant project links when possible.
Use first person as Akhil for interview-style questions.
"""

    try:
        response = client.chat.completions.create(
            model="grok-3-mini",  # or "grok-3" if available
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message}
            ],
            temperature=0.7,
            max_tokens=500
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health():
    return {"status": "healthy"}
