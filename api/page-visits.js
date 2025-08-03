import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      // 페이지 방문 기록 생성
      const visitData = req.body;
      
      const result = await sql`
        INSERT INTO squeeze_page_visits (
          session_id, route, page_title, url_params, enter_time,
          scroll_depth_percent, click_count, interaction_count,
          referrer_page, exit_intent_triggered, form_interactions,
          cta_interactions, media_interactions, search_interactions,
          social_interactions, download_interactions, error_count
        ) VALUES (
          ${visitData.session_id}, ${visitData.route}, ${visitData.page_title},
          ${JSON.stringify(visitData.url_params)}, ${visitData.enter_time || new Date()},
          ${visitData.scroll_depth_percent || 0}, ${visitData.click_count || 0},
          ${visitData.interaction_count || 0}, ${visitData.referrer_page},
          ${visitData.exit_intent_triggered || false}, ${visitData.form_interactions || 0},
          ${visitData.cta_interactions || 0}, ${visitData.media_interactions || 0},
          ${visitData.search_interactions || 0}, ${visitData.social_interactions || 0},
          ${visitData.download_interactions || 0}, ${visitData.error_count || 0}
        ) RETURNING *;
      `;
      
      return res.status(200).json({
        success: true,
        data: result.rows[0]
      });
      
    } else if (req.method === 'PUT') {
      // 페이지 방문 업데이트 (종료 시간, 스크롤 등)
      const { visitId, updateData } = req.body;
      
      const result = await sql`
        UPDATE squeeze_page_visits SET
          exit_time = ${updateData.exit_time || new Date()},
          time_spent_seconds = ${updateData.time_spent_seconds},
          scroll_depth_percent = ${updateData.scroll_depth_percent},
          click_count = ${updateData.click_count},
          interaction_count = ${updateData.interaction_count},
          exit_intent_triggered = ${updateData.exit_intent_triggered},
          form_interactions = ${updateData.form_interactions},
          cta_interactions = ${updateData.cta_interactions},
          bounce = ${updateData.bounce || false}
        WHERE id = ${visitId}
        RETURNING *;
      `;
      
      return res.status(200).json({
        success: true,
        data: result.rows[0]
      });
      
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('❌ Page visit error:', error);
    return res.status(500).json({
      error: 'Failed to process page visit',
      details: error.message
    });
  }
}