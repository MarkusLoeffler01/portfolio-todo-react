import { Box, TextField, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useFilterStore } from '@stores/filterStore';
import { DateRangePicker, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

const FilterPanel = () => {
  const {
    searchQuery,
    priorityFilter,
    dateRange,
    setSearchQuery,
    setPriorityFilter,
    setDateRange,
  } = useFilterStore();

  return (
    <Box sx={{ p: 2, display: 'grid', gap: 3 }}>
      <Typography variant="h6">Filter</Typography>
      
      <TextField
        fullWidth
        label="Suchen"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Priorität</Typography>
        {['low', 'medium', 'high'].map((priority) => (
          <FormControlLabel
            key={priority}
            control={
              <Checkbox
                checked={priorityFilter.includes(priority as "low" | "medium" | "high")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setPriorityFilter([...priorityFilter, priority as "low" | "medium" | "high"]);
                  } else {
                    setPriorityFilter(priorityFilter.filter(p => p !== priority));
                  }
                }}
              />
            }
            label={priority === 'low' ? 'Niedrig' : priority === 'medium' ? 'Mittel' : 'Hoch'}
          />
        ))}
      </Box>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateRangePicker
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          '& .MuiTypography-root': {
            display: "none",
          },
          '& .MuiFormControl-root': {
            width: "100%",
            margin: 0
          }
        }}
          localeText={{ start: 'Fällig von', end: 'Fällig bis' }}
          value={[dateRange.start, dateRange.end]}
          onChange={([start, end]) => setDateRange({ start, end })}
        />
      </LocalizationProvider>

    </Box>
  );
};

export default FilterPanel;