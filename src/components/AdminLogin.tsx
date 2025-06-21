import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
`;

const LoginCard = styled(motion.div)`
  background: white;
  border-radius: 25px;
  padding: 3rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  max-width: 400px;
  width: 100%;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 20px;
  }
`;

const Logo = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  color: #2d3748;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #718096;
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const PinInputContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const PinInput = styled.input`
  width: 60px;
  height: 60px;
  border: 3px solid #e2e8f0;
  border-radius: 15px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  background: #f7fafc;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: white;
  }
  
  &.filled {
    border-color: #48bb78;
    background: #f0fff4;
  }
  
  &.error {
    border-color: #f56565;
    background: #fed7d7;
    animation: shake 0.5s ease-in-out;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;

const LoginButton = styled(motion.button)<{ disabled: boolean }>`
  background: ${props => props.disabled 
    ? 'linear-gradient(45deg, #cbd5e0, #a0aec0)' 
    : 'linear-gradient(45deg, #667eea, #764ba2)'};
  color: white;
  border: none;
  border-radius: 15px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  width: 100%;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled(motion.div)`
  background: #fed7d7;
  color: #c53030;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const HelpText = styled.div`
  color: #a0aec0;
  font-size: 0.85rem;
  line-height: 1.5;
`;

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const ADMIN_PIN = '1234'; // 실제 운영에서는 환경변수나 보안된 저장소 사용

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    // 자동으로 다음 입력창으로 이동
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }

    // 모든 자리가 채워지면 자동 로그인 시도
    if (newPin.every(digit => digit !== '') && newPin.join('') !== pin.join('')) {
      setTimeout(() => handleLogin(newPin.join('')), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleLogin = async (pinValue?: string) => {
    const currentPin = pinValue || pin.join('');
    
    if (currentPin.length !== 4) {
      setError('4자리 숫자를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    // 로딩 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 800));

    if (currentPin === ADMIN_PIN) {
      onLogin();
    } else {
      setError('잘못된 비밀번호입니다.');
      setPin(['', '', '', '']);
      // 첫 번째 입력창에 포커스
      setTimeout(() => {
        const firstInput = document.getElementById('pin-0');
        firstInput?.focus();
      }, 100);
    }
    
    setIsLoading(false);
  };

  const isPinComplete = pin.every(digit => digit !== '');
  const hasError = error !== '';

  return (
    <Container>
      <LoginCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Logo>🔐</Logo>
        <Title>관리자 로그인</Title>
        <Subtitle>4자리 PIN 번호를 입력하세요</Subtitle>

        <PinInputContainer>
          {pin.map((digit, index) => (
            <PinInput
              key={index}
              id={`pin-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`${digit ? 'filled' : ''} ${hasError ? 'error' : ''}`}
              autoFocus={index === 0}
            />
          ))}
        </PinInputContainer>

        {error && (
          <ErrorMessage
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            ⚠️ {error}
          </ErrorMessage>
        )}

        <LoginButton
          disabled={!isPinComplete || isLoading}
          onClick={() => handleLogin()}
          whileHover={{ scale: isPinComplete && !isLoading ? 1.02 : 1 }}
          whileTap={{ scale: isPinComplete && !isLoading ? 0.98 : 1 }}
        >
          {isLoading ? '🔄 확인 중...' : '로그인'}
        </LoginButton>

        <HelpText>
          💡 관리자 권한이 필요한 페이지입니다.<br/>
          PIN을 잊으셨다면 시스템 관리자에게 문의하세요.
        </HelpText>
      </LoginCard>
    </Container>
  );
};

export default AdminLogin;