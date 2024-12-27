import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import { useSettingsPanelStore } from '@stores/settingsPanelStore';
import FilterPanel from './FilterPanel';
import SidePanel from '../common/SidePanel';

export const SettingsPanel = () => {
  const { isOpen, togglePanel } = useSettingsPanelStore();
  
  return (
    <>
      <IconButton 
        onClick={togglePanel}
        sx={{ position: 'fixed', top: 16, left: 16 }}
      >
        <MenuIcon data-testid="SettingsButton" />
      </IconButton>
      <Drawer

        anchor="left"
        open={isOpen}
        onClose={togglePanel}
      >
        <SidePanel key="SettingsPanel" open={isOpen} onClose={togglePanel} title='Einstellungen' position='left'>
          <Box sx={{ width: 300, p: 2 }}>
            <FilterPanel />
          </Box>
        </SidePanel>
        
      </Drawer>
    </>
  );
};