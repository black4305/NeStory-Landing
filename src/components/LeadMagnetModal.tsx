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

const WarningMessage = styled.div`
  background: #fff5f5;
  border: 2px solid #ff6b6b;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
  text-align: center;
  
  p {
    margin: 0;
    color: #c53030;
    font-weight: 600;
    font-size: 0.95rem;
  }
`;

const LeadMagnetModal: React.FC<LeadMagnetModalProps> = ({ isOpen, onClose, onSubmit, typeCode }) => {
  const [selectedOption, setSelectedOption] = useState<'email' | 'kakao' | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [channelAdded, setChannelAdded] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // typeCode에 따른 맞춤 문구 설정
  const getTypeContent = () => {
    switch (typeCode) {
      case 'ENFJ':
        return {
          typeName: '사교적 리더형',
          headline: '🌟 사교적 리더형 가족을 위한 특별한 선물!',
          description: '모두가 즐거운 가족 여행의 비밀을 담았어요',
          benefit: '👫 가족 화합을 이끄는 여행 리더십 가이드',
          buttonText: '우리 가족 화합 여행 가이드 받기'
        };
      case 'INFP':
        return {
          typeName: '낭만적 모험가형',
          headline: '🦄 낭만적 모험가형 가족을 위한 특별한 선물!',
          description: '특별한 추억을 만드는 감성 여행법을 공개해요',
          benefit: '✨ 감성 충만한 가족 추억 만들기 가이드',
          buttonText: '우리 가족 감성 여행 가이드 받기'
        };
      case 'ESTJ':
        return {
          typeName: '효율적 계획가형',
          headline: '📋 효율적 계획가형 가족을 위한 특별한 선물!',
          description: '완벽한 여행 계획의 모든 것을 준비했어요',
          benefit: '🎯 시간/비용 최적화 여행 계획 템플릿',
          buttonText: '우리 가족 완벽 계획 가이드 받기'
        };
      case 'ISTP':
        return {
          typeName: '실용적 탐험가형',
          headline: '🔧 실용적 탐험가형 가족을 위한 특별한 선물!',
          description: '실속 있는 가족 여행의 핵심을 담았어요',
          benefit: '🏕️ 액티비티 중심 실속 여행 가이드',
          buttonText: '우리 가족 실속 여행 가이드 받기'
        };
      case 'ESFP':
        return {
          typeName: '즉흥적 엔터테이너형',
          headline: '🎉 즉흥적 엔터테이너형 가족을 위한 특별한 선물!',
          description: '신나고 재미있는 가족 여행의 모든 것!',
          benefit: '🎊 즉흥 여행도 즐거운 플레이 가이드',
          buttonText: '우리 가족 신나는 여행 가이드 받기'
        };
      case 'INTJ':
        return {
          typeName: '전략적 사색가형',
          headline: '♟️ 전략적 사색가형 가족을 위한 특별한 선물!',
          description: '깊이 있는 가족 여행의 정수를 담았어요',
          benefit: '🎓 교육적 가치가 있는 여행 기획 가이드',
          buttonText: '우리 가족 심화 여행 가이드 받기'
        };
      case 'ISFJ':
        return {
          typeName: '세심한 보호자형',
          headline: '🛡️ 세심한 보호자형 가족을 위한 특별한 선물!',
          description: '안전하고 편안한 가족 여행의 모든 팁!',
          benefit: '🏥 안전 제일! 가족 안심 여행 가이드',
          buttonText: '우리 가족 안심 여행 가이드 받기'
        };
      case 'ENTP':
        return {
          typeName: '혁신적 도전자형',
          headline: '🚀 혁신적 도전자형 가족을 위한 특별한 선물!',
          description: '남다른 가족 여행 경험을 위한 특별 가이드!',
          benefit: '💡 창의적이고 독특한 여행 아이디어 북',
          buttonText: '우리 가족 특별 여행 가이드 받기'
        };
      default:
        return {
          typeName: typeCode,
          headline: '🎁 축하합니다! 특별한 선물을 준비했어요',
          description: '당신의 가족 여행 스타일에 맞는 완벽한 가이드!',
          benefit: '🎯 맞춤형 가족 여행 완전 정복 가이드',
          buttonText: '맞춤 여행 가이드 받기'
        };
    }
  };

  const typeContent = getTypeContent();

  // 모달이 열릴 때 배경 스크롤 방지
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // 컴포넌트가 언마운트될 때 스타일 복원
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = () => {
    if (!selectedOption || !inputValue.trim()) return;
    
    onSubmit({
      type: selectedOption,
      value: inputValue.trim(),
      channelAdded: selectedOption === 'kakao' ? channelAdded : undefined
    });
  };

  const handleClose = () => {
    if (!showWarning) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 5000); // 5초 후 경고 메시지 숨김
    } else {
      onClose();
    }
  };

  const isValid = selectedOption && inputValue.trim() && (selectedOption !== 'kakao' || channelAdded);

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <ModalContent
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={handleClose}>✕</CloseButton>
            
            <Title>{showWarning ? '🚨 잠깐! 선물 받기를 놓치지 마세요!' : '두근두근... 우리 가족의 여행 유형을 분석하고 있습니다!'}</Title>
            <Subtitle>
              {showWarning ? (
                <>
                  지금까지 진행한 테스트가 아까우시지 않나요?<br/>
                  <span style={{color: '#ff6b6b', fontWeight: 700}}>연락처를 입력하지 않으면 선물도, 맞춤 여행 계획도 받을 수 없어요!</span>
                </>
              ) : (
                <>
                  분석이 거의 다 끝났어요!<br/>
                  <span style={{color: '#667eea', fontWeight: 700}}>8가지 여행 유형 중 우리 가족의 유형은 무엇일까요?</span>
                </>
              )}
            </Subtitle>
            
            <BenefitBox>
              <BenefitTitle>
                {showWarning ? '💔 이 혜택들을 정말 포기하실 건가요?' : '지금 결과를 확인하시면, 우리 가족 유형에 대한 상세 분석과 함께'}
              </BenefitTitle>
              <div style={{ fontSize: '1rem', color: '#667eea', fontWeight: 700, marginBottom: '1rem' }}>
                [2025 여름 여행지/축제 완전 정복 가이드]도 함께 보내드릴게요.
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                분석 결과가 사라지지 않게, 그리고 보너스 가이드북을 놓치지 않도록<br/>
                아래에 가장 자주 쓰는 연락처를 남겨주세요.
              </div>
              <div style={{ fontSize: '0.85rem', color: '#888' }}>
                버튼을 누르는 즉시 결과 페이지로 이동하며,<br/>
                가이드북은 이메일 또는 카카오톡으로 자동 발송됩니다.
              </div>
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
                {isValid ? '🎁 내 여행 유형 결과 확인하고, 무료 가이드북 받기!' : '📝 연락처를 입력해주세요'}
              </SubmitButton>
            </FormSection>
            
            {showWarning && (
              <WarningMessage>
                <p>⚠️ 정말로 포기하시겠어요?</p>
                <p>지금까지의 테스트가 모두 무의미해집니다!</p>
                <p>다시 한 번 X를 누르면 창이 닫힙니다.</p>
              </WarningMessage>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default LeadMagnetModal;