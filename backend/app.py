# backend/app.py - FastAPI + Groq API for Cipher AI

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from rag import retrieve, detect_injection  # assuming you have rag.py from earlier
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Cipher AI Backend")

# Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

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

    # Build system prompt
    system_prompt = f"""
You are Cipher, Akhil Akash Bindla's intelligent portfolio assistant.
Answer only using the provided knowledge and context.
Current page: {request.page}
Context from knowledge base:
{context}

Respond naturally, professionally, and helpfully.
Attach relevant project links when possible.
Use first person as Akhil for interview-style questions.
Keep answers concise but informative.
"""

    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message}
            ],
            model="llama-3.1-70b-versatile",  # very strong & fast on Groq
            temperature=0.7,
            max_tokens=600,
            top_p=0.9,
            stream=False
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Groq API error: {str(e)}")

@app.get("/health")
def health():
    return {"status": "healthy"}
