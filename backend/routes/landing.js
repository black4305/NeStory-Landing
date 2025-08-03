const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/database');

// =============================================================================
// Landing 프로젝트 완전한 Express API 시스템 (CLAUDE.md 기반 구현)
// 5축 가족여행 테스트 + PostgreSQL 분석 + Survey 연동
// =============================================================================

// 1. 세션 관리 API
router.post('/sessions', async (req, res, next) => {
  try {
    const sessionData = req.body;
    const query = `
      INSERT INTO squeeze_anonymous_sessions (
        session_id, ip_address, user_agent, device_type, device_brand, device_model,
        os, os_version, browser, browser_version, screen_width, screen_height,
        screen_resolution, pixel_ratio, color_depth, touch_support, max_touch_points,
        hardware_concurrency, device_memory, connection_type, effective_type,
        downlink, rtt, save_data, timezone, language, languages, platform,
        cookie_enabled, do_not_track, referrer, entry_page, utm_source, utm_medium,
        utm_campaign, utm_term, utm_content, session_start_time, visit_count
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
        $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32,
        $33, $34, $35, $36, $37, $38, $39
      )
      ON CONFLICT (session_id) DO UPDATE SET
        last_activity = CURRENT_TIMESTAMP,
        visit_count = squeeze_anonymous_sessions.visit_count + 1
      RETURNING *;
    `;
    
    const params = [
      sessionData.session_id, sessionData.ip_address, sessionData.user_agent,
      sessionData.device_type, sessionData.device_brand, sessionData.device_model,
      sessionData.os, sessionData.os_version, sessionData.browser, sessionData.browser_version,
      sessionData.screen_width, sessionData.screen_height, sessionData.screen_resolution,
      sessionData.pixel_ratio, sessionData.color_depth, sessionData.touch_support,
      sessionData.max_touch_points, sessionData.hardware_concurrency, sessionData.device_memory,
      sessionData.connection_type, sessionData.effective_type, sessionData.downlink,
      sessionData.rtt, sessionData.save_data, sessionData.timezone, sessionData.language,
      sessionData.languages, sessionData.platform, sessionData.cookie_enabled,
      sessionData.do_not_track, sessionData.referrer, sessionData.entry_page,
      sessionData.utm_source, sessionData.utm_medium, sessionData.utm_campaign,
      sessionData.utm_term, sessionData.utm_content, sessionData.session_start_time,
      sessionData.visit_count || 1
    ];
    
    const result = await executeQuery(query, params);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// 2. 페이지 방문 추적 API
router.post('/page-visits', async (req, res, next) => {
  try {
    const visitData = req.body;
    const query = `
      INSERT INTO squeeze_page_visits (
        id, session_id, page_path, event_type, page_title, referrer_url,
        visit_duration, scroll_depth, bounce_rate, exit_rate, page_load_time,
        dom_content_loaded_time, first_contentful_paint, largest_contentful_paint,
        first_input_delay, cumulative_layout_shift, performance_score
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
      ) RETURNING *;
    `;
    
    const params = [
      visitData.session_id, visitData.page_path, visitData.event_type,
      visitData.page_title, visitData.referrer_url, visitData.visit_duration,
      visitData.scroll_depth, visitData.bounce_rate, visitData.exit_rate,
      visitData.page_load_time, visitData.dom_content_loaded_time,
      visitData.first_contentful_paint, visitData.largest_contentful_paint,
      visitData.first_input_delay, visitData.cumulative_layout_shift,
      visitData.performance_score
    ];
    
    const result = await executeQuery(query, params);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// 3. 사용자 이벤트 추적 API
router.post('/events', async (req, res, next) => {
  try {
    const eventData = req.body;
    const query = `
      INSERT INTO squeeze_user_events (
        id, session_id, event_type, event_category, event_action, event_label,
        event_value, element_id, element_class, element_tag, element_text,
        mouse_x, mouse_y, scroll_position, viewport_width, viewport_height,
        timestamp_offset, session_duration, page_url
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
      ) RETURNING *;
    `;
    
    const params = [
      eventData.session_id, eventData.event_type, eventData.event_category,
      eventData.event_action, eventData.event_label, eventData.event_value,
      eventData.element_id, eventData.element_class, eventData.element_tag,
      eventData.element_text, eventData.mouse_x, eventData.mouse_y,
      eventData.scroll_position, eventData.viewport_width, eventData.viewport_height,
      eventData.timestamp_offset, eventData.session_duration, eventData.page_url
    ];
    
    const result = await executeQuery(query, params);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// 4. 배치 이벤트 처리 API
router.post('/events/batch', async (req, res, next) => {
  try {
    const { events } = req.body;
    const results = [];
    
    for (const eventData of events) {
      const query = `
        INSERT INTO squeeze_user_events (
          id, session_id, event_type, event_category, event_action, event_label,
          event_value, element_id, element_class, element_tag, element_text,
          mouse_x, mouse_y, scroll_position, viewport_width, viewport_height,
          timestamp_offset, session_duration, page_url
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
        ) RETURNING *;
      `;
      
      const params = [
        eventData.session_id, eventData.event_type, eventData.event_category,
        eventData.event_action, eventData.event_label, eventData.event_value,
        eventData.element_id, eventData.element_class, eventData.element_tag,
        eventData.element_text, eventData.mouse_x, eventData.mouse_y,
        eventData.scroll_position, eventData.viewport_width, eventData.viewport_height,
        eventData.timestamp_offset, eventData.session_duration, eventData.page_url
      ];
      
      const result = await executeQuery(query, params);
      results.push(result.rows[0]);
    }
    
    res.status(201).json({ processed: results.length, events: results });
  } catch (error) {
    next(error);
  }
});

// 5. 리드 전환 API
router.post('/leads', async (req, res, next) => {
  try {
    const leadData = req.body;
    const query = `
      INSERT INTO squeeze_leads (
        id, session_id, email, lead_source, lead_type, travel_type_result,
        axis_scores, additional_data, lead_quality_score, conversion_probability,
        estimated_ltv, lead_temperature, contact_preferences, marketing_consent,
        data_processing_consent, follow_up_scheduled, notes
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
      ) RETURNING *;
    `;
    
    const params = [
      leadData.session_id, leadData.email, leadData.lead_source, leadData.lead_type,
      leadData.travel_type_result, JSON.stringify(leadData.axis_scores),
      JSON.stringify(leadData.additional_data), leadData.lead_quality_score,
      leadData.conversion_probability, leadData.estimated_ltv, leadData.lead_temperature,
      JSON.stringify(leadData.contact_preferences), leadData.marketing_consent,
      leadData.data_processing_consent, leadData.follow_up_scheduled, leadData.notes
    ];
    
    const result = await executeQuery(query, params);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// 6. 전환 추적 API
router.post('/conversions', async (req, res, next) => {
  try {
    const conversionData = req.body;
    const query = `
      INSERT INTO squeeze_conversions (
        id, session_id, conversion_type, conversion_stage, conversion_value,
        conversion_currency, funnel_step, time_to_conversion, attribution_model,
        first_touch_source, last_touch_source, conversion_path, revenue_attributed,
        cost_per_conversion, roi, conversion_quality_score
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
      ) RETURNING *;
    `;
    
    const params = [
      conversionData.session_id, conversionData.conversion_type, conversionData.conversion_stage,
      conversionData.conversion_value, conversionData.conversion_currency, conversionData.funnel_step,
      conversionData.time_to_conversion, conversionData.attribution_model,
      conversionData.first_touch_source, conversionData.last_touch_source,
      JSON.stringify(conversionData.conversion_path), conversionData.revenue_attributed,
      conversionData.cost_per_conversion, conversionData.roi, conversionData.conversion_quality_score
    ];
    
    const result = await executeQuery(query, params);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// 7. 관리자 대시보드 분석 API
router.get('/analytics/summary', async (req, res, next) => {
  try {
    const summaryQuery = `
      WITH session_stats AS (
        SELECT 
          COUNT(DISTINCT session_id) as total_sessions,
          COUNT(DISTINCT CASE WHEN last_activity > NOW() - INTERVAL '24 hours' THEN session_id END) as sessions_today,
          COUNT(DISTINCT CASE WHEN last_activity > NOW() - INTERVAL '1 hour' THEN session_id END) as active_sessions
        FROM squeeze_anonymous_sessions
      ),
      lead_stats AS (
        SELECT 
          COUNT(*) as total_leads,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as leads_today
        FROM squeeze_leads
      ),
      conversion_stats AS (
        SELECT 
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as conversions_today
        FROM squeeze_conversions
      )
      SELECT 
        s.total_sessions,
        s.sessions_today,
        s.active_sessions,
        COALESCE(l.leads_today, 0) as leads_today,
        COALESCE(c.conversions_today, 0) as conversions_today,
        CASE 
          WHEN s.total_sessions > 0 THEN 
            COALESCE(l.total_leads, 0)::float / s.total_sessions * 100
          ELSE 0 
        END as conversion_rate
      FROM session_stats s
      CROSS JOIN lead_stats l
      CROSS JOIN conversion_stats c;
    `;
    
    const result = await executeQuery(summaryQuery);
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// 8. 5축 분석 결과 API
router.get('/analytics/travel-types', async (req, res, next) => {
  try {
    const typesQuery = `
      SELECT 
        travel_type_result,
        COUNT(*) as count,
        AVG(lead_quality_score) as avg_quality_score,
        COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () as percentage
      FROM squeeze_leads 
      WHERE travel_type_result IS NOT NULL
      GROUP BY travel_type_result
      ORDER BY count DESC;
    `;
    
    const result = await executeQuery(typesQuery);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// 9. 실시간 활성 사용자 API
router.get('/analytics/active-users', async (req, res, next) => {
  try {
    const activeUsersQuery = `
      SELECT 
        COUNT(CASE WHEN last_activity > NOW() - INTERVAL '5 minutes' THEN 1 END) as active_5min,
        COUNT(CASE WHEN last_activity > NOW() - INTERVAL '15 minutes' THEN 1 END) as active_15min,
        COUNT(CASE WHEN last_activity > NOW() - INTERVAL '1 hour' THEN 1 END) as active_1hour
      FROM squeeze_anonymous_sessions;
    `;
    
    const result = await executeQuery(activeUsersQuery);
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// 10. Survey 연동 분석 API
router.get('/analytics/survey-connection', async (req, res, next) => {
  try {
    const connectionQuery = `
      SELECT 
        COUNT(DISTINCT la.session_id) as total_landing_sessions,
        COUNT(DISTINCT ss.session_id) as survey_sessions,
        COUNT(DISTINCT ss.session_id)::float / NULLIF(COUNT(DISTINCT la.session_id), 0) * 100 as landing_to_survey_rate,
        AVG(EXTRACT(EPOCH FROM (ss.created_at - la.created_at))/60) as avg_time_to_survey_minutes
      FROM squeeze_anonymous_sessions la
      LEFT JOIN survey_sessions ss ON la.session_id = ss.landing_session_id
      WHERE la.created_at > NOW() - INTERVAL '30 days';
    `;
    
    const result = await executeQuery(connectionQuery);
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
