import os
import openai
from typing import List, Optional
from pydantic import BaseModel
import re
import json

class SurveyResponse(BaseModel):
    budget: str
    duration: str
    travel_style: str
    preferred_activities: List[str]
    destination_type: str
    accommodation_preference: str
    additional_notes: Optional[str] = None

class TravelRecommendation(BaseModel):
    destination: str
    itinerary: str
    budget_breakdown: str
    tips: str

# OpenAI 클라이언트 설정
openai.api_key = os.getenv("OPENAI_API_KEY")

def format_budget_breakdown(budget_breakdown):
    if isinstance(budget_breakdown, dict):
        # "항공료: 200만원, 숙박비: 300만원, ..." 형태로 변환
        return ', '.join(f"{k}: {v}" for k, v in budget_breakdown.items())
    elif isinstance(budget_breakdown, list):
        # 리스트인 경우 문자열로 변환
        return ', '.join(str(item) for item in budget_breakdown)
    return str(budget_breakdown)

def safe_get_string(data, key, default=""):
    """안전하게 문자열을 가져오는 함수"""
    value = data.get(key, default)
    if isinstance(value, dict):
        return ', '.join(f"{k}: {v}" for k, v in value.items())
    elif isinstance(value, list):
        return ', '.join(str(item) for item in value)
    return str(value)

async def generate_travel_recommendation(survey: SurveyResponse) -> TravelRecommendation:
    """
    설문 응답을 기반으로 개인화된 여행 추천을 생성합니다.
    """
    
    # 프롬프트 구성
    prompt = f"""
당신은 전문 여행 플래너입니다. 다음 설문 응답을 바탕으로 개인화된 여행 추천을 제공해주세요.

**설문 응답:**
- 예산: {survey.budget}
- 여행 기간: {survey.duration}
- 여행 스타일: {survey.travel_style}
- 선호 활동: {', '.join(survey.preferred_activities)}
- 선호 목적지 유형: {survey.destination_type}
- 숙박 선호도: {survey.accommodation_preference}
- 추가 요청사항: {survey.additional_notes or '없음'}

다음 형식으로 **반드시 JSON만** 반환하세요. 
코드블록(````json` 등)이나 설명, 주석, 불필요한 텍스트를 절대 포함하지 마세요. 
JSON 이외의 텍스트가 있으면 안 됩니다.

{{
    "destination": "추천 목적지 (도시/국가)",
    "itinerary": "각 일정을 한 줄씩 '\\n'으로 구분하여 반환 (예: '7:50 출발\\n9:00 ...')",
    "budget_breakdown": "예산 내역 (항공료, 숙박비, 식비, 활동비 등)",
    "tips": "여행 팁과 주의사항"
}}
"""

    try:
        # OpenAI API 호출
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "당신은 전문 여행 플래너입니다. 사용자의 선호도와 예산에 맞는 최적의 여행 계획을 제시해주세요."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=3000,
        )
        
        # 응답 파싱
        content = response.choices[0].message.content.strip()  # type: ignore
        
        # 코드블록 제거 및 JSON만 추출
        json_str = content
        # 코드블록 제거
        json_str = re.sub(r"^```json|^```|```$", "", json_str, flags=re.MULTILINE).strip()
        # 첫 { ~ 마지막 } 만 추출
        match = re.search(r"{.*}", json_str, re.DOTALL)
        if match:
            json_str = match.group(0)
        recommendation_data = json.loads(json_str)
        
        # 디버깅을 위한 로그 추가
        print("OpenAI 응답 데이터:", recommendation_data)
        print("budget_breakdown 원본:", recommendation_data.get("budget_breakdown"))
        print("budget_breakdown 타입:", type(recommendation_data.get("budget_breakdown")))
        
        formatted_budget = format_budget_breakdown(recommendation_data.get("budget_breakdown", "예산 내역"))
        print("포맷된 budget_breakdown:", formatted_budget)
        
        return TravelRecommendation(
            destination=safe_get_string(recommendation_data, "destination", "추천 목적지"),
            itinerary=safe_get_string(recommendation_data, "itinerary", "일정 계획"),
            budget_breakdown=formatted_budget,
            tips=safe_get_string(recommendation_data, "tips", "여행 팁")
        )
            
    except Exception as e:
        print(e)
        raise Exception(f"OpenAI API 호출 중 오류가 발생했습니다: {str(e)}")

def format_survey_for_display(survey: SurveyResponse) -> str:
    """설문 응답을 표시용으로 포맷팅합니다."""
    return f"""
📋 설문 응답 요약
• 예산: {survey.budget}
• 여행 기간: {survey.duration}
• 여행 스타일: {survey.travel_style}
• 선호 활동: {', '.join(survey.preferred_activities)}
• 목적지 유형: {survey.destination_type}
• 숙박 선호도: {survey.accommodation_preference}
• 추가 요청사항: {survey.additional_notes or '없음'}
""" 