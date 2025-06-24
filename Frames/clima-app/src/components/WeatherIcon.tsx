import styled from 'styled-components';

interface WeatherIconProps {
  condition: string;
  size?: number;
}

const IconContainer = styled.div<{ size?: number }>`
  font-size: ${({ size }) => size || 48}px;
  margin-left: 8px;
  color: white;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const WeatherIcons: { [key: string]: string } = {
  'Soleado': '☀️',
  'Nublado': '☁️',
  'Lluvia': '🌧️',
  'Tormenta': '⚡',
  'Nieve': '❄️',
  'Viento': '💨',
  'Niebla': '🌫️',
  'Despejado': '🌞',
  'Parcialmente nublado': '⛅',
  'Tormenta eléctrica': '🌩️',
  'Nieve ligera': '🌨️',
  'Granizo': '🌧️❄️',
  'Lluvia torrencial': '🌧️⚡',
  'Nieve intensa': '❄️❄️',
  'Tormenta de nieve': '🌨️❄️',
  'Nieve mixta': '🌨️🌧️',
  'Niebla densa': '🌫️🌫️',
  'Niebla ligera': '🌫️',
  'Niebla y lluvia': '🌫️🌧️',
  'Niebla y nieve': '🌫️❄️',
  'Niebla y tormenta': '🌫️⚡',
  'Niebla y viento': '🌫️💨',
  'Niebla y nieve': '🌫️❄️',
  'Niebla y tormenta': '🌫️⚡',
  'Niebla y viento': '🌫️💨',
  'Niebla y lluvia': '🌫️🌧️',
  'Niebla y nieve': '🌫️❄️',
  'Niebla y tormenta': '🌫️⚡',
  'Niebla y viento': '🌫️💨',
};

export const WeatherIcon: React.FC<WeatherIconProps> = ({ condition, size }) => {
  const icon = WeatherIcons[condition] || '🌞';
  return <IconContainer size={size}>{icon}</IconContainer>;
};
