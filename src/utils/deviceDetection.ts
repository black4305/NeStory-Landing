// 포괄적인 디바이스 및 위치 정보 수집 시스템

export interface ComprehensiveDeviceInfo {
  // 기본 정보
  userAgent: string;
  platform: string;
  language: string;
  languages: string[];
  
  // 디바이스 정보
  device: {
    type: 'mobile' | 'tablet' | 'desktop' | 'tv' | 'unknown';
    brand: string; // Apple, Samsung, Google, etc.
    model: string; // iPhone 15 Pro, Galaxy S24, etc.
    os: string; // iOS, Android, Windows, macOS, etc.
    osVersion: string;
    browser: string; // Chrome, Safari, Firefox, etc.
    browserVersion: string;
    engine: string; // WebKit, Blink, Gecko, etc.
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
    hardwareConcurrency: number; // CPU 코어 수
    deviceMemory?: number; // RAM (GB) - Chrome only
  };

  // 네트워크 정보
  network: {
    connectionType?: string; // wifi, cellular, ethernet, etc.
    effectiveType?: string; // 4g, 3g, 2g, slow-2g
    downlink?: number; // Mbps
    rtt?: number; // Round Trip Time (ms)
    saveData?: boolean; // Data Saver 모드
  };

  // 위치 정보 (IP 기반)
  location: {
    ip: string;
    country: string;
    countryCode: string;
    region: string;
    regionCode: string;
    city: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    timezone: string;
    isp: string; // 통신사/ISP
    org: string; // 조직/회사
    asn: string; // AS Number
    proxy: boolean;
    vpn: boolean;
  };

  // 브라우저 능력
  capabilities: {
    cookieEnabled: boolean;
    doNotTrack: boolean;
    javaEnabled: boolean;
    webGL: boolean;
    webGLVendor: string;
    webGLRenderer: string;
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDB: boolean;
    webWorkers: boolean;
    serviceWorkers: boolean;
    pushNotifications: boolean;
    geolocation: boolean;
    camera: boolean;
    microphone: boolean;
  };

  // 기타 정보
  misc: {
    timezoneOffset: number;
    currentTime: string;
    referrer: string;
    onlineStatus: boolean;
    batteryLevel?: number;
    batteryCharging?: boolean;
    installedFonts: string[];
    canvasFingerprint: string;
    audioFingerprint: string;
    
    // 추가 정보
    sessionDuration?: number; // 세션 지속 시간
    visitCount?: number; // 방문 횟수
    lastVisit?: string; // 마지막 방문
    adBlock?: boolean; // 광고 차단기 사용 여부
    cpuClass?: string; // CPU 클래스
    oscpu?: string; // OS CPU
    buildID?: string; // 빌드 ID
    product?: string; // 제품명
    productSub?: string; // 제품 서브
    vendor?: string; // 벤더
    vendorSub?: string; // 벤더 서브
    webdriver?: boolean; // 웹드라이버 사용 여부
    pdfViewerEnabled?: boolean; // PDF 뷰어 지원
    mozApps?: boolean; // Firefox 앱 지원
    mozConnection?: boolean; // Firefox 연결 지원
  };
}

class DeviceDetection {
  private deviceInfo: ComprehensiveDeviceInfo | null = null;

  // User Agent 파싱하여 디바이스 정보 추출
  private parseUserAgent(ua: string): ComprehensiveDeviceInfo['device'] {
    const device: ComprehensiveDeviceInfo['device'] = {
      type: 'desktop',
      brand: 'Unknown',
      model: 'Unknown',
      os: 'Unknown',
      osVersion: 'Unknown',
      browser: 'Unknown',
      browserVersion: 'Unknown',
      engine: 'Unknown'
    };

    // OS 감지
    if (/Windows NT/i.test(ua)) {
      device.os = 'Windows';
      const winVersion = ua.match(/Windows NT ([\d.]+)/);
      if (winVersion) {
        const versions: { [key: string]: string } = {
          '10.0': '10/11',
          '6.3': '8.1',
          '6.2': '8',
          '6.1': '7'
        };
        device.osVersion = versions[winVersion[1]] || winVersion[1];
      }
    } else if (/Mac OS X/i.test(ua)) {
      device.os = 'macOS';
      const macVersion = ua.match(/Mac OS X ([\d_]+)/);
      if (macVersion) {
        device.osVersion = macVersion[1].replace(/_/g, '.');
      }
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
      device.type = /iPad/i.test(ua) ? 'tablet' : 'mobile';
      device.brand = 'Apple';
      device.os = 'iOS';
      
      // iPhone 모델 감지
      if (/iPhone/i.test(ua)) {
        const iphoneModels: { [key: string]: string } = {
          'iPhone14,2': 'iPhone 13 Pro',
          'iPhone14,3': 'iPhone 13 Pro Max',
          'iPhone14,4': 'iPhone 13 mini',
          'iPhone14,5': 'iPhone 13',
          'iPhone15,2': 'iPhone 14 Pro',
          'iPhone15,3': 'iPhone 14 Pro Max',
          'iPhone15,4': 'iPhone 14',
          'iPhone15,5': 'iPhone 14 Plus',
          'iPhone16,1': 'iPhone 15 Pro',
          'iPhone16,2': 'iPhone 15 Pro Max'
        };
        
        const modelMatch = ua.match(/iPhone[\d,]+/);
        device.model = modelMatch ? (iphoneModels[modelMatch[0]] || modelMatch[0]) : 'iPhone';
      } else if (/iPad/i.test(ua)) {
        device.model = 'iPad';
      }

      const iosVersion = ua.match(/OS ([\d_]+)/);
      if (iosVersion) {
        device.osVersion = iosVersion[1].replace(/_/g, '.');
      }
    } else if (/Android/i.test(ua)) {
      device.type = /Mobile/i.test(ua) ? 'mobile' : 'tablet';
      device.os = 'Android';
      
      const androidVersion = ua.match(/Android ([\d.]+)/);
      if (androidVersion) {
        device.osVersion = androidVersion[1];
      }

      // 브랜드 감지
      const brands: { [key: string]: string } = {
        'Samsung': 'Samsung',
        'SM-': 'Samsung Galaxy',
        'LG-': 'LG',
        'HTC': 'HTC',
        'HUAWEI': 'Huawei',
        'Pixel': 'Google Pixel',
        'OnePlus': 'OnePlus',
        'Xiaomi': 'Xiaomi'
      };

      for (const [key, brand] of Object.entries(brands)) {
        if (ua.includes(key)) {
          device.brand = brand;
          break;
        }
      }

      // 모델명 추출
      const modelMatch = ua.match(/(?:SM-\w+|LG-\w+|Pixel \d+|OnePlus \w+)/);
      if (modelMatch) {
        device.model = modelMatch[0];
      }
    } else if (/Linux/i.test(ua)) {
      device.os = 'Linux';
    }

    // 브라우저 감지
    if (/Chrome/i.test(ua) && !/Chromium/i.test(ua)) {
      device.browser = 'Chrome';
      const chromeVersion = ua.match(/Chrome\/([\d.]+)/);
      if (chromeVersion) device.browserVersion = chromeVersion[1];
      device.engine = 'Blink';
    } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
      device.browser = 'Safari';
      const safariVersion = ua.match(/Safari\/([\d.]+)/);
      if (safariVersion) device.browserVersion = safariVersion[1];
      device.engine = 'WebKit';
    } else if (/Firefox/i.test(ua)) {
      device.browser = 'Firefox';
      const firefoxVersion = ua.match(/Firefox\/([\d.]+)/);
      if (firefoxVersion) device.browserVersion = firefoxVersion[1];
      device.engine = 'Gecko';
    } else if (/Edge/i.test(ua)) {
      device.browser = 'Edge';
      const edgeVersion = ua.match(/Edge\/([\d.]+)/);
      if (edgeVersion) device.browserVersion = edgeVersion[1];
      device.engine = 'EdgeHTML';
    }

    // 디바이스 타입 재분류 (화면 크기 기반)
    const width = window.screen.width;
    if (width <= 768) {
      device.type = 'mobile';
    } else if (width <= 1024) {
      device.type = 'tablet';
    } else {
      device.type = 'desktop';
    }

    return device;
  }

  // 하드웨어 정보 수집
  private getHardwareInfo(): ComprehensiveDeviceInfo['hardware'] {
    return {
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      pixelRatio: window.devicePixelRatio || 1,
      colorDepth: window.screen.colorDepth,
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      hardwareConcurrency: navigator.hardwareConcurrency || 1,
      deviceMemory: (navigator as any).deviceMemory
    };
  }

  // 네트워크 정보 수집
  private getNetworkInfo(): ComprehensiveDeviceInfo['network'] {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    return {
      connectionType: connection?.type,
      effectiveType: connection?.effectiveType,
      downlink: connection?.downlink,
      rtt: connection?.rtt,
      saveData: connection?.saveData
    };
  }

  // 브라우저 능력 확인
  private async getCapabilities(): Promise<ComprehensiveDeviceInfo['capabilities']> {
    const capabilities = {
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack === '1',
      javaEnabled: (navigator as any).javaEnabled?.() || false,
      webGL: false,
      webGLVendor: '',
      webGLRenderer: '',
      localStorage: false,
      sessionStorage: false,
      indexedDB: false,
      webWorkers: false,
      serviceWorkers: false,
      pushNotifications: false,
      geolocation: false,
      camera: false,
      microphone: false
    };

    // WebGL 확인
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') as WebGLRenderingContext || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
      if (gl) {
        capabilities.webGL = true;
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          capabilities.webGLVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
          capabilities.webGLRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
      }
    } catch (e) {
      // WebGL not supported
    }

    // Storage 확인
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      capabilities.localStorage = true;
    } catch (e) {
      capabilities.localStorage = false;
    }

    try {
      sessionStorage.setItem('test', 'test');
      sessionStorage.removeItem('test');
      capabilities.sessionStorage = true;
    } catch (e) {
      capabilities.sessionStorage = false;
    }

    // 기타 API 확인
    capabilities.indexedDB = !!window.indexedDB;
    capabilities.webWorkers = !!window.Worker;
    capabilities.serviceWorkers = 'serviceWorker' in navigator;
    capabilities.pushNotifications = 'PushManager' in window;
    capabilities.geolocation = 'geolocation' in navigator;

    // 미디어 권한 확인
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        capabilities.camera = devices.some(device => device.kind === 'videoinput');
        capabilities.microphone = devices.some(device => device.kind === 'audioinput');
      } catch (e) {
        // Permission denied or not available
      }
    }

    return capabilities;
  }

  // 위치 정보 수집 (여러 API 사용)
  private async getLocationInfo(): Promise<ComprehensiveDeviceInfo['location']> {
    const defaultLocation = {
      ip: '0.0.0.0',
      country: 'Unknown',
      countryCode: 'XX',
      region: 'Unknown',
      regionCode: 'XX',
      city: 'Unknown',
      zipCode: 'Unknown',
      latitude: 0,
      longitude: 0,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      isp: 'Unknown',
      org: 'Unknown',
      asn: 'Unknown',
      proxy: false,
      vpn: false
    };
    
    // 캐시 확인 (5분간 유효)
    const cacheKey = 'cached_ip_location';
    const cacheExpiry = 'cached_ip_location_expiry';
    const cached = sessionStorage.getItem(cacheKey);
    const expiry = sessionStorage.getItem(cacheExpiry);
    
    if (cached && expiry && new Date().getTime() < parseInt(expiry)) {
      console.log('✅ 캐시된 IP 위치 정보 사용');
      return JSON.parse(cached);
    }

    try {
      // 1차: ipapi.co (무료, 상세 정보)
      const response1 = await fetch('https://ipapi.co/json/');
      if (response1.ok) {
        const data = await response1.json();
        const locationInfo = {
          ip: data.ip || defaultLocation.ip,
          country: data.country_name || defaultLocation.country,
          countryCode: data.country_code || defaultLocation.countryCode,
          region: data.region || defaultLocation.region,
          regionCode: data.region_code || defaultLocation.regionCode,
          city: data.city || defaultLocation.city,
          zipCode: data.postal || defaultLocation.zipCode,
          latitude: data.latitude || defaultLocation.latitude,
          longitude: data.longitude || defaultLocation.longitude,
          timezone: data.timezone || defaultLocation.timezone,
          isp: data.org || defaultLocation.isp,
          org: data.org || defaultLocation.org,
          asn: data.asn || defaultLocation.asn,
          proxy: false,
          vpn: false
        };
        
        // 캐시에 저장 (5분간 유효)
        sessionStorage.setItem(cacheKey, JSON.stringify(locationInfo));
        sessionStorage.setItem(cacheExpiry, (new Date().getTime() + 5 * 60 * 1000).toString());
        console.log('✅ IP 위치 정보 캐시 저장');
        
        return locationInfo;
      }
    } catch (error) {
      console.warn('ipapi.co failed, trying backup services');
    }

    try {
      // 2차: ip-api.com (무료, 통신사 정보 포함)
      const response2 = await fetch('http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,proxy,query');
      if (response2.ok) {
        const data = await response2.json();
        if (data.status === 'success') {
          const locationInfo = {
            ip: data.query || defaultLocation.ip,
            country: data.country || defaultLocation.country,
            countryCode: data.countryCode || defaultLocation.countryCode,
            region: data.regionName || defaultLocation.region,
            regionCode: data.region || defaultLocation.regionCode,
            city: data.city || defaultLocation.city,
            zipCode: data.zip || defaultLocation.zipCode,
            latitude: data.lat || defaultLocation.latitude,
            longitude: data.lon || defaultLocation.longitude,
            timezone: data.timezone || defaultLocation.timezone,
            isp: data.isp || defaultLocation.isp,
            org: data.org || defaultLocation.org,
            asn: data.as || defaultLocation.asn,
            proxy: data.proxy || false,
            vpn: false
          };
          
          // 캐시에 저장 (5분간 유효)
          sessionStorage.setItem(cacheKey, JSON.stringify(locationInfo));
          sessionStorage.setItem(cacheExpiry, (new Date().getTime() + 5 * 60 * 1000).toString());
          console.log('✅ IP 위치 정보 캐시 저장 (백업 API)');
          
          return locationInfo;
        }
      }
    } catch (error) {
      console.warn('ip-api.com failed, trying final backup');
    }

    try {
      // 3차: ipify.org (기본 IP만)
      const response3 = await fetch('https://api.ipify.org?format=json');
      if (response3.ok) {
        const data = await response3.json();
        return {
          ...defaultLocation,
          ip: data.ip
        };
      }
    } catch (error) {
      console.error('All IP services failed');
    }

    return defaultLocation;
  }

  // Canvas 핑거프린팅
  private getCanvasFingerprint(): string {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return 'no-canvas';

      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint canvas 🎯', 2, 2);
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.fillRect(100, 100, 200, 100);
      
      return canvas.toDataURL().slice(-50); // 마지막 50자리만
    } catch (e) {
      return 'canvas-error';
    }
  }

  // Audio 핑거프린팅
  private getAudioFingerprint(): string {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const analyser = audioContext.createAnalyser();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(analyser);
      analyser.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      return audioContext.sampleRate.toString() + analyser.frequencyBinCount.toString();
    } catch (e) {
      return 'audio-error';
    }
  }

  // 설치된 폰트 감지
  private getInstalledFonts(): string[] {
    const fonts = [
      'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Palatino',
      'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact',
      'Malgun Gothic', 'Gulim', 'Dotum', 'Batang', 'Gungsuh', 'NanumGothic'
    ];
    
    const availableFonts: string[] = [];
    const testString = 'mmmmmmmmmmlli';
    const testSize = '72px';
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return [];
    
    canvas.width = 2000;
    canvas.height = 200;
    
    const baseWidths: { [key: string]: number } = {};
    
    for (const baseFont of baseFonts) {
      context.font = testSize + ' ' + baseFont;
      baseWidths[baseFont] = context.measureText(testString).width;
    }
    
    for (const font of fonts) {
      let detected = false;
      for (const baseFont of baseFonts) {
        context.font = testSize + ' ' + font + ',' + baseFont;
        const width = context.measureText(testString).width;
        if (width !== baseWidths[baseFont]) {
          detected = true;
          break;
        }
      }
      if (detected) {
        availableFonts.push(font);
      }
    }
    
    return availableFonts;
  }

  // 배터리 정보 수집
  private async getBatteryInfo(): Promise<{ level?: number; charging?: boolean }> {
    try {
      if ('getBattery' in navigator) {
        const battery = await (navigator as any).getBattery();
        return {
          level: Math.round(battery.level * 100),
          charging: battery.charging
        };
      }
    } catch (e) {
      // Battery API not supported
    }
    return {};
  }

  // 광고 차단기 감지
  private async detectAdBlocker(): Promise<boolean> {
    try {
      // 광고 관련 요소 생성 테스트
      const adElement = document.createElement('div');
      adElement.innerHTML = '&nbsp;';
      adElement.className = 'adsbox';
      adElement.style.position = 'absolute';
      adElement.style.left = '-10000px';
      document.body.appendChild(adElement);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const detected = adElement.offsetHeight === 0;
      document.body.removeChild(adElement);
      
      return detected;
    } catch (e) {
      return false;
    }
  }

  // 방문 기록 관리
  private getVisitInfo(): { visitCount: number; lastVisit?: string; sessionDuration: number } {
    const sessionStart = sessionStorage.getItem('sessionStart') || Date.now().toString();
    const visitCount = parseInt(localStorage.getItem('visitCount') || '0') + 1;
    const lastVisit = localStorage.getItem('lastVisit');
    
    // 현재 방문 정보 저장
    localStorage.setItem('visitCount', visitCount.toString());
    localStorage.setItem('lastVisit', new Date().toISOString());
    sessionStorage.setItem('sessionStart', sessionStart);
    
    return {
      visitCount,
      lastVisit: lastVisit || undefined,
      sessionDuration: Date.now() - parseInt(sessionStart)
    };
  }

  // 추가 브라우저 정보 수집
  private getExtendedBrowserInfo(): Partial<ComprehensiveDeviceInfo['misc']> {
    const nav = navigator as any;
    
    return {
      cpuClass: nav.cpuClass,
      oscpu: nav.oscpu,
      buildID: nav.buildID,
      product: nav.product,
      productSub: nav.productSub,
      vendor: nav.vendor,
      vendorSub: nav.vendorSub,
      webdriver: nav.webdriver,
      pdfViewerEnabled: nav.pdfViewerEnabled,
      mozApps: !!nav.mozApps,
      mozConnection: !!nav.mozConnection
    };
  }

  // 종합 디바이스 정보 수집
  public async getComprehensiveDeviceInfo(): Promise<ComprehensiveDeviceInfo> {
    if (this.deviceInfo) {
      return this.deviceInfo;
    }

    const ua = navigator.userAgent;
    const [capabilities, location, battery, adBlock] = await Promise.all([
      this.getCapabilities(),
      this.getLocationInfo(),
      this.getBatteryInfo(),
      this.detectAdBlocker()
    ]);

    const visitInfo = this.getVisitInfo();
    const extendedInfo = this.getExtendedBrowserInfo();

    this.deviceInfo = {
      userAgent: ua,
      platform: navigator.platform,
      language: navigator.language,
      languages: Array.from(navigator.languages || [navigator.language]),
      
      device: this.parseUserAgent(ua),
      hardware: this.getHardwareInfo(),
      network: this.getNetworkInfo(),
      location,
      capabilities,
      
      misc: {
        timezoneOffset: new Date().getTimezoneOffset(),
        currentTime: new Date().toISOString(),
        referrer: document.referrer,
        onlineStatus: navigator.onLine,
        batteryLevel: battery.level,
        batteryCharging: battery.charging,
        installedFonts: this.getInstalledFonts(),
        canvasFingerprint: this.getCanvasFingerprint(),
        audioFingerprint: this.getAudioFingerprint(),
        
        // 추가 정보
        sessionDuration: visitInfo.sessionDuration,
        visitCount: visitInfo.visitCount,
        lastVisit: visitInfo.lastVisit,
        adBlock,
        ...extendedInfo
      }
    };

    return this.deviceInfo;
  }

  // 간단한 요약 정보 반환
  public async getDeviceSummary(): Promise<string> {
    const info = await this.getComprehensiveDeviceInfo();
    
    return `${info.device.brand} ${info.device.model} | ${info.device.os} ${info.device.osVersion} | ${info.device.browser} ${info.device.browserVersion} | ${info.location.city}, ${info.location.country} | ${info.location.isp}`;
  }
}

// 전역 인스턴스
export const deviceDetection = new DeviceDetection();