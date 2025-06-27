import { SupabaseService } from '../services/supabase';
import { AnalyticsData } from '../types';

// Supabase 연결 및 데이터 저장 테스트
export async function testSupabaseConnection() {
  console.log('🔍 Supabase 연결 테스트 시작...');
  
  // 1. 데이터베이스 초기화 확인
  const dbInitialized = await SupabaseService.initializeDatabase();
  console.log('📊 데이터베이스 초기화 상태:', dbInitialized);
  
  if (!dbInitialized) {
    console.error('❌ 데이터베이스가 초기화되지 않았습니다.');
    return false;
  }
  
  // 2. 테스트 데이터 생성
  const testData: AnalyticsData = {
    sessionId: `test_${Date.now()}`,
    startTime: Date.now() - 60000, // 1분 전
    answers: [
      { questionId: 1, score: 4, timeSpent: 3000 },
      { questionId: 2, score: 2, timeSpent: 2500 }
    ],
    totalTime: 60000,
    clickCount: 15,
    scrollDepth: 85,
    deviceType: 'desktop',
    userAgent: navigator.userAgent,
    completed: true,
    result: 'ACF',
    userInfo: {
      name: '테스트사용자',
      instagram: '@test_user',
      age: '30-39',
      gender: '남성',
      familySize: 4,
      region: '서울 강남구',
      marketingConsent: true,
      privacyConsent: true
    },
    submittedAt: Date.now(),
    reliabilityScore: 0.85,
    responsePattern: 'consistent'
  };
  
  // 3. 데이터 저장 테스트
  console.log('💾 테스트 데이터 저장 중...');
  const saveResult = await SupabaseService.saveUserData(testData);
  console.log('💾 저장 결과:', saveResult);
  
  if (!saveResult) {
    console.error('❌ 데이터 저장 실패');
    return false;
  }
  
  // 4. 데이터 조회 테스트
  console.log('📖 데이터 조회 테스트 중...');
  const allData = await SupabaseService.getAllUserData();
  console.log('📖 조회된 데이터 개수:', allData.length);
  console.log('📖 최신 데이터:', allData[0]);
  
  // 5. 방금 저장한 데이터가 있는지 확인
  const testDataFound = allData.find(item => item.sessionId === testData.sessionId);
  if (testDataFound) {
    console.log('✅ 테스트 데이터 저장 및 조회 성공!');
    
    // 6. 테스트 데이터 삭제
    const deleteResult = await SupabaseService.deleteUserData(testData.sessionId);
    console.log('🗑️ 테스트 데이터 삭제 결과:', deleteResult);
    
    return true;
  } else {
    console.error('❌ 저장된 테스트 데이터를 찾을 수 없습니다.');
    return false;
  }
}

// 현재 저장된 모든 데이터 조회
export async function checkStoredData() {
  console.log('📊 현재 저장된 데이터 확인 중...');
  
  const allData = await SupabaseService.getAllUserData();
  console.log('📊 총 저장된 응답 수:', allData.length);
  
  if (allData.length > 0) {
    console.log('📊 최근 5개 응답:');
    allData.slice(0, 5).forEach((data, index) => {
      console.log(`${index + 1}. ${data.sessionId} - ${data.result} (${new Date(data.submittedAt || 0).toLocaleString()})`);
    });
  } else {
    console.log('📊 저장된 응답이 없습니다.');
  }
  
  return allData;
}