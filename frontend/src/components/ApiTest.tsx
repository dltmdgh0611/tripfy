import { useState } from 'react'
import axios from 'axios'

interface ApiResponse {
  message?: string
  status?: string
  destination?: string
  itinerary?: string
  budget_breakdown?: string
  tips?: string
}

const ApiTest = () => {
  const [endpoint, setEndpoint] = useState('http://localhost:8000/')
  const [method, setMethod] = useState<'GET' | 'POST'>('GET')
  const [requestBody, setRequestBody] = useState('')
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTest = async () => {
    setLoading(true)
    setError('')
    setResponse(null)

    try {
      let data: any = {}
      
      if (method === 'POST' && requestBody) {
        try {
          data = JSON.parse(requestBody)
        } catch (e) {
          setError('잘못된 JSON 형식입니다.')
          setLoading(false)
          return
        }
      }

      const config = {
        method,
        url: endpoint,
        ...(method === 'POST' && { data })
      }

      const result = await axios(config)
      setResponse(result.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || '요청에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const sampleRequestBody = `{
  "budget": "100-200만원",
  "duration": "3-4일",
  "travel_style": "자유여행",
  "preferred_activities": ["문화/역사 탐방", "맛집 탐방"],
  "destination_type": "도시",
  "accommodation_preference": "호텔",
  "additional_notes": "첫 해외여행입니다"
}`

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">API 테스트</h2>
      
      <div className="space-y-4">
        {/* 엔드포인트 설정 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            엔드포인트
          </label>
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="http://localhost:8000/"
          />
        </div>

        {/* HTTP 메서드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            HTTP 메서드
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as 'GET' | 'POST')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
        </div>

        {/* 요청 본문 (POST일 때만 표시) */}
        {method === 'POST' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              요청 본문 (JSON)
            </label>
            <textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={8}
              placeholder="JSON 형식으로 입력하세요..."
            />
            <button
              onClick={() => setRequestBody(sampleRequestBody)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              샘플 데이터 사용
            </button>
          </div>
        )}

        {/* 테스트 버튼 */}
        <button
          onClick={handleTest}
          disabled={loading}
          className="w-full bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '요청 중...' : 'API 테스트'}
        </button>

        {/* 에러 메시지 */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* 응답 결과 */}
        {response && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">응답 결과:</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* API 엔드포인트 정보 */}
      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h3 className="font-semibold text-gray-800 mb-3">사용 가능한 엔드포인트:</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>
            <strong>GET /</strong> - 서버 상태 확인
          </li>
          <li>
            <strong>GET /health</strong> - 헬스 체크
          </li>
          <li>
            <strong>POST /generate-prompt</strong> - 여행 추천 생성
          </li>
          <li>
            <strong>GET /docs</strong> - API 문서 (Swagger UI)
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ApiTest 