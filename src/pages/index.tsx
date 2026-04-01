import React from 'react';
import Header from '../components/Header';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Header />
      <main style={{ padding: 16 }}>
        <h1>Welcome to Neatlys</h1>
        <p>Find vetted service providers and book appointments.</p>
        <Link href="/services">Browse services</Link>
      </main>
    </div>
  );
}
