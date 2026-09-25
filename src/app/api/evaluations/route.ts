import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wardName, fiscalYear, date, hn, an, evaluatorName, scores, totalScore } = body;

    if (!wardName || !date) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // 1. หาข้อมูล Ward ถ้าไม่มีให้สร้างใหม่
    let ward = await prisma.ward.findFirst({
      where: { name: wardName }
    });
    
    if (!ward) {
      ward = await prisma.ward.create({
        data: { name: wardName }
      });
    }

    // 2. เตรียมข้อมูลคะแนนแต่ละข้อ
    const detailsData = Object.entries(scores).map(([criteriaId, score]) => ({
      criteriaId,
      score: Number(score)
    }));

    // 3. บันทึกข้อมูลการประเมิน
    const evaluation = await prisma.evaluation.create({
      data: {
        hn: hn || "",
        an: an || "",
        fiscalYear: fiscalYear || "2569",
        evaluatorName: evaluatorName || "",
        date: new Date(date),
        totalScore: Number(totalScore),
        wardId: ward.id,
        details: {
          create: detailsData
        }
      }
    });

    return NextResponse.json({ success: true, data: evaluation }, { status: 201 });

  } catch (error) {
    console.error("Error saving evaluation:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
