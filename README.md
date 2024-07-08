# chat-app

This is a light weight python chat app, using fastapi

## Project Structure
```
chat-app
├── app.py
├── frontend
|  ├── build
|  ├── index.html
|  ├── package-lock.json
|  ├── package.json
|  ├── public
|  ├── README.md
|  ├── script.js
|  └── src
├── main.py
├── README.md
├── requirements.txt
```


## Virtual environment
### Windows
```.\venv\Scripts\activate```
### Mac OS/Linux
```source venv/bin/activate```

## Install dependencies
```pip install -r requirements.txt```

## Update dependencies
```pip freeze > requirements.txt```

## Run App
### Frontend
In the frontend folder, run 
```
npm run build
```

### Backend
In the chat-app folder, run
```
uvicorn app:app --reload
```
Then go to http://localhost:8000/

Alternatively, if you are in windows, you can run ```.\run_app.bat```

## Usage
### Join the chat
Enter username and click "Join Chat"

### Send message
Type message and click "Send"

### Change username
Enter new username and click "Change username"

### Leave chat
Click "Leave chat" button