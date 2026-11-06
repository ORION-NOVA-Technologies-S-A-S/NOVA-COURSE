/*
 * ORION NOVA CLOUD · adaptador compatible con supabase-js
 * Permite que la app use el servidor propio de Orion Nova sin reescribir su código:
 *   const sb = window.orionSupabase.createClient('https://api-alerta.orionnovatechnologies.com');
 *   sb.from('tabla').select('*').eq('col', v).order('created_at', { ascending: false }).limit(50)
 *   sb.rpc('funcion', args) · sb.auth.* · sb.channel(...) · sb.functions.invoke(...)
 */
(function () {
  'use strict';

  function crearCliente(urlApi) {
    const API = String(urlApi).replace(/\/+$/, '');
    const CLAVE = 'orion_sesion_' + new URL(API).host;
    const oyentes = new Set();
    let session = null;
    let tokenRecuperacion = null;

    try { session = JSON.parse(localStorage.getItem(CLAVE) || 'null'); } catch (e) { session = null; }
    if (session && session.expires_at && session.expires_at * 1000 < Date.now()) session = null;

    // Enlace del correo "cambiar contraseña": #type=recovery&orion_recovery=...
    try {
      const h = new URLSearchParams(location.hash.slice(1));
      if (h.get('orion_recovery')) {
        tokenRecuperacion = h.get('orion_recovery');
        history.replaceState(null, '', location.pathname + location.search);
      }
    } catch (e) { /* sin hash */ }

    function guardar(s) {
      session = s;
      try { s ? localStorage.setItem(CLAVE, JSON.stringify(s)) : localStorage.removeItem(CLAVE); } catch (e) { /* privado */ }
    }
    function avisar(evento) {
      oyentes.forEach(cb => { try { cb(evento, session); } catch (e) { console.error(e); } });
    }
    function aSesion(d) {
      const b64 = d.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const datos = JSON.parse(decodeURIComponent(escape(atob(b64 + '==='.slice((b64.length + 3) % 4)))));
      const u = d.usuario || {};
      return {
        access_token: d.token, token_type: 'bearer', expires_at: datos.exp,
        user: { id: String(u.id), email: u.email, user_metadata: { full_name: u.nombre || '' } },
      };
    }

    async function http(metodo, ruta, cuerpo) {
      const headers = { 'Content-Type': 'application/json' };
      if (session) headers.Authorization = 'Bearer ' + session.access_token;
      let r;
      try {
        r = await fetch(API + ruta, { method: metodo, headers, body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo) });
      } catch (e) {
        return { data: null, error: { message: 'Failed to fetch: no se pudo conectar con el servidor.' } };
      }
      let data = null;
      try { data = await r.json(); } catch (e) { data = null; }
      if (r.status === 401 && session && ruta.indexOf('/auth/') !== 0) { guardar(null); avisar('SIGNED_OUT'); }
      if (!r.ok) {
        const det = data && data.detail;
        const msg = typeof det === 'string' ? det
          : Array.isArray(det) ? det.map(x => x.msg).join('. ') : 'Error ' + r.status;
        return { data: null, error: { message: msg, status: r.status } };
      }
      return { data, error: null };
    }

    // ---- select('id, titulo, topics(id, title), courses!inner(slug)') ----
    function partirSelect(texto) {
      const items = []; let nivel = 0, actual = '';
      for (const ch of String(texto || '*')) {
        if (ch === '(') nivel++;
        if (ch === ')') nivel--;
        if (ch === ',' && nivel === 0) { if (actual.trim()) items.push(actual.trim()); actual = ''; } else actual += ch;
      }
      if (actual.trim()) items.push(actual.trim());
      return items.map(it => {
        const p = it.indexOf('(');
        if (p < 0) { const [alias, col] = it.includes(':') ? it.split(':') : [it, it]; return { col: col.trim(), alias: alias.trim() }; }
        let cab = it.slice(0, p).trim(); const dentro = it.slice(p + 1, it.lastIndexOf(')'));
        let alias = null; if (cab.includes(':')) [alias, cab] = cab.split(':').map(x => x.trim());
        const [tabla, pista] = cab.split('!');
        return { tabla: tabla.trim(), alias: alias || tabla.trim(), inner: pista === 'inner', hijos: partirSelect(dentro) };
      });
    }
    let relacionesP = null;
    const relaciones = () => relacionesP || (relacionesP = http('GET', '/meta/relaciones').then(r => r.data || []));
    async function traerEn(tabla, col, valores) {
      const unicos = [...new Set(valores.filter(v => v !== null && v !== undefined).map(String))];
      const filas = [];
      for (let i = 0; i < unicos.length; i += 150) {
        const p = new URLSearchParams({ limite: '5000' });
        p.set(col, 'in.(' + unicos.slice(i, i + 150).join(',') + ')');
        const r = await http('GET', '/datos/' + encodeURIComponent(tabla) + '?' + p.toString());
        if (r.error) throw r.error;
        filas.push(...r.data);
      }
      return filas;
    }
    async function resolverSelect(tabla, filas, items) {
      const anidados = items.filter(i => i.tabla);
      if (anidados.length) {
        const rels = await relaciones();
        for (const e of anidados) {
          const aUno = rels.find(r => r.tabla === tabla && r.referencia === e.tabla);    // topics -> modules
          const aMuchos = rels.find(r => r.tabla === e.tabla && r.referencia === tabla); // modules -> topics
          if (aUno) {
            const [col] = aUno.columnas, [ref] = aUno.columnas_ref;
            const hijos = await resolverSelect(e.tabla, await traerEn(e.tabla, ref, filas.map(f => f[col])), e.hijos.concat([{ col: ref, alias: '__ref' }]));
            const mapa = new Map(hijos.map(h => [String(h.__ref), h]));
            hijos.forEach(h => delete h.__ref);
            filas.forEach(f => { f['__' + e.alias] = mapa.get(String(f[col])) || null; });
            if (e.inner) filas = filas.filter(f => f['__' + e.alias]);
          } else if (aMuchos) {
            const [col] = aMuchos.columnas, [ref] = aMuchos.columnas_ref;
            const hijos = await resolverSelect(e.tabla, await traerEn(e.tabla, col, filas.map(f => f[ref])), e.hijos.concat([{ col, alias: '__ref' }]));
            const grupos = new Map();
            hijos.forEach(h => { const k = String(h.__ref); delete h.__ref; (grupos.get(k) || grupos.set(k, []).get(k)).push(h); });
            filas.forEach(f => { f['__' + e.alias] = grupos.get(String(f[ref])) || []; });
            if (e.inner) filas = filas.filter(f => f['__' + e.alias].length);
          } else {
            throw { message: 'No hay relación entre ' + tabla + ' y ' + e.tabla };
          }
        }
      }
      if (items.length === 1 && items[0].col === '*') return filas;
      return filas.map(f => {
        const o = {};
        items.forEach(i => {
          if (i.tabla) o[i.alias] = f['__' + i.alias];
          else if (i.col === '*') Object.keys(f).forEach(k => { if (!k.startsWith('__')) o[k] = f[k]; });
          else o[i.alias] = f[i.col];
        });
        return o;
      });
    }

    // ---------------- consultas: sb.from(tabla) ----------------
    class Consulta {
      constructor(tabla) {
        this.tabla = tabla; this.filtros = []; this.ordenes = []; this.lim = null; this.desde = 0;
        this.metodo = 'GET'; this.cuerpo = undefined; this.cols = '*';
        this.contar = false; this.cabeza = false; this.modo = 'lista'; this.devolver = false;
      }
      select(cols = '*', opts = {}) {
        this.cols = cols;
        if (this.metodo === 'GET') { this.contar = !!opts.count; this.cabeza = !!opts.head; } else this.devolver = true;
        return this;
      }
      insert(v) { this.metodo = 'POST'; this.cuerpo = v; return this; }
      upsert(v, opts = {}) {
        this.metodo = 'POST'; this.cuerpo = v;
        this.extra = { resolucion: opts.ignoreDuplicates ? 'ignorar' : 'actualizar' };
        if (opts.onConflict) this.extra.on_conflict = opts.onConflict;
        return this;
      }
      update(v) { this.metodo = 'PATCH'; this.cuerpo = v; return this; }
      delete() { this.metodo = 'DELETE'; return this; }
      _f(c, op, v) { this.filtros.push([c, op + '.' + (v === null || v === undefined ? 'null' : String(v))]); return this; }
      eq(c, v) { return v === null ? this.is(c, null) : this._f(c, 'eq', v); }
      neq(c, v) { return this._f(c, 'neq', v); }
      gt(c, v) { return this._f(c, 'gt', v); }
      gte(c, v) { return this._f(c, 'gte', v); }
      lt(c, v) { return this._f(c, 'lt', v); }
      lte(c, v) { return this._f(c, 'lte', v); }
      like(c, v) { return this._f(c, 'like', v); }
      ilike(c, v) { return this._f(c, 'ilike', v); }
      in(c, arr) { return this._f(c, 'in', '(' + (arr || []).map(String).join(',') + ')'); }
      is(c, v) { this.filtros.push([c, 'is.' + (v === null ? 'null' : String(v))]); return this; }
      match(obj) { Object.entries(obj || {}).forEach(([c, v]) => this.eq(c, v)); return this; }
      order(c, o = {}) { this.ordenes.push(c + '.' + (o.ascending === false ? 'desc' : 'asc')); return this; }
      limit(n) { this.lim = n; return this; }
      range(a, b) { this.desde = a; this.lim = b - a + 1; return this; }
      single() { this.modo = 'single'; return this; }
      maybeSingle() { this.modo = 'maybe'; return this; }
      then(ok, ko) { return this._ejecutar().then(ok, ko); }
      catch(ko) { return this._ejecutar().catch(ko); }

      _forma(filas, count) {
        if (this.modo === 'single') {
          if (filas.length !== 1) return { data: null, error: { message: 'No se encontró el registro' }, count };
          return { data: filas[0], error: null, count };
        }
        if (this.modo === 'maybe') return { data: filas.length ? filas[0] : null, error: null, count };
        return { data: filas, error: null, count };
      }

      async _ejecutar() {
        const p = new URLSearchParams(this.extra || {});
        this.filtros.forEach(([c, v]) => p.append(c, v));
        const ruta = '/datos/' + encodeURIComponent(this.tabla);
        if (this.metodo === 'GET') {
          if (this.ordenes.length) p.set('orden', this.ordenes.join(','));
          const lim = this.cabeza ? 0 : (this.modo === 'maybe' ? 1 : (this.lim == null ? 1000 : this.lim));
          p.set('limite', String(lim));
          if (this.desde) p.set('desde', String(this.desde));
          if (this.contar) p.set('contar', '1');
          const { data, error } = await http('GET', ruta + '?' + p.toString());
          if (error) return { data: null, error, count: null };
          const count = this.contar ? data.count : null;
          if (this.cabeza) return { data: null, error: null, count };
          try {
            return this._forma(await resolverSelect(this.tabla, this.contar ? data.data : data, partirSelect(this.cols)), count);
          } catch (e) { return { data: null, error: { message: e.message || String(e) }, count }; }
        }
        const qs = p.toString();
        const { data, error } = await http(this.metodo, ruta + (qs ? '?' + qs : ''), this.cuerpo);
        if (error) return { data: null, error };
        if (!this.devolver && this.modo === 'lista') return { data: null, error: null };
        const filas = Array.isArray(data) ? data : (data ? [data] : []);
        try {
          return this._forma(await resolverSelect(this.tabla, filas, partirSelect(this.cols)), null);
        } catch (e) { return { data: null, error: { message: e.message || String(e) } }; }
      }
    }

    // ---------------- sesión: sb.auth ----------------
    const auth = {
      async signInWithPassword({ email, password }) {
        const { data, error } = await http('POST', '/auth/login', { email, clave: password });
        if (error) return { data: { session: null, user: null }, error };
        guardar(aSesion(data)); avisar('SIGNED_IN');
        return { data: { session, user: session.user }, error: null };
      },
      async signUp({ email, password, options = {} }) {
        const md = options.data || {};
        const { data, error } = await http('POST', '/auth/registro', {
          email, clave: password, nombre: md.full_name || null, telefono: md.phone || null, metadatos: md,
        });
        if (error) return { data: { session: null, user: null }, error };
        guardar(aSesion(data)); avisar('SIGNED_IN');
        return { data: { session, user: session.user }, error: null };
      },
      async signOut() { guardar(null); avisar('SIGNED_OUT'); return { error: null }; },
      async getSession() { return { data: { session }, error: null }; },
      async getUser() { return { data: { user: session ? session.user : null }, error: null }; },
      onAuthStateChange(cb) {
        oyentes.add(cb);
        setTimeout(() => {
          try { cb(tokenRecuperacion ? 'PASSWORD_RECOVERY' : 'INITIAL_SESSION', session); } catch (e) { console.error(e); }
        }, 0);
        return { data: { subscription: { unsubscribe: () => oyentes.delete(cb) } } };
      },
      async resetPasswordForEmail(email, opts = {}) {
        const { error } = await http('POST', '/auth/recuperar', {
          email, redirect: opts.redirectTo || (location.origin + location.pathname),
        });
        return { data: {}, error };
      },
      async updateUser({ password } = {}) {
        if (!password) return { data: { user: session ? session.user : null }, error: null };
        if (!tokenRecuperacion && !session) {
          return { data: null, error: { message: 'Para cambiar la contraseña usa "¿Olvidaste tu contraseña?" y abre el enlace del correo.' } };
        }
        const { data, error } = tokenRecuperacion
          ? await http('POST', '/auth/restablecer', { token: tokenRecuperacion, clave: password })
          : await http('POST', '/auth/actualizar', { clave: password });
        if (error) return { data: null, error };
        tokenRecuperacion = null;
        guardar(aSesion(data)); avisar('USER_UPDATED');
        return { data: { user: session.user }, error: null };
      },
    };

    // ---------------- "tiempo real": revisa cambios cada 15 s ----------------
    const CADA_MS = 15000;
    function channel() {
      const canal = {
        manejadores: [], firmas: {}, vistos: {}, timer: null, ocupado: false,
        on(tipo, filtro, cb) {
          if (tipo === 'postgres_changes' && filtro && filtro.table) canal.manejadores.push({ tabla: filtro.table, cb });
          return canal;
        },
        subscribe(cb) {
          canal.timer = setInterval(revisar, CADA_MS);
          document.addEventListener('visibilitychange', alVolver);
          revisar();
          if (cb) setTimeout(() => cb('SUBSCRIBED'), 0);
          return canal;
        },
        unsubscribe() {
          clearInterval(canal.timer); canal.timer = null;
          document.removeEventListener('visibilitychange', alVolver);
          return Promise.resolve('ok');
        },
      };
      function alVolver() { if (!document.hidden) revisar(); }
      async function recientes(t) {
        const r = await http('GET', '/datos/' + t + '?orden=created_at.desc&limite=10');
        return r.error || !Array.isArray(r.data) ? [] : r.data;
      }
      async function revisar() {
        if (!session || document.hidden || canal.ocupado || !canal.manejadores.length) return;
        canal.ocupado = true;
        try {
          const tablas = [...new Set(canal.manejadores.map(m => m.tabla))];
          const { data, error } = await http('GET', '/cambios?tablas=' + tablas.map(encodeURIComponent).join(','));
          if (error || !data) return;
          for (const t of tablas) {
            const antes = canal.firmas[t];
            canal.firmas[t] = data[t];
            if (antes === undefined) {  // primera vez: recordar lo que ya existe
              canal.vistos[t] = new Set((await recientes(t)).map(f => f.id).filter(Boolean));
              continue;
            }
            if (antes === data[t]) continue;
            const vistos = canal.vistos[t] || (canal.vistos[t] = new Set());
            const nuevos = (await recientes(t)).filter(f => f.id && !vistos.has(f.id));
            nuevos.forEach(f => vistos.add(f.id));
            canal.manejadores.filter(m => m.tabla === t).forEach(m => {
              try {
                if (nuevos.length) nuevos.forEach(f => m.cb({ eventType: 'INSERT', table: t, schema: 'public', new: f, old: {} }));
                else m.cb({ eventType: 'UPDATE', table: t, schema: 'public', new: {}, old: {} });
              } catch (e) { console.error(e); }
            });
          }
        } finally { canal.ocupado = false; }
      }
      return canal;
    }

    // ---------------- archivos: sb.storage.from(bucket) ----------------
    const storage = {
      from(bucket) {
        const b = encodeURIComponent(bucket);
        const limpia = r => String(r).replace(/^\/+/, '').split('/').map(encodeURIComponent).join('/');
        return {
          async upload(ruta, archivo, opts = {}) {
            const headers = { 'Content-Type': opts.contentType || (archivo && archivo.type) || 'application/octet-stream' };
            if (session) headers.Authorization = 'Bearer ' + session.access_token;
            let r;
            try {
              r = await fetch(API + '/almacen/' + b + '/' + limpia(ruta) + (opts.upsert ? '?upsert=1' : ''), { method: 'POST', headers, body: archivo });
            } catch (e) { return { data: null, error: { message: 'Failed to fetch: no se pudo subir el archivo.' } }; }
            const d = await r.json().catch(() => null);
            if (!r.ok) return { data: null, error: { message: (d && d.detail) || 'Error ' + r.status, statusCode: String(r.status) } };
            return { data: { path: ruta, fullPath: bucket + '/' + ruta }, error: null };
          },
          update(ruta, archivo, opts = {}) { return this.upload(ruta, archivo, { ...opts, upsert: true }); },
          getPublicUrl(ruta) { return { data: { publicUrl: API + '/almacen/publico/' + b + '/' + limpia(ruta) } }; },
          remove(rutas) { return http('DELETE', '/almacen/' + b, { rutas: [].concat(rutas || []) }); },
        };
      },
    };

    return {
      servidor: 'orion',
      storage,
      from: tabla => new Consulta(tabla),
      rpc: (fn, args = {}) => http('POST', '/rpc/' + encodeURIComponent(fn), args),
      auth,
      channel,
      removeChannel: canal => (canal && canal.unsubscribe ? canal.unsubscribe() : Promise.resolve('ok')),
      functions: { invoke: (nombre, opts = {}) => http('POST', '/funciones/' + encodeURIComponent(nombre), opts.body || {}) },
    };
  }

  window.orionSupabase = { createClient: crearCliente };
})();
