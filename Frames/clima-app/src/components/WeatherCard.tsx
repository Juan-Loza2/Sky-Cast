import styled from 'styled-components';
import { WeatherIcon } from './WeatherIcon';

interface WeatherCardProps {
  temperature: number;
  condition: string;
  minTemp: number;
  maxTemp: number;
  feelsLike: number;
  uvIndex: number;
  fireRisk: number;
  windSpeed: number;
  precipitation: number;
}

const CardContainer = styled.div`
  background: linear-gradient(to bottom, #2c3e50, #bdc3c7);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  margin: 16px;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Temperature = styled.div`
  font-size: 64px;
  color: white;
  margin-bottom: 24px;
  font-weight: 700;
  line-height: 1;
`;

const Condition = styled.div`
  font-size: 36px;
  color: white;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  @media (max-width: 320px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div<{ status?: string }>`
  background: rgba(255, 255, 255, 0.1);
  padding: 16px;
  border-radius: 16px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  .label {
    color: ${props => {
      switch (props.status) {
        case 'uv': return '#4CAF50';
        case 'fire': return '#660000';
        case 'wind': return '#004d4d';
        case 'rain': return '#2196F3';
        default: return 'white';
      }
    }};
    font-size: 16px;
    font-weight: 500;
  }

  .value {
    color: white;
    font-size: 36px;
    font-weight: 700;
  }
`;

export const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature,
  condition,
  minTemp,
  maxTemp,
  feelsLike,
  uvIndex,
  fireRisk,
  windSpeed,
  precipitation,
}) => {
  return (
    <CardContainer>
      <Temperature>{temperature}°</Temperature>
      <Condition>
        {condition} <WeatherIcon condition={condition} size={48} />
      </Condition>
      <InfoRow>
        <InfoItem status="clear">
          <div className="label">Mínima</div>
          <div className="value">{minTemp}°</div>
        </InfoItem>
        <InfoItem status="clear">
          <div className="label">Máxima</div>
          <div className="value">{maxTemp}°</div>
        </InfoItem>
        <InfoItem status="clear">
          <div className="label">Sensación</div>
          <div className="value">{feelsLike}°</div>
        </InfoItem>
      </InfoRow>
      <InfoRow>
        <InfoItem status="uv">
          <div className="label">Índice UV</div>
          <div className="value">{uvIndex}</div>
        </InfoItem>
        <InfoItem status="fire">
          <div className="label">Incendio</div>
          <div className="value">{fireRisk}%</div>
        </InfoItem>
        <InfoItem status="wind">
          <div className="label">Viento</div>
          <div className="value">{windSpeed} km/h</div>
        </InfoItem>
        <InfoItem status="rain">
          <div className="label">Precipitación</div>
          <div className="value">{precipitation} mm</div>
        </InfoItem>
      </InfoRow>
    </CardContainer>
  );
};
