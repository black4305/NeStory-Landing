import { SupabaseService } from '../services/supabase';
import { AnalyticsData, UserInfo, Answer } from '../types';

// 테스트용 더미 데이터 생성
export const createTestData = (): AnalyticsData => {
  const sessionId = `test-${Date.now()}`;
  
  // 가상의 설문 답변
  const answers: Answer[] = [
    { questionId: 1, score: 4, timeSpent: 3500 },
    { questionId: 2, score: 3, timeSpent: 4200 },
    { questionId: 3, score: 5, timeSpent: 2800 },
    { questionId: 4, score: 2, timeSpent: 5100 },
    { questionId: 5, score: 4, timeSpent: 3200 }
  ];

  // 가상의 사용자 정보
  const userInfo: UserInfo = {
    name: '테스트 사용자',
    age: '30대',
    gender: '여성',
    familySize: 4,
    region: '서울',
    instagram: '@test_user',
    marketingConsent: true,
    privacyConsent: true
  };

  const testData: AnalyticsData = {
    id: sessionId,
    sessionId,
    startTime: Date.now() - 25000, // 25초 전 시작
    answers,
    totalTime: 18800, // 총 18.8초
    clickCount: 12,
    scrollDepth: 0.85, // 85%
    deviceType: 'desktop',
    userAgent: 'Mozilla/5.0 (Test Browser)',
    completed: true,
    result: 'ACFBK', // 활동적+문화+미식+가성비+아이주도
    userInfo,
    submittedAt: Date.now(),
    reliabilityScore: 0.82,
    responsePattern: 'consistent'
  };

  return testData;
};

// 데이터 저장 테스트
export const testDataSave = async (): Promise<boolean> => {
  console.log('🧪 데이터 저장 테스트 시작...');
  
  try {
    const testData = createTestData();
    console.log('📝 테스트 데이터 생성:', testData.sessionId);
    
    const success = await SupabaseService.saveUserData(testData);
    
    if (success) {
      console.log('✅ 데이터 저장 성공!');
      return true;
    } else {
      console.error('❌ 데이터 저장 실패');
      return false;
    }
  } catch (error) {
    console.error('💥 데이터 저장 중 오류:', error);
    return false;
  }
};

// 데이터 조회 테스트
export const testDataRetrieval = async (): Promise<boolean> => {
  console.log('🔍 데이터 조회 테스트 시작...');
  
  try {
    const allData = await SupabaseService.getAllUserData();
    console.log(`📊 조회된 데이터 수: ${allData.length}개`);
    
    if (allData.length > 0) {
      const latestData = allData[allData.length - 1];
      console.log('📋 최신 데이터:', {
        sessionId: latestData.sessionId,
        completed: latestData.completed,
        result: latestData.result,
        totalTime: latestData.totalTime
      });
      console.log('✅ 데이터 조회 성공!');
      return true;
    } else {
      console.log('ℹ️ 조회된 데이터가 없습니다.');
      return true;
    }
  } catch (error) {
    console.error('💥 데이터 조회 중 오류:', error);
    return false;
  }
};

// 통계 조회 테스트
export const testStatsRetrieval = async (): Promise<boolean> => {
  console.log('📈 통계 조회 테스트 시작...');
  
  try {
    const stats = await SupabaseService.getNestoryLandingStats();
    
    if (stats) {
      console.log('📊 통계 데이터:', stats);
      console.log('✅ 통계 조회 성공!');
      return true;
    } else {
      console.log('ℹ️ 통계 데이터가 없습니다.');
      return false;
    }
  } catch (error) {
    console.error('💥 통계 조회 중 오류:', error);
    return false;
  }
};

// 리더보드 조회 테스트
export const testLeaderboardRetrieval = async (): Promise<boolean> => {
  console.log('🏆 리더보드 조회 테스트 시작...');
  
  try {
    const leaderboard = await SupabaseService.getNestoryLandingLeaderboard();
    
    if (leaderboard && leaderboard.length > 0) {
      console.log('🏆 리더보드 데이터:', leaderboard);
      console.log('✅ 리더보드 조회 성공!');
      return true;
    } else {
      console.log('ℹ️ 리더보드 데이터가 없습니다.');
      return false;
    }
  } catch (error) {
    console.error('💥 리더보드 조회 중 오류:', error);
    return false;
  }
};

// 랜딩 페이지 분석 데이터 저장 테스트
export const testLandingAnalyticsSave = async (): Promise<boolean> => {
  console.log('📊 랜딩 분석 데이터 저장 테스트 시작...');
  
  try {
    const analyticsData = {
      visitId: `landing-test-${Date.now()}`,
      timestamp: Date.now(),
      userAgent: 'Mozilla/5.0 (Test Browser)',
      referrer: 'https://test-referrer.com',
      deviceType: 'desktop' as const,
      sessionDuration: 45.5,
      ctaClicked: true,
      scrollDepth: 0.75
    };
    
    const success = await SupabaseService.saveLandingAnalytics(analyticsData);
    
    if (success) {
      console.log('✅ 랜딩 분석 데이터 저장 성공!');
      return true;
    } else {
      console.error('❌ 랜딩 분석 데이터 저장 실패');
      return false;
    }
  } catch (error) {
    console.error('💥 랜딩 분석 데이터 저장 중 오류:', error);
    return false;
  }
};

// 전체 데이터 플로우 테스트
export const runFullDataFlowTest = async (): Promise<void> => {
  console.log('🚀 전체 데이터 플로우 테스트 시작...\n');
  
  const tests = [
    { name: '랜딩 분석 데이터 저장', test: testLandingAnalyticsSave },
    { name: '설문 데이터 저장', test: testDataSave },
    { name: '설문 데이터 조회', test: testDataRetrieval },
    { name: '통계 조회', test: testStatsRetrieval },
    { name: '리더보드 조회', test: testLeaderboardRetrieval }
  ];
  
  let passedTests = 0;
  const totalTests = tests.length;
  
  for (const { name, test } of tests) {
    console.log(`\n--- ${name} ---`);
    const result = await test();
    if (result) {
      passedTests++;
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
  }
  
  console.log(`\n🎯 테스트 결과: ${passedTests}/${totalTests} 통과`);
  
  if (passedTests === totalTests) {
    console.log('🎉 모든 데이터 플로우 테스트 통과!');
  } else {
    console.log('⚠️ 일부 테스트 실패. Supabase 설정과 스키마를 확인하세요.');
  }
};

// 브라우저 콘솔에서 실행할 수 있도록 전역에 노출
declare global {
  interface Window {
    testDataFlow: typeof runFullDataFlowTest;
    testDataSave: typeof testDataSave;
    testDataRetrieval: typeof testDataRetrieval;
  }
}

if (typeof window !== 'undefined') {
  window.testDataFlow = runFullDataFlowTest;
  window.testDataSave = testDataSave;
  window.testDataRetrieval = testDataRetrieval;
}