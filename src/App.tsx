import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Container, Fab } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import TaskForm from './components/Task/TaskForm';
import TaskList from './components/Task/TaskList';
import { Task } from './components/Task/interface';
import useDebounce from './hooks/useDebounce';
import { URL } from './utils/constants';


const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [open, setOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    fetchTasks();
  }, [debouncedSearch, sortBy]);

  const fetchTasks = async (searchQuery: string = debouncedSearch, sortQuery: string = sortBy) => {
    try {
      const response = await axios.get<Task[]>(`${URL}/tasks`, {
        params: {
          search: searchQuery || undefined,
          sortBy: sortQuery || undefined,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await axios.delete(`${URL}/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
      toast('Task deleted successfully!!')
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const onClose = () => {
    setOpen(open => !open)
  }

  const RenderNoTask = () => {
    return (
      <Container sx={{ marginTop: '20%', marginLeft: '40%' }}>
        <Button 
          onClick={() => setOpen(true)} 
          color="primary" 
          variant='contained'
          sx={{ width: 'fit-content' }}
        >
          Create New Task
        </Button>
      </Container>
    )
  }

  return (
    <Box mt={8}>
      <ToastContainer position='top-center' theme='dark'  />
      
      <TaskForm open={open} onClose={onClose} getTasks={fetchTasks}   />
      
      {tasks?.length ? 
      <>      
        <TaskList 
          tasks={tasks} 
          search={search} 
          setSearch={setSearch} 
          sortBy={sortBy} 
          setSortBy={setSortBy} 
          deleteTask={deleteTask}
          getTasks={fetchTasks}
        /> 
        

        <Fab
          color="primary"
          aria-label="add"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
          }}
          onClick={onClose}
        >
          <AddIcon />
        </Fab>
      </>

      : <RenderNoTask />}
    </Box>
  );
};

export default App;