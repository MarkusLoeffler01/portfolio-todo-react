import { Drawer, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useSettingsPanelStore } from '@stores/settingsPanelStore';
import FilterPanel from './FilterPanel';

export const SettingsPanel = () => {
  const { isOpen, togglePanel } = useSettingsPanelStore();
  
  return (
    <>
      <IconButton 
        onClick={togglePanel}
        sx={{ position: 'fixed', top: 16, left: 16 }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={togglePanel}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <FilterPanel />
        </Box>
      </Drawer>
    </>
  );
};