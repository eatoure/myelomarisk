'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "04df9316b37880dca6cc578fb66ddab5",
"version.json": "4d0b9ac6b4687e6218560591bfd07660",
"index.html": "57dd396c87ab3828f0550c135accec46",
"/": "57dd396c87ab3828f0550c135accec46",
"main.dart.js": "e4d24c601b24311024bf3212b3e0e279",
"flutter.js": "383e55f7f3cce5be08fcf1f3881f585c",
"Favicon.png": "f7c9feb29fc607020d927e9c8ab86b7f",
"icons/favicon-16x16.png": "f480d033497a51dc37bfade43d45d30d",
"icons/favicon.ico": "0bc10cd106dc93b975cd0b8b461d06a1",
"icons/apple-icon.png": "396128963b52634f2b4c570560251378",
"icons/apple-icon-144x144.png": "b953f58e9d0bfb2b32ca9e864f1e7fd8",
"icons/android-icon-192x192.png": "0d3a4e652f9029f2d3dde1a08014bb59",
"icons/apple-icon-precomposed.png": "396128963b52634f2b4c570560251378",
"icons/apple-icon-114x114.png": "97292b9f298425b51e0a0fb3a9ead1ef",
"icons/ms-icon-310x310.png": "30cce06bf58b5baa341e1789046e280b",
"icons/ms-icon-144x144.png": "b953f58e9d0bfb2b32ca9e864f1e7fd8",
"icons/apple-icon-57x57.png": "c0001862e4b4b4d6a7aa5e4c8651e931",
"icons/apple-icon-152x152.png": "db5b3c75ddf82737a96c6ed638b9f519",
"icons/ms-icon-150x150.png": "27a8a90b63e22c1fda53b4b2c5146f12",
"icons/android-icon-72x72.png": "e7b3d313cc0cdff1d95da67dce9b3157",
"icons/android-icon-96x96.png": "55c84d9091f48e9a7abf1672504c7f85",
"icons/android-icon-36x36.png": "a63caf737f7855202680d1a7f16528e8",
"icons/apple-icon-180x180.png": "f5f1e464e20a15edcd0362d6d3fcada9",
"icons/favicon-96x96.png": "55c84d9091f48e9a7abf1672504c7f85",
"icons/android-icon-48x48.png": "01d5472da204759e39cccb7a73746d90",
"icons/apple-icon-76x76.png": "aa04301bcb001a0a2925723a17ebea60",
"icons/apple-icon-60x60.png": "9e497eebe0624e4d4044c2bcb2f55f7c",
"icons/browserconfig.xml": "653d077300a12f09a69caeea7a8947f8",
"icons/android-icon-144x144.png": "b953f58e9d0bfb2b32ca9e864f1e7fd8",
"icons/apple-icon-72x72.png": "e7b3d313cc0cdff1d95da67dce9b3157",
"icons/apple-icon-120x120.png": "ecc20d2a33b32c74874de88f964baf02",
"icons/favicon-32x32.png": "2513ed79934fd897311dbb7e1bb8bcf7",
"icons/ms-icon-70x70.png": "405d1a71a1c30485611b2d7d618c99d3",
"manifest.json": "6b5535e2f6902122b8ef86908aeca5af",
"assets/AmadouToure.jpg": "e26a71fe2608617bf4ab39d0fd69ab29",
"assets/national-cancer-institute-L7en7Lb-Ovc-unsplash.jpeg": "39039dd97043b1d5a2c0c6180d9834ba",
"assets/combined_video.mp4": "90592e80a5af8c20437bb3e926f8bf3f",
"assets/web/assets/AmadouToure.JPG": "e26a71fe2608617bf4ab39d0fd69ab29",
"assets/web/assets/national-cancer-institute-L7en7Lb-Ovc-unsplash.jpeg": "39039dd97043b1d5a2c0c6180d9834ba",
"assets/web/assets/combined_video.mp4": "90592e80a5af8c20437bb3e926f8bf3f",
"assets/web/assets/ShajiKumar.jpg": "589e7757bc9589672d11fbf81ba97745",
"assets/web/assets/VincentRajkumar.jpg": "079fe8c1b20736c19f7c87f784cc8040",
"assets/AssetManifest.json": "944ce295813f9760fad01ca5413e1694",
"assets/ShajiKumar.jpg": "589e7757bc9589672d11fbf81ba97745",
"assets/VincentRajkumar.jpg": "079fe8c1b20736c19f7c87f784cc8040",
"assets/NOTICES": "b70e95b9cf78d37a936ba0d3758d1e1a",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/AssetManifest.bin.json": "8db609f7f8d2073f2b24eb18c35520dd",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "431d5f86131d69ac254a3d4267b8d153",
"assets/fonts/MaterialIcons-Regular.otf": "37296d49ed5d9918e6c9af156c72cf25",
"canvaskit/skwasm.js": "5d4f9263ec93efeb022bb14a3881d240",
"canvaskit/skwasm.js.symbols": "c3c05bd50bdf59da8626bbe446ce65a3",
"canvaskit/canvaskit.js.symbols": "74a84c23f5ada42fe063514c587968c6",
"canvaskit/skwasm.wasm": "4051bfc27ba29bf420d17aa0c3a98bce",
"canvaskit/chromium/canvaskit.js.symbols": "ee7e331f7f5bbf5ec937737542112372",
"canvaskit/chromium/canvaskit.js": "901bb9e28fac643b7da75ecfd3339f3f",
"canvaskit/chromium/canvaskit.wasm": "399e2344480862e2dfa26f12fa5891d7",
"canvaskit/canvaskit.js": "738255d00768497e86aa4ca510cce1e1",
"canvaskit/canvaskit.wasm": "9251bb81ae8464c4df3b072f84aa969b",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
