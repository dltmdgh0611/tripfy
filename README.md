# Tripfy - 설문 기반 여행 추천 서비스

Tripfy는 사용자의 설문 응답을 기반으로 개인화된 여행 추천을 제공하는 풀스택 웹 애플리케이션입니다.

## 프로젝트 구조

```
tripfy/
├── frontend/      # React 프로젝트 (Vite 기반)
├── backend/       # FastAPI 서버
└── README.md
```

### 폴더 설명

- **frontend/**: React + TypeScript + Vite 기반 프론트엔드 애플리케이션
  - TailwindCSS로 스타일링
  - Axios를 통한 API 통신
  - 절대경로 alias 설정 (`@` → src/)

- **backend/**: FastAPI 기반 백엔드 서버
  - Python 3.10+ 기반
  - OpenAI API 연동
  - CORS 설정으로 프론트엔드와 통신
  - 환경변수를 통한 API 키 관리

## 개발 환경 설정

### 1. 백엔드 설정

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 2. 프론트엔드 설정

```bash
cd frontend
npm install
```

## 개발 서버 실행

### 백엔드 서버 실행

```bash
cd backend
# 가상환경 활성화 후
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

서버가 실행되면 다음 URL에서 접근 가능합니다:
- API 서버: http://localhost:8000
- API 문서: http://localhost:8000/docs

### 프론트엔드 개발 서버 실행

```bash
cd frontend
npm run dev
```

프론트엔드는 다음 URL에서 접근 가능합니다:
- 개발 서버: http://localhost:5173

## 환경변수 설정

### 백엔드 환경변수 설정

`backend/.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### OpenAI API 키 발급 방법

1. [OpenAI 웹사이트](https://platform.openai.com/)에 접속
2. 계정 생성 또는 로그인
3. API Keys 섹션에서 새 API 키 생성
4. 생성된 키를 `backend/.env` 파일의 `OPENAI_API_KEY`에 설정

## API 엔드포인트

- `GET /`: 서버 상태 확인
- `POST /generate-prompt`: 설문 기반 여행 추천 생성
- `GET /docs`: API 문서 (Swagger UI)

## 기술 스택

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Axios

### Backend
- FastAPI
- Python 3.10+
- OpenAI API
- Uvicorn
- Python-dotenv

## 추후 계획

- Flutter 모바일 앱 연동
- 사용자 인증 시스템
- 여행 추천 히스토리 저장
- 실시간 채팅 기능 