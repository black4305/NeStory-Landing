import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-8px) rotate(1deg); }
  66% { transform: translateY(-5px) rotate(-1deg); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
`;

const wiggle = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-3deg); }
  75% { transform: rotate(3deg); }
`;

const Container = styled(motion.div)`
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto 1rem;
  
  &::before, &::after {
    content: '✨';
    position: absolute;
    font-size: 16px;
    animation: ${sparkle} 2s ease-in-out infinite;
    pointer-events: none;
  }
  
  &::before {
    top: 10px;
    left: 10px;
    animation-delay: 0s;
  }
  
  &::after {
    top: 20px;
    right: 15px;
    animation-delay: 1s;
  }
`;

const CharacterBody = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  animation: ${float} 3s ease-in-out infinite;
  transform-origin: center bottom;
  
  &:hover {
    animation: ${wiggle} 0.5s ease-in-out;
  }
`;

// 얼굴
const Face = styled.div<{ skinTone: string }>`
  position: absolute;
  top: 25px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 70px;
  background: ${props => props.skinTone};
  border-radius: 50%;
  border: 4px solid #2d3748;
  z-index: 2;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  
  /* 볼 터치 */
  &::before, &::after {
    content: '';
    position: absolute;
    top: 45px;
    width: 12px;
    height: 8px;
    background: #ff9ff3;
    border-radius: 50%;
    opacity: 0.6;
  }
  
  &::before {
    left: 8px;
  }
  
  &::after {
    right: 8px;
  }
`;

// 머리카락
const Hair = styled.div<{ hairColor: string; hairStyle: string }>`
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 45px;
  background: ${props => props.hairColor};
  border-radius: ${props => {
    switch (props.hairStyle) {
      case 'curly': return '50% 50% 30% 30%';
      case 'straight': return '50% 50% 0% 0%';
      case 'wavy': return '60% 40% 20% 80%';
      default: return '50%';
    }
  }};
  border: 3px solid #2d3748;
  z-index: 1;
  
  ${props => props.hairStyle === 'curly' && `
    &::before {
      content: '';
      position: absolute;
      top: -5px;
      left: 10px;
      width: 15px;
      height: 15px;
      background: ${props.hairColor};
      border-radius: 50%;
      border: 2px solid #2d3748;
    }
    &::after {
      content: '';
      position: absolute;
      top: -5px;
      right: 10px;
      width: 15px;
      height: 15px;
      background: ${props.hairColor};
      border-radius: 50%;
      border: 2px solid #2d3748;
    }
  `}
`;

// 눈
const Eyes = styled.div<{ expression: string }>`
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 20px;
  z-index: 3;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: ${props => props.expression === 'excited' ? '12px' : '10px'};
    height: ${props => props.expression === 'excited' ? '12px' : '10px'};
    background: #2d3748;
    border-radius: 50%;
    
    /* 눈동자 하이라이트 */
    box-shadow: inset 2px 2px 0 white;
  }
  
  &::before {
    left: 8px;
    ${props => props.expression === 'excited' && 'transform: scale(1.2);'}
  }
  
  &::after {
    right: 8px;
    ${props => props.expression === 'excited' && 'transform: scale(1.2);'}
  }
`;

// 입
const Mouth = styled.div<{ expression: string }>`
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 10px;
  border-bottom: 3px solid #2d3748;
  border-radius: ${props => {
    switch (props.expression) {
      case 'happy': return '0 0 20px 20px';
      case 'excited': return '50%';
      case 'calm': return '10px';
      default: return '0 0 10px 10px';
    }
  }};
  z-index: 3;
`;

// 몸
const Body = styled.div<{ outfitColor: string }>`
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 40px;
  background: ${props => props.outfitColor};
  border-radius: 10px 10px 0 0;
  border: 3px solid #2d3748;
  z-index: 1;
`;

// 팔
const Arms = styled.div<{ skinTone: string }>`
  position: absolute;
  top: 75px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 8px;
  z-index: 0;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    width: 25px;
    height: 8px;
    background: ${props => props.skinTone};
    border-radius: 10px;
    border: 2px solid #2d3748;
    transform: rotate(-20deg);
  }
  
  &::after {
    content: '';
    position: absolute;
    right: 0;
    width: 25px;
    height: 8px;
    background: ${props => props.skinTone};
    border-radius: 10px;
    border: 2px solid #2d3748;
    transform: rotate(20deg);
  }
`;

// 악세서리
const Accessory = styled.div<{ type: string; color: string }>`
  position: absolute;
  z-index: 4;
  
  ${props => {
    switch (props.type) {
      case 'glasses':
        return `
          top: 32px;
          left: 50%;
          transform: translateX(-50%);
          width: 45px;
          height: 20px;
          border: 2px solid ${props.color};
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          
          &::before {
            content: '';
            position: absolute;
            left: 18px;
            top: -2px;
            width: 8px;
            height: 4px;
            border-top: 2px solid ${props.color};
          }
        `;
      case 'hat':
        return `
          top: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 25px;
          background: ${props.color};
          border-radius: 40px 40px 0 0;
          border: 3px solid #2d3748;
          
          &::after {
            content: '';
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 85px;
            height: 8px;
            background: ${props.color};
            border-radius: 50%;
            border: 2px solid #2d3748;
          }
        `;
      case 'bowtie':
        return `
          top: 85px;
          left: 50%;
          transform: translateX(-50%);
          width: 15px;
          height: 8px;
          background: ${props.color};
          border: 2px solid #2d3748;
          
          &::before {
            content: '';
            position: absolute;
            left: -8px;
            top: -2px;
            width: 12px;
            height: 12px;
            background: ${props.color};
            border: 2px solid #2d3748;
            transform: rotate(45deg);
          }
          
          &::after {
            content: '';
            position: absolute;
            right: -8px;
            top: -2px;
            width: 12px;
            height: 12px;
            background: ${props.color};
            border: 2px solid #2d3748;
            transform: rotate(45deg);
          }
        `;
      default:
        return '';
    }
  }}
`;

interface CharacterAvatarProps {
  typeCode: string;
}

const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ typeCode }) => {
  // 8가지 유형별 고유 캐릭터 스타일 매핑
  const getCharacterStyle = (code: string) => {
    const characterStyles: Record<string, any> = {
      // 8가지 간소화된 여행 유형 (완전히 다른 디자인)
      'ACF': { // 도시 미식 탐험가 🍜
        skinTone: '#fdbcb4', hairColor: '#ff4757', hairStyle: 'curly', 
        outfitColor: '#fd79a8', expression: 'excited', accessory: 'hat', accessoryColor: '#ff4757'
      },
      'ACE': { // 문화 체험러 🎭
        skinTone: '#f4d03f', hairColor: '#2d3748', hairStyle: 'straight',
        outfitColor: '#3498db', expression: 'happy', accessory: 'glasses', accessoryColor: '#2d3748'
      },
      'ANF': { // 자연 미식가 🏕️
        skinTone: '#e17055', hairColor: '#27ae60', hairStyle: 'wavy',
        outfitColor: '#55a3ff', expression: 'happy', accessory: 'hat', accessoryColor: '#27ae60'
      },
      'ANE': { // 아웃도어 모험가 ⛰️
        skinTone: '#f39c12', hairColor: '#e67e22', hairStyle: 'curly', 
        outfitColor: '#d63031', expression: 'excited', accessory: 'glasses', accessoryColor: '#e67e22'
      },
      'RCF': { // 도시 힐링 미식가 ☕
        skinTone: '#fdcb6e', hairColor: '#6c5ce7', hairStyle: 'wavy',
        outfitColor: '#fd79a8', expression: 'calm', accessory: 'glasses', accessoryColor: '#6c5ce7'
      },
      'RCE': { // 문화 감상러 🎨
        skinTone: '#fab1a0', hairColor: '#8e44ad', hairStyle: 'straight',
        outfitColor: '#9b59b6', expression: 'calm', accessory: 'bowtie', accessoryColor: '#8e44ad'
      },
      'RNF': { // 전원 힐링 미식가 🌾
        skinTone: '#ffeaa7', hairColor: '#00b894', hairStyle: 'curly',
        outfitColor: '#2ed573', expression: 'happy', accessory: 'hat', accessoryColor: '#00b894'
      },
      'RNE': { // 자연 힐링 체험러 🌿
        skinTone: '#f8c291', hairColor: '#81ecec', hairStyle: 'wavy',
        outfitColor: '#00cec9', expression: 'calm', accessory: 'bowtie', accessoryColor: '#81ecec'
      }
    };

    return characterStyles[code] || {
      skinTone: '#fdbcb4', hairColor: '#8b4513', hairStyle: 'wavy',
      outfitColor: '#667eea', expression: 'happy', accessory: 'glasses', accessoryColor: '#2d3748'
    };
  };

  const style = getCharacterStyle(typeCode);

  return (
    <Container
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 0.2
      }}
    >
      <CharacterBody>
        <Hair 
          hairColor={style.hairColor} 
          hairStyle={style.hairStyle}
        />
        <Face skinTone={style.skinTone} />
        <Eyes expression={style.expression} />
        <Mouth expression={style.expression} />
        <Body outfitColor={style.outfitColor} />
        <Arms skinTone={style.skinTone} />
        <Accessory 
          type={style.accessory} 
          color={style.accessoryColor}
        />
      </CharacterBody>
    </Container>
  );
};

export default CharacterAvatar;