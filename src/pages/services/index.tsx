import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import ServiceCard, { Service } from '../../components/ServiceCard';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  useEffect(() => {
    fetch('/api/services/list')
      .then((r) => r.json())
      .then((data) => setServices(data.services || []));
  }, []);

  return (
    <div>
      <Header />
      <main style={{ padding: 16 }}>
        <h1>Services</h1>
        <div style={{ display: 'grid', gap: 12 }}>
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </main>
    </div>
  );
}
