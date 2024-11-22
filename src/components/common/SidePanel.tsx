// src/components/common/SidePanel.tsx
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { keyframes } from '@emotion/react';

const ANIMATION_DURATION = 300; // ms

/**
 * ! Slide out animation doesn't work yet. Maybe use CSSTransition from react-transition-group instead? 
 */

interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
  width?: number | string;
}

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
  transform: translateX(0);
  opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const SidePanel = ({ 
  open, 
  onClose, 
  title, 
  children, 
  position = 'right',
  width = 400 
}: SidePanelProps) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        [position]: 0,
        width,
        height: "100vh",
        bgcolor: "background.paper",
        boxShadow: 3,
        zIndex: 1200,
        // display: open ? "block" : "none",
        // Use visibility and opacity, to hide the element AFTER the animation ends
        // DO NOT use display: none, as it will prevent the animation from running
        visibility: open ? "visible" : "hidden",
        opacity: open ? 1 : 0,
        transition: `opacity ${ANIMATION_DURATION}ms ease`,
        animation: open 
          ? `${slideIn} ${ANIMATION_DURATION}ms ease-out forwards`
          : `${slideOut} ${ANIMATION_DURATION}ms ease-in forwards`,
      }}
      >
      <SidePanelHeader title={title} onClose={onClose} />
      <Box sx={{ 
        flex: 1,
        overflow: 'auto',
        p: 2
      }}>
        {children}
      </Box>
    </Box>
  );
};


function SidePanelHeader({ title, onClose }: { title: string, onClose: () => void }) {
  return <Box sx={{ 
    p: 2, 
    borderBottom: 1, 
    borderColor: 'divider',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }}>
    <Typography variant="h6">{title}</Typography>
    <IconButton onClick={onClose} edge="end">
      <CloseIcon />
    </IconButton>
  </Box>
}

export default SidePanel;