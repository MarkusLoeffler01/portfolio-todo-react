import { Drawer, IconButton, Box } from '@mui/material';
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
        <MenuIcon />
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