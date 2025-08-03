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
    const leadData = req.body;
    
    const result = await sql`
      INSERT INTO squeeze_leads (
        session_id, email, contact_type, contact_value, marketing_consent,
        privacy_consent, kakao_channel_added, lead_source, travel_type,
        lead_score, webhook_sent, name, source, timestamp,
        phone, additional_info, communication_preference, lead_quality
      ) VALUES (
        ${leadData.session_id}, ${leadData.email}, ${leadData.contact_type},
        ${leadData.contact_value}, ${leadData.marketing_consent || false},
        ${leadData.privacy_consent || false}, ${leadData.kakao_channel_added || false},
        ${leadData.lead_source}, ${leadData.travel_type}, ${leadData.lead_score || 50},
        ${leadData.webhook_sent || false}, ${leadData.name}, ${leadData.source},
        ${leadData.timestamp || new Date()}, ${leadData.phone}, ${leadData.additional_info},
        ${leadData.communication_preference}, ${leadData.lead_quality}
      ) RETURNING *;
    `;
    
    return res.status(200).json({
      success: true,
      data: result.rows[0],
      lead_id: result.rows[0].id
    });
    
  } catch (error) {
    console.error('❌ Lead creation error:', error);
    return res.status(500).json({
      error: 'Failed to create lead',
      details: error.message
    });
  }
}