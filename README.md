# 📘 Chatbot SSE + RAG Backend (Next.js + Vercel)

## Overview

This project is a **production-ready chatbot backend** built with **Next.js 14 App Router**, leveraging:

* **Edge runtime** for fast, streaming LLM responses
* **Node runtime** for database persistence and heavy tasks (PDF/DOC ingestion)
* **RAG (Retrieval-Augmented Generation)** with pgvector
* **Authentication & Role-Based Access Control (RBAC)**
* **PDF/DOC ingestion** with chunking and embeddings
* **Server-Sent Events (SSE)** for real-time streaming

---

## 📁 File Structure

```
chatbot-sse/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts           ← EDGE ROUTE (SSE + Agent streaming)
│   │   ├── messages/
│   │   │   └── route.ts           ← NODE ROUTE (DB persistence)
│   │   └── documents/
│   │       └── upload/route.ts    ← NODE ROUTE (PDF/DOC ingestion)
│   └── layout.tsx
├── lib/
│   ├── auth/
│   │   ├── index.ts               ← Auth.js configuration
│   │   └── permission.ts          ← RBAC helpers
│   ├── db/
│   │   ├── index.ts               ← DB client
│   │   └── queries.ts             ← DB queries (saveMessage, etc.)
│   ├── memory/
│   │   ├── context.ts             ← RAG context builder
│   │   └── embed.ts               ← OpenAI embeddings helper
│   └── llm/
│       ├── agent.ts               ← Agent logic
│       └── agent-stream.ts        ← Streaming helper
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

---

## ⚡ CHATBOT BACKEND ARCHITECTURE (Next.js 14, App Router, Vercel)

This diagram illustrates the **Edge vs Node routes**, **message flow**, **RAG / vector store**, and **DB persistence** in your chatbot backend:

![Chatbot SSE + RAG Backend](./An_infographic_in_the_README.md_file_illustrates_t.png)

**Flow Highlights:**

1. **Edge Route (`/api/chat`)**

   * Handles **streaming + inference**
   * Reads context from **RAG / vector DB**
   * Fire-and-forget writes to Node route
   * Fast, low-latency (Vercel Edge)

2. **Node Route (`/api/messages`)**

   * Handles **persistent DB writes**
   * Runs in Node runtime (can use Postgres TCP)
   * Ensures **exactly-once message saving**

3. **PDF/DOC ingestion**

   * Node-only route: `/api/documents/upload`
   * Processes files → chunk → embeddings → pgvector
   * Can be queued for async processing

4. **Auth & Permissions**

   * Edge or Node routes use `auth()` + `assertPermission()`
   * Roles determine access to Node-only routes

5. **Lib Folder**

   * Shared code: `db/`, `memory/`, `llm/`, `auth/`
   * Can be imported from both Edge and Node

**Design Principles:**

* Edge = streaming & inference
* Node = persistence & CPU-heavy tasks
* Fire-and-forget DB writes prevent blocking Edge route
* RAG + semantic search ensures context-aware responses
* RBAC keeps multi-tenant / SaaS scenarios safe

---

## 🛠 Features

### 1. Edge Streaming

* Fast inference for LLM responses
* Server-Sent Events (SSE)
* Fire-and-forget message persistence

### 2. Node Persistence

* Reliable DB writes
* Handles exactly-once message saving
* Supports heavy PDF/DOC ingestion

### 3. RAG / Vector Search

* Embedding-based context retrieval
* Supports chunked documents
* Collection-based search / filtering

### 4. PDF / DOC Ingestion

* Upload PDF or DOCX
* Chunking with overlap
* Embedding generation
* Stores in pgvector

### 5. Authentication & RBAC

* Auth.js v5 configuration
* JWT-based sessions
* Role-based permissions
* `assertPermission()` and `hasPermission()` helpers

---

## 🔧 Setup

1. Install dependencies

```bash
npm install
```

2. Set environment variables

```
OPENAI_API_KEY=your_openai_key
DATABASE_URL=your_postgres_url
NEXT_PUBLIC_BASE_URL=http://localhost:3000
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```

3. Run dev server

```bash
npm run dev
```

---

## 📝 Usage Examples

### POST message to chat (Edge)

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"conversationId": "123", "message": "Hello, bot!"}'
```

### Upload PDF / DOCX (Node)

```bash
curl -X POST http://localhost:3000/api/documents/upload \
  -F "file=@example.pdf"
```

### Save messages (Node)

This happens automatically via **fire-and-forget** from the Edge route.

---

## ⚡ Permissions Example

```ts
import { auth } from "@/lib/auth";
import { assertPermission } from "@/lib/auth/permission";

const session = await auth();
const role = session.user.role ?? "user";

assertPermission(role, "documents:upload");
```

---

## 📦 Database Schema (Postgres / pgvector)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id TEXT,
  role TEXT,
  content TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  content TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE message_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT,
  embedding vector(1536),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now()
);
```

---

## 🧠 Design Principles

* **Edge for streaming + inference**
* **Node for DB + heavy tasks**
* **Lib folder outside `app/`** for clean alias imports
* **Fire-and-forget writes** prevent blocking Edge route
* **RAG + semantic search** ensures context-aware responses
* **RBAC** keeps multi-tenant / SaaS scenarios safe

---

## 🚀 Next Steps / Enhancements

* Background ingestion queue
* Real-time token streaming to DB
* Per-collection RBAC / permissions
* Rate-limiting per user / role
* Multi-agent orchestration
