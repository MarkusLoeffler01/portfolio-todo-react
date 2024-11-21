import type { RecursivePartial } from "@/types/core";
import styled from "@emotion/styled";
import { Box, Theme as MuiTheme } from "@mui/material";

export const GridContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%'
});

export const GridHeader = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '25% 35% 15% 15% 10%',
  padding: '16px',
  fontWeight: 'bold',
  borderBottom: '2px solid rgba(255,255,255,0.1)'
});



export const GridRow = styled(Box)<{ mouseX?: string, mouseY?: string, theme?: RecursivePartial<MuiTheme> }>(({ theme, mouseX = '0px', mouseY = '0px' }) => ({
  display: 'grid',
  gridTemplateColumns: '25% 35% 15% 15% 10%',
  padding: '16px',
  cursor: 'pointer',
  position: 'relative',
  transition: 'all 0.2s',

  // Andere Farben
  '&:nth-of-type(even)': {
    backgroundColor: theme?.palette?.action?.hover || 'rgba(100, 0, 0, 0.04)'
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `radial-gradient(
      800px circle at ${mouseX} ${mouseY},
      rgba(255, 255, 255, 0.06),
      transparent 40%
    )`,
    opacity: 0,
    transition: 'opacity 500ms',
    zIndex: 1,
    pointerEvents: 'none'
  },
  '&:hover::before': {
    opacity: 1
  },
  '& > *': {
    position: 'relative',
    zIndex: 2,
    overflow: 'hidden',
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    // padding: "0 8px"
  }
}));