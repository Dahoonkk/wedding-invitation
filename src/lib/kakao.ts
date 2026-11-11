export const kakaoJavaScriptKey =
  import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY?.trim() ?? "";

interface KakaoShareSdk {
  init(key: string): void;
  isInitialized(): boolean;
  Share: {
    sendDefault(options: {
      objectType: "feed";
      content: {
        title: string;
        description: string;
        imageUrl: string;
        imageWidth: number;
        imageHeight: number;
        link: { mobileWebUrl: string; webUrl: string };
      };
      buttons: {
        title: string;
        link: { mobileWebUrl: string; webUrl: string };
      }[];
    }): void;
  };
}

interface KakaoMapSdk {
  load(callback: () => void): void;
  LatLng: new (latitude: number, longitude: number) => object;
  Map: new (
    element: HTMLElement,
    options: {
      center: object;
      level: number;
      draggable: boolean;
      scrollwheel: boolean;
    },
  ) => object;
  CustomOverlay: new (options: {
    map: object;
    position: object;
    content: HTMLElement;
    xAnchor: number;
    yAnchor: number;
  }) => object;
  services: {
    Status: { OK: string };
    Geocoder: new () => {
      addressSearch(
        address: string,
        callback: (results: { x: string; y: string }[], status: string) => void,
        options: { analyze_type: string },
      ): void;
    };
  };
}

declare global {
  interface Window {
    Kakao?: KakaoShareSdk;
    kakao?: { maps: KakaoMapSdk };
  }
}

function loadScript(url: string, integrity?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    if (integrity) {
      script.integrity = integrity;
      script.crossOrigin = "anonymous";
    }
    const timeout = window.setTimeout(() => {
      script.remove();
      reject(new Error("카카오 SDK 로딩 시간이 초과되었습니다."));
    }, 10000);
    script.onload = () => {
      window.clearTimeout(timeout);
      resolve();
    };
    script.onerror = () => {
      window.clearTimeout(timeout);
      script.remove();
      reject(new Error("카카오 SDK를 불러오지 못했습니다."));
    };
    document.head.appendChild(script);
  });
}

let sharePromise: Promise<KakaoShareSdk> | undefined;
export function loadKakaoShare(): Promise<KakaoShareSdk> {
  if (!kakaoJavaScriptKey)
    return Promise.reject(new Error("카카오 JavaScript 키가 없습니다."));
  if (!sharePromise) {
    sharePromise = (async () => {
      if (!window.Kakao) {
        await loadScript(
          "https://t1.kakaocdn.net/kakao_js_sdk/2.8.5/kakao.min.js",
          "sha384-v6JKY3z4FUkWq21oZDHZe74YvuPk/WUrVLrDHTBojHXClOSa3iXy7sCXPY1jkFbj",
        );
      }
      const sdk = window.Kakao;
      if (!sdk) throw new Error("카카오 공유 SDK를 사용할 수 없습니다.");
      if (!sdk.isInitialized()) sdk.init(kakaoJavaScriptKey);
      return sdk;
    })().catch((error: unknown) => {
      sharePromise = undefined;
      throw error;
    });
  }
  return sharePromise;
}

let mapsPromise: Promise<KakaoMapSdk> | undefined;
export function loadKakaoMaps(): Promise<KakaoMapSdk> {
  if (!kakaoJavaScriptKey)
    return Promise.reject(new Error("카카오 JavaScript 키가 없습니다."));
  if (!mapsPromise) {
    mapsPromise = (async () => {
      if (!window.kakao?.maps) {
        await loadScript(
          `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(kakaoJavaScriptKey)}&autoload=false&libraries=services`,
        );
      }
      const maps = window.kakao?.maps;
      if (!maps || typeof maps.load !== "function")
        throw new Error("카카오 지도 SDK를 사용할 수 없습니다.");
      await new Promise<void>((resolve, reject) => {
        const timeout = window.setTimeout(
          () => reject(new Error("카카오 지도 초기화 시간이 초과되었습니다.")),
          10000,
        );
        maps.load(() => {
          window.clearTimeout(timeout);
          resolve();
        });
      });
      if (!maps.services?.Geocoder)
        throw new Error("카카오 지도 검색 기능을 사용할 수 없습니다.");
      return maps;
    })().catch((error: unknown) => {
      mapsPromise = undefined;
      throw error;
    });
  }
  return mapsPromise;
}
