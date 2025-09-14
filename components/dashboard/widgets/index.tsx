'use client';

import React from 'react';

export function Card({ title, children, actions }: { title: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div>{actions}</div>
      </div>
      {children}
    </div>
  );
}

export function Kpi({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

export function Empty({ message }: { message: string }) {
  return <p className="text-gray-600">{message}</p>;
}


