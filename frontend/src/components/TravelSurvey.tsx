import { useState } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { BsPerson, BsPeople, BsBackpack, BsGem, BsBuilding, BsTree, BsUmbrella, BsBank, BsHouse, BsHouseDoor, BsStar, BsCamera, BsShop, BsTriangle } from 'react-icons/bs'
import axios from 'axios'

interface SurveyData {
  budget: string
  duration: string
  travel_style: string
  preferred_activities: string[]
  destination_type: string
  accommodation_preference: string
  additional_notes: string
}

interface TravelRecommendation {
  destination: string
  itinerary: string
  budget_breakdown: string
  tips: string
}

const questions = [
  {
    label: '여행 예산을 선택하세요',
    name: 'budget',
    type: 'range',
    min: 10,
    max: 1000,
    step: 10,
    unit: '만원',
  },
  {
    label: '여행 기간을 선택하세요',
    name: 'duration',
    type: 'date',
  },
  {
    label: '여행 스타일을 선택하세요',
    name: 'travel_style',
    type: 'card-radio',
    options: [
      { value: '자유여행', icon: <BsPerson size={32} color="#3A8DFF" /> },
      { value: '패키지여행', icon: <BsPeople size={32} color="#FF7E6D" /> },
      { value: '배낭여행', icon: <BsBackpack size={32} color="#3A8DFF" /> },
      { value: '럭셔리여행', icon: <BsGem size={32} color="#FF7E6D" /> },
    ],
  },
  {
    label: '선호 활동을 모두 선택하세요',
    name: 'preferred_activities',
    type: 'label-checkbox',
    options: [
      { value: '문화/역사 탐방', icon: <BsBank /> },
      { value: '자연/풍경 감상', icon: <BsTree /> },
      { value: '맛집 탐방', icon: <BsShop /> },
      { value: '쇼핑', icon: <BsBuilding /> },
      { value: '액티비티/스포츠', icon: <BsStar /> },
      { value: '휴양/휴식', icon: <BsUmbrella /> },
      { value: '사진 촬영', icon: <BsCamera /> },
      { value: '로컬 체험', icon: <BsPeople /> },
    ],
  },
  {
    label: '선호 목적지 유형을 선택하세요',
    name: 'destination_type',
    type: 'card-radio',
    options: [
      { value: '도시', icon: <BsBuilding size={32} color="#3A8DFF" /> },
      { value: '자연', icon: <BsTree size={32} color="#FF7E6D" /> },
      { value: '해변', icon: <BsUmbrella size={32} color="#3A8DFF" /> },
      { value: '산악', icon: <BsTriangle size={32} color="#FF7E6D" /> },
      { value: '문화유산', icon: <BsBank size={32} color="#3A8DFF" /> },
    ],
  },
  {
    label: '숙박 선호도를 선택하세요',
    name: 'accommodation_preference',
    type: 'card-radio',
    options: [
      { value: '호텔', icon: <BsHouse size={32} color="#FF7E6D" /> },
      { value: '게스트하우스', icon: <BsHouseDoor size={32} color="#3A8DFF" /> },
      { value: '펜션', icon: <BsHouse size={32} color="#3A8DFF" /> },
      { value: '리조트', icon: <BsGem size={32} color="#FF7E6D" /> },
      { value: '캠핑', icon: <BsTriangle size={32} color="#3A8DFF" /> },
    ],
  },
  {
    label: '추가 요청사항이 있다면 입력하세요',
    name: 'additional_notes',
    type: 'textarea',
    options: [],
  },
]

const initialSurvey = {
  budget: [50, 200],
  duration: { start: null, end: null },
  travel_style: '',
  preferred_activities: [],
  destination_type: '',
  accommodation_preference: '',
  additional_notes: '',
}

function getNightsDays(start: Date, end: Date) {
  if (!start || !end) return ''
  const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return `${diff}박 ${diff + 1}일`
}

const TravelSurvey = ({ onComplete }: { onComplete?: (data: any) => void }) => {
  const [step, setStep] = useState(0)
  const [survey, setSurvey] = useState<any>(initialSurvey)
  const [submitting, setSubmitting] = useState(false)

  const current = questions[step]
  const total = questions.length
  const percent = Math.round(((step + 1) / total) * 100)

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      setSurvey((prev: any) => {
        const arr = prev[name] || []
        return {
          ...prev,
          [name]: checked
            ? [...arr, value]
            : arr.filter((v: string) => v !== value),
        }
      })
    } else {
      setSurvey((prev: any) => ({ ...prev, [name]: value }))
    }
  }

  // 예산 슬라이더 핸들러
  const handleBudgetChange = (vals: number[]) => {
    setSurvey((prev: any) => ({ ...prev, budget: vals }))
  }

  // 날짜 선택 핸들러
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates
    setSurvey((prev: any) => ({ ...prev, duration: { start, end } }))
  }

  // 카드형 라디오 핸들러
  const handleCardRadio = (name: string, value: string) => {
    setSurvey((prev: any) => ({ ...prev, [name]: value }))
  }

  // 라벨형 멀티 체크박스 핸들러
  const handleLabelCheckbox = (name: string, value: string) => {
    setSurvey((prev: any) => {
      const arr = prev[name] || []
      return {
        ...prev,
        [name]: arr.includes(value) ? arr.filter((v: string) => v !== value) : [...arr, value],
      }
    })
  }

  const handleNext = (e: any) => {
    e.preventDefault()
    if (step < total - 1) {
      setStep(step + 1)
    } else if (onComplete) {
      setSubmitting(true)
      // 예산은 "최소~최대만원" 형태, 기간은 "X박 Y일"로 변환
      const nightsDays = getNightsDays(survey.duration.start, survey.duration.end)
      const data = {
        ...survey,
        budget: `${survey.budget[0]}~${survey.budget[1]}만원`,
        duration: nightsDays,
      }
      onComplete(data)
    }
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center h-100" style={{ minHeight: '60vh' }}>
      <div className="w-75 mx-auto" style={{ maxWidth: 480 }}>
        <div className="mb-4">
          <div className="fw-bold fs-4 mb-2" style={{ color: '#2D2D2D' }}>
            {current.label}
          </div>
          <div className="progress mb-3" style={{ height: 6, background: '#FDFDFD' }}>
            <div className="progress-bar" style={{ width: `${percent}%` }}></div>
          </div>
        </div>
        <form onSubmit={handleNext}>
          {current.type === 'range' && (
            <div className="mb-4">
              <Slider
                range
                min={current.min}
                max={current.max}
                step={current.step}
                value={survey.budget}
                onChange={handleBudgetChange}
                trackStyle={[{ backgroundColor: '#FF7E6D', height: 8 }]}
                handleStyle={[
                  { borderColor: '#FF7E6D', backgroundColor: '#fff', height: 24, width: 24 },
                  { borderColor: '#FF7E6D', backgroundColor: '#fff', height: 24, width: 24 },
                ]}
                railStyle={{ backgroundColor: '#FDFDFD', height: 8 }}
              />
              <div className="d-flex justify-content-between mt-2">
                <span className="fw-bold text-secondary">{survey.budget[0]}만원</span>
                <span className="fw-bold text-secondary">{survey.budget[1]}만원</span>
              </div>
            </div>
          )}
          {current.type === 'date' && (
            <div className="mb-4">
              <DatePicker
                selected={survey.duration.start}
                onChange={handleDateChange}
                startDate={survey.duration.start}
                endDate={survey.duration.end}
                selectsRange
                inline
                monthsShown={2}
                dateFormat="yyyy-MM-dd"
                placeholderText="여행 시작일 ~ 종료일"
                className="form-control form-control-lg"
              />
              {survey.duration.start && survey.duration.end && (
                <div className="mt-2 text-secondary fw-bold">
                  {getNightsDays(survey.duration.start, survey.duration.end)}
                </div>
              )}
            </div>
          )}
          {current.type === 'card-radio' && (
            <div className="row g-3 mb-4">
              {current.options?.map((opt: any) => (
                <div className="col-6" key={opt.value}>
                  <div
                    className={`card text-center p-3 shadow-sm ${survey[current.name] === opt.value ? 'border-primary' : ''}`}
                    style={{ cursor: 'pointer', borderWidth: 2 }}
                    onClick={() => handleCardRadio(current.name, opt.value)}
                  >
                    <div className="mb-2">{opt.icon}</div>
                    <div className="fw-bold" style={{ color: survey[current.name] === opt.value ? '#3A8DFF' : '#2D2D2D' }}>{opt.value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {current.type === 'label-checkbox' && (
            <div className="mb-4 d-flex flex-wrap gap-2">
              {current.options?.map((opt: any) =>
                typeof opt === 'string' ? (
                  <span
                    key={opt}
                    className={`badge rounded-pill px-3 py-2 fs-6 ${survey[current.name]?.includes(opt) ? 'bg-primary text-white' : 'bg-light text-secondary'}`}
                    style={{ cursor: 'pointer', border: survey[current.name]?.includes(opt) ? '2px solid #FF7E6D' : '1px solid #eee' }}
                    onClick={() => handleLabelCheckbox(current.name, opt)}
                  >
                    {opt}
                  </span>
                ) : (
                  <span
                    key={opt.value}
                    className={`badge rounded-pill px-3 py-2 fs-6 ${survey[current.name]?.includes(opt.value) ? 'bg-primary text-white' : 'bg-light text-secondary'}`}
                    style={{ cursor: 'pointer', border: survey[current.name]?.includes(opt.value) ? '2px solid #FF7E6D' : '1px solid #eee' }}
                    onClick={() => handleLabelCheckbox(current.name, opt.value)}
                  >
                    <span className="me-1">{opt.icon}</span>
                    {opt.value}
                  </span>
                )
              )}
            </div>
          )}
          {current.type === 'select' && (
            <select
              className="form-select form-control-lg mb-4"
              name={current.name}
              value={survey[current.name]}
              onChange={handleChange}
              required
            >
              <option value="">선택하세요</option>
              {current.options?.map((opt: any) =>
                typeof opt === 'string' ? (
                  <option key={opt} value={opt}>{opt}</option>
                ) : (
                  <option key={opt.value} value={opt.value}>{opt.value}</option>
                )
              )}
            </select>
          )}
          {current.type === 'checkbox' && (
            <div className="row g-2 mb-4">
              {current.options?.map((opt: any) =>
                typeof opt === 'string' ? (
                  <div className="col-6" key={opt}>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name={current.name}
                        value={opt}
                        id={opt}
                        checked={survey[current.name]?.includes(opt)}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor={opt}>
                        {opt}
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="col-6" key={opt.value}>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name={current.name}
                        value={opt.value}
                        id={opt.value.toString()}
                        checked={survey[current.name]?.includes(opt.value)}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor={opt.value.toString()}>
                        {opt.value}
                      </label>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
          {current.type === 'textarea' && (
            <textarea
              className="form-control form-control-lg mb-4"
              name={current.name}
              value={survey[current.name]}
              onChange={handleChange}
              rows={3}
              placeholder="특별한 요청사항이 있다면 입력하세요..."
            />
          )}
          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center"
            disabled={submitting}
            style={{ fontWeight: 600 }}
          >
            {step < total - 1 ? (
              <>
                다음 <i className="bi bi-arrow-right ms-2"></i>
              </>
            ) : (
              <>
                제출 <i className="bi bi-send ms-2"></i>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default TravelSurvey 