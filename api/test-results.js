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
    const testData = req.body;
    
    // squeeze_conversions 테이블에 테스트 결과를 저장
    const result = await sql`
      INSERT INTO squeeze_conversions (
        session_id, conversion_type, conversion_stage, conversion_value,
        conversion_data, timestamp, funnel_step, conversion_score,
        device_type, traffic_source
      ) VALUES (
        ${testData.session_id}, 'test_completion', 'result_generated',
        ${testData.type_code || 'UNKNOWN'},
        ${JSON.stringify({
          travel_type_code: testData.travel_type_code,
          axis_scores: testData.axis_scores,
          total_response_time_ms: testData.total_response_time_ms,
          average_response_time_ms: testData.average_response_time_ms,
          completion_rate: testData.completion_rate,
          consistency_score: testData.consistency_score,
          started_at: testData.started_at,
          completed_at: testData.completed_at,
          share_id: testData.share_id,
          shared_count: testData.shared_count
        })},
        ${testData.timestamp || new Date()}, 'test_result',
        ${testData.consistency_score || 50},
        ${testData.device_type || 'unknown'}, ${testData.traffic_source || 'direct'}
      ) RETURNING *;
    `;
    
    return res.status(201).json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('❌ Test result creation error:', error);
    return res.status(500).json({
      error: 'Failed to save test result',
      details: error.message
    });
  }
}