import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import StartScreen from './components/StartScreen';
import QuestionCard from './components/QuestionCard';
import ResultScreen from './components/ResultScreen';
import UserInfoForm from './components/UserInfoForm';
import ThankYouScreen from './components/ThankYouScreen';
import AdminLogin from './components/AdminLogin';
import EnhancedAdminDashboard from './components/EnhancedAdminDashboard';
import { questions } from './data/questions';
import { calculateTravelType, getAxisScores } from './utils/calculator';
import { analytics } from './utils/analytics';
import { Answer, UserInfo } from './types';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  html {
    scroll-behavior: smooth;
  }

  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }
  }
`;

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
`;

type AppState = 'start' | 'survey' | 'userInfo' | 'thankYou' | 'result';

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
  const [appState, setAppState] = useState<AppState>('start');
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
    const handleBeforeUnload = () => {
      if (appState === 'survey' && answers.length > 0) {
        analytics.trackAbandon();
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

  const handleUserInfoSubmit = (info: UserInfo) => {
    setUserInfo(info);
    if (result) {
      analytics.trackCompletion(result.typeCode, info);
    }
    setAppState('thankYou');
  };

  const handleSkipUserInfo = () => {
    if (result) {
      analytics.trackCompletion(result.typeCode);
    }
    setAppState('thankYou');
  };

  const handleThankYouComplete = () => {
    setAppState('result');
  };

  const handleRestart = () => {
    setAppState('start');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResult(null);
    setUserInfo(null);
  };

  return (
    <>
      {appState === 'start' && (
        <StartScreen onStart={handleStart} />
      )}
      
      {appState === 'survey' && (
        <QuestionCard
          question={questions[currentQuestionIndex]}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
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

function App() {
  return (
    <AppContainer>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<SurveyApp />} />
        <Route path="/admin" element={<AdminRoute />} />
      </Routes>
    </AppContainer>
  );
}

export default App;
