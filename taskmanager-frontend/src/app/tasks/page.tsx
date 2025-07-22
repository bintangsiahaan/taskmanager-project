'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TaskCard from '@/components/TaskCard';

interface Task {
  ID: number;
  Title: string;
  Description: string;
  Status: string;
  Deadline: string;
  AssigneeID: number;
}

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8080/tasks/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch tasks');
        }

        const data = await res.json();
        console.log('Fetched tasks:', data);
        setTasks(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unexpected error');
        }
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Task List</h1>
        <button
          onClick={() => router.push('/tasks/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.ID} task={task} />
        ))}
      </div>
    </div>
  );
}
