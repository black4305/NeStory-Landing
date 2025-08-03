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
    const sessionData = req.body;
    
    const result = await sql`
      INSERT INTO squeeze_anonymous_sessions (
        session_id, ip_address, user_agent, device_type, device_brand, device_model,
        os, os_version, browser, browser_version, screen_width, screen_height,
        screen_resolution, pixel_ratio, color_depth, touch_support, max_touch_points,
        hardware_concurrency, device_memory, connection_type, effective_type,
        downlink, rtt, save_data, timezone, language, languages, platform,
        cookie_enabled, do_not_track, referrer, entry_page, utm_source, utm_medium,
        utm_campaign, utm_term, utm_content, session_start_time, visit_count
      ) VALUES (
        ${sessionData.session_id}, ${sessionData.ip_address}, ${sessionData.user_agent},
        ${sessionData.device_type}, ${sessionData.device_brand}, ${sessionData.device_model},
        ${sessionData.os}, ${sessionData.os_version}, ${sessionData.browser}, ${sessionData.browser_version},
        ${sessionData.screen_width}, ${sessionData.screen_height}, ${sessionData.screen_resolution},
        ${sessionData.pixel_ratio}, ${sessionData.color_depth}, ${sessionData.touch_support},
        ${sessionData.max_touch_points}, ${sessionData.hardware_concurrency}, ${sessionData.device_memory},
        ${sessionData.connection_type}, ${sessionData.effective_type}, ${sessionData.downlink},
        ${sessionData.rtt}, ${sessionData.save_data}, ${sessionData.timezone}, ${sessionData.language},
        ${sessionData.languages}, ${sessionData.platform}, ${sessionData.cookie_enabled},
        ${sessionData.do_not_track}, ${sessionData.referrer}, ${sessionData.entry_page},
        ${sessionData.utm_source}, ${sessionData.utm_medium}, ${sessionData.utm_campaign},
        ${sessionData.utm_term}, ${sessionData.utm_content}, ${sessionData.session_start_time},
        ${sessionData.visit_count || 1}
      )
      ON CONFLICT (session_id) DO UPDATE SET
        last_activity = CURRENT_TIMESTAMP,
        visit_count = squeeze_anonymous_sessions.visit_count + 1
      RETURNING *;
    `;
    
    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('❌ Session creation error:', error);
    return res.status(500).json({
      error: 'Failed to create session',
      details: error.message
    });
  }
}