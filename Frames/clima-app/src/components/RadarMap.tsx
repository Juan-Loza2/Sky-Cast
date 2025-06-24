import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Icon } from 'leaflet';
import styled from 'styled-components';

const MapWrapper = styled.div`
  height: 100vh;
  width: 100%;
  background-color: #121212;
`;

const SearchBar = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
`;

const customIcon = new Icon({
  iconUrl: '/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface RadarMapProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const RadarMap: React.FC<RadarMapProps> = ({ selectedDate, onDateChange }) => {
  return (
    <MapWrapper>
      <MapContainer center={[-31.4165, -64.1807]} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Ejemplo de marcadores */}
        <Marker position={[-31.4165, -64.1807]} icon={customIcon} />
      </MapContainer>
      <SearchBar>
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => onDateChange(new Date(e.target.value))}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            padding: '8px',
            borderRadius: '8px',
            marginRight: '8px',
          }}
        />
      </SearchBar>
    </MapWrapper>
  );
};
