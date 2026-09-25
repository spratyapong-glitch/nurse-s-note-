"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('NURSE');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name, role }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg('เพิ่มผู้ใช้งานสำเร็จ');
        setUsername('');
        setPassword('');
        setName('');
        fetchUsers();
      } else {
        setErrorMsg(data.error);
      }
    } catch (err) {
      setErrorMsg('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('ยืนยันการลบผู้ใช้งานนี้?')) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      alert('ลบไม่สำเร็จ');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">จัดการผู้ใช้งาน (Admin)</h1>
            <p className="text-slate-500 text-sm mt-1">เพิ่ม/ลบ รหัสผ่านของพยาบาลในระบบ</p>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard" className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">
              กลับไป Dashboard
            </Link>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors">
              ออกจากระบบ
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
            <h2 className="text-lg font-bold text-slate-800 mb-4">เพิ่มผู้ใช้งานใหม่</h2>
            {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{errorMsg}</div>}
            {successMsg && <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">{successMsg}</div>}
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">รหัสประจำตัว (Username)</label>
                <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อ-นามสกุล (Name)</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">รหัสผ่าน (Password)</label>
                <input type="text" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">สิทธิ์ (Role)</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-slate-50">
                  <option value="NURSE">พยาบาล (NURSE)</option>
                  <option value="ADMIN">ผู้ดูแลระบบ (ADMIN)</option>
                </select>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700">
                {isSubmitting ? 'กำลังบันทึก...' : 'เพิ่มผู้ใช้งาน'}
              </button>
            </form>
          </div>

          {/* Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold">Username</th>
                  <th className="px-6 py-4 font-bold">ชื่อ-นามสกุล</th>
                  <th className="px-6 py-4 font-bold">สิทธิ์</th>
                  <th className="px-6 py-4 font-bold text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">กำลังโหลดข้อมูล...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">ยังไม่มีผู้ใช้งาน</td></tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-800 font-medium">{user.username}</td>
                      <td className="px-6 py-4 text-slate-600">{user.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
