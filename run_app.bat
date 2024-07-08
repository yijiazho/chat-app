@echo off
echo Building React frontend...

cd frontend
call npm run build
cd ..

echo Starting FastAPI server...

cd backend
call venv\Scripts\activate
call uvicorn app:app --reload
pause
