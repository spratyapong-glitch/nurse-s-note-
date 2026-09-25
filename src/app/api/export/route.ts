import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || 'all';
    const ward = searchParams.get('ward') || 'all';

    let whereClause: any = {};
    if (year !== 'all') {
      whereClause.fiscalYear = year;
    }
    if (ward !== 'all') {
      whereClause.ward = { name: ward };
    }

    const evaluations = await prisma.evaluation.findMany({
      where: whereClause,
      include: {
        ward: true,
        details: true
      },
      orderBy: { date: 'desc' }
    });

    // ถ้าไม่มีข้อมูล
    if (evaluations.length === 0) {
      return NextResponse.json({ message: "No data found for this filter" }, { status: 404 });
    }

    // แปลงข้อมูลเป็นแถวสำหรับ Excel
    const data = evaluations.map((ev) => {
      const row: any = {
        "ลำดับ ID": ev.id,
        "ปีงบประมาณ": ev.fiscalYear,
        "วันที่ประเมิน": ev.date.toISOString().split('T')[0],
        "หน่วยงาน": ev.ward.name,
        "HN": ev.hn,
        "AN": ev.an,
        "ผู้ตรวจประเมิน": ev.evaluatorName,
        "คะแนนรวม (เต็ม 100)": ev.totalScore
      };
      
      // เอาคะแนนรายข้อยัดเป็นคอลัมน์เพิ่มเติม
      ev.details.forEach(d => {
        row[`ข้อ ${d.criteriaId}`] = d.score;
      });

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "รายงานการประเมิน");
    
    // ตั้งค่าความกว้างคอลัมน์เบื้องต้น
    worksheet['!cols'] = [
      { wch: 10 }, { wch: 12 }, { wch: 15 }, { wch: 25 }, 
      { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 20 }
    ];

    const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buf, {
      headers: {
        'Content-Disposition': `attachment; filename="nurses_note_report_${year}_${ward}.xlsx"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }
    });
  } catch (error) {
    console.error("Export Error:", error);
    return NextResponse.json({ error: 'Failed to export Excel' }, { status: 500 });
  }
}
