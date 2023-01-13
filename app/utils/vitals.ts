import type { CLSReportCallback } from 'web-vitals';

const VITALS_URL = 'https://vitals.vercel-analytics.com/v1/vitals';

declare global {
  interface Window {
    ENV?: {
      vercelAnalyticsId?: string;
    };
  }
}

const getConnectionSpeed = () => {
  const isSupported = !!(navigator as any)?.connection?.effectiveType;

  return isSupported ? (navigator as any).connection.effectiveType : '';
};

const sendToVercel: CLSReportCallback = (metric) => {
  const analyticsId = window?.ENV?.vercelAnalyticsId;

  if (!analyticsId) {
    return;
  }

  const body = {
    dsn: analyticsId,
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  };

  const blob = new Blob([new URLSearchParams(body).toString()], {
    type: 'application/x-www-form-urlencoded',
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(VITALS_URL, blob);
  } else {
    fetch(VITALS_URL, {
      method: 'POST',
      body: blob,
      credentials: 'omit',
      keepalive: true,
    });
  }
};

const reportWebVitals = () => {
  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
    onCLS(sendToVercel);
    onFID(sendToVercel);
    onFCP(sendToVercel);
    onLCP(sendToVercel);
    onTTFB(sendToVercel);
  });
};

export default reportWebVitals;
