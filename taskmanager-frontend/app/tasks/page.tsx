'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TaskCard from '@/components/TaskCard';
import Sidebar from '@/components/Sidebar';

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
  const searchParams = useSearchParams();

  const status = searchParams.get('status') || '';
  const due = searchParams.get('due') || '';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchTasks = async () => {
      try {
        const query = new URLSearchParams();
        if (status) query.set('status', status);
        if (due) query.set('due', due);

        const res = await fetch(`http://localhost:8080/tasks/?${query.toString()}`, {
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
  }, [router, status, due]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E186B4] to-[#BDD8FE] p-6 text-black">
      <div
  className="p-[2px] rounded-xl bg-gradient-to-r from-[#E186B4] to-[#BDD8FE] mb-6"
>
  <div className="bg-white rounded-lg px-6 py-4 flex items-center justify-between">
    <h1 className="text-2xl font-bold">Task List</h1>

    <div className="flex items-center space-x-2">
      <button 
      onClick={() => router.push('/tasks/new')}
      className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
  <i className="fas fa-plus"></i>
  Add Task
</button>
      <button 
      onClick={handleLogout}
      className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
  <i className="fas fa-sign-out-alt"></i>
  Logout
</button>

    </div>
  </div>
</div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="flex gap-6 items-start">
  <div className="w-full md:w-64 flex-shrink-0">
    <Sidebar />
  </div>
  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
    {tasks.map((task) => (
      <TaskCard key={task.ID} task={task} />
    ))}
  </div>
</div>

    </div>
  );
}
