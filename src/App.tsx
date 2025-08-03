import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import PreTestPage from './components/PreTestPage';
import QuestionCard from './components/QuestionCard';
import ResultScreen from './components/ResultScreen';
import LeadMagnetPage from './components/LeadMagnetPage';
import AdminLogin from './components/AdminLogin';
import AdvancedAdminDashboard from './components/AdvancedAdminDashboard';
import AllTypesScreen from './components/AllTypesScreen';
import LandingPage from './components/LandingPage';
import PostgresService from './services/postgresService';
import { calculateTravelType, getAxisScores } from './utils/calculator';
import { analytics } from './utils/analytics';
import { detailedAnalytics } from './utils/detailedAnalytics';
import { Answer } from './types';
import { questions as questionsData } from './data/questions';

// Styled components 정의
const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: #f8f9fa;
  }
`;

// ... (스타일 컴포넌트는 이전과 동일)

// 메인 설문 컴포넌트
const SurveyApp: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questions] = useState(questionsData); // 로컬 questions 데이터 사용

  useEffect(() => {
    // 세션 및 분석 초기화

    const handleBeforeUnload = async () => {
      if (answers.length > 0) {
        await analytics.trackAbandon();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [answers]);

  const handleAnswer = async (score: number, timeSpent: number) => {
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
      const typeCode = calculateTravelType(newAnswers);
      const axisScores = getAxisScores(newAnswers);
      
      const analyticsData = {
        totalTime: analytics.getAverageResponseTime() * newAnswers.length,
        averageResponseTime: analytics.getAverageResponseTime(),
        completionRate: analytics.getCompletionRate()
      };

      await detailedAnalytics.trackTestCompletion(typeCode, axisScores as unknown as Record<string, number>, analyticsData);

      sessionStorage.setItem('testResult', JSON.stringify({
        typeCode,
        axisScores,
        analytics: analyticsData
      }));
      
      navigate(`/squeeze?type=${typeCode}`);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      const newAnswers = answers.slice(0, -1);
      setAnswers(newAnswers);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // questions는 이제 로컬 데이터이므로 항상 사용 가능

  return (
    <QuestionCard
      question={questions[currentQuestionIndex]}
      currentQuestion={currentQuestionIndex + 1}
      totalQuestions={questions.length}
      onAnswer={handleAnswer}
      onBack={handleBack}
    />
  );
};

// 누락된 컴포넌트들 정의
const InfoPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  return <PreTestPage onStart={() => navigate('/nestoryti')} />;
};

const SqueezePageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const typeCode = searchParams.get('type') || 'ACFBK';
  
  return (
    <LeadMagnetPage 
      typeCode={typeCode} 
      onComplete={() => navigate('/result')} 
    />
  );
};
const SharedResult: React.FC = () => {
  const navigate = useNavigate();
  // 기본값 설정
  const defaultProps = {
    typeCode: 'ACFBK',
    axisScores: { A: 50, C: 50, F: 50 },
    onRestart: () => navigate('/'),
    analytics: { totalTime: 0, averageResponseTime: 0, completionRate: 100 }
  };
  
  return <ResultScreen {...defaultProps} />;
};

const UniqueSharedResult: React.FC = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();
  
  const defaultProps = {
    typeCode: 'ACFBK',
    axisScores: { A: 50, C: 50, F: 50 },
    onRestart: () => navigate('/'),
    analytics: { totalTime: 0, averageResponseTime: 0, completionRate: 100 },
    shareId
  };
  
  return <ResultScreen {...defaultProps} />;
};
const AllTypesRoute: React.FC = () => {
  const navigate = useNavigate();
  return <AllTypesScreen onBack={() => navigate('/')} />;
};

// AdminRoute 컴포넌트 정의
const AdminRoute: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return <AdvancedAdminDashboard />;
};

function App() {
  return (
    <AppContainer>
      <GlobalStyle />
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/info" element={<InfoPageWrapper />} />
        <Route path="/nestoryti" element={<SurveyApp />} />
        <Route path="/squeeze" element={<SqueezePageWrapper />} />
        <Route path="/result" element={<SharedResult />} />
        <Route path="/share/:shareId" element={<UniqueSharedResult />} />
        <Route path="/all-types" element={<AllTypesRoute />} />
        <Route path="/landing_admin" element={<AdminRoute />} />
      </Routes>
    </AppContainer>
  );
}

export default App;
