import { AnalyticsData } from '../types';

export class DataManager {
  private static readonly ANALYTICS_KEY = 'surveyAnalytics';
  private static readonly BACKUP_KEY = 'surveyAnalytics_backup';
  private static readonly SYNC_TIMESTAMP_KEY = 'lastSyncTime';

  // 데이터 저장
  static saveAnalyticsData(data: AnalyticsData[]): void {
    try {
      const dataString = JSON.stringify(data);
      localStorage.setItem(this.ANALYTICS_KEY, dataString);
      
      // 백업 저장
      localStorage.setItem(this.BACKUP_KEY, dataString);
      localStorage.setItem(this.SYNC_TIMESTAMP_KEY, Date.now().toString());
      
      console.log(`📊 Analytics data saved: ${data.length} records`);
    } catch (error) {
      console.error('Failed to save analytics data:', error);
      throw new Error('데이터 저장에 실패했습니다.');
    }
  }

  // 데이터 로드
  static loadAnalyticsData(): AnalyticsData[] {
    try {
      const stored = localStorage.getItem(this.ANALYTICS_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        console.log(`📊 Analytics data loaded: ${data.length} records`);
        return data;
      }
      
      // 메인 데이터가 없으면 백업에서 복원 시도
      return this.restoreFromBackup();
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      return this.restoreFromBackup();
    }
  }

  // 백업에서 복원
  static restoreFromBackup(): AnalyticsData[] {
    try {
      const backup = localStorage.getItem(this.BACKUP_KEY);
      if (backup) {
        const data = JSON.parse(backup);
        console.log(`🔄 Data restored from backup: ${data.length} records`);
        return data;
      }
      console.log('📭 No data found, starting fresh');
      return [];
    } catch (error) {
      console.error('Failed to restore from backup:', error);
      return [];
    }
  }

  // 새 응답 추가
  static addNewResponse(newResponse: AnalyticsData): void {
    const existingData = this.loadAnalyticsData();
    
    // 중복 체크 (sessionId 기준)
    const isDuplicate = existingData.some(item => item.sessionId === newResponse.sessionId);
    if (isDuplicate) {
      console.warn(`⚠️ Duplicate session ID detected: ${newResponse.sessionId}`);
      return;
    }

    const updatedData = [...existingData, newResponse];
    this.saveAnalyticsData(updatedData);
  }

  // 데이터 업데이트
  static updateResponse(sessionId: string, updatedData: Partial<AnalyticsData>): void {
    const existingData = this.loadAnalyticsData();
    const updatedArray = existingData.map(item => 
      item.sessionId === sessionId ? { ...item, ...updatedData } : item
    );
    this.saveAnalyticsData(updatedArray);
  }

  // 데이터 내보내기 (JSON)
  static exportToJSON(): string {
    const data = this.loadAnalyticsData();
    return JSON.stringify(data, null, 2);
  }

  // 데이터 가져오기 (JSON)
  static importFromJSON(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data)) {
        this.saveAnalyticsData(data);
        return true;
      }
      throw new Error('Invalid data format');
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // 데이터 통계
  static getDataStats(): {
    totalRecords: number;
    completedRecords: number;
    lastSyncTime: string;
    dataSize: string;
  } {
    const data = this.loadAnalyticsData();
    const lastSync = localStorage.getItem(this.SYNC_TIMESTAMP_KEY);
    const dataString = localStorage.getItem(this.ANALYTICS_KEY) || '';
    
    return {
      totalRecords: data.length,
      completedRecords: data.filter(item => item.completed).length,
      lastSyncTime: lastSync ? new Date(parseInt(lastSync)).toLocaleString() : '없음',
      dataSize: `${Math.round(dataString.length / 1024)} KB`
    };
  }

  // 데이터 초기화
  static clearAllData(): void {
    localStorage.removeItem(this.ANALYTICS_KEY);
    localStorage.removeItem(this.BACKUP_KEY);
    localStorage.removeItem(this.SYNC_TIMESTAMP_KEY);
    console.log('🗑️ All analytics data cleared');
  }

  // 클라우드 동기화를 위한 URL 생성 (브라우저 간 공유용)
  static generateShareableURL(): string {
    const data = this.loadAnalyticsData();
    const compressedData = JSON.stringify(data);
    
    // Base64 인코딩으로 URL에 포함 (실제 운영시에는 서버 업로드 권장)
    const encoded = btoa(compressedData);
    const baseUrl = window.location.origin + window.location.pathname;
    
    return `${baseUrl}?import=${encoded}`;
  }

  // URL에서 데이터 가져오기
  static importFromURL(): boolean {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const importData = urlParams.get('import');
      
      if (importData) {
        const decodedData = atob(importData);
        const success = this.importFromJSON(decodedData);
        
        if (success) {
          // URL에서 import 파라미터 제거
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
          console.log('📥 Data imported from URL successfully');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Failed to import from URL:', error);
      return false;
    }
  }

  // 데이터 무결성 검사
  static validateData(data: AnalyticsData[]): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (!Array.isArray(data)) {
      errors.push('데이터가 배열 형태가 아닙니다.');
      return { isValid: false, errors };
    }

    data.forEach((item, index) => {
      if (!item.sessionId) {
        errors.push(`${index + 1}번째 레코드: sessionId가 없습니다.`);
      }
      
      if (!item.startTime) {
        errors.push(`${index + 1}번째 레코드: startTime이 없습니다.`);
      }
      
      if (!Array.isArray(item.answers)) {
        errors.push(`${index + 1}번째 레코드: answers가 배열이 아닙니다.`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}