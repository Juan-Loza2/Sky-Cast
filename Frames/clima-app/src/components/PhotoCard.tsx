import styled from 'styled-components';

interface PhotoCardProps {
  title: string;
  time: string;
  imageUrl: string;
  type: 'precipitaciones' | 'incendios' | 'viento';
}

const CardContainer = styled.div<{ type: string }>`
  background: ${props => {
    switch (props.type) {
      case 'precipitaciones':
        return '#003366';
      case 'incendios':
        return '#660000';
      case 'viento':
        return '#004d4d';
      default:
        return '#2d2d2d';
    }
  }};
  border-radius: 16px;
  padding: 16px;
  margin: 16px;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.3);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  color: white;
  margin: 0;
`;

const CardTime = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
`;

const ImageContainer = styled.div`
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-right: 16px;
`;

export const PhotoCard: React.FC<PhotoCardProps> = ({ title, time, imageUrl, type }) => {
  return (
    <CardContainer type={type}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardTime>{time}</CardTime>
      </CardHeader>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ImageContainer>
          <img src={imageUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </ImageContainer>
      </div>
    </CardContainer>
  );
};
