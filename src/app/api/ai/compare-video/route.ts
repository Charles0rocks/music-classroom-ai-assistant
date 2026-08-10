import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { student_video_url, demo_video_id } = body;

    const mockFeedback = {
      overall_score: 86,
      pitch_accuracy: 89,
      rhythm_accuracy: 81,
      bpm_detected: 102,
      summary: '經過 AI 雙影片逐影格比對，學生練習音準掌握度高達 89%，唯在第 14 秒至第 28 秒出現微幅搶拍（+6 BPM）與手腕過緊現象。建議參考老師 0:14 處右臂放鬆弧度。',
      timeline_markers: [
        {
          time: 5,
          type: 'posture',
          severity: 'good',
          title: '起弓姿勢標準',
          description: '持弓手型自然，右手腕放鬆適度。',
          recommendation: '保持當前手型狀態。',
        },
        {
          time: 14,
          type: 'rhythm',
          severity: 'warning',
          title: '第 16 小節十六分音符搶拍',
          description: '偵測到演奏速度達到 104 BPM（老師範例為 96 BPM）。',
          recommendation: '建議搭配節拍器，在第 14-18 秒處保持穩定踏拍。',
        },
        {
          time: 28,
          type: 'pitch',
          severity: 'error',
          title: '第 32 小節升 C (C#) 音高偏高',
          description: '音高測量高出標準頻率 +18 cents。',
          recommendation: '第二指按弦位置需稍微後退 2 毫米，注意按弦力量。',
        },
        {
          time: 42,
          type: 'posture',
          severity: 'warning',
          title: '末段運弓手腕略顯僵硬',
          description: '運弓靠近弓尾時，手腕未及時順應沉下。',
          recommendation: '換弓時注意力集中於手腕小幅度的緩衝運動。',
        },
      ],
    };

    return NextResponse.json({
      success: true,
      demo_video_id,
      student_video_url,
      ai_feedback_json: mockFeedback,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Error processing video comparison' },
      { status: 500 }
    );
  }
}
