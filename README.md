# 🧠 AI Product Manager RAG Chatbot

I built this no-code **Retrieval-Augmented Generation (RAG) Chatbot** by following [The Product Compass guide](https://www.productcompass.pm/p/how-to-build-a-rag-chatbot).  
It demonstrates how I can design and prototype an AI product that retrieves information from documents and generates context-aware answers — without writing code.

---

## 🎯 What I Did
- Used **n8n** to orchestrate the chatbot’s workflow  
- Connected **OpenAI** for embeddings and text generation  
- Used **Pinecone** as a vector database to store and search document embeddings  
- (Optional) Connected **Lovable** for a simple chat UI  
- Uploaded custom documents and built a chatbot that answers questions using only those sources  

---

## 🧩 How It Works
1. A user asks a question  
2. The chatbot embeds the query with OpenAI  
3. Pinecone finds the most relevant document chunks  
4. The model uses that context to generate an accurate, grounded response  

---

## 💡 Why It Matters
This project shows my ability to:
- Build and explain **AI product architecture**  
- Understand **RAG pipelines** and **context engineering** concepts  
- Prototype **end-to-end AI systems** using no-code tools  
- Translate technical workflows into **clear user and business outcomes**

---
## n8n Workflows
<img width="997" height="524" alt="Screenshot 2025-10-04 at 11 24 08 PM" src="https://github.com/user-attachments/assets/169dfbdf-0577-456d-83a8-432cf189a5fc" />
<img width="1201" height="443" alt="Screenshot 2025-10-04 at 11 23 57 PM" src="https://github.com/user-attachments/assets/5beb6608-d0c7-4044-9872-b715f35aa535" />


## 🛠️ Tools
**n8n** · **Pinecone** · **OpenAI API** · **Lovable**

