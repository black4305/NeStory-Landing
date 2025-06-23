import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  where,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { AnalyticsData } from '../types';

// Firebase 설정 (환경변수에서 가져오기)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// 컬렉션 참조
const SURVEYS_COLLECTION = 'surveys';

export class FirebaseService {
  // 설문 결과 저장
  static async saveSurveyResult(data: AnalyticsData): Promise<string> {
    try {
      // serverTimestamp를 사용하여 서버 시간 기록
      const surveyData = {
        ...data,
        firebaseTimestamp: serverTimestamp(),
        savedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, SURVEYS_COLLECTION), surveyData);
      console.log('✅ Firebase에 설문 결과 저장 완료:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Firebase 저장 실패:', error);
      throw error;
    }
  }

  // 모든 설문 결과 가져오기 (최신순)
  static async getAllSurveyResults(): Promise<AnalyticsData[]> {
    try {
      const q = query(
        collection(db, SURVEYS_COLLECTION),
        orderBy('submittedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const results: AnalyticsData[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Firestore Timestamp를 일반 숫자로 변환
        if (data.firebaseTimestamp instanceof Timestamp) {
          data.firebaseTimestamp = data.firebaseTimestamp.toMillis();
        }
        results.push(data as AnalyticsData);
      });

      console.log(`📊 Firebase에서 ${results.length}개 설문 결과 조회`);
      return results;
    } catch (error) {
      console.error('❌ Firebase 조회 실패:', error);
      throw error;
    }
  }

  // 완료된 설문만 가져오기
  static async getCompletedSurveys(): Promise<AnalyticsData[]> {
    try {
      const q = query(
        collection(db, SURVEYS_COLLECTION),
        where('completed', '==', true),
        orderBy('submittedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const results: AnalyticsData[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.firebaseTimestamp instanceof Timestamp) {
          data.firebaseTimestamp = data.firebaseTimestamp.toMillis();
        }
        results.push(data as AnalyticsData);
      });

      console.log(`📊 완료된 설문 ${results.length}개 조회`);
      return results;
    } catch (error) {
      console.error('❌ 완료된 설문 조회 실패:', error);
      throw error;
    }
  }

  // 특정 기간 설문 결과 가져오기
  static async getSurveysByDateRange(startDate: Date, endDate: Date): Promise<AnalyticsData[]> {
    try {
      const q = query(
        collection(db, SURVEYS_COLLECTION),
        where('submittedAt', '>=', startDate.getTime()),
        where('submittedAt', '<=', endDate.getTime()),
        orderBy('submittedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const results: AnalyticsData[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.firebaseTimestamp instanceof Timestamp) {
          data.firebaseTimestamp = data.firebaseTimestamp.toMillis();
        }
        results.push(data as AnalyticsData);
      });

      console.log(`📊 ${startDate.toLocaleDateString()}~${endDate.toLocaleDateString()} 기간 설문 ${results.length}개 조회`);
      return results;
    } catch (error) {
      console.error('❌ 기간별 설문 조회 실패:', error);
      throw error;
    }
  }

  // 통계 데이터 가져오기
  static async getStatistics(): Promise<{
    total: number;
    completed: number;
    today: number;
    thisWeek: number;
  }> {
    try {
      const allResults = await this.getAllSurveyResults();
      const completed = allResults.filter(item => item.completed);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayResults = allResults.filter(item => 
        new Date(item.submittedAt || 0) >= today
      );

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekResults = allResults.filter(item => 
        new Date(item.submittedAt || 0) >= weekAgo
      );

      return {
        total: allResults.length,
        completed: completed.length,
        today: todayResults.length,
        thisWeek: weekResults.length
      };
    } catch (error) {
      console.error('❌ 통계 조회 실패:', error);
      return { total: 0, completed: 0, today: 0, thisWeek: 0 };
    }
  }

  // Firebase 연결 상태 확인
  static async testConnection(): Promise<boolean> {
    try {
      // 빈 쿼리로 연결 테스트
      const q = query(collection(db, SURVEYS_COLLECTION));
      await getDocs(q);
      console.log('✅ Firebase 연결 성공');
      return true;
    } catch (error) {
      console.error('❌ Firebase 연결 실패:', error);
      return false;
    }
  }
}