import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import StartScreen from './components/StartScreen';
import PreTestPage from './components/PreTestPage';
import QuestionCard from './components/QuestionCard';
import ResultScreen from './components/ResultScreen';
import UserInfoForm from './components/UserInfoForm';
import ThankYouScreen from './components/ThankYouScreen';
import AdminLogin from './components/AdminLogin';
import EnhancedAdminDashboard from './components/EnhancedAdminDashboard';
import AllTypesScreen from './components/AllTypesScreen';
import LandingPage from './components/LandingPage';
import { questions } from './data/questions';
import { calculateTravelType, getAxisScores } from './utils/calculator';
import { analytics } from './utils/analytics';
import { Answer, UserInfo } from './types';


const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  html {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    /* 모바일 스크롤 활성화 */
    overflow: auto;
    height: auto;
    min-height: 100%;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    overflow-y: auto;
    /* 높이 제한 제거로 스크롤 허용 */
    min-height: 100vh;
    height: auto;
    /* 모바일 터치 스크롤 활성화 */
    -webkit-overflow-scrolling: touch;
    touch-action: manipulation;
    /* 터치 최적화 */
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
  }

  /* 모바일 우선 스타일링 */
  @media (max-width: 768px) {
    body {
      font-size: 16px; /* 모바일에서 줌 방지를 위해 16px 이상 */
    }
    
    /* 입력 필드 줌 방지 */
    input, select, textarea {
      font-size: 16px !important;
    }
  }

  /* 매우 작은 화면 (iPhone SE 등) */
  @media (max-width: 375px) {
    body {
      font-size: 15px;
    }
  }

  /* 터치 기기용 스크롤바 숨기기 */
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`;

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
`;

type AppState = 'start' | 'pretest' | 'survey' | 'userInfo' | 'thankYou' | 'result';

// 관리자 인증 상태 관리
const AdminRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // 세션에서 인증 상태 확인
    const adminAuth = sessionStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    sessionStorage.setItem('adminAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  return isAuthenticated ? <EnhancedAdminDashboard /> : <AdminLogin onLogin={handleLogin} />;
};

// 메인 설문 컴포넌트
const SurveyApp: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('pretest');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<{
    typeCode: string;
    axisScores: any;
    analytics: any;
  } | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    // 페이지 이탈 시 분석 데이터 전송
    const handleBeforeUnload = async () => {
      if (appState === 'survey' && answers.length > 0) {
        await analytics.trackAbandon();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [appState, answers]);

  const handleStart = () => {
    setAppState('survey');
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  const handlePreTestStart = () => {
    setAppState('start');
  };

  const handleAnswer = (score: number, timeSpent: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      score,
      timeSpent
    };

    analytics.trackAnswer(currentQuestion.id, score, timeSpent);
    
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 모든 질문 완료 - 사용자 정보 입력으로 이동
      const typeCode = calculateTravelType(newAnswers);
      const axisScores = getAxisScores(newAnswers);
      
      const analyticsData = {
        totalTime: analytics.getAverageResponseTime() * newAnswers.length,
        averageResponseTime: analytics.getAverageResponseTime(),
        completionRate: analytics.getCompletionRate()
      };

      setResult({
        typeCode,
        axisScores,
        analytics: analyticsData
      });
      
      setAppState('userInfo');
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      // 이전 답변 제거
      const newAnswers = answers.slice(0, -1);
      setAnswers(newAnswers);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleUserInfoSubmit = async (info: UserInfo) => {
    setUserInfo(info);
    if (result) {
      await analytics.trackCompletion(result.typeCode, info);
    }
    setAppState('thankYou');
  };

  const handleSkipUserInfo = async () => {
    if (result) {
      await analytics.trackCompletion(result.typeCode);
    }
    setAppState('thankYou');
  };

  const handleThankYouComplete = () => {
    setAppState('result');
  };

  const handleRestart = () => {
    setAppState('pretest');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResult(null);
    setUserInfo(null);
  };

  return (
    <>
      {appState === 'pretest' && (
        <PreTestPage onStart={handlePreTestStart} />
      )}
      
      {appState === 'start' && (
        <StartScreen onStart={handleStart} />
      )}
      
      {appState === 'survey' && (
        <QuestionCard
          question={questions[currentQuestionIndex]}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          onBack={handleBack}
        />
      )}
      
      {appState === 'userInfo' && (
        <UserInfoForm
          onSubmit={handleUserInfoSubmit}
          onSkip={handleSkipUserInfo}
        />
      )}
      
      {appState === 'thankYou' && (
        <ThankYouScreen
          userName={userInfo?.name}
          onComplete={handleThankYouComplete}
        />
      )}
      
      {appState === 'result' && result && (
        <ResultScreen
          typeCode={result.typeCode}
          axisScores={result.axisScores}
          analytics={result.analytics}
          onRestart={handleRestart}
          userRegion={userInfo?.region}
        />
      )}
    </>
  );
};

// 모든 유형 보기 컴포넌트
const AllTypesRoute: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1); // 이전 페이지로 되돌아가기 (결과창)
  };
  
  const handleSelectType = (typeCode: string) => {
    // 선택한 유형으로 결과 페이지 이동
    const userData = '';
    navigate(`/result?type=${typeCode}${userData ? `&user=${userData}` : ''}`);
  };
  
  return (
    <AllTypesScreen 
      onBack={handleBack} 
      onSelectType={handleSelectType}
    />
  );
};

// 공유된 결과 표시 컴포넌트 (기존 URL 파라미터 방식)
const SharedResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sharedData, setSharedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const typeCode = urlParams.get('type');
    const userDataString = urlParams.get('user');
    
    if (typeCode) {
      // 기본적인 결과 데이터 구성
      const basicResult = {
        typeCode,
        axisScores: getAxisScoresFromType(typeCode),
        analytics: {
          totalTime: 0,
          averageResponseTime: 0,
          completionRate: 100
        }
      };

      // 사용자 정보가 있으면 파싱
      let userInfo = null;
      if (userDataString) {
        try {
          userInfo = JSON.parse(decodeURIComponent(userDataString));
        } catch (e) {
          console.warn('Failed to parse user data:', e);
        }
      }

      setSharedData({ result: basicResult, userInfo });
    }
    setLoading(false);
  }, [location]);

  // TypeCode로부터 AxisScores 역산하는 함수 (6개 문항 기준)
  const getAxisScoresFromType = (typeCode: string) => {
    return {
      A: typeCode[0] === 'A' ? 8 : 4,   // Active vs Relaxing (2문항)
      C: typeCode[1] === 'C' ? 8 : 4,   // Culture vs Nature  
      F: typeCode[2] === 'F' ? 8 : 4    // Foodie vs Experience
    };
  };

  const handleStartNewTest = () => {
    navigate('/landing');
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>로딩 중...</div>;
  }

  if (!sharedData) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>잘못된 링크입니다.</div>;
  }

  return (
    <ResultScreen
      typeCode={sharedData.result.typeCode}
      axisScores={sharedData.result.axisScores}
      analytics={sharedData.result.analytics}
      onRestart={handleStartNewTest}
      userRegion={sharedData.userInfo?.region}
      isSharedView={true}
    />
  );
};

// 고유 ID 기반 공유 결과 표시 컴포넌트
const UniqueSharedResult: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const [sharedData, setSharedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadSharedResult = async () => {
      if (!shareId) {
        setError('공유 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        const { SupabaseService } = await import('./services/supabase');
        const allData = await SupabaseService.getAllUserData();
        const data = allData.find(item => item.sessionId === shareId);
        
        if (data && data.completed) {
          setSharedData({
            result: {
              typeCode: data.result,
              axisScores: data.answers ? data.answers.reduce((acc, answer) => {
                acc[answer.questionId] = answer.score;
                return acc;
              }, {} as any) : {},
              analytics: {
                totalTime: data.totalTime,
                clickCount: data.clickCount,
                scrollDepth: data.scrollDepth
              }
            },
            userInfo: data.userInfo
          });
        } else {
          setError('공유된 결과를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('공유 결과 로드 실패:', error);
        setError('결과를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadSharedResult();
  }, [shareId]);

  const handleStartNewTest = () => {
    navigate('/landing');
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        ⏳ 공유된 결과를 불러오는 중...
      </div>
    );
  }

  if (error || !sharedData) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <h2>😅 링크를 찾을 수 없어요</h2>
        <p>{error || '잘못된 공유 링크입니다.'}</p>
        <button 
          onClick={handleStartNewTest}
          style={{
            background: 'linear-gradient(45deg, #ff6b6b, #ffa500)',
            border: 'none',
            borderRadius: '50px',
            padding: '1rem 2rem',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          🚀 새로운 테스트하기
        </button>
      </div>
    );
  }

  return (
    <ResultScreen
      typeCode={sharedData.typeCode}
      axisScores={sharedData.axisScores}
      analytics={sharedData.analytics}
      onRestart={handleStartNewTest}
      userRegion={sharedData.userInfo?.region}
      isSharedView={true}
    />
  );
};

function App() {
  return (
    <AppContainer>
      <GlobalStyle />
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<SurveyApp />} />
        <Route path="/result" element={<SharedResult />} />
        <Route path="/share/:shareId" element={<UniqueSharedResult />} />
        <Route path="/all-types" element={<AllTypesRoute />} />
        <Route path="/admin" element={<AdminRoute />} />
      </Routes>
    </AppContainer>
  );
}

export default App;
