// lib/metaPixel.ts
const META_PIXEL_ID = "984341170881002";

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

const loadPixelScript = () => {
  if (document.getElementById("fb-pixel-script")) return;

  const script = document.createElement("script");
  script.id = "fb-pixel-script";
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${META_PIXEL_ID}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(script);
};

export const initMetaPixel = () => {
  if (typeof window === "undefined") return;
  loadPixelScript();
  //console.log("✅ Pixel inicializado, fbq:", typeof window.fbq);
};

export const trackLead = () => {
  // console.log("🔥 trackLead llamado");
  //console.log("fbq disponible:", typeof window.fbq);
  if (typeof window === "undefined" || !window.fbq) {
    //  console.error("❌ fbq no está disponible");
    return;
  }
  window.fbq("track", "Lead");
  //console.log("✅ Lead disparado");
};
