// Firebase 연결 테스트 스크립트 (ES Modules)
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyDDMjVUaxrHLKDMJZy5AtuNLbrAjw_tIRo",
  authDomain: "nestory-landing-5844f.firebaseapp.com",
  projectId: "nestory-landing-5844f",
  storageBucket: "nestory-landing-5844f.firebasestorage.app",
  messagingSenderId: "72742437646",
  appId: "1:72742437646:web:ddee0a487b93d2a4ea4d5f"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const SURVEYS_COLLECTION = 'surveys';

console.log('🔥 Firebase 연결 테스트 시작...\n');

// 테스트 데이터
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
  submittedAt: Date.now(),
  firebaseTimestamp: serverTimestamp(),
  savedAt: new Date().toISOString()
};

async function testFirebase() {
  try {
    // 1. 연결 테스트
    console.log('📡 1단계: Firebase 연결 테스트...');
    const testQuery = query(collection(db, SURVEYS_COLLECTION));
    await getDocs(testQuery);
    console.log('✅ Firebase 연결 성공!\n');

    // 2. 데이터 저장 테스트
    console.log('💾 2단계: 데이터 저장 테스트...');
    const docRef = await addDoc(collection(db, SURVEYS_COLLECTION), testData);
    console.log(`✅ 데이터 저장 성공! 문서 ID: ${docRef.id}\n`);

    // 3. 데이터 조회 테스트
    console.log('📊 3단계: 데이터 조회 테스트...');
    const allQuery = query(collection(db, SURVEYS_COLLECTION), orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(allQuery);
    
    console.log(`📋 총 저장된 데이터: ${querySnapshot.size}개`);
    
    // 최근 5개 데이터 표시
    let count = 0;
    querySnapshot.forEach((doc) => {
      if (count < 5) {
        const data = doc.data();
        console.log(`${count + 1}. ${data.userInfo?.name || '익명'} - ${data.result} (${data.sessionId})`);
        count++;
      }
    });

    if (querySnapshot.size > 5) {
      console.log(`... 및 ${querySnapshot.size - 5}개 더`);
    }

    console.log('\n🎉 Firebase 테스트 완료!');
    console.log('✅ 모든 기능이 정상 작동합니다!');

  } catch (error) {
    console.error('🚨 Firebase 테스트 오류:', error.message);
    
    if (error.code === 'permission-denied') {
      console.log('\n⚠️  Firestore 보안 규칙을 확인하세요:');
      console.log('Firebase Console → Firestore Database → Rules');
      console.log('임시 테스트용 규칙:');
      console.log('rules_version = \'2\';');
      console.log('service cloud.firestore {');
      console.log('  match /databases/{database}/documents {');
      console.log('    match /{document=**} {');
      console.log('      allow read, write: if true;');
      console.log('    }');
      console.log('  }');
      console.log('}');
    }
  }
}

// 테스트 실행
testFirebase().then(() => {
  console.log('\n📝 테스트 완료. 프로세스를 종료합니다.');
  process.exit(0);
}).catch((error) => {
  console.error('💥 예상치 못한 오류:', error);
  process.exit(1);
});