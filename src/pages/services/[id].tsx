import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import { Service } from '../../components/ServiceCard';

export default function ServiceDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    if (!id) return;
    const parsedId = Array.isArray(id) ? id[0] : id;
    fetch(`/api/services/details?id=${encodeURIComponent(parsedId)}`)
      .then((r) => r.json())
      .then((data) => setService(data.service));
  }, [id]);

  if (!service) return (
    <div>
      <Header />
      <main style={{ padding: 16 }}>Loading...</main>
    </div>
  );

  return (
    <div>
      <Header />
      <main style={{ padding: 16 }}>
        <h1>{service.name}</h1>
        <p>{service.description}</p>
        <div>Price: ${service.base_price}</div>
      </main>
    </div>
  );
}
