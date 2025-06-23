// Firebase 저장 테스트 스크립트
import { FirebaseService } from './src/services/firebase.js';

const testData = {
  sessionId: `test_${Date.now()}`,
  startTime: Date.now() - 60000,
  answers: [
    { questionId: 1, score: 4, timeSpent: 3000 },
    { questionId: 2, score: 2, timeSpent: 4000 },
    { questionId: 3, score: 5, timeSpent: 2500 },
    { questionId: 4, score: 3, timeSpent: 3500 },
    { questionId: 5, score: 4, timeSpent: 2800 },
    { questionId: 6, score: 1, timeSpent: 5000 }
  ],
  totalTime: 20800,
  clickCount: 15,
  scrollDepth: 85,
  deviceType: 'desktop',
  userAgent: 'Test User Agent',
  completed: true,
  result: 'ACF',
  userInfo: {
    name: 'Firebase 테스트',
    region: '서울 강남구'
  },
  submittedAt: Date.now()
};

async function testFirebaseSave() {
  try {
    console.log('🔥 Firebase 저장 테스트 시작...');
    
    // 연결 테스트
    const isConnected = await FirebaseService.testConnection();
    console.log(`📡 Firebase 연결 상태: ${isConnected ? '✅ 성공' : '❌ 실패'}`);
    
    if (isConnected) {
      // 데이터 저장 테스트
      const docId = await FirebaseService.saveSurveyResult(testData);
      console.log(`💾 데이터 저장 성공! 문서 ID: ${docId}`);
      
      // 데이터 조회 테스트
      const allData = await FirebaseService.getAllSurveyResults();
      console.log(`📊 총 저장된 데이터: ${allData.length}개`);
      
      // 통계 조회 테스트
      const stats = await FirebaseService.getStatistics();
      console.log('📈 통계:', stats);
      
      console.log('🎉 Firebase 테스트 완료!');
    } else {
      console.log('❌ Firebase 연결 실패');
    }
  } catch (error) {
    console.error('🚨 Firebase 테스트 오류:', error);
  }
}

testFirebaseSave();