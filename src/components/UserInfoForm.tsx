import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { UserInfo } from '../types';
import { provinces, districts, convertRegionFormat } from '../data/regions';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: -webkit-fill-available;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
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

const FormCard = styled(motion.div)`
  background: white;
  border-radius: 25px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 100%;
  color: #2d3748;
  
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

const Title = styled.h2`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #667eea;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 1rem;
  margin-bottom: 2rem;
  color: #4a5568;
  line-height: 1.5;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2d3748;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 16px; /* 모바일 줌 방지 */
  transition: border-color 0.3s ease;
  min-height: 48px; /* 터치 접근성 */
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #a0aec0;
  }
  
  @media (max-width: 375px) {
    padding: 0.7rem 0.9rem;
    min-height: 44px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 16px; /* 모바일 줌 방지 */
  background: white;
  transition: border-color 0.3s ease;
  min-height: 48px; /* 터치 접근성 */
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  @media (max-width: 375px) {
    padding: 0.7rem 0.9rem;
    min-height: 44px;
  }
`;

const CheckboxGroup = styled.div`
  background: #f8f9fa;
  border-radius: 15px;
  padding: 1.5rem;
  margin: 2rem 0;
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 0.75rem;
  margin-top: 0.25rem;
  transform: scale(1.2);
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  line-height: 1.5;
  color: #2d3748;
  cursor: pointer;
`;

const PrivacyText = styled.div`
  background: #e8f4fd;
  border-left: 4px solid #667eea;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 5px;
  font-size: 0.85rem;
  line-height: 1.6;
  color: #2d3748;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled(motion.button)<{ variant?: 'primary' | 'secondary'; disabled?: boolean }>`
  background: ${props => {
    if (props.disabled) return 'linear-gradient(45deg, #adb5bd, #6c757d)';
    return props.variant === 'secondary' 
      ? 'linear-gradient(45deg, #6c757d, #495057)' 
      : 'linear-gradient(45deg, #28a745, #20c997)';
  }};
  color: white;
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.7 : 1};
  min-height: 50px;
  flex: 1;
  max-width: 200px;
  
  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    font-size: 0.95rem;
    min-height: 48px;
    width: 100%;
    max-width: 300px;
  }
  
  @media (max-width: 375px) {
    padding: 0.9rem 1.25rem;
    font-size: 0.9rem;
    min-height: 44px;
    max-width: 280px;
  }
`;

const Required = styled.span`
  color: #e53e3e;
  margin-left: 0.25rem;
`;

interface UserInfoFormProps {
  onSubmit: (userInfo: UserInfo) => void;
  onSkip: () => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onSubmit, onSkip }) => {
  const [formData, setFormData] = useState<UserInfo>({
    name: '',
    instagram: '',
    age: '',
    gender: '',
    familySize: 1,
    region: '',
    marketingConsent: false,
    privacyConsent: false
  });

  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

  const [errors, setErrors] = useState<Partial<UserInfo>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<UserInfo> = {};

    if (!formData.name.trim()) newErrors.name = '이름을 입력해주세요.';
    if (!formData.privacyConsent) newErrors.privacyConsent = true;

    // 인스타그램 계정 형식 검증 (선택적)
    if (formData.instagram && !formData.instagram.startsWith('@')) {
      newErrors.instagram = '인스타그램 계정은 @로 시작해야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof UserInfo, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    setSelectedDistrict(''); // 시/도 변경 시 시/군/구 초기화
    setFormData(prev => ({ ...prev, region: '' })); // 지역 초기화
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    if (selectedProvince && district) {
      const regionString = convertRegionFormat(selectedProvince, district);
      setFormData(prev => ({ ...prev, region: regionString }));
    }
  };

  const isFormValid = formData.name && formData.privacyConsent;
  const canGetRecommendations = isFormValid && formData.marketingConsent;
  const allConsentsGiven = formData.privacyConsent && formData.marketingConsent;

  return (
    <Container>
      <FormCard
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Title>🎁 우리 지역 맞춤 여행지 알아보기</Title>
        <Subtitle>
          <strong>마케팅 정보 수신 동의</strong> 시 거주지역 기반으로<br/>
          <span style={{ color: '#667eea', fontWeight: '600' }}>
            📍 딱 2곳의 맞춤 여행지</span>를 추천해드려요! 
        </Subtitle>

        <FormGroup>
          <Label>이름<Required>*</Required></Label>
          <Input
            type="text"
            placeholder="이름을 입력해주세요"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
          {errors.name && <div style={{ color: '#e53e3e', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.name}</div>}
        </FormGroup>

        <FormGroup>
          <Label>인스타그램 계정</Label>
          <Input
            type="text"
            placeholder="@instagram"
            value={formData.instagram}
            onChange={(e) => handleInputChange('instagram', e.target.value)}
          />
          {errors.instagram && <div style={{ color: '#e53e3e', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.instagram}</div>}
        </FormGroup>

        <FormGroup>
          <Label>연령대</Label>
          <Select
            value={formData.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
          >
            <option value="">선택해주세요</option>
            <option value="20대">20대</option>
            <option value="30대">30대</option>
            <option value="40대">40대</option>
            <option value="50대">50대</option>
            <option value="60대 이상">60대 이상</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>성별</Label>
          <Select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
          >
            <option value="">선택해주세요</option>
            <option value="남성">남성</option>
            <option value="여성">여성</option>
            <option value="기타">기타</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>가족 구성원 수</Label>
          <Select
            value={formData.familySize}
            onChange={(e) => handleInputChange('familySize', parseInt(e.target.value))}
          >
            <option value={1}>1명 (혼자)</option>
            <option value={2}>2명</option>
            <option value={3}>3명</option>
            <option value={4}>4명</option>
            <option value={5}>5명 이상</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>거주 지역</Label>
          <Select
            value={selectedProvince}
            onChange={(e) => handleProvinceChange(e.target.value)}
          >
            <option value="">시/도 선택</option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </Select>
        </FormGroup>

        {selectedProvince && (
          <FormGroup>
            <Label>시/군/구</Label>
            <Select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
            >
              <option value="">시/군/구 선택</option>
              {districts[selectedProvince]?.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </Select>
          </FormGroup>
        )}

        <CheckboxGroup>
          <CheckboxItem>
            <Checkbox
              checked={formData.privacyConsent}
              onChange={(e) => handleInputChange('privacyConsent', e.target.checked)}
            />
            <CheckboxLabel>
              <strong>(필수)</strong> 개인정보 수집 및 이용에 동의합니다<Required>*</Required>
            </CheckboxLabel>
          </CheckboxItem>
          {errors.privacyConsent && (
            <div style={{ color: '#e53e3e', fontSize: '0.8rem', marginLeft: '2rem' }}>
              개인정보 수집 및 이용에 동의해주세요.
            </div>
          )}

          <PrivacyText>
            <strong>개인정보 수집 및 이용 동의</strong><br/>
            • <strong>수집목적:</strong> 맞춤 여행지 추천, 서비스 개선, 고객 상담<br/>
            • <strong>수집항목:</strong> 이름, 인스타그램 계정, 연령대, 성별, 가족구성원수, 거주지역, 설문응답결과<br/>
            • <strong>보유기간:</strong> 서비스 이용 종료 후 3년<br/>
            • <strong>위탁업체:</strong> 소셜미디어 서비스 제공업체(Meta)<br/>
            귀하는 개인정보 수집 및 이용을 거부할 권리가 있으나, 거부 시 서비스 이용이 제한될 수 있습니다.
          </PrivacyText>

          <CheckboxItem>
            <Checkbox
              checked={formData.marketingConsent}
              onChange={(e) => handleInputChange('marketingConsent', e.target.checked)}
            />
            <CheckboxLabel>
              <strong>(선택) 마케팅 정보 수신 동의</strong> - 이벤트, 프로모션, 맞춤 여행지 정보
              <br/>
              <div style={{ 
                background: '#e8f4fd', 
                borderRadius: '8px', 
                padding: '0.75rem', 
                marginTop: '0.5rem',
                border: '1px solid #667eea'
              }}>
                <div style={{ color: '#667eea', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                  ✨ 마케팅 동의 시 혜택
                </div>
                <div style={{ color: '#2d3748', fontSize: '0.8rem', lineHeight: '1.4' }}>
                  • 거주지역 기반 맞춤 여행지 <strong>2곳 추천</strong><br/>
                  • 우리 가족 성향에 딱 맞는 장소만 엄선<br/>
                  • 새로운 여행 이벤트 및 할인 정보 우선 제공
                </div>
              </div>
            </CheckboxLabel>
          </CheckboxItem>
        </CheckboxGroup>

        <ButtonGroup>
          <Button
            onClick={handleSubmit}
            disabled={!canGetRecommendations}
            style={{
              filter: !canGetRecommendations ? 'blur(2px)' : 'none',
              opacity: !canGetRecommendations ? 0.5 : 1
            }}
            whileHover={{ scale: canGetRecommendations ? 1.05 : 1 }}
            whileTap={{ scale: canGetRecommendations ? 0.95 : 1 }}
          >
            {canGetRecommendations ? '🎯 맞춤 추천 받기' : '📋 모든 동의 필요'}
          </Button>
          <Button
            variant="secondary"
            onClick={onSkip}
            disabled={allConsentsGiven}
            style={{
              filter: allConsentsGiven ? 'blur(2px)' : 'none',
              opacity: allConsentsGiven ? 0.5 : 1,
              cursor: allConsentsGiven ? 'not-allowed' : 'pointer'
            }}
            whileHover={{ scale: !allConsentsGiven ? 1.05 : 1 }}
            whileTap={{ scale: !allConsentsGiven ? 0.95 : 1 }}
          >
            {allConsentsGiven ? '✅ 추천 이용 가능' : '건너뛰기'}
          </Button>
        </ButtonGroup>
        
        {!formData.marketingConsent && (
          <div style={{
            textAlign: 'center',
            marginTop: '1rem',
            padding: '0.75rem',
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: '#856404'
          }}>
            💡 <strong>마케팅 정보 수신에 동의</strong>하시면 거주지역 기반 맞춤 여행지를 추천받을 수 있어요!
          </div>
        )}
      </FormCard>
    </Container>
  );
};

export default UserInfoForm;