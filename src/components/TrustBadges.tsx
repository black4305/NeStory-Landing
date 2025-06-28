import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const BadgesContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px;
  margin: 20px 0;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 12px;
    padding: 15px;
    margin: 15px 0;
  }
  
  @media (max-width: 480px) {
    gap: 10px;
    padding: 12px;
    margin: 12px 0;
  }
  
  @media (max-width: 375px) {
    gap: 8px;
    padding: 10px;
    margin: 10px 0;
  }
`;

const Badge = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 8px 16px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 12px;
    border-radius: 15px;
    gap: 6px;
  }
  
  @media (max-width: 480px) {
    padding: 5px 10px;
    font-size: 11px;
    border-radius: 12px;
    gap: 5px;
  }
  
  @media (max-width: 375px) {
    padding: 4px 8px;
    font-size: 10px;
    border-radius: 10px;
    gap: 4px;
  }
`;

const Icon = styled.span`
  font-size: 16px;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
  }
  
  @media (max-width: 375px) {
    font-size: 11px;
  }
`;

const TrustBadges: React.FC = () => {
  const badges = [
    { icon: '🔒', text: 'SSL 보안' },
    { icon: '⚡', text: '1분 완료' },
    { icon: '📊', text: '10만+ 분석' },
    { icon: '🏆', text: '98% 만족도' },
    { icon: '✅', text: '무료 서비스' }
  ];

  return (
    <BadgesContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {badges.map((badge, index) => (
        <Badge
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.4, 
            delay: 0.5 + index * 0.1,
            type: "spring",
            stiffness: 300 
          }}
          whileHover={{ scale: 1.05 }}
        >
          <Icon>{badge.icon}</Icon>
          <span>{badge.text}</span>
        </Badge>
      ))}
    </BadgesContainer>
  );
};

export default TrustBadges;