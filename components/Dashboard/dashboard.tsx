import React from 'react';

type CardProps = {
  title: string;
  children: React.ReactNode;
};

export function Card({ title, children }: CardProps) {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {children}
    </div>
  );
}

type StatProps = {
  label: string;
  value: string | number;
};

export function Stat({ label, value }: StatProps) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-xl font-bold">{value}</span>
    </div>
  );
}

type DashboardProps = {
  title: string;
  children: React.ReactNode;
};

export default function Dashboard({ title, children }: DashboardProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      {children}
    </div>
  );
}