# backend/rag.py - RAG with Chroma (pure Python, Render-safe)

from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.utils import embedding_functions
import os
import uuid

# Embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')
ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name='all-MiniLM-L6-v2')

# Persistent Chroma client (Render supports disk persistence)
client = chromadb.PersistentClient(path="./chroma_db")

collection_name = "portfolio_knowledge"
collection = client.get_or_create_collection(
    name=collection_name,
    embedding_function=ef
)

def load_documents():
    documents = []
    sources = []
    ids = []
    for filename in os.listdir("data"):
        if filename.endswith(".txt"):
            with open(f"data/{filename}", "r", encoding="utf-8") as f:
                text = f.read().strip()
                documents.append(text)
                sources.append(filename)
                ids.append(str(uuid.uuid4()))  # unique ID
    return documents, sources, ids

def build_index():
    if collection.count() == 0:
        documents, sources, ids = load_documents()
        if not documents:
            raise ValueError("No documents found in data/")
        collection.add(
            documents=documents,
            metadatas=[{"source": src} for src in sources],
            ids=ids
        )
        print(f"Added {len(documents)} documents to Chroma collection")

def retrieve(query: str, k: int = 3):
    build_index()  # Ensure index exists
    results = collection.query(
        query_texts=[query],
        n_results=k
    )
    return [
        {
            "text": doc,
            "source": meta["source"],
            "distance": float(dist)
        }
        for doc, meta, dist in zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0]
        )
    ]
