import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const Container = styled(motion.div)`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 1rem;
`;

const CharacterBody = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  animation: ${float} 3s ease-in-out infinite;
`;

// 얼굴
const Face = styled.div<{ skinTone: string }>`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 60px;
  background: ${props => props.skinTone};
  border-radius: 50%;
  border: 3px solid #2d3748;
  z-index: 2;
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
const Eyes = styled.div`
  position: absolute;
  top: 35px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 8px;
  z-index: 3;
  
  &::before {
    content: '';
    position: absolute;
    left: 5px;
    width: 8px;
    height: 8px;
    background: #2d3748;
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    right: 5px;
    width: 8px;
    height: 8px;
    background: #2d3748;
    border-radius: 50%;
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
  // 유형별 캐릭터 스타일 매핑
  const getCharacterStyle = (code: string) => {
    const styles = {
      // Active vs Relaxing
      A: {
        skinTone: '#fdbcb4',
        hairColor: '#8b4513',
        hairStyle: 'curly',
        outfitColor: '#ff6b6b',
        expression: 'excited',
        accessory: 'hat',
        accessoryColor: '#ff6b6b'
      },
      R: {
        skinTone: '#f3d5ab',
        hairColor: '#4a4a4a',
        hairStyle: 'straight',
        outfitColor: '#74b9ff',
        expression: 'calm',
        accessory: 'glasses',
        accessoryColor: '#2d3748'
      },
      
      // Culture vs Nature
      C: {
        skinTone: '#fdbcb4',
        hairColor: '#2d3748',
        hairStyle: 'wavy',
        outfitColor: '#6c5ce7',
        expression: 'happy',
        accessory: 'bowtie',
        accessoryColor: '#fdcb6e'
      },
      N: {
        skinTone: '#f3d5ab',
        hairColor: '#8b4513',
        hairStyle: 'curly',
        outfitColor: '#00b894',
        expression: 'happy',
        accessory: 'hat',
        accessoryColor: '#00b894'
      },
      
      // Default combinations
      default: {
        skinTone: '#fdbcb4',
        hairColor: '#8b4513',
        hairStyle: 'wavy',
        outfitColor: '#667eea',
        expression: 'happy',
        accessory: 'glasses',
        accessoryColor: '#2d3748'
      }
    };

    // 첫 번째 글자로 기본 스타일 결정
    const firstChar = code[0] as keyof typeof styles;
    const baseStyle = styles[firstChar] || styles.default;
    
    // 나머지 글자들로 스타일 조합
    const modifications: any = {};
    
    if (code.includes('C')) {
      modifications.accessory = 'bowtie';
      modifications.accessoryColor = '#e17055';
    }
    if (code.includes('F')) {
      modifications.outfitColor = '#fd79a8';
      modifications.expression = 'excited';
    }
    if (code.includes('L')) {
      modifications.accessory = 'hat';
      modifications.accessoryColor = '#fdcb6e';
    }
    if (code.includes('K')) {
      modifications.hairStyle = 'curly';
      modifications.hairColor = '#e84393';
    }
    
    return { ...baseStyle, ...modifications };
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
        <Eyes />
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