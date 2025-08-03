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
    const { events, isBatch } = req.body;
    
    if (isBatch && Array.isArray(events)) {
      // 배치 이벤트 처리
      const results = [];
      
      for (const eventData of events) {
        const result = await sql`
          INSERT INTO squeeze_user_events (
            session_id, event_type, event_data, timestamp, page_visit_id,
            target_element, target_text, target_value, mouse_x, mouse_y,
            keyboard_key, scroll_x, scroll_y, error_message, metadata
          ) VALUES (
            ${eventData.session_id}, ${eventData.event_type}, ${JSON.stringify(eventData.event_data)},
            ${eventData.timestamp || new Date()}, ${eventData.page_visit_id},
            ${eventData.target_element}, ${eventData.target_text}, ${eventData.target_value},
            ${eventData.mouse_x}, ${eventData.mouse_y}, ${eventData.keyboard_key},
            ${eventData.scroll_x}, ${eventData.scroll_y}, ${eventData.error_message},
            ${JSON.stringify(eventData.metadata)}
          ) RETURNING id;
        `;
        results.push(result.rows[0]);
      }
      
      return res.status(200).json({
        success: true,
        processed: results.length,
        data: results
      });
      
    } else {
      // 단일 이벤트 처리
      const eventData = events || req.body;
      
      const result = await sql`
        INSERT INTO squeeze_user_events (
          session_id, event_type, event_data, timestamp, page_visit_id,
          target_element, target_text, target_value, mouse_x, mouse_y,
          keyboard_key, scroll_x, scroll_y, error_message, metadata
        ) VALUES (
          ${eventData.session_id}, ${eventData.event_type}, ${JSON.stringify(eventData.event_data)},
          ${eventData.timestamp || new Date()}, ${eventData.page_visit_id},
          ${eventData.target_element}, ${eventData.target_text}, ${eventData.target_value},
          ${eventData.mouse_x}, ${eventData.mouse_y}, ${eventData.keyboard_key},
          ${eventData.scroll_x}, ${eventData.scroll_y}, ${eventData.error_message},
          ${JSON.stringify(eventData.metadata)}
        ) RETURNING *;
      `;
      
      return res.status(200).json({
        success: true,
        data: result.rows[0]
      });
    }
    
  } catch (error) {
    console.error('❌ Event creation error:', error);
    return res.status(500).json({
      error: 'Failed to create event',
      details: error.message
    });
  }
}