globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'http';
import { Server } from 'https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, createError, createApp, createRouter, lazyEventHandler } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ohmyfetch';
import { createRouter as createRouter$1 } from 'radix3';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { hash } from 'ohash';
import { parseURL, withQuery, withLeadingSlash, withoutTrailingSlash, joinURL } from 'ufo';
import { createStorage } from 'unstorage';
import { promises } from 'fs';
import { dirname, resolve } from 'pathe';
import { fileURLToPath } from 'url';

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"routes":{},"envPrefix":"NUXT_"},"public":{}};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _runtimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const getEnv = (key) => {
  const envKey = snakeCase(key).toUpperCase();
  return destr(process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]);
};
function isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function overrideConfig(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey);
    if (isObject(obj[key])) {
      if (isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      overrideConfig(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
}
overrideConfig(_runtimeConfig);
const config = deepFreeze(_runtimeConfig);
const useRuntimeConfig = () => config;
function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

const globalTiming = globalThis.__timing__ || {
  start: () => 0,
  end: () => 0,
  metrics: []
};
function timingMiddleware(_req, res, next) {
  const start = globalTiming.start();
  const _end = res.end;
  res.end = (data, encoding, callback) => {
    const metrics = [["Generate", globalTiming.end(start)], ...globalTiming.metrics];
    const serverTiming = metrics.map((m) => `-;dur=${m[1]};desc="${encodeURIComponent(m[0])}"`).join(", ");
    if (!res.headersSent) {
      res.setHeader("Server-Timing", serverTiming);
    }
    _end.call(res, data, encoding, callback);
  };
  next();
}

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

const useStorage = () => storage;

storage.mount('/assets', assets$1);

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  async function get(key, resolver) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl;
    const _resolve = async () => {
      if (!pending[key]) {
        entry.value = void 0;
        entry.integrity = void 0;
        entry.mtime = void 0;
        entry.expires = void 0;
        pending[key] = Promise.resolve(resolver());
      }
      entry.value = await pending[key];
      entry.mtime = Date.now();
      entry.integrity = integrity;
      delete pending[key];
      useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return Promise.resolve(entry);
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const key = (opts.getKey || getKey)(...args);
    const entry = await get(key, () => fn(...args));
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length ? hash(args, {}) : "";
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: (event) => {
      const url = event.req.originalUrl || event.req.url;
      const friendlyName = decodeURI(parseURL(url).pathname).replace(/[^a-zA-Z0-9]/g, "").substring(0, 16);
      const urlHash = hash(url);
      return `${friendlyName}.${urlHash}`;
    },
    group: opts.group || "nitro/handlers",
    integrity: [
      opts.integrity,
      handler
    ]
  };
  const _cachedHandler = cachedFunction(async (incomingEvent) => {
    const reqProxy = cloneWithProxy(incomingEvent.req, { headers: {} });
    const resHeaders = {};
    const resProxy = cloneWithProxy(incomingEvent.res, {
      statusCode: 200,
      getHeader(name) {
        return resHeaders[name];
      },
      setHeader(name, value) {
        resHeaders[name] = value;
        return this;
      },
      getHeaderNames() {
        return Object.keys(resHeaders);
      },
      hasHeader(name) {
        return name in resHeaders;
      },
      removeHeader(name) {
        delete resHeaders[name];
      },
      getHeaders() {
        return resHeaders;
      }
    });
    const event = createEvent(reqProxy, resProxy);
    event.context = incomingEvent.context;
    const body = await handler(event);
    const headers = event.res.getHeaders();
    headers.Etag = `W/"${hash(body)}"`;
    headers["Last-Modified"] = new Date().toUTCString();
    const cacheControl = [];
    if (opts.swr) {
      if (opts.maxAge) {
        cacheControl.push(`s-maxage=${opts.maxAge}`);
      }
      if (opts.staleMaxAge) {
        cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
      } else {
        cacheControl.push("stale-while-revalidate");
      }
    } else if (opts.maxAge) {
      cacheControl.push(`max-age=${opts.maxAge}`);
    }
    if (cacheControl.length) {
      headers["Cache-Control"] = cacheControl.join(", ");
    }
    const cacheEntry = {
      code: event.res.statusCode,
      headers,
      body
    };
    return cacheEntry;
  }, _opts);
  return defineEventHandler(async (event) => {
    const response = await _cachedHandler(event);
    if (event.res.headersSent || event.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["Last-Modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.res.statusCode = response.code;
    for (const name in response.headers) {
      event.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const plugins = [
  
];

function hasReqHeader(req, header, includes) {
  const value = req.headers[header];
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event.req, "accept", "application/json") || hasReqHeader(event.req, "user-agent", "curl/") || hasReqHeader(event.req, "user-agent", "httpie/") || event.req.url?.endsWith(".json") || event.req.url?.includes("/api/");
}
function normalizeError(error) {
  const cwd = process.cwd();
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Route Not Found" : "Internal Server Error");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.req.url,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  event.res.statusCode = errorObject.statusCode;
  event.res.statusMessage = errorObject.statusMessage;
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (isJsonRequest(event)) {
    event.res.setHeader("Content-Type", "application/json");
    event.res.end(JSON.stringify(errorObject));
    return;
  }
  const isErrorPage = event.req.url?.startsWith("/__nuxt_error");
  let html = !isErrorPage ? await $fetch(withQuery("/__nuxt_error", errorObject)).catch(() => null) : null;
  if (!html) {
    const { template } = await import('./error-500.mjs');
    html = template(errorObject);
  }
  event.res.setHeader("Content-Type", "text/html;charset=UTF-8");
  event.res.end(html);
});

const assets = {
  "/fonts/OnestBlack1602-hint.woff": {
    "type": "font/woff",
    "etag": "\"b57c-g3gJlHOCegto/rdQfCA+VP+lxLg\"",
    "mtime": "2022-10-07T19:14:35.942Z",
    "size": 46460,
    "path": "../public/fonts/OnestBlack1602-hint.woff"
  },
  "/fonts/OnestBold1602-hint.woff": {
    "type": "font/woff",
    "etag": "\"af58-O3/vnoSlwqv/UAl1XZhY+RBYjB0\"",
    "mtime": "2022-10-07T19:14:35.946Z",
    "size": 44888,
    "path": "../public/fonts/OnestBold1602-hint.woff"
  },
  "/fonts/OnestExtraBold1602-hint.woff": {
    "type": "font/woff",
    "etag": "\"b674-GF5pA2Wc5nKkGWKct8Jd2cTJyDQ\"",
    "mtime": "2022-10-07T19:14:35.948Z",
    "size": 46708,
    "path": "../public/fonts/OnestExtraBold1602-hint.woff"
  },
  "/fonts/OnestLight1602-hint.woff": {
    "type": "font/woff",
    "etag": "\"a228-/ob932Hj48WCmT33q8igRG1DML0\"",
    "mtime": "2022-10-07T19:14:35.949Z",
    "size": 41512,
    "path": "../public/fonts/OnestLight1602-hint.woff"
  },
  "/fonts/OnestMedium1602-hint.woff": {
    "type": "font/woff",
    "etag": "\"aa88-MjjUZRnMQcPv0zBq4cn59VXkYBI\"",
    "mtime": "2022-10-07T19:14:35.951Z",
    "size": 43656,
    "path": "../public/fonts/OnestMedium1602-hint.woff"
  },
  "/fonts/OnestRegular1602-hint.woff": {
    "type": "font/woff",
    "etag": "\"a4fc-6ooJTiHnQXbBlBPvqkAj3gOZ+0g\"",
    "mtime": "2022-10-07T19:14:35.952Z",
    "size": 42236,
    "path": "../public/fonts/OnestRegular1602-hint.woff"
  },
  "/fonts/OnestThin1602-hint.woff": {
    "type": "font/woff",
    "etag": "\"a1ec-BwBuIsk/Z0l+PJC65CtOvBNcGx4\"",
    "mtime": "2022-10-07T19:14:35.953Z",
    "size": 41452,
    "path": "../public/fonts/OnestThin1602-hint.woff"
  },
  "/images/art-mobile-pic.svg": {
    "type": "image/svg+xml",
    "etag": "\"522-JvbOAMGaDLEbNF7fHSA6K8k3qlA\"",
    "mtime": "2022-10-07T19:14:35.954Z",
    "size": 1314,
    "path": "../public/images/art-mobile-pic.svg"
  },
  "/images/art-pic.svg": {
    "type": "image/svg+xml",
    "etag": "\"528-CQuDNzJBMwC1YLvBfgPD85CswJo\"",
    "mtime": "2022-10-07T19:14:35.956Z",
    "size": 1320,
    "path": "../public/images/art-pic.svg"
  },
  "/images/card3D-mobile-pic.svg": {
    "type": "image/svg+xml",
    "etag": "\"fa3-AkpyjlBI1P8GD32SqE8lGq2yX/s\"",
    "mtime": "2022-10-07T19:14:35.957Z",
    "size": 4003,
    "path": "../public/images/card3D-mobile-pic.svg"
  },
  "/images/card3D-pic.svg": {
    "type": "image/svg+xml",
    "etag": "\"a07b3-n7MkgeiC9+lxiedgmcSn+cdp3cI\"",
    "mtime": "2022-10-07T19:14:35.967Z",
    "size": 657331,
    "path": "../public/images/card3D-pic.svg"
  },
  "/images/cards.svg": {
    "type": "image/svg+xml",
    "etag": "\"35341a-aPlldw1mpgDhotUrIjxFjsvQSR0\"",
    "mtime": "2022-10-08T15:11:05.852Z",
    "size": 3486746,
    "path": "../public/images/cards.svg"
  },
  "/images/clock-icon.svg": {
    "type": "image/svg+xml",
    "etag": "\"2e4-uXxJ9brOfxv/nLO53yWS6yBG76M\"",
    "mtime": "2022-10-07T19:14:35.969Z",
    "size": 740,
    "path": "../public/images/clock-icon.svg"
  },
  "/images/craft-mobile-pic.svg": {
    "type": "image/svg+xml",
    "etag": "\"11d6-+CoNVV94tHz6qk+w/UOCmb1i5nE\"",
    "mtime": "2022-10-07T19:14:35.970Z",
    "size": 4566,
    "path": "../public/images/craft-mobile-pic.svg"
  },
  "/images/craft-pic.svg": {
    "type": "image/svg+xml",
    "etag": "\"11c6-AyDVyDAUHX34HTzaJFHbXbDzaU0\"",
    "mtime": "2022-10-07T19:14:35.971Z",
    "size": 4550,
    "path": "../public/images/craft-pic.svg"
  },
  "/images/darkcard-mobile-pic.svg": {
    "type": "image/svg+xml",
    "etag": "\"304-OWhrc6tJwAGraa9+T+j4JDnxPOQ\"",
    "mtime": "2022-10-07T19:14:35.972Z",
    "size": 772,
    "path": "../public/images/darkcard-mobile-pic.svg"
  },
  "/images/design-pic.svg": {
    "type": "image/svg+xml",
    "etag": "\"38d97-9tYNxCLzYJxpEKluKwUngdSpiYU\"",
    "mtime": "2022-10-07T19:14:35.977Z",
    "size": 232855,
    "path": "../public/images/design-pic.svg"
  },
  "/images/digital-mobile-pic.svg": {
    "type": "image/svg+xml",
    "etag": "\"1a84-1jXyZi95n0MrwnLn9QeJSWpgXOE\"",
    "mtime": "2022-10-07T19:14:35.977Z",
    "size": 6788,
    "path": "../public/images/digital-mobile-pic.svg"
  },
  "/images/digital-pic.svg": {
    "type": "image/svg+xml",
    "etag": "\"1a92-LB4+u1BNPqrCLbm/kV8lOXJe66c\"",
    "mtime": "2022-10-07T19:14:35.978Z",
    "size": 6802,
    "path": "../public/images/digital-pic.svg"
  },
  "/images/drawing-pic.svg": {
    "type": "image/svg+xml",
    "etag": "\"7c797-Ip/yPQPmmPgDjVTIpa6xfiW4dts\"",
    "mtime": "2022-10-07T19:14:35.985Z",
    "size": 509847,
    "path": "../public/images/drawing-pic.svg"
  },
  "/images/illustration-pic.svg": {
    "type": "image/svg+xml",
    "etag": "\"2382-pHm4S8oWO7RLr9R7BNIcy0pfWYk\"",
    "mtime": "2022-10-07T19:14:35.986Z",
    "size": 9090,
    "path": "../public/images/illustration-pic.svg"
  },
  "/images/logo.svg": {
    "type": "image/svg+xml",
    "etag": "\"555-ITdD7Dh/l1VZ3zcn8UhsA1MBXOo\"",
    "mtime": "2022-10-07T19:14:35.987Z",
    "size": 1365,
    "path": "../public/images/logo.svg"
  },
  "/images/painting-mobile-pic.svg": {
    "type": "image/svg+xml",
    "etag": "\"9b7b5-cZH1ioQ4IiKBZwGVFsCusfMIAdc\"",
    "mtime": "2022-10-07T19:14:35.996Z",
    "size": 636853,
    "path": "../public/images/painting-mobile-pic.svg"
  },
  "/images/painting-pic.svg": {
    "type": "image/svg+xml",
    "etag": "\"9b935-1BDR2JHODy7mX9Lhz7rzM0z5/+I\"",
    "mtime": "2022-10-07T19:14:36.000Z",
    "size": 637237,
    "path": "../public/images/painting-pic.svg"
  },
  "/images/photography-pic.svg": {
    "type": "image/svg+xml",
    "etag": "\"eaf36-3cjZsEtym+AV2glr5YJiEFEImzM\"",
    "mtime": "2022-10-07T19:14:36.014Z",
    "size": 962358,
    "path": "../public/images/photography-pic.svg"
  },
  "/images/present-icon.svg": {
    "type": "image/svg+xml",
    "etag": "\"8f2-gWOC40fzJr5Dfk+F+zMNLEIlTuU\"",
    "mtime": "2022-10-07T19:14:36.015Z",
    "size": 2290,
    "path": "../public/images/present-icon.svg"
  },
  "/images/redcard-mobile-pic.svg": {
    "type": "image/svg+xml",
    "etag": "\"ed-W1xDSNAjHdt1qyABhjOTVC2zImI\"",
    "mtime": "2022-10-07T19:14:36.016Z",
    "size": 237,
    "path": "../public/images/redcard-mobile-pic.svg"
  },
  "/images/sculpture-mobile-pic.svg": {
    "type": "image/svg+xml",
    "etag": "\"71f2e-L3YAeCqcC4+sGre5VMK/9iJCyvQ\"",
    "mtime": "2022-10-07T19:14:36.023Z",
    "size": 466734,
    "path": "../public/images/sculpture-mobile-pic.svg"
  },
  "/images/sculpture-pic.svg": {
    "type": "image/svg+xml",
    "etag": "\"71ee9-js8BThXOlKee9u+fVsZuCaxi1Vg\"",
    "mtime": "2022-10-07T19:14:36.026Z",
    "size": 466665,
    "path": "../public/images/sculpture-pic.svg"
  },
  "/video/1.mp4": {
    "type": "video/mp4",
    "etag": "\"19d066-+V6F1eG9npTwcDau4CS8JMzuvd8\"",
    "mtime": "2022-10-07T19:14:36.049Z",
    "size": 1691750,
    "path": "../public/video/1.mp4"
  },
  "/video/2.mp4": {
    "type": "video/mp4",
    "etag": "\"29b799-RBAUK/Ugq3yZNBL+VgrMjS+zF+c\"",
    "mtime": "2022-10-07T19:14:36.071Z",
    "size": 2733977,
    "path": "../public/video/2.mp4"
  },
  "/video/3.mp4": {
    "type": "video/mp4",
    "etag": "\"21f29f-H6l1OSlJ13udN7qXAr5ewLwj1oM\"",
    "mtime": "2022-10-07T19:14:36.086Z",
    "size": 2224799,
    "path": "../public/video/3.mp4"
  },
  "/video/4.mp4": {
    "type": "video/mp4",
    "etag": "\"32c548-wWGYDHDPI0b51Wdhvk0DGc/oQgc\"",
    "mtime": "2022-10-07T19:14:36.113Z",
    "size": 3327304,
    "path": "../public/video/4.mp4"
  },
  "/video/5.mp4": {
    "type": "video/mp4",
    "etag": "\"1645ff-by1mOUEt1v1sHCdZOU3O4n0z3m0\"",
    "mtime": "2022-10-07T19:14:36.124Z",
    "size": 1459711,
    "path": "../public/video/5.mp4"
  },
  "/video/6.mp4": {
    "type": "video/mp4",
    "etag": "\"3274e1-5Rt6HMNXaXpC6kuy73vi5PNOEbE\"",
    "mtime": "2022-10-07T19:14:36.150Z",
    "size": 3306721,
    "path": "../public/video/6.mp4"
  },
  "/video/7.mp4": {
    "type": "video/mp4",
    "etag": "\"487323-4hDawnWDE0uMrQsaqJB6NCO537U\"",
    "mtime": "2022-10-07T19:14:36.181Z",
    "size": 4748067,
    "path": "../public/video/7.mp4"
  },
  "/video/8.mp4": {
    "type": "video/mp4",
    "etag": "\"33b67d-f7V4uVNU1dNeFQYwFy5e07gOkYw\"",
    "mtime": "2022-10-07T19:14:36.207Z",
    "size": 3389053,
    "path": "../public/video/8.mp4"
  },
  "/video/9.mp4": {
    "type": "video/mp4",
    "etag": "\"ecec1-VK8qfV+zY20gSWepwDL6hBHKxwM\"",
    "mtime": "2022-10-07T19:14:36.213Z",
    "size": 970433,
    "path": "../public/video/9.mp4"
  },
  "/_nuxt/entry.786ec6f0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e99-2XSQO+LM/vf+vY2Ldc4OP2TaWOg\"",
    "mtime": "2022-10-09T19:50:21.453Z",
    "size": 7833,
    "path": "../public/_nuxt/entry.786ec6f0.css"
  },
  "/_nuxt/entry.c7ab1efe.js": {
    "type": "application/javascript",
    "etag": "\"1e0a9-MMKL80D6Lw0UDZb+ET5IzJOmbe8\"",
    "mtime": "2022-10-09T19:50:21.452Z",
    "size": 123049,
    "path": "../public/_nuxt/entry.c7ab1efe.js"
  },
  "/_nuxt/error-404.0762c8ba.js": {
    "type": "application/javascript",
    "etag": "\"8a8-7YdqtYWbAKhbckv0N5sNZ4IsyMU\"",
    "mtime": "2022-10-09T19:50:21.452Z",
    "size": 2216,
    "path": "../public/_nuxt/error-404.0762c8ba.js"
  },
  "/_nuxt/error-404.18ced855.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-F8gJ3uSz6Dg2HRyb374Ax3RegKE\"",
    "mtime": "2022-10-09T19:50:21.453Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.18ced855.css"
  },
  "/_nuxt/error-500.1ad0df5b.js": {
    "type": "application/javascript",
    "etag": "\"756-i/Z4nYi6HboqCDlQGhe4eMXFWD8\"",
    "mtime": "2022-10-09T19:50:21.452Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.1ad0df5b.js"
  },
  "/_nuxt/error-500.e60962de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-VhleGjkSRH7z4cQDJV3dxcboMhU\"",
    "mtime": "2022-10-09T19:50:21.454Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.e60962de.css"
  },
  "/_nuxt/error-component.bfcf3a76.js": {
    "type": "application/javascript",
    "etag": "\"465-qFTY8kFNKtm2Z0oXkbi5XvMLpYs\"",
    "mtime": "2022-10-09T19:50:21.452Z",
    "size": 1125,
    "path": "../public/_nuxt/error-component.bfcf3a76.js"
  },
  "/_nuxt/index.4d15b374.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"9c-81ZvGgJuG7wDGoJPzMbQdDV7RlU\"",
    "mtime": "2022-10-09T19:50:21.453Z",
    "size": 156,
    "path": "../public/_nuxt/index.4d15b374.css"
  },
  "/_nuxt/index.f4bd0e70.js": {
    "type": "application/javascript",
    "etag": "\"1aab-AwzAZo+Xo3LUJ/BGx+3e3Be1RkY\"",
    "mtime": "2022-10-09T19:50:21.452Z",
    "size": 6827,
    "path": "../public/_nuxt/index.f4bd0e70.js"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = [];

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base of publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = ["HEAD", "GET"];
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler(async (event) => {
  if (event.req.method && !METHODS.includes(event.req.method)) {
    return;
  }
  let id = decodeURIComponent(withLeadingSlash(withoutTrailingSlash(parseURL(event.req.url).pathname)));
  let asset;
  const encodingHeader = String(event.req.headers["accept-encoding"] || "");
  const encodings = encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort().concat([""]);
  if (encodings.length > 1) {
    event.res.setHeader("Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.res.statusCode = 304;
    event.res.end("Not Modified (etag)");
    return;
  }
  const ifModifiedSinceH = event.req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime) {
    if (new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
      event.res.statusCode = 304;
      event.res.end("Not Modified (mtime)");
      return;
    }
  }
  if (asset.type) {
    event.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag) {
    event.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime) {
    event.res.setHeader("Last-Modified", asset.mtime);
  }
  if (asset.encoding) {
    event.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size) {
    event.res.setHeader("Content-Length", asset.size);
  }
  const contents = await readAsset(id);
  event.res.end(contents);
});

const _lazy_hOE9HN = () => import('./renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_hOE9HN, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_hOE9HN, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  h3App.use(config.app.baseURL, timingMiddleware);
  const router = createRouter();
  const routerOptions = createRouter$1({ routes: config.nitro.routes });
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    const referenceRoute = h.route.replace(/:\w+|\*\*/g, "_");
    const routeOptions = routerOptions.lookup(referenceRoute) || {};
    if (routeOptions.swr) {
      handler = cachedEventHandler(handler, {
        group: "nitro/routes"
      });
    }
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(/\/+/g, "/");
      h3App.use(middlewareBase, handler);
    } else {
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router);
  const localCall = createCall(h3App.nodeHandler);
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({ fetch: localFetch, Headers, defaults: { baseURL: config.app.baseURL } });
  globalThis.$fetch = $fetch;
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, nitroApp.h3App.nodeHandler) : new Server$1(nitroApp.h3App.nodeHandler);
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const s = server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const i = s.address();
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${i.family === "IPv6" ? `[${i.address}]` : i.address}:${i.port}${baseURL}`;
  console.log(`Listening ${url}`);
});
{
  process.on("unhandledRejection", (err) => console.error("[nitro] [dev] [unhandledRejection] " + err));
  process.on("uncaughtException", (err) => console.error("[nitro] [dev] [uncaughtException] " + err));
}
const nodeServer = {};

export { useRuntimeConfig as a, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
