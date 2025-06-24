import React from 'react';
import styled from 'styled-components';

interface LogoProps {
  size?: number;
  showText?: boolean;
  color?: string;
}

const NeStoryTILogo: React.FC<LogoProps> = ({ 
  size = 120, 
  showText = true, 
  color = '#667eea' 
}) => {
  return (
    <LogoContainer>
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        {/* Background Circle */}
        <circle cx="60" cy="60" r="60" fill="url(#logoGradient)" />
        
        {/* Letter N - Modern Design */}
        <path 
          d="M30 35 L30 85 L38 85 L38 55 L52 85 L60 85 L60 55 L74 85 L82 85 L82 35 L74 35 L74 65 L60 35 L52 35 L52 65 L38 35 L30 35 Z" 
          fill="white" 
        />
        
        {/* Decorative Travel Elements */}
        <circle cx="88" cy="32" r="4" fill="#fbbf24" opacity="0.9" />
        <circle cx="95" cy="45" r="3" fill="#10b981" opacity="0.7" />
        <circle cx="25" cy="88" r="3.5" fill="#f59e0b" opacity="0.8" />
        <circle cx="88" cy="88" r="2.5" fill="#ec4899" opacity="0.6" />
        
        {/* Travel Path Line */}
        <path 
          d="M20 100 Q40 95 60 100 T100 100" 
          stroke="#fbbf24" 
          strokeWidth="2" 
          fill="none" 
          opacity="0.6"
        />
        
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: color}} />
            <stop offset="100%" style={{stopColor: '#764ba2'}} />
          </linearGradient>
        </defs>
      </svg>
      
      {showText && (
        <LogoText size={size}>
          <BrandName size={size}>NeStoryTI</BrandName>
          <Tagline size={size}>3세대 행복 여행 AI</Tagline>
        </LogoText>
      )}
    </LogoContainer>
  );
};

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const LogoText = styled.div<{ size: number }>`
  text-align: center;
  user-select: none;
`;

const BrandName = styled.h1<{ size: number }>`
  font-size: ${props => props.size * 0.25}px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -1px;
  font-family: 'Arial', sans-serif;
`;

const Tagline = styled.p<{ size: number }>`
  font-size: ${props => props.size * 0.12}px;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

export default NeStoryTILogo;