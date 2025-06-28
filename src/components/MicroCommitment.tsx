import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const CommitmentContainer = styled(motion.div)`
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border: 2px solid #dee2e6;
  border-radius: 16px;
  padding: 30px;
  margin: 30px 0;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 18px;
    margin: 15px 0;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
    margin: 12px 0;
    border-radius: 10px;
  }
  
  @media (max-width: 375px) {
    padding: 12px;
    margin: 10px 0;
    border-radius: 8px;
  }
`;

const Question = styled.h3`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0 0 20px 0;
  
  @media (max-width: 768px) {
    font-size: 17px;
    margin: 0 0 15px 0;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
    margin: 0 0 12px 0;
  }
  
  @media (max-width: 375px) {
    font-size: 15px;
    margin: 0 0 10px 0;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 20px 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin: 15px 0;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
    margin: 12px 0;
  }
  
  @media (max-width: 375px) {
    gap: 6px;
    margin: 10px 0;
  }
`;

const OptionButton = styled(motion.button)<{ selected?: boolean }>`
  background: ${props => props.selected ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'white'};
  color: ${props => props.selected ? 'white' : '#333'};
  border: 2px solid ${props => props.selected ? '#667eea' : '#dee2e6'};
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  min-width: 120px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 14px;
    min-width: 90px;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 9px 14px;
    font-size: 13px;
    min-width: 80px;
    border-radius: 18px;
  }
  
  @media (max-width: 375px) {
    padding: 8px 12px;
    font-size: 12px;
    min-width: 70px;
    border-radius: 15px;
  }
`;

const NextButton = styled(motion.button)<{ visible: boolean }>`
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 25px;
  cursor: pointer;
  margin-top: 20px;
  opacity: ${props => props.visible ? 1 : 0.5};
  pointer-events: ${props => props.visible ? 'auto' : 'none'};
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 15px;
    margin-top: 15px;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 11px 20px;
    font-size: 14px;
    margin-top: 12px;
    border-radius: 18px;
  }
  
  @media (max-width: 375px) {
    padding: 10px 18px;
    font-size: 13px;
    margin-top: 10px;
    border-radius: 15px;
  }
`;

const ProgressText = styled.p`
  font-size: 14px;
  color: #666;
  margin: 15px 0 0 0;
  
  @media (max-width: 768px) {
    font-size: 12px;
    margin: 12px 0 0 0;
  }
  
  @media (max-width: 480px) {
    font-size: 11px;
    margin: 10px 0 0 0;
  }
  
  @media (max-width: 375px) {
    font-size: 10px;
    margin: 8px 0 0 0;
  }
`;

interface MicroCommitmentProps {
  onComplete?: () => void;
  onSurveyRedirect?: (answers: string[]) => void;
}

const MicroCommitment: React.FC<MicroCommitmentProps> = ({ onComplete, onSurveyRedirect }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const questions = [
    {
      question: "가족과 함께하는 여행에서 가장 중요한 것은?",
      options: ["재미있는 활동", "편안한 휴식", "새로운 경험"]
    },
    {
      question: "주로 어떤 여행지를 선호하시나요?",
      options: ["도시/문화", "자연/힐링", "테마파크"]
    },
    {
      question: "여행 계획은 주로 누가 세우나요?",
      options: ["부모가 주도", "아이 의견 반영", "함께 계획"]
    }
  ];

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 외부 설문으로 리다이렉트 옵션 추가
      if (onSurveyRedirect) {
        onSurveyRedirect(answers);
      } else if (onComplete) {
        onComplete();
      }
    }
  };

  const currentQuestion = questions[currentStep];
  const hasAnswer = answers[currentStep];

  return (
    <CommitmentContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Question>{currentQuestion.question}</Question>
      
      <OptionsContainer>
        {currentQuestion.options.map((option, index) => (
          <OptionButton
            key={index}
            selected={answers[currentStep] === option}
            onClick={() => handleAnswer(option)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {option}
          </OptionButton>
        ))}
      </OptionsContainer>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <NextButton
          visible={!!hasAnswer}
          onClick={handleNext}
          whileHover={{ scale: hasAnswer ? 1.05 : 1 }}
          whileTap={{ scale: hasAnswer ? 0.95 : 1 }}
        >
          {currentStep < questions.length - 1 ? '다음 질문' : '📝 내부 설문 시작'}
        </NextButton>
        
        {currentStep === questions.length - 1 && hasAnswer && onSurveyRedirect && (
          <NextButton
            visible={true}
            onClick={() => onSurveyRedirect(answers)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ 
              background: 'linear-gradient(135deg, #ff6b6b, #ffa500)',
              fontSize: typeof window !== 'undefined' && window.innerWidth <= 768 ? '14px' : '15px'
            }}
          >
            🚀 전문 설문하기
          </NextButton>
        )}
      </div>

      <ProgressText>
        {currentStep + 1} / {questions.length} 단계 • 전체 테스트는 1분이면 완료됩니다
      </ProgressText>
    </CommitmentContainer>
  );
};

export default MicroCommitment;