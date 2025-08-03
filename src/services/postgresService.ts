import axios from 'axios';
import { ComprehensiveDeviceInfo } from '../utils/deviceDetection';

// API 클라이언트 생성
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_LANDING_API_URL || 'http://localhost:3001/api/landing',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 데이터 타입 정의 (필요한 인터페이스만 남김)
export interface AnonymousSession {
    id?: string;
    session_id: string;
    user_agent?: string;
    ip_address?: string;
    device_type?: string;
    country?: string;
    city?: string;
    referrer?: string;
    landing_page?: string;
}

export class PostgresService {
  // 1. Landing 페이지 초기 데이터 조회
  static async getInitialData(): Promise<{ travelTypes: any[], characters: any[], regions: any[] }> {
    try {
      const response = await apiClient.get('/initial-data');
      console.log('✅ 초기 데이터 로딩 완료:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ 초기 데이터 로딩 실패:', error);
      return { travelTypes: [], characters: [], regions: [] };
    }
  }

  // 2. 익명 세션 생성/업데이트
  static async createOrUpdateSession(deviceInfo: ComprehensiveDeviceInfo, sessionId: string): Promise<boolean> {
    try {
      const sessionData: Partial<AnonymousSession> = {
        session_id: sessionId,
        user_agent: deviceInfo.userAgent,
        ip_address: deviceInfo.location.ip,
        device_type: deviceInfo.device.type,
        country: deviceInfo.location.country,
        city: deviceInfo.location.city,
        referrer: deviceInfo.misc.referrer,
        landing_page: window.location.href,
      };

      const response = await apiClient.post('/session', sessionData);

      if (response.status === 201) {
        console.log('✅ 익명 세션 저장 완료:', sessionId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('💥 세션 저장 오류:', error);
      return false;
    }
  }

  // 다른 Supabase 관련 메소드들은 현재 구현에서 제외되었습니다.
  // 필요 시 백엔드 API 엔드포인트를 추가하고, 이 서비스 클래스에 메소드를 구현해야 합니다.
}

export default PostgresService;
