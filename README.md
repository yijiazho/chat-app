# chat-app

This is a light weight python chat app, using fastapi

## Project Structure
lightweight-python-project/
├── venv/
├── README.md
├── .gitignore
├── app.py
├── frontend/
│   ├── index.html
│   └── script.js
├── requirements.txt



## Virtual environment
### Windows
.\venv\Scripts\activate
### Mac OS/Linux
source venv/bin/activate

## Install dependencies
pip install -r requirements.txt

## Update dependencies
pip freeze > requirements.txt

## Run App
uvicorn app:app --reload

## Usage
### Join the chat
Enter username and click "Join Chat"

### Send message
Type message and click "Send"