import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'กรุณากรอก Username และ Password' },
        { status: 400 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { username },
    });

    // ถ้ายังไม่มีใครในระบบเลย (แอปเพิ่งสร้างใหม่) ให้สร้างแอดมินคนแรกให้อัตโนมัติ
    if (!user && username === 'admin') {
      const count = await prisma.user.count();
      if (count === 0) {
        const hashedPassword = await bcrypt.hash('admin1234', 10);
        user = await prisma.user.create({
          data: {
            username: 'admin',
            name: 'ผู้ดูแลระบบ',
            password: hashedPassword,
            role: 'ADMIN',
          }
        });
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'ไม่พบผู้ใช้งานนี้ในระบบ' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'รหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // สร้าง Session (JWT)
    const expires = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 ชม.
    const sessionToken = await encrypt({ 
      id: user.id, 
      username: user.username,
      name: user.name,
      role: user.role 
    });

    const cookieStore = await cookies();
    cookieStore.set('session', sessionToken, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในระบบ' },
      { status: 500 }
    );
  }
}
