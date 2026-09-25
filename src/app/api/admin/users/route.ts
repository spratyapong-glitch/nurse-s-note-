import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

// ตรวจสอบสิทธิ์ว่าเป็น ADMIN หรือไม่
async function checkAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return false;
  }
  return true;
}

export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const users = await prisma.user.findMany({
    select: { id: true, username: true, name: true, role: true, wardId: true, ward: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const { username, name, password, role, wardId } = await request.json();

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return NextResponse.json({ error: 'มีรหัสประจำตัวนี้ในระบบแล้ว' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        name,
        password: hashedPassword,
        role: role || 'NURSE',
        wardId: wardId ? parseInt(wardId) : null,
      },
      select: { id: true, username: true, name: true, role: true }
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้งาน' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการลบผู้ใช้งาน' }, { status: 500 });
  }
}
