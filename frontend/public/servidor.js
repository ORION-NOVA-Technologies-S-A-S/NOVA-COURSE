/* ORION NOVA CLOUD · elige el servidor de Orion Nova Academy.
 * SERVIDOR_PREDETERMINADO: 'supabase' u 'orion' (servidor propio de Orion Nova).
 * Para probar sin afectar a nadie: abre la web con ?servidor=orion  (y ?servidor=supabase para volver). */
(function () {
  'use strict';
  var ORION_API_URL = 'https://api-academy.orionnovatechnologies.com';
  var SERVIDOR_PREDETERMINADO = 'supabase';
  var servidor = SERVIDOR_PREDETERMINADO;
  try {
    var q = new URLSearchParams(location.search).get('servidor');
    if (q === 'orion' || q === 'supabase') localStorage.setItem('academy_servidor', q);
    var v = localStorage.getItem('academy_servidor');
    if (v === 'orion' || v === 'supabase') servidor = v;
  } catch (e) { /* sin localStorage */ }
  window.ORION_SERVIDOR = servidor;
  window.__orionElegir = function (crearSupabase) {
    return function (url, key, opts) {
      if (servidor === 'orion' && window.orionSupabase) return window.orionSupabase.createClient(ORION_API_URL);
      return crearSupabase(url, key, opts);
    };
  };
  if (servidor !== SERVIDOR_PREDETERMINADO) {
    var poner = function () {
      var tag = document.createElement('div');
      tag.textContent = servidor === 'orion' ? 'Servidor ORION (prueba)' : 'Servidor Supabase (prueba)';
      tag.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:99999;padding:4px 8px;border-radius:8px;background:#0B1B4D;color:#fff;font:600 11px system-ui;opacity:.85;pointer-events:none';
      document.body.appendChild(tag);
    };
    if (document.body) poner(); else document.addEventListener('DOMContentLoaded', poner);
  }
})();
