'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to register');
      }

      setSuccess('Registration successful. Redirecting to login...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Unexpected error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E186B4] to-[#BDD8FE]">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow-md w-80 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700">Register</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <input
          type="text"
          placeholder="Name"
          className="w-full px-3 py-2 rounded border border-[#E186B4] placeholder-gray-500 text-gray-700 focus:outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 rounded border border-[#E186B4] placeholder-gray-500 text-gray-700 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 rounded border border-[#E186B4] placeholder-gray-500 text-gray-700 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:opacity-90 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
