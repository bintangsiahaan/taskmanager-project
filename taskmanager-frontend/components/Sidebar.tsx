'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface TaskStats {
  total: number;
  in_progress: number;
  done: number;
  todo: number;
  overdue: number;
}

export default function Sidebar() {
  const [stats, setStats] = useState<TaskStats | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedStatus = searchParams.get('status') || '';
  const selectedDue = searchParams.get('due') || '';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8080/tasks/statistics', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch statistics:', err);
      }
    };

    fetchStats();
  }, []);

  const handleFilterChange = (type: 'status' | 'due', value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(type, value);
    } else {
      params.delete(type);
    }

    router.push(`/tasks?${params.toString()}`);
    router.refresh();
  };

  return (
    <div
  style={{
    padding: '2px',
    borderRadius: '12px',
    background: 'linear-gradient(to right, #E186B4, #BDD8FE)',
  }}
>
  <div
    style={{
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '16px',
    }}
  >
      <div>
  <h2 className="text-lg font-semibold mb-4">Task Summary</h2>
  <div className="grid grid-cols-2 gap-4 mb-4">
    {[
      { label: 'Total', value: stats?.total ?? '-', color: 'text-blue-600' },
      { label: 'To Do', value: stats?.todo ?? '-', color: 'text-yellow-600' },
      { label: 'In Progress', value: stats?.in_progress ?? '-', color: 'text-indigo-600' },
      { label: 'Done', value: stats?.done ?? '-', color: 'text-green-600' },
    ].map((item) => (
      <div
        key={item.label}
        className="bg-gradient-to-b from-gray-200 to-gray-50 rounded-xl p-4 text-center shadow-sm"
      >
        <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
        <p className="text-sm text-gray-500">{item.label}</p>
      </div>
    ))}
  </div>

  <div className="mt-2 px-2 py-2 rounded-md bg-red-100 text-red-600 text-sm text-center shadow-sm">
    Overdue: <span className="font-bold">{stats?.overdue ?? '-'}</span>
  </div>
</div>


      <div>
        <h2 className="text-lg font-semibold mb-2">Filter Status</h2>
        <select
          className="w-full border rounded p-2"
          value={selectedStatus}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">All</option>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Due Date</h2>
        <select
          className="w-full border rounded p-2"
          value={selectedDue}
          onChange={(e) => handleFilterChange('due', e.target.value)}
        >
          <option value="">All</option>
          <option value="today">Today</option>
          <option value="this_week">This Week</option>
          <option value="this_month">This Month</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
    </div>
    </div>
  );
}
