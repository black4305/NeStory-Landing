# Landing 프로젝트 백엔드 API 서버

## 📋 개요
Landing 프로젝트의 Express.js 기반 백엔드 API 서버입니다. 5축 가족여행 테스트 분석과 PostgreSQL 데이터 수집을 담당합니다.

## 🚀 빠른 시작

### 1. 환경 설정
```bash
# .env 파일 생성
cp .env.template .env

# .env 파일에서 데이터베이스 정보 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=funnel_analytics
DB_USER=postgres
DB_PASSWORD=your_actual_password
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 서버 실행
```bash
npm start
```

서버가 실행되면 `http://localhost:3001`에서 접근 가능합니다.

## 📡 API 엔드포인트

### 세션 관리
- `POST /api/landing/sessions` - 사용자 세션 생성/업데이트
- `GET /api/landing/analytics/active-users` - 실시간 활성 사용자

### 분석 데이터
- `POST /api/landing/page-visits` - 페이지 방문 추적
- `POST /api/landing/events` - 사용자 이벤트 기록
- `POST /api/landing/events/batch` - 배치 이벤트 처리

### 리드 관리
- `POST /api/landing/leads` - 리드 전환 저장
- `POST /api/landing/conversions` - 전환 데이터 저장

### 대시보드 분석
- `GET /api/landing/analytics/summary` - 대시보드 요약 통계
- `GET /api/landing/analytics/travel-types` - 5축 분석 결과
- `GET /api/landing/analytics/survey-connection` - Survey 연동 분석

## 🗄️ 데이터베이스 테이블

### squeeze_anonymous_sessions
사용자 세션 및 디바이스 정보 (40+ 필드)

### squeeze_page_visits  
페이지 방문 및 성능 메트릭 (17+ 필드)

### squeeze_user_events
사용자 행동 이벤트 상세 기록 (19+ 필드)

### squeeze_leads
리드 전환 및 품질 분석 (17+ 필드)

### squeeze_conversions
전환 추적 및 ROI 분석 (16+ 필드)

## 🔗 Survey 프로젝트 연동

Landing 세션이 Survey로 전환될 때 `landing_session_id` FK로 연결됩니다:

```javascript
// Landing에서 Survey로 이동 시
const surveyUrl = `https://survey.nestory.co.kr?landing_session=${sessionId}&ref=landing_result`;
```

## 🛡️ 보안 기능

- **Helmet**: HTTP 헤더 보안
- **CORS**: 도메인 간 요청 제어
- **Rate Limiting**: API 요청 제한 (15분당 100회)
- **Input Validation**: 데이터 검증 및 sanitization

## 📊 모니터링

### 로그 확인
```bash
# 실시간 로그 확인
tail -f logs/landing-backend.log

# 에러 로그만 확인
grep "ERROR" logs/landing-backend.log
```

### 성능 모니터링
- 모든 쿼리 실행 시간 자동 로깅
- 메모리 사용량 및 커넥션 풀 모니터링
- API 응답 시간 추적

## 🧪 테스트

### API 테스트 예시
```bash
# 세션 생성 테스트
curl -X POST http://localhost:3001/api/landing/sessions \
  -H "Content-Type: application/json" \
  -d '{"session_id":"test_123","device_type":"mobile","ip_address":"127.0.0.1"}'

# 대시보드 데이터 확인
curl http://localhost:3001/api/landing/analytics/summary
```

## 🔧 환경별 설정

### Development
```env
NODE_ENV=development
LANDING_PORT=3001
LOG_LEVEL=debug
```

### Production
```env
NODE_ENV=production
LANDING_PORT=3001
LOG_LEVEL=error
DB_SSL=true
```

## 📈 확장 계획

### Phase 1: 고급 분석
- 실시간 A/B 테스트 지원
- 고급 세그멘테이션 API
- 예측 분석 엔드포인트

### Phase 2: 성능 최적화
- Redis 캐싱 레이어
- GraphQL API 추가
- 마이크로서비스 분리

### Phase 3: AI 통합
- 실시간 개인화 API
- 자동 리드 스코어링
- 예측적 분석 시스템

## 🆘 문제 해결

### 데이터베이스 연결 실패
```bash
# PostgreSQL 연결 확인
psql -h localhost -p 5432 -U postgres -d funnel_analytics

# 테이블 존재 확인
\dt squeeze_*
```

### 메모리 누수 확인
```bash
# Node.js 메모리 사용량 모니터링
node --inspect server.js
```

## 📝 개발 참고사항

- 모든 API는 JSON 형식으로 응답
- 에러 처리는 express error handler 사용
- SQL 인젝션 방지를 위해 parameterized query 사용
- 모든 민감한 정보는 환경변수로 관리

---

**⚠️ 주의사항**: 프로덕션 배포 시 반드시 환경변수를 안전하게 설정하고, SSL 인증서를 구성하세요.