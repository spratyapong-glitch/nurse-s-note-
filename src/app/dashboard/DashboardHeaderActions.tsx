"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardHeaderActions({ isAdmin }: { isAdmin: boolean }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <div className="flex items-center space-x-4">
      {isAdmin && (
        <Link href="/admin/users" className="hidden md:flex text-sm font-bold bg-amber-50 text-amber-600 px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors">
          ระบบแอดมิน
        </Link>
      )}
      <Link href="/evaluation" className="hidden md:flex text-sm font-bold bg-primary-50 text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-100 transition-colors">
        + ประเมินแฟ้มใหม่
      </Link>
      <button onClick={handleLogout} className="text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors">
        ออกจากระบบ
      </button>
    </div>
  );
}
