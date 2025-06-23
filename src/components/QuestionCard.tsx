import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '../types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: -webkit-fill-available;
  padding: 1rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  
  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
    justify-content: flex-start;
    padding-top: 1.5rem;
  }
  
  @media (max-width: 375px) {
    padding: 0.75rem 0.5rem;
    padding-top: 1rem;
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
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 15px;
    max-width: 100%;
  }
  
  @media (max-width: 375px) {
    padding: 1.25rem;
    border-radius: 12px;
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

const Logo = styled.div`
  width: 24px;
  height: 24px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.7rem;
  font-weight: 900;
`;

const QuestionText = styled.h2`
  color: #2d3748;
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
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
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.8rem;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const OptionButton = styled(motion.button)<{ selected: boolean }>`
  background: ${props => props.selected 
    ? 'linear-gradient(45deg, #667eea, #764ba2)' 
    : 'linear-gradient(45deg, #f8f9fa, #e9ecef)'};
  color: ${props => props.selected ? 'white' : '#495057'};
  border: 2px solid ${props => props.selected ? '#667eea' : 'transparent'};
  border-radius: 15px;
  padding: 1.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 80px;
  flex: 1;
  text-align: center;
  line-height: 1.4;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 0.95rem;
    min-height: 48px;
    border-radius: 12px;
  }
  
  @media (max-width: 375px) {
    padding: 0.9rem;
    font-size: 0.9rem;
    min-height: 44px;
    border-radius: 10px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    margin-top: 1.5rem;
  }
  
  @media (max-width: 375px) {
    margin-top: 1.25rem;
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

const getBinaryOptions = (question: Question) => {
  // description에서 "vs" 기준으로 나누어 두 옵션 생성
  if (question.description) {
    const parts = question.description.split(' vs ');
    if (parts.length === 2) {
      return [
        { value: 1, label: parts[0].trim() },
        { value: 5, label: parts[1].trim() }
      ];
    }
  }
  
  // fallback 옵션
  return [
    { value: 1, label: '첫 번째 선택' },
    { value: 5, label: '두 번째 선택' }
  ];
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentQuestion,
  totalQuestions,
  onAnswer,
  onBack
}) => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [timeSpent, setTimeSpent] = useState<number>(0);

  useEffect(() => {
    setStartTime(Date.now());
    setSelectedScore(null);
    setTimeSpent(0);
  }, [question.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const handleAnswer = () => {
    if (selectedScore !== null) {
      const totalTime = Date.now() - startTime;
      onAnswer(selectedScore, totalTime);
    }
  };

  const progress = (currentQuestion / totalQuestions) * 100;
  const options = getBinaryOptions(question);

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
            <Logo>N</Logo>
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
            {options.map((option) => (
              <OptionButton
                key={option.value}
                selected={selectedScore === option.value}
                onClick={() => setSelectedScore(option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option.label}
              </OptionButton>
            ))}
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