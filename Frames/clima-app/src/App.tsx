import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import { WeatherCard } from './components/WeatherCard';
import { RadarMap } from './components/RadarMap';
import { PhotoCard } from './components/PhotoCard';
import { MenuDrawer } from './components/MenuDrawer';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const AppContainer = styled.div`
  background: linear-gradient(to bottom, #2c3e50, #bdc3c7);
  min-height: 100vh;
  padding: 16px;
`;

const BottomNav = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  display: flex;
  justify-content: space-around;
  box-shadow: 0px -4px 12px rgba(0,0,0,0.3);
`;

interface NavItemProps {
  to: string;
  className?: string;
  children: React.ReactNode;
}

const NavItem = styled(Link)<NavItemProps>`
  color: white;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &.active {
    color: #4CAF50;
  }
`;

const HomeScreen: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const weatherData = {
    temperature: 25,
    condition: 'Soleado',
    minTemp: 18,
    maxTemp: 30,
    feelsLike: 27,
    uvIndex: 3,
    fireRisk: 30,
    windSpeed: 10,
    precipitation: 3,
  };

  return (
    <div>
      <WeatherCard {...weatherData} />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <button
        onClick={() => setMenuOpen(true)}
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '24px',
        }}
      >
        ☰
      </button>
    </div>
  );
};

const RadarScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <RadarMap
      selectedDate={selectedDate}
      onDateChange={setSelectedDate}
    />
  );
};

const PhotosScreen: React.FC = () => {
  interface Photo {
  title: string;
  time: string;
  imageUrl: string;
  type: 'precipitaciones' | 'incendios' | 'viento';
}

const photos: Photo[] = [
  {
    title: 'Precipitaciones',
    time: 'mar, 14:50',
    imageUrl: '/precipitation.jpg',
    type: 'precipitaciones',
  },
  {
    title: 'Incendios',
    time: 'mar, 14:30',
    imageUrl: '/fire.jpg',
    type: 'incendios',
  },
  {
    title: 'Vientos',
    time: 'mar, 14:45',
    imageUrl: '/wind.jpg',
    type: 'viento',
  },
];

  return (
    <div style={{ padding: '16px' }}>
      {photos.map((photo, index) => (
        <PhotoCard key={index} {...photo} />
      ))}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/radar" element={<RadarScreen />} />
          <Route path="/photos" element={<PhotosScreen />} />
        </Routes>
        <BottomNav>
          <NavItem to="/" className="nav-item">
            🏠
            <span>Inicio</span>
          </NavItem>
          <NavItem to="/radar" className="nav-item">
            🗺️
            <span>Radar</span>
          </NavItem>
          <NavItem to="/photos" className="nav-item">
            📸
            <span>Fotos</span>
          </NavItem>

          <style jsx>{`
            .nav-item.active {
              color: #4CAF50;
            }
          `}</style>
        </BottomNav>
      </AppContainer>
    </Router>
  );
};

export default App;
