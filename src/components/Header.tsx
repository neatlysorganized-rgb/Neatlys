import Link from 'next/link';
import React from 'react';
import Router from 'next/router';

async function logout() {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'same-origin',
  });
  Router.push('/auth/login');
}

export default function Header() {
  return (
    <header style={{ padding: 16, borderBottom: '1px solid #eee' }}>
      <nav>
        <Link href="/">Neatlys</Link> | <Link href="/services">Services</Link> | <Link href="/auth/login">Login</Link>{' '}
        | <button type="button" onClick={logout}>Logout</button>
      </nav>
    </header>
  );
}
