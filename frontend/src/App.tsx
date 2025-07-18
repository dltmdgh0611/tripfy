import { useState } from 'react'
import TravelSurvey from '@/components/TravelSurvey'
import ApiTest from '@/components/ApiTest'
import ResultTimeline from '@/components/ResultTimeline'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

function App() {
  const [status, setStatus] = useState<'landing' | 'survey' | 'loading' | 'result' | 'api'>('landing')
  const [surveyData, setSurveyData] = useState<any>(null)

  const handleSurveyComplete = async (data: any) => {
    setStatus('loading');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      console.log('API URL:', apiUrl); // 디버깅용
      const res = await fetch(`${apiUrl}/generate-prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setSurveyData(result);
      setStatus('result');
    } catch (e) {
      console.error('API Error:', e); // 디버깅용
      setStatus('survey');
      alert('AI 추천 생성에 실패했습니다.');
    }
  };



  return (
    <div className="main-bg d-flex flex-column" style={{ background: '#FFF8F2', minHeight: '100vh' }}>
      <header className="py-3 py-md-4 text-center">
        <img 
          src="/tripfy.png" 
          alt="Tripfy" 
          height={44} 
          style={{ maxHeight: 44, cursor: 'pointer' }} 
          onClick={() => setStatus('landing')}
        />
      </header>
      <main
        className="flex-grow-1 d-flex align-items-center justify-content-center px-2 px-md-4"
        style={{ minHeight: 'calc(100vh - 200px)' }}
      >
        <div
          className="survey-card shadow rounded-4 w-100"
          style={{
            maxWidth: 900,
            minHeight: '60vh',
            background: '#FDFDFD',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(1rem, 4vw, 3rem)',
          }}
        >
          {status === 'landing' && (
            <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '40vh' }}>
              <div className="mb-4 mb-md-5">
                <h3 className="display-6 display-md-4 fw-bold mb-3" style={{ color: '#2D2D2D' }}>
                  여행 계획 AI 에이전트
                </h3>
                <p className="fs-6 text-muted mb-4 mb-md-5">
                  P들을 위한 여행 계획 AI 서비스
                </p>
              </div>
              <button
                className="btn btn-primary px-4 px-md-5 py-2 py-md-3 fw-bold"
                onClick={() => setStatus('survey')}
                style={{ 
                  fontSize: 'clamp(1rem, 4vw, 1.2rem)',
                  background: 'linear-gradient(135deg, #FF7E6D 0%, #FF6B6B 100%)',
                  border: 'none',
                  borderRadius: '50px',
                  boxShadow: '0 8px 25px rgba(255, 126, 109, 0.3)'
                }}
              >
                <i className="bi bi-plus-circle me-2"></i>
                새 계획 생성
              </button>
            </div>
          )}
          {status === 'survey' && <TravelSurvey onComplete={handleSurveyComplete} />}
          {status === 'loading' && (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '40vh' }}>
              <div className="spinner-border text-primary mb-4" style={{ width: 'clamp(48px, 12vw, 64px)', height: 'clamp(48px, 12vw, 64px)' }} role="status"></div>
              <div className="fs-5 fs-md-4 fw-bold text-center" style={{ color: '#2D2D2D' }}>AI가 여행 플랜을 분석 중입니다...</div>
              <div className="text-secondary mt-2 text-center">잠시만 기다려주세요</div>
            </div>
          )}
          {status === 'result' && surveyData && (
            <ResultTimeline result={surveyData} />
          )}
          {status === 'api' && <ApiTest />}
        </div>
      </main>
      <footer className="text-center mb-3 mb-md-4 px-2" style={{ color: '#bbb', fontSize: 'clamp(0.8rem, 3vw, 0.95rem)', opacity: 0.7 }}>
        <span
          style={{ cursor: 'pointer', textDecoration: status === 'landing' ? 'underline' : 'none' }}
          onClick={() => setStatus('landing')}
        >
          홈
        </span>
        &nbsp;|&nbsp;
        <span
          style={{ cursor: 'pointer', textDecoration: status === 'survey' ? 'underline' : 'none' }}
          onClick={() => setStatus('survey')}
        >
          여행 설문
        </span>
        &nbsp;|&nbsp;
        <span
          style={{ cursor: 'pointer', textDecoration: status === 'api' ? 'underline' : 'none' }}
          onClick={() => setStatus('api')}
        >
          API 테스트
        </span>
      </footer>
    </div>
  )
}

export default App
