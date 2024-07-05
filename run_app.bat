@echo off
echo Building React frontend...
cd frontend
call npm run build
cd ..
echo Starting FastAPI server...

call venv\Scripts\activate
call uvicorn app:app --reload
pause
