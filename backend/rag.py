# backend/rag.py - Basic RAG with FAISS

from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from typing import List, Dict
import os

# Load embedding model (all-MiniLM-L6-v2 is fast & good)
model = SentenceTransformer('all-MiniLM-L6-v2')

# Load documents from data folder
def load_documents():
    documents = []
    sources = []
    for filename in os.listdir("data"):
        if filename.endswith(".txt"):
            with open(f"data/{filename}", "r", encoding="utf-8") as f:
                text = f.read().strip()
                documents.append(text)
                sources.append(filename)
    return documents, sources

# Build or load vector index
def build_index():
    documents, sources = load_documents()
    if not documents:
        raise ValueError("No documents found in data folder")

    embeddings = model.encode(documents, show_progress_bar=True)
    dimension = embeddings.shape[1]

    index = faiss.IndexFlatL2(dimension)
    index.add(np.array(embeddings))

    # Save metadata
    metadata = [{"source": src, "text": doc} for src, doc in zip(sources, documents)]
    faiss.write_index(index, "faiss_index.index")
    with open("metadata.json", "w", encoding="utf-8") as f:
        import json
        json.dump(metadata, f)

    return index, metadata

# Retrieve relevant chunks
def retrieve(query: str, k: int = 3):
    if not os.path.exists("faiss_index.index"):
        index, metadata = build_index()
    else:
        index = faiss.read_index("faiss_index.index")
        with open("metadata.json", "r", encoding="utf-8") as f:
            import json
            metadata = json.load(f)

    query_embedding = model.encode([query])
    distances, indices = index.search(np.array(query_embedding), k)

    results = []
    for idx, dist in zip(indices[0], distances[0]):
        if idx == -1:
            continue
        results.append({
            "text": metadata[idx]["text"],
            "source": metadata[idx]["source"],
            "distance": float(dist)
        })
    return results

# Simple prompt injection check
def detect_injection(text: str) -> bool:
    blocked = [
        "ignore previous instructions",
        "override system",
        "drop table",
        "system prompt",
        "forget all previous",
        "jailbreak",
        "developer mode"
    ]
    return any(p in text.lower() for p in blocked)

