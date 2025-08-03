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
        ${sessionData.session_id}, ${sessionData.ip_address || '0.0.0.0'}, ${sessionData.user_agent || 'Unknown'},
        ${sessionData.device_type || 'unknown'}, ${sessionData.device_brand || 'Unknown'}, ${sessionData.device_model || 'Unknown'},
        ${sessionData.os || 'Unknown'}, ${sessionData.os_version || 'Unknown'}, ${sessionData.browser || 'Unknown'}, ${sessionData.browser_version || 'Unknown'},
        ${sessionData.screen_width || 0}, ${sessionData.screen_height || 0}, ${sessionData.screen_resolution || '0x0'},
        ${sessionData.pixel_ratio || 1}, ${sessionData.color_depth || 24}, ${sessionData.touch_support || false},
        ${sessionData.max_touch_points || 0}, ${sessionData.hardware_concurrency || 1}, ${sessionData.device_memory || null},
        ${sessionData.connection_type || null}, ${sessionData.effective_type || null}, ${sessionData.downlink || null},
        ${sessionData.rtt || null}, ${sessionData.save_data || false}, ${sessionData.timezone || 'UTC'}, ${sessionData.language || 'en'},
        ${JSON.stringify(sessionData.languages || ['en'])}, ${sessionData.platform || 'Unknown'}, ${sessionData.cookie_enabled || true},
        ${sessionData.do_not_track || false}, ${sessionData.referrer || ''}, ${sessionData.entry_page || sessionData.landing_page || ''},
        ${sessionData.utm_source || null}, ${sessionData.utm_medium || null}, ${sessionData.utm_campaign || null},
        ${sessionData.utm_term || null}, ${sessionData.utm_content || null}, ${sessionData.session_start_time || new Date()},
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