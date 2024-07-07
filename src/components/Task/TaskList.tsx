import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Card, CardContent, Container, IconButton, List, ListItem, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React, { useState } from 'react';
import TaskFilter from './TaskFilter';
import TaskForm from './TaskForm'; // Import TaskForm component
import { Task, TaskListProps } from './interface';

const TaskCard = styled(Card)({
  marginBottom: 16,
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
  },
});

const TaskList: React.FC<TaskListProps> = ({ tasks, search, setSearch, sortBy, setSortBy, deleteTask, getTasks }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false); // State to control edit dialog
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // State to store selected task for editing
  const [filter, setFilter] = useState('All');

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setOpenEditDialog(true);
  };

  const handleSort = (field: string) => {
    setSortBy((prevSortBy) => {
      const [prevField, prevOrder] = prevSortBy.split(':');
      const newOrder = prevField === field && prevOrder === 'asc' ? 'desc' : 'asc';
      return `${field}:${newOrder}`;
    });
  };

  const filteredTasks = tasks.filter(task => 
    filter === 'All' || task.status === filter
  );

  return (
    <Container>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <TextField
          size="medium"
          label="Search"
          value={search}
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
        />

        <Box sx={{ width: '50%', margin: '0 1rem'}}>
          <TaskFilter setFilter={setFilter} />
        </Box>

        <Box display='flex'>
          <Button onClick={() => handleSort('title')}>
            Title
            <ArrowUpwardIcon style={{ transform: sortBy === 'title:asc' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </Button>
          <Button onClick={() => handleSort('status')}>
            Status
            <ArrowUpwardIcon style={{ transform: sortBy === 'status:asc' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </Button>
        </Box>
      </Box>

      <List>
        {filteredTasks.map((task) => (
          <ListItem key={task._id}>
            <TaskCard>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5" component="div">
                    {task.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {task.status}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Description: {task.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Due Date: {task?.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>

                <Box>
                  <IconButton aria-label="edit" onClick={() => handleEditTask(task)}>
                    <EditIcon color='primary' />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(task._id)}>
                    <DeleteIcon color='warning' />
                  </IconButton>
                </Box>
              </CardContent>
            </TaskCard>
          </ListItem>
        ))}
      </List>

      {/* TaskForm Dialog for Editing */}
      <TaskForm
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        getTasks={getTasks}
        task={selectedTask} // Pass selected task to TaskForm for editing
      />
    </Container>
  );
};

export default TaskList;