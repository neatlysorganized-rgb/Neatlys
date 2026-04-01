import React, { useState } from 'react';
import Header from '../../components/Header';
import Router from 'next/router';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
    const data = await res.json();

    if (res.ok && data.token) {
      Router.push('/');
    } else {
      alert(data.error || 'registration failed');
    }
  }

  return (
    <div>
      <Header />
      <main style={{ padding: 16 }}>
        <h1>Register</h1>
        <form onSubmit={submit}>
          <div>
            <label htmlFor="fullName">Full name</label>
            <input id="fullName" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit">Register</button>
        </form>
      </main>
    </div>
  );
}
