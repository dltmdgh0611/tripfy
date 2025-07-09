import { Card, ListGroup } from 'react-bootstrap'
import { BsClock, BsGeoAlt, BsStar, BsCamera, BsCupHot } from 'react-icons/bs'

interface ResultTimelineProps {
  result: {
    destination: string
    itinerary: string
    budget_breakdown: string
    tips: string
  }
}

// 간단한 키워드별 아이콘 매핑
const getIcon = (text: string) => {
  if (text.includes('출발') || text.includes('도착')) return <BsGeoAlt color="#FF7E6D" />
  if (text.includes('식사') || text.includes('카페') || text.includes('팜')) return <BsCupHot color="#3A8DFF" />
  if (text.includes('사진') || text.includes('크리스마스') || text.includes('언덕')) return <BsCamera color="#FF7E6D" />
  if (text.includes('역') || text.includes('오아시스')) return <BsStar color="#3A8DFF" />
  return <BsClock color="#bbb" />
}

const parseItinerary = (itinerary: string | undefined) => {
  if (!itinerary) return [];
  return itinerary.split(/\n|<br\s*\/?>/).map(line => {
    const match = line.match(/^(\d{1,2}:\d{2})?\s*(.*)$/)
    return match ? { time: match[1] || '', desc: match[2] } : { time: '', desc: line }
  })
}

const ResultTimeline = ({ result }: ResultTimelineProps) => {
  const items = parseItinerary(result.itinerary)
  return (
    <div>
      <h2 className="fw-bold mb-4" style={{ color: '#2D2D2D' }}>
        <BsStar className="me-2" color="#FF7E6D" /> {result.destination} 여행 추천 일정
      </h2>
      <Card className="mb-4 shadow-sm" style={{ background: '#fff', border: 'none' }}>
        <ListGroup variant="flush">
          {items.map((item, idx) => (
            <ListGroup.Item key={idx} className="d-flex align-items-center py-3" style={{ background: idx % 2 === 0 ? '#FFF8F2' : '#FDFDFD', border: 'none' }}>
              <span className="me-3 fs-4">{getIcon(item.desc)}</span>
              <span className="fw-bold me-3" style={{ minWidth: 70, color: '#3A8DFF' }}>{item.time}</span>
              <span className="fs-5" style={{ color: '#2D2D2D' }}>{item.desc}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
      <Card className="mb-3 p-3" style={{ background: '#FDFDFD', border: 'none' }}>
        <div className="fw-bold mb-2" style={{ color: '#FF7E6D' }}>예산 내역</div>
        <div style={{ whiteSpace: 'pre-line', color: '#2D2D2D' }}>{result.budget_breakdown}</div>
      </Card>
      <Card className="p-3" style={{ background: '#FDFDFD', border: 'none' }}>
        <div className="fw-bold mb-2" style={{ color: '#3A8DFF' }}>여행 팁</div>
        <div style={{ whiteSpace: 'pre-line', color: '#2D2D2D' }}>{result.tips}</div>
      </Card>
    </div>
  )
}

export default ResultTimeline 