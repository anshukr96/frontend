import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

interface TaskFilterProps {
  setFilter: (filter: string) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ setFilter }) => (
  <FormControl fullWidth>
    <InputLabel>Filter by Status</InputLabel>
    <Select
      onChange={(e) => setFilter(e.target.value as string)}
      label="Filter by Status"
    >
      <MenuItem value="All">All</MenuItem>
      <MenuItem value="To Do">To Do</MenuItem>
      <MenuItem value="In Progress">In Progress</MenuItem>
      <MenuItem value="Done">Done</MenuItem>
    </Select>
  </FormControl>
);

export default TaskFilter;