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
    const conversionData = req.body;
    
    const result = await sql`
      INSERT INTO squeeze_conversions (
        session_id, conversion_type, conversion_stage, conversion_value,
        conversion_data, timestamp, funnel_step, previous_step,
        time_to_convert_seconds, conversion_score, ab_test_variant,
        device_type, traffic_source, campaign_data, user_segment,
        revenue_impact
      ) VALUES (
        ${conversionData.session_id}, ${conversionData.conversion_type},
        ${conversionData.conversion_stage}, ${conversionData.conversion_value},
        ${JSON.stringify(conversionData.conversion_data)}, ${conversionData.timestamp || new Date()},
        ${conversionData.funnel_step}, ${conversionData.previous_step},
        ${conversionData.time_to_convert_seconds}, ${conversionData.conversion_score || 50},
        ${conversionData.ab_test_variant}, ${conversionData.device_type},
        ${conversionData.traffic_source}, ${JSON.stringify(conversionData.campaign_data)},
        ${conversionData.user_segment}, ${conversionData.revenue_impact || 0}
      ) RETURNING *;
    `;
    
    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('❌ Conversion creation error:', error);
    return res.status(500).json({
      error: 'Failed to create conversion',
      details: error.message
    });
  }
}