import styled from 'styled-components';
import { Drawer } from '@mui/material';
import { Link } from 'react-router-dom';

const MenuContainer = styled.div`
  background: #0d0d0d;
  color: white;
  padding: 24px;
`;

const MenuItem = styled(Link)`
  display: block;
  padding: 12px;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  margin: 8px 0;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({ open, onClose }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '250px',
          background: '#0d0d0d',
        },
      }}
    >
      <MenuContainer>
        <MenuItem to="/">Inicio</MenuItem>
        <MenuItem to="/profile">Perfil</MenuItem>
        <MenuItem to="/terms">Términos y condiciones</MenuItem>
        <MenuItem to="/privacy">Política y Privacidad</MenuItem>
        <MenuItem to="/contact">Contacto</MenuItem>
      </MenuContainer>
    </Drawer>
  );
};
