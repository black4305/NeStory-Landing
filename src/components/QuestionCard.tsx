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
  padding: 2rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
    padding: 2rem;
    border-radius: 20px;
  }
`;

const QuestionNumber = styled.div`
  color: #667eea;
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const QuestionText = styled.h2`
  color: #2d3748;
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OptionButton = styled(motion.button)<{ selected: boolean }>`
  background: ${props => props.selected 
    ? 'linear-gradient(45deg, #667eea, #764ba2)' 
    : 'linear-gradient(45deg, #f8f9fa, #e9ecef)'};
  color: ${props => props.selected ? 'white' : '#495057'};
  border: 2px solid ${props => props.selected ? '#667eea' : 'transparent'};
  border-radius: 15px;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 1.2rem;
    font-size: 0.9rem;
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
  margin-top: 2rem;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
`;


interface QuestionCardProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  onAnswer: (score: number, timeSpent: number) => void;
}

const options = [
  { value: 1, label: '매우 그렇지 않다' },
  { value: 2, label: '그렇지 않다' },
  { value: 3, label: '보통이다' },
  { value: 4, label: '그렇다' },
  { value: 5, label: '매우 그렇다' }
];

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentQuestion,
  totalQuestions,
  onAnswer
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
          <QuestionNumber>
            질문 {currentQuestion} / {totalQuestions}
          </QuestionNumber>
          
          <QuestionText>{question.text}</QuestionText>
          
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
          
          <NextButton
            disabled={selectedScore === null}
            onClick={handleAnswer}
            whileHover={{ scale: selectedScore !== null ? 1.05 : 1 }}
            whileTap={{ scale: selectedScore !== null ? 0.95 : 1 }}
          >
            {currentQuestion === totalQuestions ? '결과 보기' : '다음'}
          </NextButton>
        </Card>
      </AnimatePresence>
    </Container>
  );
};

export default QuestionCard;