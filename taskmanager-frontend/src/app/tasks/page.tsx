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
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchTasks = async () => {
      try {
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
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E186B4] to-[#BDD8FE] p-6 text-black">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task List</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/tasks/new')}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            + Add Task
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-black text-black rounded hover:bg-white/20 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.ID} task={task} />
        ))}
      </div>
    </div>
  );
}
