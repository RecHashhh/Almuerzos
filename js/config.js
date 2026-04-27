// ══════════════════════════════════════════════════════
//  RIPCONCIV — CONFIGURACIÓN CENTRAL
//  Edita este archivo antes de publicar en GitHub Pages
// ══════════════════════════════════════════════════════

const CONFIG = {
  // ── Supabase ──
  supabaseUrl: 'https://ttqxkpjsxjcttgwmvthz.supabase.co',
  supabaseKey: 'sb_publishable_zewVZ7jawj5T3H8mWi-3kA_322dgRkI',

  // ── Microsoft Azure AD ──
  msalConfig: {
    auth: {
      clientId:    '46eb1c2a-0010-4b20-ab75-09de560b26e8',
      authority:   'https://login.microsoftonline.com/12f2a4b5-4935-464d-9dae-e0525d0c593f',
      redirectUri: window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/'),
    },
    cache: { cacheLocation: 'sessionStorage', storeAuthStateInCookie: false }
  },
  msalScopes: ['User.Read'],
  dominioPermitido: 'ripconciv.com',

  // ── Contraseñas panel admin/cocina ──
  // ⚠️ CAMBIAR ANTES DE PUBLICAR
  usuarios: {
    admin:  { password: 'Admin2026!',  rol: 'admin'  },
    cocina: { password: 'Cocina2026!', rol: 'cocina' },
    supervisor: { password: 'Supervisor2026!', rol: 'supervisor' }
  },

  // ── Configuración general ──
  timezone:        'America/Guayaquil',
  refreshInterval: 30000,   // ms entre auto-refreshes en cocina
  totalEmpleados:  37,

  // ── Token para links de invitado (cámbialo periódicamente) ──
  invitadoSecret: 'RIPC2026INV',
};

// ── Lista de empleados ──
const EMPLEADOS = [
"MARIA AGUIRRE",
"LUCIA ARCINIEGA",
"TATIANA BASTIDAS",
"MIREYA BENITEZ",
"JENIFER CAMACHO",
"BRUNO CEVALLOS",
"KARINA CHAVEZ",
"CARLOS CHIMBO",
"NANCY CORDOVA",
"STEPHANY FREIRE",
"WILLIAM GARZON",
"GISSELA HERNANDEZ",
"DIANA HERRERA",
"JHOSSELYN ILLAPA",
"BERTHA JARAMILLO",
"GABRIELA JIMENEZ",
"JAVIER JIMENEZ",
"JESICA LALANGUI",
"ANTHONY LUJE",
"DIEGO MENDOZA",
"DANIEL MESIAS",
"TATIANA MOLINA",
"ARIADNA NEJER",
"FREDDY NIETO",
"VANESSA PALACIO",
"JENNY PALACIOS",
"PAOLA PALOMINO",
"RICARDO PAZMIÑO",
"MARIA PEÑA",
"BYRON PULLAY",
"ALBERTO REYES",
"DAVID RODRIGUEZ",
"JEANETH SANTANA",
"ANGELICA SANTOS",
"CARLOS TRUJILLO",
"LOURDES VITERI",
"JOSGREHER VIERA"
];

// ══ Utilidades globales ══

function fechaHoy() {
  const ec = new Date(new Date().toLocaleString('en-US', { timeZone: CONFIG.timezone }));
  return `${ec.getFullYear()}-${String(ec.getMonth()+1).padStart(2,'0')}-${String(ec.getDate()).padStart(2,'0')}`;
}

function fechaDisplay(iso) {
  if (!iso) return '';
  const [y,m,d] = iso.split('-');
  const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const DIAS  = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const dt    = new Date(+y, +m-1, +d);
  return `${DIAS[dt.getDay()]}, ${d} de ${MESES[+m-1]} de ${y}`;
}

function horaDisplay(ts) {
  return new Date(ts).toLocaleTimeString('es-EC', { hour:'2-digit', minute:'2-digit', timeZone: CONFIG.timezone });
}

// Session helpers (admin/cocina panel)
function getSession()        { try { return JSON.parse(sessionStorage.getItem('rip_sess')||'null'); } catch { return null; } }
function setSession(rol)     { sessionStorage.setItem('rip_sess', JSON.stringify({ rol, ts: Date.now() })); }
function clearSession()      { sessionStorage.removeItem('rip_sess'); }
function requireAuth(rol)    { const s=getSession(); if(!s||s.rol!==rol){ window.location.href='login.html?rol='+rol; return false; } return true; }

// Invitado token helpers
function makeInviteToken(fecha) {
  // Simple deterministic token: secret + fecha hashed via btoa
  return btoa(CONFIG.invitadoSecret + '|' + fecha).replace(/=/g,'');
}
function validateInviteToken(token, fecha) {
  return token === makeInviteToken(fecha);
}