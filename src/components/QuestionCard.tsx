import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '../types';
import NeStoryTILogo from './NeStoryTILogo';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  
  @media (max-width: 768px) {
    min-height: auto;
    padding: 2rem 1rem;
    touch-action: manipulation;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 0.5rem;
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
    padding: 1rem;
    border-radius: 15px;
    max-width: 100%;
    width: 100%;
    margin: 0;
    height: 100%;
    max-height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  @media (max-width: 480px) {
    padding: 0.8rem;
    border-radius: 12px;
  }
  
  @media (max-width: 375px) {
    padding: 0.6rem;
    border-radius: 10px;
    font-size: 0.95rem;
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

const getLikertOptions = () => {
  return [
    { value: 1, label: '전혀 그렇지 않다', emoji: '😟' },
    { value: 2, label: '그렇지 않다', emoji: '😐' },
    { value: 3, label: '보통이다', emoji: '😊' },
    { value: 4, label: '그렇다', emoji: '😍' },
    { value: 5, label: '매우 그렇다', emoji: '🤩' }
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

  useEffect(() => {
    setStartTime(Date.now());
    setSelectedScore(null);
  }, [question.id]);

  const handleAnswer = () => {
    if (selectedScore !== null) {
      const totalTime = Date.now() - startTime;
      onAnswer(selectedScore, totalTime);
    }
  };

  const progress = (currentQuestion / totalQuestions) * 100;
  const options = getLikertOptions();

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
            {options.map((option) => (
              <OptionButton
                key={option.value}
                selected={selectedScore === option.value}
                onClick={() => setSelectedScore(option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span style={{ fontSize: '1.2rem' }}>{option.emoji}</span>
                <span>{option.label}</span>
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