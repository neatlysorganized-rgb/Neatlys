import React from 'react';

export type Service = {
  id: number;
  name: string;
  description: string | null;
  base_price: number;
};

type Props = {
  service: Service;
};

export default function ServiceCard({ service }: Props) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
      <h3>{service.name}</h3>
      <p>{service.description}</p>
      <div>Price: ${service.base_price}</div>
    </div>
  );
}
