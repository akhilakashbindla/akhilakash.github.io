# backend/rag.py - RAG with Chroma (pure Python, no compilation)

from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.utils import embedding_functions
import os
import json

# Embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')
ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name='all-MiniLM-L6-v2')

# Chroma client (persistent on disk)
client = chromadb.PersistentClient(path="./chroma_db")

# Collection name
COLLECTION_NAME = "portfolio_knowledge"

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

def build_index():
    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=ef
    )

    # Only add if empty (idempotent)
    if collection.count() == 0:
        documents, sources = load_documents()
        if not documents:
            raise ValueError("No documents found in data/")

        collection.add(
            documents=documents,
            metadatas=[{"source": src} for src in sources],
            ids=[f"doc_{i}" for i in range(len(documents))]
        )
        print(f"Added {len(documents)} documents to Chroma collection")

def retrieve(query: str, k: int = 3):
    build_index()  # Ensure collection exists
    collection = client.get_collection(name=COLLECTION_NAME)

    results = collection.query(
        query_texts=[query],
        n_results=k
    )

    return [
        {
            "text": doc,
            "source": meta["source"],
            "distance": dist
        }
        for doc, meta, dist in zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0]
        )
    ]
