import { useState } from 'react'
import TravelSurvey from '@/components/TravelSurvey'
import ApiTest from '@/components/ApiTest'
import ResultTimeline from '@/components/ResultTimeline'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

function App() {
  const [status, setStatus] = useState<'survey' | 'loading' | 'result' | 'api'>('survey')
  const [surveyData, setSurveyData] = useState<any>(null)

  const handleSurveyComplete = async (data: any) => {
    setStatus('loading');
    try {
      const res = await fetch('http://localhost:8000/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setSurveyData(result);
      setStatus('result');
    } catch (e) {
      // 에러 처리
      setStatus('survey');
      alert('AI 추천 생성에 실패했습니다.');
    }
  };

  // 예시 결과 데이터 (실제론 AI 응답 사용)
  const exampleResult = {
    destination: '---',
    itinerary: `7:50 11\n9:00 22\n10:45 33\n11:15 44\n13:00 55\n14:00 66\n15:10 77\n경유지 99\n18:40 00`,
    budget_breakdown: '1',
    tips: '2.'
  }

  return (
    <div className="main-bg d-flex flex-column" style={{ background: '#FFF8F2' }}>
      <header className="py-4 text-center">
        <img src="/tripfy.png" alt="Tripfy" height={44} style={{ maxHeight: 44 }} />
      </header>
      <main
        className="flex-grow-1 d-flex align-items-center justify-content-center"
        style={{ minHeight: '80vh' }}
      >
        <div
          className="survey-card p-5 shadow rounded-4 w-100"
          style={{
            maxWidth: 900,
            minHeight: '60vh',
            background: '#FDFDFD',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {status === 'survey' && <TravelSurvey onComplete={handleSurveyComplete} />}
          {status === 'loading' && (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '40vh' }}>
              <div className="spinner-border text-primary mb-4" style={{ width: 64, height: 64 }} role="status"></div>
              <div className="fs-4 fw-bold" style={{ color: '#2D2D2D' }}>AI가 여행 플랜을 분석 중입니다...</div>
              <div className="text-secondary mt-2">잠시만 기다려주세요</div>
            </div>
          )}
          {status === 'result' && surveyData && (
            <ResultTimeline result={surveyData} />
          )}
          {status === 'api' && <ApiTest />}
        </div>
      </main>
      <footer className="text-center mb-4" style={{ color: '#bbb', fontSize: '0.95rem', opacity: 0.7 }}>
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
