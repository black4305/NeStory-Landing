import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const responseData = req.body;
    
    // squeeze_user_events 테이블에 설문 응답을 저장
    const result = await sql`
      INSERT INTO squeeze_user_events (
        session_id, event_type, event_timestamp, target_element,
        target_text, target_value, event_data, page_url,
        mouse_x, mouse_y, scroll_x, scroll_y, metadata
      ) VALUES (
        ${responseData.session_id}, 'survey_response', ${responseData.answered_at || new Date()},
        ${`question_${responseData.question_id}`}, ${responseData.question_number?.toString()},
        ${responseData.answer || responseData.selected_option}, 
        ${JSON.stringify({
          question_id: responseData.question_id,
          question_number: responseData.question_number,
          answer: responseData.answer,
          selected_option: responseData.selected_option,
          selected_score: responseData.selected_score,
          response_time_ms: responseData.response_time_ms,
          confidence_score: responseData.confidence_score,
          answered_at: responseData.answered_at
        })},
        ${typeof window !== 'undefined' ? window.location.href : ''},
        ${0}, ${0}, ${0}, ${0},
        ${JSON.stringify({ type: 'survey_response', timestamp: responseData.timestamp })}
      ) RETURNING *;
    `;
    
    return res.status(201).json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('❌ Survey response creation error:', error);
    return res.status(500).json({
      error: 'Failed to save survey response',
      details: error.message
    });
  }
}