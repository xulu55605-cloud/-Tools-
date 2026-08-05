// ── Service Worker for 喷油器工程计算平台 ──
const CACHE_NAME = 'injector-calc-v1';

// 本地资源（离线可用）
const STATIC_ASSETS = [
  '.',
  'index.html',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

// 外部 CDN 资源（缓存后离线可用）
const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap'
];

// ── Install: 预缓存所有资源 ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // 本地资源必须缓存成功
      return cache.addAll(STATIC_ASSETS).then(() => {
        // CDN 资源尽力而为，单个失败不阻断安装
        return Promise.allSettled(
          CDN_ASSETS.map(url =>
            cache.add(url).catch(err => console.warn('CDN cache miss:', url, err))
          )
        );
      });
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: 清理旧缓存 ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: Cache-First，回退网络 ──
self.addEventListener('fetch', event => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Google Fonts 字体文件：网络优先，失败用缓存
  if (url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 其余资源：Cache-First
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // 仅缓存成功的 2xx 同源或 CORS 响应
        if (
          response &&
          response.status === 200 &&
          (response.type === 'basic' || response.type === 'cors')
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // 离线 fallback：返回主页面
        if (event.request.destination === 'document') {
          return caches.match('index.html');
        }
      });
    })
  );
});
