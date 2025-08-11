// Survey 프로젝트 전용 디바이스 정보 수집 시스템
// Landing 프로젝트와 동일한 구조로 포괄적인 디바이스 정보 수집

export interface ComprehensiveDeviceInfo {
  // 기본 디바이스 정보
  device: {
    type: 'mobile' | 'tablet' | 'desktop' | 'tv';
    brand?: string;
    model?: string;
    os?: string;
    osVersion?: string;
    browser?: string;
    browserVersion?: string;
    engine?: string;
  };
  
  // 하드웨어 정보
  hardware: {
    screenWidth: number;
    screenHeight: number;
    screenResolution: string;
    pixelRatio: number;
    colorDepth: number;
    touchSupport: boolean;
    maxTouchPoints: number;
    hardwareConcurrency: number;
    deviceMemory?: number; // Chrome only
  };
  
  // 네트워크 정보
  network: {
    connectionType?: string;
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  };
  
  // 위치 정보 (IP 기반)
  location: {
    ip?: string;
    country?: string;
    countryCode?: string;
    region?: string;
    regionCode?: string;
    city?: string;
    zipCode?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
    isp?: string;
    org?: string;
    asn?: string;
    proxy?: boolean;
    vpn?: boolean;
  };
  
  // 브라우저 능력
  capabilities: {
    cookieEnabled: boolean;
    doNotTrack: boolean;
    javaEnabled: boolean;
    webGL: boolean;
    webGLVendor?: string;
    webGLRenderer?: string;
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDB: boolean;
    webWorkers: boolean;
    serviceWorkers: boolean;
    pushNotifications: boolean;
    geolocation: boolean;
    camera?: boolean;
    microphone?: boolean;
  };
  
  // 기타 정보
  misc: {
    timezoneOffset: number;
    currentTime: string;
    referrer: string;
    onlineStatus: boolean;
    batteryLevel?: number;
    batteryCharging?: boolean;
    installedFonts?: string[];
    canvasFingerprint?: string;
    audioFingerprint?: string;
    sessionDuration?: number;
    visitCount?: number;
    adBlock?: boolean;
    cpuClass?: string;
    platform?: string;
    plugins?: string[];
    mimeTypes?: string[];
    languages?: string[];
    webdriver?: boolean;
    phantomJS?: boolean;
    selenium?: boolean;
  };
  
  // Survey 특화 정보
  survey: {
    entryPoint?: string;
    referralSource?: string;
    landingSessionId?: string;
    surveyVersion?: string;
  };
}

// User Agent 파싱 함수
function parseUserAgent(userAgent: string) {
  const device = {
    type: 'desktop' as 'mobile' | 'tablet' | 'desktop' | 'tv',
    brand: undefined as string | undefined,
    model: undefined as string | undefined,
    os: undefined as string | undefined,
    osVersion: undefined as string | undefined,
    browser: undefined as string | undefined,
    browserVersion: undefined as string | undefined,
    engine: undefined as string | undefined,
  };

  // 디바이스 타입 감지
  if (/Mobi|Android/i.test(userAgent)) {
    device.type = 'mobile';
  } else if (/Tablet|iPad/i.test(userAgent)) {
    device.type = 'tablet';
  }

  // 브라우저 감지
  if (userAgent.includes('Chrome')) {
    device.browser = 'Chrome';
    const chromeMatch = userAgent.match(/Chrome\/([0-9.]+)/);
    if (chromeMatch) device.browserVersion = chromeMatch[1];
    device.engine = 'Blink';
  } else if (userAgent.includes('Safari')) {
    device.browser = 'Safari';
    const safariMatch = userAgent.match(/Version\/([0-9.]+)/);
    if (safariMatch) device.browserVersion = safariMatch[1];
    device.engine = 'WebKit';
  } else if (userAgent.includes('Firefox')) {
    device.browser = 'Firefox';
    const firefoxMatch = userAgent.match(/Firefox\/([0-9.]+)/);
    if (firefoxMatch) device.browserVersion = firefoxMatch[1];
    device.engine = 'Gecko';
  } else if (userAgent.includes('Edge')) {
    device.browser = 'Edge';
    const edgeMatch = userAgent.match(/Edge\/([0-9.]+)/);
    if (edgeMatch) device.browserVersion = edgeMatch[1];
    device.engine = 'EdgeHTML';
  }

  // OS 감지
  if (userAgent.includes('Windows NT')) {
    device.os = 'Windows';
    const winMatch = userAgent.match(/Windows NT ([0-9.]+)/);
    if (winMatch) device.osVersion = winMatch[1];
  } else if (userAgent.includes('Mac OS X')) {
    device.os = 'macOS';
    const macMatch = userAgent.match(/Mac OS X ([0-9_]+)/);
    if (macMatch) device.osVersion = macMatch[1].replace(/_/g, '.');
  } else if (userAgent.includes('iPhone OS')) {
    device.os = 'iOS';
    device.brand = 'Apple';
    device.model = 'iPhone';
    const iosMatch = userAgent.match(/iPhone OS ([0-9_]+)/);
    if (iosMatch) device.osVersion = iosMatch[1].replace(/_/g, '.');
  } else if (userAgent.includes('iPad')) {
    device.os = 'iOS';
    device.brand = 'Apple';
    device.model = 'iPad';
    const iosMatch = userAgent.match(/OS ([0-9_]+)/);
    if (iosMatch) device.osVersion = iosMatch[1].replace(/_/g, '.');
  } else if (userAgent.includes('Android')) {
    device.os = 'Android';
    const androidMatch = userAgent.match(/Android ([0-9.]+)/);
    if (androidMatch) device.osVersion = androidMatch[1];
    
    // Android 디바이스 브랜드/모델 감지
    if (userAgent.includes('Samsung')) {
      device.brand = 'Samsung';
      const samsungMatch = userAgent.match(/Samsung[^;]*/);
      if (samsungMatch) device.model = samsungMatch[0];
    } else if (userAgent.includes('LG')) {
      device.brand = 'LG';
    } else if (userAgent.includes('Pixel')) {
      device.brand = 'Google';
      device.model = 'Pixel';
    }
  }

  return device;
}

// WebGL 정보 수집
function getWebGLInfo() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return { webGL: false };
    }

    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    return {
      webGL: true,
      webGLVendor: debugInfo ? (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : undefined,
      webGLRenderer: debugInfo ? (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : undefined,
    };
  } catch (e) {
    return { webGL: false };
  }
}

// Canvas 핑거프린트 생성
function generateCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';

    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Survey Canvas Fingerprint 🔍', 2, 2);
    
    return canvas.toDataURL().slice(-50); // 마지막 50자만 사용
  } catch (e) {
    return 'canvas-error';
  }
}

// Audio 핑거프린트 생성
function generateAudioFingerprint(): string {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const analyser = audioContext.createAnalyser();
    
    oscillator.connect(analyser);
    oscillator.frequency.value = 1000;
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    
    return Array.from(dataArray.slice(0, 10)).join('');
  } catch (e) {
    return 'audio-error';
  }
}

// 배터리 정보 수집
async function getBatteryInfo() {
  try {
    if ('getBattery' in navigator) {
      const battery = await (navigator as any).getBattery();
      return {
        batteryLevel: Math.round(battery.level * 100),
        batteryCharging: battery.charging,
      };
    }
  } catch (e) {
    // Battery API not supported
  }
  return {};
}

// 설치된 폰트 감지
function getInstalledFonts(): string[] {
  const fonts = [
    'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana',
    'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
    'Trebuchet MS', 'Arial Black', 'Impact', 'sans-serif', 'serif'
  ];
  
  const installedFonts: string[] = [];
  const testString = 'mmmmmmmmmmlli';
  const testSize = '72px';
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return [];
  
  // 기본 폰트로 측정
  context.font = testSize + ' sans-serif';
  const baseWidth = context.measureText(testString).width;
  
  fonts.forEach(font => {
    context.font = testSize + ' ' + font + ', sans-serif';
    const width = context.measureText(testString).width;
    if (width !== baseWidth) {
      installedFonts.push(font);
    }
  });
  
  return installedFonts;
}

// 위치 정보 수집 (IP 기반, 3단계 백업 + 캐싱)
async function getLocationInfo() {
  // 캐시 확인 (5분간 유효)
  const cacheKey = 'survey_cached_ip_location';
  const cacheExpiry = 'survey_cached_ip_location_expiry';
  const cached = sessionStorage.getItem(cacheKey);
  const expiry = sessionStorage.getItem(cacheExpiry);
  
  if (cached && expiry && new Date().getTime() < parseInt(expiry)) {
    console.log('✅ Survey 캐시된 IP 위치 정보 사용');
    return JSON.parse(cached);
  }

  const apis = [
    {
      url: 'https://ipapi.co/json/',
      parser: (data: any) => ({
        ip: data.ip,
        country: data.country_name,
        countryCode: data.country_code,
        region: data.region,
        regionCode: data.region_code,
        city: data.city,
        zipCode: data.postal,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        isp: data.org,
        org: data.org,
        asn: data.asn,
      })
    },
    {
      url: 'http://ip-api.com/json/',
      parser: (data: any) => ({
        ip: data.query,
        country: data.country,
        countryCode: data.countryCode,
        region: data.regionName,
        regionCode: data.region,
        city: data.city,
        zipCode: data.zip,
        latitude: data.lat,
        longitude: data.lon,
        timezone: data.timezone,
        isp: data.isp,
        org: data.org,
        asn: data.as,
      })
    },
    {
      url: 'https://api.ipify.org?format=json',
      parser: (data: any) => ({
        ip: data.ip,
      })
    }
  ];

  for (const api of apis) {
    try {
      const response = await fetch(api.url, { timeout: 5000 } as any);
      const data = await response.json();
      const locationInfo = api.parser(data);
      
      // 캐시에 저장 (5분간 유효)
      if (locationInfo.ip) {
        sessionStorage.setItem(cacheKey, JSON.stringify(locationInfo));
        sessionStorage.setItem(cacheExpiry, (new Date().getTime() + 5 * 60 * 1000).toString());
        console.log('✅ Survey IP 위치 정보 캐시 저장');
      }
      
      return locationInfo;
    } catch (error) {
      console.warn(`Failed to fetch from ${api.url}:`, error);
      continue;
    }
  }

  return {}; // 모든 API 실패 시 빈 객체 반환
}

// 권한 상태 확인
async function getPermissions() {
  const permissions = {
    camera: false,
    microphone: false,
    geolocation: false,
    pushNotifications: false,
  };

  try {
    if ('permissions' in navigator) {
      const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      permissions.camera = cameraPermission.state === 'granted';
      
      const microphonePermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      permissions.microphone = microphonePermission.state === 'granted';
      
      const geolocationPermission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      permissions.geolocation = geolocationPermission.state === 'granted';
      
      const notificationPermission = await navigator.permissions.query({ name: 'notifications' as PermissionName });
      permissions.pushNotifications = notificationPermission.state === 'granted';
    }
  } catch (e) {
    // Permissions API not supported
  }

  return permissions;
}

// 메인 디바이스 정보 수집 함수
export async function collectComprehensiveDeviceInfo(surveySpecific?: {
  entryPoint?: string;
  referralSource?: string;
  landingSessionId?: string;
  surveyVersion?: string;
}): Promise<ComprehensiveDeviceInfo> {
  const userAgent = navigator.userAgent;
  const device = parseUserAgent(userAgent);
  const webglInfo = getWebGLInfo();
  const batteryInfo = await getBatteryInfo();
  const locationInfo = await getLocationInfo();
  const permissions = await getPermissions();

  // 네트워크 정보
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  const deviceInfo: ComprehensiveDeviceInfo = {
    device,
    
    hardware: {
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      pixelRatio: window.devicePixelRatio || 1,
      colorDepth: window.screen.colorDepth,
      touchSupport: 'ontouchstart' in window,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      hardwareConcurrency: navigator.hardwareConcurrency || 1,
      deviceMemory: (navigator as any).deviceMemory,
    },
    
    network: {
      connectionType: connection?.type,
      effectiveType: connection?.effectiveType,
      downlink: connection?.downlink,
      rtt: connection?.rtt,
      saveData: connection?.saveData,
    },
    
    location: locationInfo,
    
    capabilities: {
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack === '1',
      javaEnabled: (navigator as any).javaEnabled ? (navigator as any).javaEnabled() : false,
      ...webglInfo,
      localStorage: !!window.localStorage,
      sessionStorage: !!window.sessionStorage,
      indexedDB: !!window.indexedDB,
      webWorkers: !!window.Worker,
      serviceWorkers: 'serviceWorker' in navigator,
      ...permissions,
    },
    
    misc: {
      timezoneOffset: new Date().getTimezoneOffset(),
      currentTime: new Date().toISOString(),
      referrer: document.referrer,
      onlineStatus: navigator.onLine,
      ...batteryInfo,
      installedFonts: getInstalledFonts(),
      canvasFingerprint: generateCanvasFingerprint(),
      audioFingerprint: generateAudioFingerprint(),
      languages: navigator.languages ? Array.from(navigator.languages) : [navigator.language],
      platform: navigator.platform,
      plugins: Array.from(navigator.plugins).map(p => p.name),
      mimeTypes: Array.from(navigator.mimeTypes).map(m => m.type),
      webdriver: (navigator as any).webdriver,
      phantomJS: !!(window as any).callPhantom,
      selenium: !!(window as any).selenium,
    },
    
    survey: {
      entryPoint: surveySpecific?.entryPoint || 'direct',
      referralSource: surveySpecific?.referralSource || 'direct',
      landingSessionId: surveySpecific?.landingSessionId,
      surveyVersion: surveySpecific?.surveyVersion || '1.0',
    },
  };

  return deviceInfo;
}

// 디바이스 정보를 간단한 문자열로 요약
export function summarizeDeviceInfo(deviceInfo: ComprehensiveDeviceInfo): string {
  const { device, hardware, location } = deviceInfo;
  
  const deviceStr = device.brand && device.model 
    ? `${device.brand} ${device.model}` 
    : device.browser || 'Unknown';
  
  const locationStr = location.city && location.country
    ? `${location.city}, ${location.country}`
    : location.country || 'Unknown';
  
  const screenStr = `${hardware.screenWidth}x${hardware.screenHeight}`;
  
  return `${deviceStr} | ${device.os} | ${screenStr} | ${locationStr}`;
}

// 세션 ID 생성 (Landing용)
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `landing_${timestamp}_${random}`;
}

// Survey와 호환성을 위한 별칭
export const generateSurveySessionId = generateSessionId;

// 세션 스토리지에서 기존 세션 정보 확인
export function getExistingSession(): string | null {
  try {
    return sessionStorage.getItem('sessionId');
  } catch (e) {
    return null;
  }
}

// Survey와 호환성을 위한 별칭
export const getExistingSurveySession = getExistingSession;

// 세션 ID를 세션 스토리지에 저장
export function saveSessionId(sessionId: string): void {
  try {
    sessionStorage.setItem('sessionId', sessionId);
  } catch (e) {
    console.warn('Failed to save session ID to sessionStorage');
  }
}

// Survey와 호환성을 위한 별칭
export const saveSurveySessionId = saveSessionId;

const deviceDetection = {
  collectComprehensiveDeviceInfo,
  summarizeDeviceInfo,
  generateSurveySessionId,
  getExistingSurveySession,
  saveSurveySessionId,
};

export default deviceDetection;