import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { URL } from '../../utils/constants';
import { Task } from './interface';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  getTasks: () => void;
  task?: Task | null; // Optional task prop for editing
}

const TaskForm: React.FC<TaskFormProps> = ({ open, onClose, getTasks, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [dueDate, setDueDate] = useState('');
  const [errorInfo, setErrorInfo] = useState({ error: false, errorTxt: '' });

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task?.description || '');
      setStatus(task.status);
      setDueDate(task.dueDate || ''); 
    }
  }, [task]);

  const handleSubmit = async () => {
    if (title) {
      try {
        if (task) {
          // Update existing task
          await axios.put(`${URL}/tasks/${task._id}`, { title, description, status, dueDate });
          toast.success('Task updated successfully');
        } else {
          // Create new task
          await axios.post(`${URL}/tasks`, { title, description, status, dueDate });
          toast.success('New task created');
        }
        resetForm();
        getTasks();
        onClose();
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to save task');
      }
    } else {
      setErrorInfo({
        error: true,
        errorTxt: 'Title is mandatory'
      });
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('To Do');
    setDueDate('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{task ? 'Edit Task' : 'Add Task'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => {
            setErrorInfo({ error: false, errorTxt: '' });
            setTitle(e.target.value);
          }}
          required
          fullWidth
          margin="normal"
          error={errorInfo.error}
          helperText={errorInfo.errorTxt}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as string)}
          label="Status"
          fullWidth
          sx={{ margin: '8px 0px' }}
        >
          <MenuItem value="To Do">To Do</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
        </Select>

        <TextField
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='outlined'>Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant='contained'>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm;