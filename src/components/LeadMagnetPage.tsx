import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { SupabaseService } from '../services/supabase';
import usePageTracking from '../hooks/usePageTracking';
import { detailedAnalytics } from '../utils/detailedAnalytics';

interface LeadMagnetPageProps {
  onComplete: () => void;
  typeCode: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const PageContent = styled(motion.div)`
  background: white;
  border-radius: 25px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  color: #2d3748;
  
  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 15px;
  }
  
  @media (max-width: 375px) {
    padding: 1.5rem;
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

const KakaoChannelButton = styled.button`
  background: #fee500;
  border: none;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  color: #3a1d1d;
  transition: all 0.3s ease;
  
  &:hover {
    background: #fada0a;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(254, 229, 0, 0.3);
  }
`;


const SubmitButton = styled(motion.button)`
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

const SkipButton = styled.button`
  background: none;
  border: none;
  color: #718096;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 1rem;
  text-decoration: underline;
  
  &:hover {
    color: #4a5568;
  }
`;

const LeadMagnetPage: React.FC<LeadMagnetPageProps> = ({ onComplete, typeCode }) => {
  const [selectedOption, setSelectedOption] = useState<'email' | 'kakao' | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [channelAdded, setChannelAdded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 페이지 추적 훅 사용
  const { linkUserInfo } = usePageTracking('leadmagnet');

  useEffect(() => {
    const initTracking = async () => {
      await detailedAnalytics.trackPageEnter('/squeeze', {
        page: 'leadmagnet',
        title: '고객 정보 수집 페이지',
        step: 4,
        funnel: 'conversion',
        typeCode,
        testResult: sessionStorage.getItem('testResult')
      });
    };

    initTracking();

    return () => {
      detailedAnalytics.trackPageExit();
    };
  }, [typeCode]);

  const handleSubmit = async () => {
    if (!selectedOption || !inputValue.trim()) {
      detailedAnalytics.trackError('form_validation', 'Missing required fields', {
        selectedOption,
        inputValueLength: inputValue.length,
        page: 'leadmagnet'
      });
      return;
    }
    
    if (selectedOption === 'kakao' && !channelAdded) {
      detailedAnalytics.trackError('form_validation', 'Kakao channel not added', {
        selectedOption,
        channelAdded,
        page: 'leadmagnet'
      });
      alert('카카오톡 채널을 먼저 추가해주세요!');
      return;
    }
    
    setIsSubmitting(true);
    
    // 폼 제출 추적
    detailedAnalytics.trackFormSubmit('lead_capture', {
      leadType: selectedOption,
      hasInput: !!inputValue.trim(),
      channelAdded: selectedOption === 'kakao' ? channelAdded : null,
      typeCode,
      step: 4,
      funnel: 'conversion'
    });
    
    try {
      // 새로운 PostgreSQL 기반 리드 추적 시스템
      await detailedAnalytics.trackLeadCapture(
        selectedOption as 'email' | 'kakao',
        inputValue.trim(),
        typeCode,
        {
          marketingConsent: selectedOption === 'kakao' ? channelAdded : false,
          privacyConsent: true,
          kakaoChannelAdded: selectedOption === 'kakao' ? channelAdded : false
        }
      );

      // 기존 Supabase 시스템과의 호환성 유지 (나중에 제거 예정)
      const visitId = sessionStorage.getItem('visitId') || Date.now().toString();
      await SupabaseService.saveLeadInfo({
        visitId,
        timestamp: Date.now(),
        leadType: selectedOption,
        email: selectedOption === 'email' ? inputValue.trim() : undefined,
        phone: selectedOption === 'kakao' ? inputValue.trim() : undefined,
        marketingConsent: selectedOption === 'kakao' ? channelAdded : false
      });

      // KPI 시스템과 사용자 정보 연결
      await linkUserInfo({
        email: selectedOption === 'email' ? inputValue.trim() : undefined,
        phone: selectedOption === 'kakao' ? inputValue.trim() : undefined,
        name: selectedOption === 'kakao' ? inputValue.trim() : undefined, // 카톡의 경우 별명을 이름으로
        marketingConsent: selectedOption === 'kakao' ? channelAdded : false
      });
      
      // 웹훅 URL (환경 변수에서 가져오기)
      const webhookUrl = process.env.REACT_APP_WEBHOOK_URL;
      
      if (webhookUrl) {
        try {
          // 디바이스 정보 파싱
          const getDeviceInfo = () => {
            const ua = navigator.userAgent;
            let device = '알 수 없음';
            
            // 모바일 체크
            if (/iPhone|iPad|iPod/.test(ua)) {
              device = 'iOS';
              if (/iPhone/.test(ua)) device = 'iPhone';
              else if (/iPad/.test(ua)) device = 'iPad';
            } else if (/Android/.test(ua)) {
              device = 'Android';
            } else if (/Windows/.test(ua)) {
              device = 'Windows PC';
            } else if (/Mac/.test(ua)) {
              device = 'Mac';
            } else if (/Linux/.test(ua)) {
              device = 'Linux';
            }
            
            return device;
          };
          
          // IP 주소 가져오기 (외부 API 사용)
          let ipInfo = { ip: '알 수 없음', city: '알 수 없음', country: '알 수 없음' };
          try {
            const ipResponse = await fetch('https://ipapi.co/json/');
            if (ipResponse.ok) {
              const data = await ipResponse.json();
              ipInfo = {
                ip: data.ip || '알 수 없음',
                city: data.city || '알 수 없음',
                country: data.country_name || '알 수 없음'
              };
            }
          } catch (e) {
            console.log('IP 정보 가져오기 실패');
          }
          
          // 웹훅으로 데이터 전송
          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              timestamp: new Date().toISOString(),
              type: selectedOption,
              value: inputValue.trim(),
              channelAdded: selectedOption === 'kakao' ? channelAdded : undefined,
              device: getDeviceInfo(),
              ip: ipInfo.ip,
              location: `${ipInfo.city}, ${ipInfo.country}`,
              pageUrl: window.location.href
            })
          });
          
          if (!response.ok) {
            console.error('웹훅 전송 실패:', response.status);
          }
        } catch (error) {
          console.error('웹훅 전송 중 오류:', error);
          // 웹훅 실패해도 사용자 경험에 영향 없도록 계속 진행
        }
      }
      
      // 완료 후 결과 페이지로 이동
      // 사용자에게 확인 메시지 (선택사항)
      if (selectedOption === 'email') {
        console.log('이메일로 템플릿이 발송될 예정입니다.');
      } else {
        console.log('카카오톡으로 템플릿이 발송될 예정입니다.');
      }
      onComplete();
    } catch (error) {
      console.error('리드 정보 저장 실패:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
      setIsSubmitting(false);
    }
  };

  const isValid = selectedOption && inputValue.trim() && (selectedOption !== 'kakao' || channelAdded);

  return (
    <Container>
      <PageContent
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Title>두근두근... 우리 가족의 여행 유형을 분석하고 있습니다!</Title>
        <Subtitle>
          분석이 거의 다 끝났어요!<br/>
          <span style={{color: '#667eea', fontWeight: 700}}>8가지 여행 유형 중 우리 가족의 유형은 무엇일까요?</span>
        </Subtitle>
        
        <BenefitBox>
          <BenefitTitle>
            지금 결과를 확인하시면, 우리 가족 유형에 대한 상세 분석과 함께
          </BenefitTitle>
          <div style={{ fontSize: '1rem', color: '#667eea', fontWeight: 700, marginBottom: '1rem' }}>
            [2025 여름 여행지/축제 완전 정복 가이드]도 함께 보내드릴게요.
          </div>
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
            분석 결과가 사라지지 않게, 그리고 무료 템플릿을 놓치지 않도록<br/>
            아래에 가장 자주 쓰는 연락처를 남겨주세요.
          </div>
          <div style={{ fontSize: '0.85rem', color: '#888' }}>
            버튼을 누르는 즉시 결과 페이지로 이동하며,<br/>
            템플릿은 이메일 또는 카카오톡으로 자동 발송됩니다.
          </div>
        </BenefitBox>
        
        <FormSection>
          <OptionButton
            selected={selectedOption === 'email'}
            onClick={() => {
              setSelectedOption('email');
              detailedAnalytics.trackCustomEvent('option_selected', {
                optionType: 'contact_method',
                selectedValue: 'email',
                page: 'leadmagnet',
                step: 4
              });
            }}
          >
            <OptionIcon>📧</OptionIcon>
            <OptionText>
              <OptionTitle>이메일로 받기</OptionTitle>
              <OptionDesc>자료를 바로 다운로드할 수 있는 링크 발송</OptionDesc>
            </OptionText>
          </OptionButton>
          
          <OptionButton
            selected={selectedOption === 'kakao'}
            onClick={() => {
              setSelectedOption('kakao');
              detailedAnalytics.trackCustomEvent('option_selected', {
                optionType: 'contact_method',
                selectedValue: 'kakao',
                page: 'leadmagnet',
                step: 4
              });
            }}
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
                <KakaoChannelButton
                  onClick={() => {
                    window.open('http://pf.kakao.com/_YJtTn', '_blank');
                    setChannelAdded(true);
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>💬</span>
                  <span>카카오톡 채널 친구추가 {channelAdded ? '✓' : '(필수)'}</span>
                </KakaoChannelButton>
              )}
            </InputSection>
          )}
          
          <SubmitButton 
            onClick={handleSubmit} 
            disabled={!isValid || isSubmitting}
            whileHover={{ scale: isValid && !isSubmitting ? 1.02 : 1 }}
            whileTap={{ scale: isValid && !isSubmitting ? 0.98 : 1 }}
          >
            {isSubmitting ? '⏳ 처리 중...' : isValid ? '🎁 내 여행 유형 결과 확인하고, 무료 템플릿 받기!' : '📝 연락처를 입력해주세요'}
          </SubmitButton>
          
          <div style={{ textAlign: 'center' }}>
            <SkipButton onClick={onComplete}>
              나중에 받을게요 (결과만 보기)
            </SkipButton>
          </div>
        </FormSection>
      </PageContent>
    </Container>
  );
};

export default LeadMagnetPage;