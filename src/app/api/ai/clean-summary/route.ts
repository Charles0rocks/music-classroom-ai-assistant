import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
你是一位專業且溫暖的音樂教學秘書 (Professional & Warm Music Pedagogy Assistant)。
你的任務是處理老師在課堂上的口頭對話轉譯文本 (raw_transcript)。

請嚴格遵守以下過濾與整理規則：
1. 角色：專業且溫暖的音樂教學秘書。
2. 嚴格過濾掉情緒化字眼、批評/罵學生、無關笑話與私生活雜談（例如：「你又沒練習」、「昨天我貓病了」、「真是不聽話」等一律刪除）。
3. 僅萃取：「本週修正技術（手型/弓法/觸鍵/呼吸/姿勢）」、「樂理重點（拍子/調性/表情符號）」、「回家作業與練習 BPM 建議」。
4. 必須嚴格輸出 JSON 格式，不得包含額外的 Markdown 標記或開場白：
{
  "highlights": ["本週學習亮點與優點1", "..."],
  "technical_tips": ["技術修正細節1", "..."],
  "homework": ["回家作業與練習指引1", "..."],
  "encouragement": "一句充滿力量與溫暖的課後鼓勵語",
  "bpm_recommendation": 72
}
`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { raw_transcript } = body;

    if (!raw_transcript || typeof raw_transcript !== 'string') {
      return NextResponse.json(
        { error: 'Invalid payload: raw_transcript is required' },
        { status: 400 }
      );
    }

    // Mock LLM Processing with Rule-based Emotion Cleansing Parser
    // In production, this calls OpenAI / Anthropic / Gemini via SDK
    const rawLower = raw_transcript.toLowerCase();

    // Extract BPM from transcript if mentioned (e.g. "BPM 72" or "72 拍")
    const bpmMatch = raw_transcript.match(/bpm\s*(\d+)/i) || raw_transcript.match(/(\d+)\s*拍/);
    const detectedBpm = bpmMatch ? parseInt(bpmMatch[1], 10) : 72;

    // Filter out emotional / irrelevant keywords
    // E.g., filter out gossip, cat talk, harsh scolding
    const cleanedHighlights: string[] = [];
    const cleanedTips: string[] = [];
    const cleanedHomework: string[] = [];

    if (raw_transcript.includes('巴哈') || raw_transcript.includes('曲目') || raw_transcript.includes('音高')) {
      cleanedHighlights.push('音高穩定度掌握優良，曲目整體音樂流暢性佳');
    } else {
      cleanedHighlights.push('課堂展現積極學習態度，基礎音色建立完整');
    }

    if (raw_transcript.includes('弓法') || raw_transcript.includes('手型') || raw_transcript.includes('右手') || raw_transcript.includes('姿勢')) {
      cleanedTips.push('右手持弓手腕維持放鬆與彈性，避免換弓時肌肉緊繃');
      cleanedTips.push('注意發音起弓時弓毛與琴弦的接觸角度');
    } else {
      cleanedTips.push('按弦第一關節保持站立，避免塌指影響音準');
    }

    if (raw_transcript.includes('十六分音符') || raw_transcript.includes('拍子') || raw_transcript.includes('搶拍')) {
      cleanedTips.push('樂理重點：十六分音符節奏需均勻分配，注意拍點精準度');
    }

    if (raw_transcript.includes('小節') || raw_transcript.includes('練習') || raw_transcript.includes('遍')) {
      cleanedHomework.push(`針對重點樂句進行分段練習 10 次`);
      cleanedHomework.push(`配合節拍器由 BPM ${detectedBpm} 開始慢練，漸進提升至目標速度`);
    } else {
      cleanedHomework.push(`每天練習 20 分鐘，重點加強弱拍發音與連音順暢度`);
      cleanedHomework.push(`使用節拍器設定 BPM ${detectedBpm} 穩固基礎節拍`);
    }

    const cleanSummaryJSON = {
      highlights: cleanedHighlights,
      technical_tips: cleanedTips,
      homework: cleanedHomework,
      encouragement: '音樂的魅力在於不斷雕琢後的純粹，這週你已經大步邁進，繼續保持專注與熱情！',
      bpm_recommendation: detectedBpm,
    };

    return NextResponse.json({
      success: true,
      system_prompt_used: SYSTEM_PROMPT.trim(),
      raw_transcript_received: raw_transcript,
      clean_summary_json: cleanSummaryJSON,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
