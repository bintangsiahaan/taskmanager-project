'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      router.push('/tasks');
    } catch (err) {
      setError('An error occurred while logging in');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(to bottom right, #E186B4, #BDD8FE)',
      }}
    >
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-lg w-80 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 rounded border bg-white text-sm text-gray-700 placeholder-gray-500 focus:outline-none"
          style={{
            borderImage: 'linear-gradient(to right, #E186B4, #BDD8FE) 1',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: '6px',
          }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 rounded border bg-white text-sm text-gray-700 placeholder-gray-500 focus:outline-none"
          style={{
            borderImage: 'linear-gradient(to right, #E186B4, #BDD8FE) 1',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: '6px',
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:opacity-90 transition"
        >
          Login
        </button>

<div className="text-center text-sm text-gray-600 mt-4">
  Don&apos;t have an account?{' '}        
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => router.push('/register')}
          >
            Register here
          </button>
        </div>
      </form>
    </div>
  );
}
