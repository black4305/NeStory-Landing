# NeStory-Landing Supabase 설정 가이드

## 📋 간단 3단계 설정

### 1. 데이터베이스 설정
1. Supabase 대시보드에서 SQL Editor 열기
2. `nestory-landing-setup.sql` 파일 내용 전체 복사 & 실행
3. 완료! ✅

### 2. Storage 설정 (선택사항)
결과 이미지 공유 기능을 사용하려면:
1. Storage → New bucket 클릭
2. 버킷 이름: `nestory-landing`
3. **Private bucket** 선택 (Public 아님!)
4. Create bucket 클릭
5. SQL Editor에서 `storage-policies.sql` 실행

### 3. 실시간 기능 활성화 (필수!)
**관리자 페이지에서 실시간 데이터를 보려면:**

1. Supabase 대시보드 → **API** → **Realtime** 메뉴
2. **Schemas** 섹션에서 `nestory` 스키마 전체 Enable ✅

**참고:** 
- `stats_overview`, `active_users_live`, `result_leaderboard`는 **뷰(View)**라서 Realtime 버튼이 없음
- 뷰는 기본 테이블이 실시간 업데이트되면 자동으로 함께 업데이트됨
- 실제 테이블 4개만 Realtime 활성화하면 됨:
  - `user_responses` ✅
  - `landing_analytics` ✅  
  - `active_users` ✅
  - `ab_test_results` ✅

### 4. 보안 설정 확인 (RLS)
**Row Level Security 정책이 제대로 적용되었는지 확인:**

1. **Database** → **Tables** → 각 테이블 클릭
2. **Policies** 탭에서 다음 정책들이 있는지 확인:

**nestory.user_responses:**
- ✅ "Users can insert their own responses"
- ✅ "Users can read their own responses"  
- ✅ "Users can update their own responses"

**nestory.landing_analytics:**
- ✅ "Anyone can insert analytics"
- ✅ "Only admins can read analytics"

**nestory.active_users:**
- ✅ "Anyone can manage active users"

**nestory.ab_test_results:**
- ✅ "Anyone can insert ab test results"
- ✅ "Only admins can read ab test results"

**✅ 모든 RLS 정책 완료!**

### 5. 환경 변수 설정
`.env` 파일에 다음 추가:
```
REACT_APP_SUPABASE_URL=your_project_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```

### 5. 실시간 기능 활성화 확인
1. Database > Replication 메뉴
2. `nestory.active_users`와 `nestory.user_responses` 테이블 활성화

## 🚀 주요 기능

### 실시간 통계 위젯
- 현재 활성 사용자 수
- 총 방문자/완료 테스트
- 인기 여행 유형 TOP 3

### 분석 데이터
- 랜딩 페이지 방문 추적
- 스크롤 깊이 측정
- CTA 클릭률 분석
- A/B 테스트 지원

### RLS (Row Level Security)
- 사용자별 데이터 접근 제어
- 관리자 전용 분석 데이터
- 안전한 데이터 격리

## 📊 관리자 대시보드

추후 관리자 대시보드에서 다음 데이터 확인 가능:
- 실시간 사용자 활동
- 전환율 분석
- 디바이스별 통계
- 시간대별 트래픽

## ⚠️ 주의사항

1. Pro 플랜 제한사항:
   - API 요청: 500K/월
   - 데이터베이스 크기: 8GB
   - 파일 스토리지: 100GB

2. 성능 최적화:
   - 인덱스가 자동 생성됨
   - 30분 이상 비활성 사용자는 자동 정리
   - 실시간 구독은 필요시에만 사용

3. 보안:
   - RLS 정책이 설정되어 있음
   - Service Role Key는 서버에서만 사용
   - Anon Key는 클라이언트에서 안전하게 사용 가능