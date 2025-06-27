# 🚀 Family Travel Test

가족 여행 성향 분석 및 맞춤 추천 서비스

## 🎯 주요 기능

- **감정적 후킹** 랜딩페이지로 높은 전환율 달성
- **Supabase 백엔드** PostgreSQL 데이터베이스 연동
- **3축 여행 성향** 분석 시스템 (A/C/F - 8가지 유형)
- **10문항 5점 척도** 정밀 설문 시스템
- **실시간 분석** 및 맞춤 여행지 추천
- **모바일 최적화** 반응형 디자인

## 🚀 빠른 시작

### 환경 설정
```bash
# 의존성 설치
npm install

# 환경 변수 설정 (.env 파일 생성)
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# 개발 서버 실행
npm start
```

### 배포
```bash
git add .
git commit -m "feat: Family Travel Test complete"
git push origin main
```

**배포 URL**: `https://your-project.vercel.app`

## 🔧 로컬 개발

```bash
# 개발 서버 시작
npm start

# 프로덕션 빌드
npm run build

# 테스트 실행
npm test
```

## 📖 상세 문서

**모든 개발 과정, 기능 설명, 배포 가이드는 `CLAUDE.md` 파일을 참고하세요.**

## 🔧 기술 스택

- **Frontend**: React 19, TypeScript, Styled Components
- **Backend**: Supabase (PostgreSQL)
- **Animation**: Framer Motion
- **Charts**: Recharts, Chart.js  
- **Deployment**: Vercel
- **State Management**: React Hooks + Context

## 🎮 Demo

- **랜딩페이지**: `/` - 감정적 후킹 요소가 적용된 메인 페이지
- **중간 페이지**: `/test` - 설문 시작 전 안내 페이지
- **설문 페이지**: `/survey` - 10문항 5점 척도 설문
- **결과 페이지**: `/result` - 개인화된 여행 성향 분석 결과
- **관리자 페이지**: `/admin` - 데이터 분석 및 관리 도구

## 🎯 여행 성향 분석 시스템

### 3축 분석 체계
- **A축 (Activity)**: 활동적(Active) vs 휴식형(Relaxing) - 4문항
- **C축 (Culture)**: 문화(Culture) vs 자연(Nature) - 3문항  
- **F축 (Food)**: 미식(Foodie) vs 체험(Experience) - 3문항

### 8가지 여행 유형
ACF, ACE, ARF, ARE, NCF, NCE, NRF, NRE

---

💡 **모든 작업 내용과 상세 가이드는 `CLAUDE.md`에서 확인하세요!**