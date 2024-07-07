// src/__tests__/App.test.tsx

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('Task App', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    mockedAxios.post.mockResolvedValue({ data: {} });
    mockedAxios.put.mockResolvedValue({ data: {} });
    mockedAxios.delete.mockResolvedValue({ data: {} });
  });

  it('should create a new task', async () => {
    render(<App />);

    // Open the task form
    fireEvent.click(screen.getByText('Create New Task'));

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Task' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'To Do' } });

    // Submit the form
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(`${URL}/tasks`, expect.objectContaining({
        title: 'Test Task',
        description: 'Test Description',
        status: 'To Do'
      }));
    });
  });

  it('should update an existing task', async () => {
    const task = { _id: '1', title: 'Test Task', description: 'Test Description', status: 'To Do' };
    mockedAxios.get.mockResolvedValueOnce({ data: [task] });

    render(<App />);

    await waitFor(() => screen.getByText('Test Task'));

    // Open the edit form
    fireEvent.click(screen.getByLabelText('edit'));

    // Update the form
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Task' } });

    // Submit the form
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith(`${URL}/tasks/${task._id}`, expect.objectContaining({
        title: 'Updated Task',
        description: 'Test Description',
        status: 'To Do'
      }));
    });
  });

  it('should delete a task', async () => {
    const task = { _id: '1', title: 'Test Task', description: 'Test Description', status: 'To Do' };
    mockedAxios.get.mockResolvedValueOnce({ data: [task] });

    render(<App />);

    await waitFor(() => screen.getByText('Test Task'));

    // Delete the task
    fireEvent.click(screen.getByLabelText('delete'));

    await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledWith(`${URL}/tasks/${task._id}`);
    });
  });

  it('should filter tasks by status', async () => {
    const tasks = [
      { _id: '1', title: 'Task 1', description: 'Description 1', status: 'To Do' },
      { _id: '2', title: 'Task 2', description: 'Description 2', status: 'In Progress' },
      { _id: '3', title: 'Task 3', description: 'Description 3', status: 'Done' },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: tasks });

    render(<App />);

    await waitFor(() => screen.getByText('Task 1'));

    // Filter by status
    fireEvent.change(screen.getByLabelText('Filter by Status'), { target: { value: 'Done' } });

    await waitFor(() => {
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
    });
  });
});