import { NextResponse } from 'next/server';
import { store } from '@/lib/storage';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const rec = store.getRecruitmentById(id);
    if (!rec) {
      return NextResponse.json({ success: false, error: 'Recruitment post not found' }, { status: 404 });
    }

    const body = await req.json();
    const {
      studentName,
      studentRoll,
      studentDept,
      studentPhone,
      studentEmail,
      roleApplied,
      experience,
      whyJoin,
      portfolioUrl
    } = body;

    if (!studentName || !studentRoll || !studentEmail || !roleApplied || !whyJoin) {
      return NextResponse.json({ success: false, error: 'Please fill in all required fields' }, { status: 400 });
    }

    const app = store.submitApplication({
      recruitmentId: id,
      studentId: `std-${Date.now()}`,
      studentName,
      studentRoll,
      studentDept: studentDept || 'DBUU Student',
      studentPhone: studentPhone || 'N/A',
      studentEmail,
      roleApplied,
      experience: experience || 'First-time volunteer',
      whyJoin,
      portfolioUrl
    });

    return NextResponse.json({ success: true, data: app });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
