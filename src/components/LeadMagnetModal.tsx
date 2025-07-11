import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface LeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { type: 'email' | 'kakao'; value: string; channelAdded?: boolean }) => void;
  typeCode: string;
}

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 500px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 15px;
  }
  
  @media (max-width: 375px) {
    padding: 1.5rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
  transition: color 0.2s;
  
  &:hover {
    color: #2d3748;
  }
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 800;
  color: #2d3748;
  text-align: center;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #4a5568;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const BenefitBox = styled.div`
  background: linear-gradient(135deg, #fff5cc, #ffe4b3);
  border: 2px solid #ffa500;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const BenefitTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
  
  strong {
    color: #ff6b6b;
  }
`;

const BenefitList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
  
  li {
    padding: 0.5rem 0;
    font-size: 0.95rem;
    color: #555;
    
    &:before {
      content: "✅ ";
    }
  }
`;

const FormSection = styled.div`
  margin-top: 2rem;
`;

const OptionButton = styled.button<{ selected: boolean }>`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 2px solid ${props => props.selected ? '#667eea' : '#e2e8f0'};
  background: ${props => props.selected ? 'linear-gradient(135deg, #f0f4ff, #e6edff)' : 'white'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
  }
`;

const OptionIcon = styled.div`
  font-size: 2rem;
`;

const OptionText = styled.div`
  text-align: left;
  flex: 1;
`;

const OptionTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
`;

const OptionDesc = styled.div`
  font-size: 0.85rem;
  color: #718096;
`;

const InputSection = styled.div`
  margin-top: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const KakaoChannelBox = styled.div`
  background: #fee500;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 0.95rem;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  strong {
    color: #3a1d1d;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.2rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
    transform: none;
  }
`;

const LeadMagnetModal: React.FC<LeadMagnetModalProps> = ({ isOpen, onClose, onSubmit, typeCode }) => {
  const [selectedOption, setSelectedOption] = useState<'email' | 'kakao' | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [channelAdded, setChannelAdded] = useState(false);

  const handleSubmit = () => {
    if (!selectedOption || !inputValue.trim()) return;
    
    onSubmit({
      type: selectedOption,
      value: inputValue.trim(),
      channelAdded: selectedOption === 'kakao' ? channelAdded : undefined
    });
  };

  const isValid = selectedOption && inputValue.trim() && (selectedOption !== 'kakao' || channelAdded);

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>✕</CloseButton>
            
            <Title>🎁 {typeCode} 유형 맞춤 선물 받기!</Title>
            <Subtitle>
              테스트 완료를 축하드려요!<br/>
              연락처를 남겨주시면 특별 선물을 보내드릴게요
            </Subtitle>
            
            <BenefitBox>
              <BenefitTitle>
                🎉 <strong>총 19,900원 상당</strong> 무료 혜택!
              </BenefitTitle>
              <BenefitList>
                <li>가족 여행 완벽 준비 체크리스트</li>
                <li>2025 여름방학 가족여행 축제 일정표 (광주/전남/전북/충남)</li>
                <li>우리 가족 여행 스타일 진단서</li>
              </BenefitList>
            </BenefitBox>
            
            <FormSection>
              <OptionButton
                selected={selectedOption === 'email'}
                onClick={() => setSelectedOption('email')}
              >
                <OptionIcon>📧</OptionIcon>
                <OptionText>
                  <OptionTitle>이메일로 받기</OptionTitle>
                  <OptionDesc>자료를 바로 다운로드할 수 있는 링크 발송</OptionDesc>
                </OptionText>
              </OptionButton>
              
              <OptionButton
                selected={selectedOption === 'kakao'}
                onClick={() => setSelectedOption('kakao')}
              >
                <OptionIcon>💬</OptionIcon>
                <OptionText>
                  <OptionTitle>카카오톡으로 받기</OptionTitle>
                  <OptionDesc>카카오톡 프로필명 입력 + 채널 친구추가</OptionDesc>
                </OptionText>
              </OptionButton>
              
              {selectedOption && (
                <InputSection>
                  <Input
                    type={selectedOption === 'email' ? 'email' : 'text'}
                    placeholder={selectedOption === 'email' ? '이메일 주소를 입력하세요' : '카카오톡 프로필명을 입력하세요'}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  
                  {selectedOption === 'kakao' && (
                    <KakaoChannelBox>
                      <Checkbox
                        type="checkbox"
                        id="channelAdd"
                        checked={channelAdded}
                        onChange={(e) => setChannelAdded(e.target.checked)}
                      />
                      <CheckboxLabel htmlFor="channelAdd">
                        <strong>카카오톡 채널 친구추가</strong> (필수)
                      </CheckboxLabel>
                    </KakaoChannelBox>
                  )}
                </InputSection>
              )}
              
              <SubmitButton onClick={handleSubmit} disabled={!isValid}>
                {isValid ? '🎁 무료 선물 받기!' : '정보를 입력해주세요'}
              </SubmitButton>
            </FormSection>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default LeadMagnetModal;