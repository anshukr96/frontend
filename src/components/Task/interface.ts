export interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'To Do' | 'In Progress' | 'Done';
    createdAt: string;
    dueDate: string
}

export interface TaskListProps {
    tasks: Task[];
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    sortBy: string;
    setSortBy: React.Dispatch<React.SetStateAction<string>>;
    deleteTask: (taskId: string) => Promise<void>; 
    getTasks: any;
}