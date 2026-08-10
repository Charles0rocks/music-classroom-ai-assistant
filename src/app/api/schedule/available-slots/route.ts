import { NextRequest, NextResponse } from 'next/server';

interface AvailableSlotResponse {
  slot_id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  clash_reason?: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const teacherId = searchParams.get('teacherId');
  const studentId = searchParams.get('studentId');

  if (!teacherId) {
    return NextResponse.json({ error: 'Missing teacherId parameter' }, { status: 400 });
  }

  // Generate dynamic date helpers for mock database simulation
  const now = new Date();
  const getSlotDate = (days: number, hours: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    d.setHours(hours, 0, 0, 0);
    return d.toISOString();
  };

  // Mock schedule slots created by teacher
  const allTeacherSlots = [
    { id: 'slot-1', teacher_id: teacherId, start_time: getSlotDate(1, 14), end_time: getSlotDate(1, 15), is_available: true },
    { id: 'slot-2', teacher_id: teacherId, start_time: getSlotDate(1, 16), end_time: getSlotDate(1, 17), is_available: true },
    { id: 'slot-3', teacher_id: teacherId, start_time: getSlotDate(2, 10), end_time: getSlotDate(2, 11), is_available: true },
    { id: 'slot-4', teacher_id: teacherId, start_time: getSlotDate(2, 15), end_time: getSlotDate(2, 16), is_available: false },
    { id: 'slot-5', teacher_id: teacherId, start_time: getSlotDate(3, 19), end_time: getSlotDate(3, 20), is_available: true },
    { id: 'slot-6', teacher_id: teacherId, start_time: getSlotDate(4, 14), end_time: getSlotDate(4, 15), is_available: true },
  ];

  // Mock active appointments (including other students' confidential bookings)
  const existingAppointments = [
    { id: 'app-confidential-1', student_id: 'other-student-99', teacher_id: teacherId, start_time: getSlotDate(2, 15), end_time: getSlotDate(2, 16), status: 'confirmed' },
    { id: 'app-student-current', student_id: studentId || 'current-student', teacher_id: teacherId, start_time: getSlotDate(1, 10), end_time: getSlotDate(1, 11), status: 'confirmed' },
  ];

  // Algorithmic Conflict Checking Filter
  const availableSlots: AvailableSlotResponse[] = [];

  for (const slot of allTeacherSlots) {
    if (!slot.is_available) continue;

    const slotStart = new Date(slot.start_time).getTime();
    const slotEnd = new Date(slot.end_time).getTime();

    // Check overlap with any confirmed appointment: max(start1, start2) < min(end1, end2)
    const isOccupied = existingAppointments.some((app) => {
      if (app.status !== 'confirmed') return false;
      const appStart = new Date(app.start_time).getTime();
      const appEnd = new Date(app.end_time).getTime();
      return Math.max(slotStart, appStart) < Math.min(slotEnd, appEnd);
    });

    if (!isOccupied) {
      availableSlots.push({
        slot_id: slot.id,
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_available: true,
      });
    }
  }

  return NextResponse.json({
    success: true,
    teacher_id: teacherId,
    student_id: studentId,
    available_slots: availableSlots,
    filtered_privacy_count: allTeacherSlots.length - availableSlots.length,
  });
}
