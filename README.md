# 🤖 RAGBot.AI
RAGBot.AI is a **Retrieval-Augmented Generation (RAG)** application that allows users to upload PDF documents, build a searchable knowledge base and ask questions in natural language.  
The system retrieves relevant context from documents and generates accurate, source-grounded answers using an LLM.

## 🧠 Architecture Overview
- **Backend**: Django + Django REST Framework  
- **RAG Stack**: LangChain, FAISS, OpenAI Embeddings  
- **Frontend**: React + Vite + Tailwind CSS  
- **Vector Store**: FAISS (local persistence)
- **API**: REST API and OpenAI API key

## Flow
```
Frontend (Vite + React)
↓
Backend API (Django + DRF)
↓
FAISS Vector Store
↓
OpenAI LLM
↓
Response from Django Server
↓
Answer on Browser
```

## 📁 Project Structure
```
RAGBot.AI/
├── backend/
│   ├── backend/            # Django project settings
│   ├── RAG_app/            # Core RAG logic (views, services)
│   ├── vectorstore
│   │     └── db_faiss
│   │          └── index.faiss
│   ├── .env
│   ├── db.sqlite3
│   ├── index.faiss
│   ├── manage.py
│   └── req.txt
│
├── frontend/
│    ├── node_modules/
│    ├── public/
│    │   └── vite.svg
│    ├── src/
│    │   ├── App.jsx          
│    │   ├── main.jsx         
│    │   └── index.css        
│    ├── eslint.config.js
│    ├── index.html
│    ├── package-lock.json
│    ├── package.json
│    ├── postcss.config.js
│    ├── tailwind.config.js
│    └── vite.config.js
│
├── .gitignore
└── README.md

```

## ⚙️ Backend Setup (Django)

### 1️⃣ Create and activate virtual environment

```bash
cd backend
## Activate the virtual environment
python -m venv rag_env

## Windows:
rag_env\Scripts\activate

## macOS / Linux:
source rag_env/bin/activate
```

### 2️⃣ Install backend dependencies
```bash
pip install -r req.txt
```

### 3️⃣ Create .env file
```bash
## Create a file named .env inside the backend/ directory and add:

OPENAI_API_KEY=your_openai_api_key_here
VECTORSTORE_PATH=vectorstore/db_faiss
RAG_DATA_PATH=data

## ⚠️ Never commit your OpenAI API key to version control.
```

### 4️⃣ Migrate & Run the Django server
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
## Backend will be available at: http://127.0.0.1:8000
```

## 🎨 Frontend Setup (Vite + React)
### 1️⃣ Install frontend dependencies
```bash
cd frontend
npm install
```

### 2️⃣ Start development server
```bash
npm run dev
## Frontend will be available at: http://localhost:5173
```

## 🚀 Features

- 📂 Build knowledge base from server-side PDF directory
- 📄 Upload PDFs and dynamically rebuild vector store
- 🔍 Semantic search using FAISS
- 💬 Ask questions in natural language
- 📌 Source-aware answers
- 🧪 JSON debug view for transparency
- ⚡ Fast UI with Vite + Tailwind CSS


## 🔗 API Endpoints
```
Method	    Endpoint	                    Description
POST	    /api/rag/build-from-dir/	    Build vector store from server folder
POST	    /api/rag/build-from-upload/	    Build vector store from uploaded PDFs
POST	    /api/rag/ask/	                Ask questions from the knowledge base
```

## 🧠 How RAG Works in This Project
- PDFs are loaded and split into text chunks
- Chunks are embedded using OpenAI embeddings
- Embeddings are stored in FAISS
- User query retrieves top-K relevant chunks
- LLM generates an answer using retrieved context

## 🛡️ Notes & Best Practices

1) Use clean, text-based PDFs for best results
2) Rebuild the vector store after adding new documents
3) Large PDFs may take time during embedding
4) This project uses local FAISS storage, not a managed vector DB

**Aakash Jha**

- 🌐 [Portfolio](http://aakash-jha--portfolio.vercel.app/)
- 💼 [LinkedIn](https://www.linkedin.com/in/aakash-jha-a11931257/)
- GitHub: [@Aakash-Jha3903](https://github.com/Aakash-Jha3903)
- Project: [RAG chatBot ](https://github.com/Aakash-Jha3903/Chat_with_Document__RAG)

---


## 🙏🏻 Thank You

If you liked my project or found it useful:

- ⭐️ **Star the repo** – It motivates open‑source developers like me. 🙂
- 🍴 **Fork it** – Build and extend your own version. 🧑🏻‍💻
- 🧠 **Suggest Ideas** – Submit issues or feature requests. 
- 💬 **Feedback** – I love to hear your thoughts or suggestions.

---

- Made with ❤️ by Aakash Jha
- Connect on [LinkedIn](https://www.linkedin.com/in/aakash-jha-a11931257/)