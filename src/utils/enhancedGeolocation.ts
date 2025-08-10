// 향상된 지오로케이션 서비스 - 하이브리드 접근법
// HTML5 Geolocation API + 여러 IP 서비스 조합

export interface EnhancedLocationInfo {
  // 기본 위치 정보
  latitude: number;
  longitude: number;
  accuracy: number; // 미터 단위
  
  // 주소 정보
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  city: string;
  district?: string; // 구/군
  zipCode: string;
  
  // 네트워크 정보
  ip: string;
  isp: string;
  org: string;
  asn: string;
  
  // 메타 정보
  timezone: string;
  currency?: string;
  languages?: string[];
  
  // 신뢰도 정보
  source: 'gps' | 'wifi' | 'cell' | 'ip' | 'hybrid';
  confidence: 'high' | 'medium' | 'low';
  isVPN: boolean;
  isProxy: boolean;
  isMobile: boolean;
  
  // 추가 정보
  timestamp: number;
  cached: boolean;
}

export class EnhancedGeolocation {
  private static instance: EnhancedGeolocation;
  private cachedLocation: EnhancedLocationInfo | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10분
  
  private constructor() {}
  
  public static getInstance(): EnhancedGeolocation {
    if (!EnhancedGeolocation.instance) {
      EnhancedGeolocation.instance = new EnhancedGeolocation();
    }
    return EnhancedGeolocation.instance;
  }
  
  // 메인 위치 정보 획득 메서드
  public async getLocation(options?: {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
    fallbackToIP?: boolean;
  }): Promise<EnhancedLocationInfo> {
    const opts = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      fallbackToIP: true,
      ...options
    };
    
    // 캐시 확인
    if (this.cachedLocation && Date.now() < this.cacheExpiry) {
      console.log('📍 캐시된 위치 정보 사용');
      return { ...this.cachedLocation, cached: true };
    }
    
    let location: EnhancedLocationInfo | null = null;
    
    // 1단계: HTML5 Geolocation API 시도 (가장 정확함)
    if ('geolocation' in navigator) {
      try {
        location = await this.getBrowserLocation(opts);
        console.log('✅ 브라우저 위치 정보 획득 성공');
      } catch (error) {
        console.warn('브라우저 위치 정보 획득 실패:', error);
      }
    }
    
    // 2단계: IP 기반 위치 정보로 폴백 또는 보완
    if (!location && opts.fallbackToIP) {
      location = await this.getIPLocation();
      console.log('📍 IP 기반 위치 정보 사용');
    } else if (location && opts.fallbackToIP) {
      // 브라우저 위치 정보를 IP 정보로 보완
      const ipInfo = await this.getIPLocation();
      location = this.mergeLocationData(location, ipInfo);
      console.log('🔄 하이브리드 위치 정보 생성');
    }
    
    // 기본값 제공
    if (!location) {
      location = this.getDefaultLocation();
    }
    
    // 캐시 저장
    this.cachedLocation = location;
    this.cacheExpiry = Date.now() + this.CACHE_DURATION;
    
    return location;
  }
  
  // HTML5 Geolocation API 사용
  private async getBrowserLocation(options: any): Promise<EnhancedLocationInfo> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          // 역지오코딩으로 주소 정보 획득
          const addressInfo = await this.reverseGeocode(latitude, longitude);
          
          resolve({
            latitude,
            longitude,
            accuracy: accuracy || 10,
            ...addressInfo,
            source: this.determineSource(accuracy),
            confidence: this.determineConfidence(accuracy),
            timestamp: position.timestamp,
            cached: false
          } as EnhancedLocationInfo);
        },
        (error) => {
          console.error('Geolocation 에러:', error.message);
          reject(error);
        },
        {
          enableHighAccuracy: options.enableHighAccuracy,
          timeout: options.timeout,
          maximumAge: options.maximumAge
        }
      );
    });
  }
  
  // 여러 IP 서비스를 조합한 위치 정보 획득
  private async getIPLocation(): Promise<EnhancedLocationInfo> {
    const services = [
      this.getIPInfoLocation,    // IPinfo.io (가장 정확)
      this.getIPAPILocation,      // ipapi.is (두번째로 정확)
      this.getIPDataLocation,     // ipdata.co
      this.getFreeIPAPILocation   // ip-api.com (무료 백업)
    ];
    
    for (const service of services) {
      try {
        const location = await service.call(this);
        if (location && location.latitude !== 0) {
          return location;
        }
      } catch (error) {
        console.warn('IP 서비스 실패:', error);
        continue;
      }
    }
    
    return this.getDefaultLocation();
  }
  
  // IPinfo.io 서비스 (가장 정확 - 무료 50k 요청/월)
  private async getIPInfoLocation(): Promise<EnhancedLocationInfo> {
    // 무료 토큰 (실제 프로덕션에서는 환경변수 사용)
    const token = process.env.REACT_APP_IPINFO_TOKEN || 'free';
    const url = token === 'free' 
      ? 'https://ipinfo.io/json' 
      : `https://ipinfo.io/json?token=${token}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('IPinfo 요청 실패');
    
    const data = await response.json();
    const [lat, lon] = data.loc ? data.loc.split(',').map(Number) : [0, 0];
    
    return {
      latitude: lat,
      longitude: lon,
      accuracy: 50000, // IP 기반은 정확도 낮음
      country: data.country || 'Unknown',
      countryCode: data.country || 'XX',
      region: data.region || 'Unknown',
      regionCode: data.region || 'XX',
      city: data.city || 'Unknown',
      zipCode: data.postal || 'Unknown',
      ip: data.ip || '0.0.0.0',
      isp: data.org || 'Unknown',
      org: data.org || 'Unknown',
      asn: data.asn || 'Unknown',
      timezone: data.timezone || 'UTC',
      source: 'ip',
      confidence: 'low',
      isVPN: false,
      isProxy: false,
      isMobile: data.org?.toLowerCase().includes('mobile') || false,
      timestamp: Date.now(),
      cached: false
    };
  }
  
  // ipapi.is 서비스 (비용 효율적)
  private async getIPAPILocation(): Promise<EnhancedLocationInfo> {
    const response = await fetch('https://api.ipapi.is/');
    if (!response.ok) throw new Error('ipapi.is 요청 실패');
    
    const data = await response.json();
    
    return {
      latitude: data.location?.latitude || 0,
      longitude: data.location?.longitude || 0,
      accuracy: 50000,
      country: data.location?.country || 'Unknown',
      countryCode: data.location?.country_code || 'XX',
      region: data.location?.state || 'Unknown',
      regionCode: data.location?.state_code || 'XX',
      city: data.location?.city || 'Unknown',
      zipCode: data.location?.zip || 'Unknown',
      ip: data.ip || '0.0.0.0',
      isp: data.asn?.org || 'Unknown',
      org: data.company?.name || 'Unknown',
      asn: data.asn?.asn || 'Unknown',
      timezone: data.location?.timezone || 'UTC',
      currency: data.location?.currency,
      languages: data.location?.languages,
      source: 'ip',
      confidence: 'low',
      isVPN: data.is_vpn || false,
      isProxy: data.is_proxy || false,
      isMobile: data.is_mobile || false,
      timestamp: Date.now(),
      cached: false
    };
  }
  
  // ipdata.co 서비스
  private async getIPDataLocation(): Promise<EnhancedLocationInfo> {
    const apiKey = process.env.REACT_APP_IPDATA_KEY || 'test';
    const response = await fetch(`https://api.ipdata.co?api-key=${apiKey}`);
    if (!response.ok) throw new Error('ipdata 요청 실패');
    
    const data = await response.json();
    
    return {
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      accuracy: 50000,
      country: data.country_name || 'Unknown',
      countryCode: data.country_code || 'XX',
      region: data.region || 'Unknown',
      regionCode: data.region_code || 'XX',
      city: data.city || 'Unknown',
      zipCode: data.postal || 'Unknown',
      ip: data.ip || '0.0.0.0',
      isp: data.asn?.name || 'Unknown',
      org: data.asn?.name || 'Unknown',
      asn: data.asn?.asn || 'Unknown',
      timezone: data.time_zone?.name || 'UTC',
      currency: data.currency?.code,
      languages: data.languages?.map((l: any) => l.name),
      source: 'ip',
      confidence: 'low',
      isVPN: data.threat?.is_vpn || false,
      isProxy: data.threat?.is_proxy || false,
      isMobile: false,
      timestamp: Date.now(),
      cached: false
    };
  }
  
  // 무료 백업 서비스
  private async getFreeIPAPILocation(): Promise<EnhancedLocationInfo> {
    // HTTPS 지원 무료 서비스
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) throw new Error('무료 IP API 요청 실패');
    
    const data = await response.json();
    
    return {
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      accuracy: 50000,
      country: data.country_name || 'Unknown',
      countryCode: data.country_code || 'XX',
      region: data.region || 'Unknown',
      regionCode: data.region_code || 'XX',
      city: data.city || 'Unknown',
      zipCode: data.postal || 'Unknown',
      ip: data.ip || '0.0.0.0',
      isp: data.org || 'Unknown',
      org: data.org || 'Unknown',
      asn: data.asn || 'Unknown',
      timezone: data.timezone || 'UTC',
      currency: data.currency,
      languages: data.languages ? data.languages.split(',') : [],
      source: 'ip',
      confidence: 'low',
      isVPN: false,
      isProxy: false,
      isMobile: false,
      timestamp: Date.now(),
      cached: false
    };
  }
  
  // 역지오코딩 (좌표 -> 주소)
  private async reverseGeocode(lat: number, lon: number): Promise<Partial<EnhancedLocationInfo>> {
    try {
      // Nominatim OpenStreetMap API (무료)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ko`
      );
      
      if (!response.ok) throw new Error('역지오코딩 실패');
      
      const data = await response.json();
      const address = data.address || {};
      
      return {
        country: address.country || 'Unknown',
        countryCode: address.country_code?.toUpperCase() || 'XX',
        region: address.state || address.province || 'Unknown',
        city: address.city || address.town || address.village || 'Unknown',
        district: address.suburb || address.district,
        zipCode: address.postcode || 'Unknown'
      };
    } catch (error) {
      console.warn('역지오코딩 실패:', error);
      return {};
    }
  }
  
  // 위치 정보 병합 (브라우저 + IP)
  private mergeLocationData(
    browserLocation: EnhancedLocationInfo,
    ipLocation: EnhancedLocationInfo
  ): EnhancedLocationInfo {
    return {
      // 브라우저에서 얻은 정확한 좌표 사용
      latitude: browserLocation.latitude,
      longitude: browserLocation.longitude,
      accuracy: browserLocation.accuracy,
      
      // IP에서 얻은 네트워크 정보 사용
      ip: ipLocation.ip,
      isp: ipLocation.isp,
      org: ipLocation.org,
      asn: ipLocation.asn,
      
      // 브라우저 정보가 있으면 우선 사용, 없으면 IP 정보 사용
      country: browserLocation.country !== 'Unknown' ? browserLocation.country : ipLocation.country,
      countryCode: browserLocation.countryCode !== 'XX' ? browserLocation.countryCode : ipLocation.countryCode,
      region: browserLocation.region !== 'Unknown' ? browserLocation.region : ipLocation.region,
      regionCode: browserLocation.regionCode !== 'XX' ? browserLocation.regionCode : ipLocation.regionCode,
      city: browserLocation.city !== 'Unknown' ? browserLocation.city : ipLocation.city,
      district: browserLocation.district || ipLocation.district,
      zipCode: browserLocation.zipCode !== 'Unknown' ? browserLocation.zipCode : ipLocation.zipCode,
      
      // 메타 정보
      timezone: browserLocation.timezone || ipLocation.timezone,
      currency: ipLocation.currency,
      languages: ipLocation.languages,
      
      // 신뢰도 정보
      source: 'hybrid',
      confidence: browserLocation.confidence,
      isVPN: ipLocation.isVPN,
      isProxy: ipLocation.isProxy,
      isMobile: ipLocation.isMobile,
      
      timestamp: Date.now(),
      cached: false
    };
  }
  
  // 정확도 기반 소스 판단
  private determineSource(accuracy: number): EnhancedLocationInfo['source'] {
    if (accuracy <= 10) return 'gps';
    if (accuracy <= 100) return 'wifi';
    if (accuracy <= 1000) return 'cell';
    return 'ip';
  }
  
  // 정확도 기반 신뢰도 판단
  private determineConfidence(accuracy: number): EnhancedLocationInfo['confidence'] {
    if (accuracy <= 100) return 'high';
    if (accuracy <= 1000) return 'medium';
    return 'low';
  }
  
  // 기본 위치 정보 (실패 시)
  private getDefaultLocation(): EnhancedLocationInfo {
    return {
      latitude: 37.5665, // 서울 기본 좌표
      longitude: 126.9780,
      accuracy: 100000,
      country: 'South Korea',
      countryCode: 'KR',
      region: 'Seoul',
      regionCode: 'SEO',
      city: 'Seoul',
      zipCode: '00000',
      ip: '0.0.0.0',
      isp: 'Unknown',
      org: 'Unknown',
      asn: 'Unknown',
      timezone: 'Asia/Seoul',
      source: 'ip',
      confidence: 'low',
      isVPN: false,
      isProxy: false,
      isMobile: false,
      timestamp: Date.now(),
      cached: false
    };
  }
  
  // 한국 특화 개선 메서드
  public async getKoreanLocation(): Promise<EnhancedLocationInfo> {
    const location = await this.getLocation();
    
    // 한국인 경우 추가 처리
    if (location.countryCode === 'KR') {
      // 한국 통신사 감지
      const koreanISPs = ['SK Broadband', 'KT Corporation', 'LG DACOM', 'SK Telecom', 'LG U+'];
      const isKoreanMobile = koreanISPs.some(isp => 
        location.isp.toLowerCase().includes(isp.toLowerCase())
      );
      
      if (isKoreanMobile) {
        location.isMobile = true;
        location.confidence = 'low'; // 한국 모바일 네트워크는 정확도 낮음
        console.warn('⚠️ 한국 모바일 네트워크 감지 - 정확도 낮음');
      }
      
      // 구/군 정보 추가 파싱
      if (location.city && location.city.includes(' ')) {
        const parts = location.city.split(' ');
        if (parts.length > 1) {
          location.district = parts[1];
        }
      }
    }
    
    return location;
  }
  
  // 정확도 통계 반환
  public getAccuracyStats(): {
    source: string;
    confidence: string;
    accuracyMeters: number;
    expectedError: string;
  } {
    if (!this.cachedLocation) {
      return {
        source: 'none',
        confidence: 'none',
        accuracyMeters: 0,
        expectedError: '위치 정보 없음'
      };
    }
    
    const location = this.cachedLocation;
    let expectedError = '';
    
    switch (location.source) {
      case 'gps':
        expectedError = '5-10m 이내';
        break;
      case 'wifi':
        expectedError = '10-100m 이내';
        break;
      case 'cell':
        expectedError = '100m-1km 이내';
        break;
      case 'ip':
        expectedError = '도시 수준 (10-50km)';
        break;
      case 'hybrid':
        expectedError = '상황에 따라 다름';
        break;
    }
    
    return {
      source: location.source,
      confidence: location.confidence,
      accuracyMeters: location.accuracy,
      expectedError
    };
  }
}

// 싱글톤 인스턴스 export
export const enhancedGeolocation = EnhancedGeolocation.getInstance();