from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from prompt_generator import generate_travel_recommendation, SurveyResponse

# 환경변수 로드
load_dotenv()

app = FastAPI(
    title="Tripfy API",
    description="설문 기반 여행 추천 서비스 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # 프론트엔드 개발 서버
        "http://localhost:3000",  # 프론트엔드 개발 서버
        "https://tripfy-mu.vercel.app",  # Vercel 배포 도메인
        "https://*.vercel.app",  # Vercel 프리뷰 도메인
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic 모델
class TravelRecommendation(BaseModel):
    destination: str
    itinerary: str
    budget_breakdown: str
    tips: str

@app.get("/")
async def root():
    """서버 상태 확인"""
    return {
        "message": "Tripfy API 서버가 정상적으로 실행 중입니다.",
        "version": "1.0.0",
        "status": "running"
    }

@app.post("/generate-prompt", response_model=TravelRecommendation)
async def generate_prompt(survey: SurveyResponse):
    """설문 응답을 기반으로 여행 추천을 생성합니다."""
    try:
        # OpenAI API 키 확인
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500, 
                detail="OpenAI API 키가 설정되지 않았습니다. .env 파일을 확인해주세요."
            )
        
        print(survey)
        # 여행 추천 생성
        recommendation = await generate_travel_recommendation(survey)
        print(recommendation)
        return recommendation
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"추천 생성 중 오류가 발생했습니다: {str(e)}")

@app.get("/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {"status": "healthy", "timestamp": "2024-01-01T00:00:00Z"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 