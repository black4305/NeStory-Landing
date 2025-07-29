import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '../types';
import NeStoryTILogo from './NeStoryTILogo';
import { detailedAnalytics } from '../utils/detailedAnalytics';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh; /* 동적 뷰포트 높이 사용 */
  height: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  
  @media (max-width: 768px) {
    min-height: 100vh;
    min-height: 100dvh;
    padding: 1rem;
    touch-action: manipulation;
    justify-content: center;
    position: fixed;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0.5rem;
    min-height: 100vh;
    min-height: 100dvh;
    height: 100vh;
    height: 100dvh;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  max-width: 500px;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  margin-bottom: 2rem;
  overflow: hidden;
  align-self: center;
  
  @media (max-width: 768px) {
    margin-bottom: 0;
    height: 6px;
    max-width: 100%;
  }
  
  @media (max-width: 375px) {
    height: 4px;
  }
`;

const Progress = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #00f5ff, #0099ff);
  border-radius: 4px;
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 25px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 15px;
    max-width: 90%;
    width: 90%;
    margin: auto;
    min-height: auto;
    max-height: 80vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-self: center;
  }
  
  @media (max-width: 480px) {
    padding: 1.2rem;
    border-radius: 12px;
    max-width: 95%;
    width: 95%;
    max-height: 85vh;
  }
  
  @media (max-width: 375px) {
    padding: 1rem;
    border-radius: 10px;
    font-size: 0.95rem;
    max-width: 95%;
    width: 95%;
  }
`;

const QuestionNumber = styled.div`
  color: #667eea;
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const BrandingHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #667eea;
  font-weight: 700;
  font-size: 0.9rem;
`;


const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const QuestionText = styled.h2`
  color: #2d3748;
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.5;
  margin-bottom: 1rem;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
    line-height: 1.4;
    margin-bottom: 1rem;
    font-weight: 700;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
    line-height: 1.4;
    margin-bottom: 0.8rem;
    font-weight: 700;
  }
  
  @media (max-width: 375px) {
    font-size: 1.1rem;
    line-height: 1.3;
    margin-bottom: 0.8rem;
    font-weight: 700;
  }
`;

const QuestionDescription = styled.p`
  color: #4a5568;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  padding: 1rem;
  border-radius: 12px;
  border-left: 4px solid #667eea;
  text-align: center;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    padding: 0.8rem;
    margin-bottom: 1.2rem;
    line-height: 1.5;
    font-weight: 500;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.7rem;
    margin-bottom: 1rem;
    line-height: 1.4;
    font-weight: 500;
  }
  
  @media (max-width: 375px) {
    font-size: 0.85rem;
    padding: 0.6rem;
    margin-bottom: 0.8rem;
    line-height: 1.4;
    font-weight: 500;
  }
`;

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const OptionButton = styled(motion.button)<{ selected: boolean; isA?: boolean }>`
  background: ${props => props.selected 
    ? props.isA 
      ? 'linear-gradient(45deg, #ff6b6b, #ff8e53)' 
      : 'linear-gradient(45deg, #667eea, #764ba2)'
    : 'linear-gradient(45deg, #f8f9fa, #e9ecef)'};
  color: ${props => props.selected ? 'white' : '#495057'};
  border: 3px solid ${props => props.selected 
    ? props.isA ? '#ff6b6b' : '#667eea' 
    : '#e9ecef'};
  border-radius: 20px;
  padding: 2rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 120px;
  text-align: center;
  line-height: 1.4;
  word-break: keep-all;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    border-color: #667eea;
  }
  
  @media (max-width: 768px) {
    padding: 1.2rem 0.8rem;
    font-size: 1rem;
    min-height: 60px;
    border-radius: 12px;
    font-weight: 600;
    line-height: 1.3;
    flex-direction: row;
    gap: 0.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0.7rem;
    font-size: 0.95rem;
    min-height: 56px;
    border-radius: 12px;
    font-weight: 600;
    line-height: 1.3;
  }
  
  @media (max-width: 375px) {
    padding: 1rem 0.6rem;
    font-size: 0.9rem;
    min-height: 52px;
    border-radius: 10px;
    font-weight: 600;
    line-height: 1.2;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    margin-top: 0.8rem;
    gap: 0.5rem;
  }
  
  @media (max-width: 480px) {
    margin-top: 0.6rem;
    gap: 0.4rem;
  }
  
  @media (max-width: 375px) {
    margin-top: 0.5rem;
    gap: 0.3rem;
  }
`;

const NextButton = styled(motion.button)`
  background: linear-gradient(45deg, #28a745, #20c997);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 50px;
  flex: 1;
  max-width: 200px;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    font-size: 1rem;
    min-height: 48px;
    max-width: 180px;
  }
  
  @media (max-width: 375px) {
    padding: 0.9rem 1.25rem;
    font-size: 0.95rem;
    min-height: 44px;
    max-width: 160px;
  }
`;

const BackButton = styled(motion.button)`
  background: linear-gradient(45deg, #6c757d, #495057);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 50px;
  flex: 1;
  max-width: 200px;
  
  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    font-size: 1rem;
    min-height: 48px;
    max-width: 180px;
  }
  
  @media (max-width: 375px) {
    padding: 0.9rem 1.25rem;
    font-size: 0.95rem;
    min-height: 44px;
    max-width: 160px;
  }
`;


interface QuestionCardProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  onAnswer: (score: number, timeSpent: number) => void;
  onBack?: () => void;
}


const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentQuestion,
  totalQuestions,
  onAnswer,
  onBack
}) => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    setStartTime(Date.now());
    setSelectedScore(null);
    
    // 페이지 추적 (첫 번째 문제일 때만)
    if (currentQuestion === 1) {
      const initTestTracking = async () => {
        await detailedAnalytics.trackPageEnter('/nestoryti', {
          page: 'test',
          title: 'MBTI 테스트 페이지',
          step: 3,
          funnel: 'test_taking',
          totalQuestions
        });
      };
      initTestTracking();
    }
    
    // 문제별 추적
    detailedAnalytics.trackCustomEvent('question_displayed', {
      questionId: question.id,
      questionNumber: currentQuestion,
      totalQuestions,
      questionText: question.text?.slice(0, 50),
      optionA: question.optionA?.slice(0, 30),
      optionB: question.optionB?.slice(0, 30)
    });
  }, [question.id, currentQuestion, totalQuestions]);

  const handleAnswer = () => {
    if (selectedScore !== null) {
      const totalTime = Date.now() - startTime;
      
      // 답변 추적
      detailedAnalytics.trackTestAnswer(question.id, selectedScore, totalTime);
      detailedAnalytics.trackCustomEvent('question_answered', {
        questionId: question.id,
        questionNumber: currentQuestion,
        selectedScore,
        selectedOption: selectedScore === 5 ? 'A' : 'B',
        responseTime: totalTime,
        isLastQuestion: currentQuestion === totalQuestions,
        progress: (currentQuestion / totalQuestions) * 100
      });
      
      // 마지막 문제인 경우 페이지 이탈 추적
      if (currentQuestion === totalQuestions) {
        detailedAnalytics.trackPageExit();
      }
      
      onAnswer(selectedScore, totalTime);
    }
  };

  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <Container>
      
      <ProgressBar>
        <Progress
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </ProgressBar>

      <AnimatePresence mode="wait">
        <Card
          key={question.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <BrandingHeader>
            <LogoWrapper>
              <NeStoryTILogo size={30} showText={false} color="#667eea" />
            </LogoWrapper>
            NeStoryTI
          </BrandingHeader>
          
          <QuestionNumber>
            질문 {currentQuestion} / {totalQuestions}
          </QuestionNumber>
          
          <QuestionText>{question.text}</QuestionText>
          
          {question.description && (
            <QuestionDescription>
              {question.description}
            </QuestionDescription>
          )}
          
          <OptionsContainer>
            <OptionButton
              key="A"
              selected={selectedScore === 5}
              isA={true}
              onClick={() => {
                setSelectedScore(5);
                detailedAnalytics.trackCustomEvent('option_selected', {
                  questionId: question.id,
                  questionNumber: currentQuestion,
                  selectedOption: 'A',
                  optionText: question.optionA?.slice(0, 30),
                  timeToSelect: Date.now() - startTime
                });
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>A</span>
              <span>{question.optionA}</span>
            </OptionButton>
            <OptionButton
              key="B"
              selected={selectedScore === 1}
              isA={false}
              onClick={() => {
                setSelectedScore(1);
                detailedAnalytics.trackCustomEvent('option_selected', {
                  questionId: question.id,
                  questionNumber: currentQuestion,
                  selectedOption: 'B',
                  optionText: question.optionB?.slice(0, 30),
                  timeToSelect: Date.now() - startTime
                });
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>B</span>
              <span>{question.optionB}</span>
            </OptionButton>
          </OptionsContainer>
          
          <ButtonGroup>
            {currentQuestion > 1 && onBack && (
              <BackButton
                onClick={onBack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← 이전
              </BackButton>
            )}
            <NextButton
              disabled={selectedScore === null}
              onClick={handleAnswer}
              whileHover={{ scale: selectedScore !== null ? 1.05 : 1 }}
              whileTap={{ scale: selectedScore !== null ? 0.95 : 1 }}
            >
              {currentQuestion === totalQuestions ? '결과 보기' : '다음 →'}
            </NextButton>
          </ButtonGroup>
        </Card>
      </AnimatePresence>
    </Container>
  );
};

export default QuestionCard;