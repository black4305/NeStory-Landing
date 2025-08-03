import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type } = req.query;
    
    switch (type) {
      case 'summary':
        // 대시보드 요약 분석
        const summaryResult = await sql`
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
        
        return res.status(200).json({
          success: true,
          data: summaryResult.rows[0]
        });
        
      case 'travel-types':
        // 5축 여행 유형별 분석
        const travelTypesResult = await sql`
          SELECT 
            travel_type,
            COUNT(*) as count,
            AVG(lead_score) as avg_lead_score,
            COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as recent_count
          FROM squeeze_leads 
          WHERE travel_type IS NOT NULL
          GROUP BY travel_type
          ORDER BY count DESC;
        `;
        
        return res.status(200).json({
          success: true,
          data: travelTypesResult.rows
        });
        
      case 'active-users':
        // 실시간 활성 사용자
        const activeUsersResult = await sql`
          SELECT 
            COUNT(CASE WHEN last_activity > NOW() - INTERVAL '5 minutes' THEN 1 END) as active_5min,
            COUNT(CASE WHEN last_activity > NOW() - INTERVAL '1 hour' THEN 1 END) as active_1hour,
            COUNT(CASE WHEN last_activity > NOW() - INTERVAL '24 hours' THEN 1 END) as active_24hours
          FROM squeeze_anonymous_sessions;
        `;
        
        return res.status(200).json({
          success: true,
          data: activeUsersResult.rows[0]
        });
        
      case 'survey-connection':
        // Survey 연동 분석 (mock 데이터로 대체)
        return res.status(200).json({
          success: true,
          data: {
            total_landing_sessions: 892,
            landing_to_survey_rate: 27.7,
            survey_sessions: 247,
            avg_time_to_survey_minutes: 12.4
          }
        });
        
      default:
        return res.status(400).json({ error: 'Invalid analytics type' });
    }
    
  } catch (error) {
    console.error('❌ Analytics error:', error);
    return res.status(500).json({
      error: 'Failed to fetch analytics',
      details: error.message
    });
  }
}