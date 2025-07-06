import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface TwoStepOptinModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: { name?: string; phone: string; userType: string }) => void;
  userType: string;
}

interface FormData {
  name: string;
  phone: string;
}

const TwoStepOptinModal: React.FC<TwoStepOptinModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  userType
}) => {
  const [step, setStep] = useState<'channel' | 'phone'>('channel');
  const [formData, setFormData] = useState<FormData>({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleKakaoClick = () => {
    // 카카오톡 채널 추가 URL (실제 URL로 교체 필요)
    window.open('https://pf.kakao.com/_your_kakao_channel_id', '_blank');
    onClose();
  };

  const handlePhoneClick = () => {
    setStep('phone');
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // 한국 휴대폰 번호 패턴 (010-XXXX-XXXX, 01X-XXXX-XXXX)
    const phonePattern = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    return phonePattern.test(phone.replace(/\s/g, ''));
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone) return;

    // 연락처 유효성 검사
    if (!validatePhoneNumber(formData.phone)) {
      alert('올바른 연락처 형식을 입력해주세요. (예: 010-1234-5678)');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 폼 데이터와 사용자 타입을 부모 컴포넌트로 전달
      await onSubmit({
        name: formData.name || undefined,
        phone: formData.phone,
        userType
      });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhoneNumber = (value: string): string => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');
    
    // 010-XXXX-XXXX 형식으로 자동 포맷팅
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length <= 11) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    }
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === 'phone') {
      const formattedPhone = formatPhoneNumber(value);
      setFormData(prev => ({ ...prev, [field]: formattedPhone }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>×</CloseButton>
            
            {step === 'channel' && (
              <ChannelSelection>
                <ModalTitle>결과를 어디로 보내드릴까요?</ModalTitle>
                <ModalSubtitle>정확한 분석 결과를 가장 편한 방법으로 확인하세요.</ModalSubtitle>
                
                <ChannelButtons>
                  <ChannelButton 
                    onClick={handleKakaoClick}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ChannelIcon>📱</ChannelIcon>
                    <ChannelText>카카오톡으로 받기</ChannelText>
                  </ChannelButton>
                  
                  <ChannelButton 
                    onClick={handlePhoneClick}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ChannelIcon>📞</ChannelIcon>
                    <ChannelText>연락처로 받기</ChannelText>
                  </ChannelButton>
                </ChannelButtons>
              </ChannelSelection>
            )}

            {step === 'phone' && (
              <PhoneForm onSubmit={handlePhoneSubmit}>
                <ModalTitle>연락처로 결과 받기</ModalTitle>
                <ModalSubtitle>분석 결과를 안전하게 문자메시지로 전달해드립니다.</ModalSubtitle>
                
                <FormFields>
                  <InputField>
                    <InputLabel>이름 (선택)</InputLabel>
                    <Input
                      type="text"
                      placeholder="이름을 입력하세요"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </InputField>
                  
                  <InputField>
                    <InputLabel>연락처 *</InputLabel>
                    <Input
                      type="tel"
                      placeholder="연락처를 입력하세요 (예: 010-1234-5678)"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </InputField>
                </FormFields>
                
                <SubmitButton
                  type="submit"
                  disabled={!formData.phone || isSubmitting}
                  whileHover={{ scale: !formData.phone ? 1 : 1.02 }}
                  whileTap={{ scale: !formData.phone ? 1 : 0.98 }}
                >
                  {isSubmitting ? '결과 분석 중...' : '결과 확인하기!'}
                </SubmitButton>
                
                <BackButton onClick={() => setStep('channel')}>
                  ← 채널 선택으로 돌아가기
                </BackButton>
              </PhoneForm>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

// Styled Components
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    border-radius: 15px;
    max-width: 95vw;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
    border-radius: 12px;
    max-width: 98vw;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  line-height: 1;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;

const ChannelSelection = styled.div`
  text-align: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.8rem;
  line-height: 1.3;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const ModalSubtitle = styled.p`
  color: #4a5568;
  font-size: 1rem;
  margin-bottom: 2rem;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-bottom: 1.2rem;
  }
`;

const ChannelButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ChannelButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.2rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  
  &:hover {
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 1rem 1.2rem;
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.9rem 1rem;
    font-size: 0.95rem;
    gap: 0.8rem;
  }
`;

const ChannelIcon = styled.span`
  font-size: 1.5rem;
`;

const ChannelText = styled.span`
  flex: 1;
  text-align: center;
`;

const PhoneForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const InputField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InputLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  margin-bottom: 1rem;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 0.9rem 1.2rem;
    font-size: 1rem;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 0.9rem;
  cursor: pointer;
  text-align: center;
  padding: 0.5rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: #5a67d8;
    text-decoration: underline;
  }
`;

export default TwoStepOptinModal;