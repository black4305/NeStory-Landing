import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { travelTypes } from '../data/travelTypes';
import { characters } from '../data/characters';
import CharacterAvatar from './CharacterAvatar';

const Container = styled.div`
  min-height: 100vh;
  min-height: -webkit-fill-available;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const BackButton = styled(motion.button)`
  background: linear-gradient(45deg, #28a745, #20c997);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }
`;

const TypesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 0.5rem;
  }
  
  @media (min-width: 768px) and (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: 1400px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const TypeCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const TypeCode = styled.div`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: inline-block;
`;

const CharacterContainer = styled.div`
  margin: 1.5rem 0;
  
  /* CharacterAvatar 크기 조정 */
  > div {
    width: 120px !important;
    height: 120px !important;
    margin: 0 auto 1rem;
    
    div {
      transform: scale(0.85);
      transform-origin: center;
    }
  }
`;

const CharacterName = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const TypeTitle = styled.h4`
  font-size: 1rem;
  color: #4a5568;
  margin-bottom: 1rem;
  line-height: 1.3;
`;

const SpecialItem = styled.div`
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 15px;
  padding: 0.8rem;
  margin: 0.5rem 0;
  font-size: 0.85rem;
  color: #495057;
  border-left: 3px solid #667eea;
`;

const TraitDescription = styled.div`
  font-size: 0.8rem;
  color: #6c757d;
  font-style: italic;
  margin-top: 0.5rem;
`;

interface AllTypesScreenProps {
  onBack: () => void;
  onSelectType?: (typeCode: string) => void;
}

const AllTypesScreen: React.FC<AllTypesScreenProps> = ({ onBack, onSelectType }) => {
  const allTypes = Object.keys(travelTypes).sort();

  const handleTypeClick = (typeCode: string) => {
    if (onSelectType) {
      onSelectType(typeCode);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← 뒤로가기
        </BackButton>
        <Title>🎭 8가지 가족여행 유형</Title>
        <Subtitle>
          간소화된 8가지 여행 유형의 캐릭터를 확인해보세요!<br/>
          각 캐릭터를 클릭하면 자세한 정보를 볼 수 있습니다.
        </Subtitle>
      </Header>

      <TypesGrid>
        {allTypes.map((typeCode, index) => {
          const travelType = travelTypes[typeCode];
          const character = characters[typeCode];
          
          return (
            <TypeCard
              key={typeCode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleTypeClick(typeCode)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <TypeCode>{typeCode}</TypeCode>
              
              <CharacterContainer>
                <CharacterAvatar typeCode={typeCode} />
              </CharacterContainer>
              
              <CharacterName>{character?.name || '캐릭터명'}</CharacterName>
              <TypeTitle>{travelType?.title || '여행 유형'}</TypeTitle>
              
              {character?.specialItem && (
                <SpecialItem>
                  🎒 {character.specialItem}
                </SpecialItem>
              )}
              
              {character?.trait && (
                <TraitDescription>
                  ✨ {character.trait}
                </TraitDescription>
              )}
            </TypeCard>
          );
        })}
      </TypesGrid>
    </Container>
  );
};

export default AllTypesScreen;