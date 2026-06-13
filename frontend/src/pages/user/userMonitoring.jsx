//COMENTARIO IMPORTANTE 
// DELEY en cargar el css — CORREGIDO


import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import whiteLogo from "../../assets/whiteLogo.png";
import NotificationBell from "../../components/Notifications";
import { logout } from "../../services/authService";
import { getUserProfile } from "../../services/userService";
import { getSensorData, getSensorHistory } from "../../services/deviceService";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

/* ══ CSS ══ */
const GLOBAL_CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --ink:#00082C;--i70:rgba(0,8,44,.70);--i50:rgba(0,8,44,.50);--i40:rgba(0,8,44,.40);
  --i24:rgba(0,8,44,.24);--i16:rgba(0,8,44,.16);--i10:rgba(0,8,44,.10);
  --i07:rgba(0,8,44,.07);--i04:rgba(0,8,44,.04);
  --page:#F0F0F4;--card:rgba(255,255,255,.86);
  --green:#0C8A5A;--green-t:rgba(12,138,90,.10);
  --amber:#9A6214;--amber-t:rgba(154,98,20,.10);
  --red:#C0392B;--red-t:rgba(192,57,43,.10);
  --shadow:0 1px 2px rgba(0,8,44,.03),0 4px 12px rgba(0,8,44,.05),0 16px 40px rgba(0,8,44,.07);
  --shadow-sm:0 1px 2px rgba(0,8,44,.03),0 2px 8px rgba(0,8,44,.05);
  --sb-w:250px;--tb-h:62px;--r:18px;--r-sm:10px;--r-xs:8px;
  --mq2:#1D4ED8;--mq7:#0C8A5A;--mq4:#7C3AED;
}
html,body{min-height:100vh;width:100%;font-family:'DM Sans',system-ui,sans-serif;background:var(--page);color:var(--ink);-webkit-font-smoothing:antialiased;overflow-x:hidden;}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes alertRing{0%,100%{box-shadow:var(--shadow)}50%{box-shadow:0 0 0 3px rgba(192,57,43,.20),var(--shadow)}}

/* Overlay */
.rm-overlay{display:none;position:fixed;inset:0;z-index:40;background:rgba(0,8,44,.50);animation:fadeIn .22s ease;}
.rm-overlay.open{display:block;}

/* Layout */
.rm-layout{display:flex;min-height:100vh;position:relative;z-index:1;}

/* Sidebar base — sin backdrop-filter ni rgba para que móvil sea opaco */
.rm-sidebar{
  width:var(--sb-w);background:#f5f5f9;border-right:0.5px solid var(--i07);
  display:flex;flex-direction:column;
  position:fixed;top:0;left:0;bottom:0;height:100%;z-index:30;
  transition:transform .28s cubic-bezier(.4,0,.2,1);
  overflow-y:auto;overflow-x:hidden;
  will-change:transform;
}
@media(min-width:961px){
  .rm-sidebar{
    background:rgba(255,255,255,.74);
    backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);
    box-shadow:1px 0 0 rgba(255,255,255,.60),2px 0 12px rgba(0,8,44,.04);
  }
}
.rm-sidebar::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.9) 50%,transparent);pointer-events:none;}
.rm-sidebar.open{transform:translateX(0)!important;}
.rm-sb-brand{padding:26px 20px 22px;display:flex;align-items:center;gap:11px;}
.rm-sb-close{display:none;margin-left:auto;width:28px;height:28px;border-radius:8px;border:0.5px solid var(--i10);background:var(--i04);align-items:center;justify-content:center;cursor:pointer;color:var(--i40);flex-shrink:0;}
.rm-sb-mark{width:32px;height:32px;background:var(--ink);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 8px rgba(0,8,44,.22),inset 0 1px 0 rgba(255,255,255,.10);}
.rm-sb-name{font-size:15px;font-weight:600;letter-spacing:-.02em;}
.rm-sb-tag{font-size:9px;font-weight:500;color:var(--i40);letter-spacing:.09em;text-transform:uppercase;margin-top:1px;}
.rm-sb-nav{padding:18px 13px;flex:1;}
.rm-sb-item{display:flex;align-items:center;gap:10px;height:38px;padding:0 11px;border-radius:var(--r-xs);border:0.5px solid transparent;cursor:pointer;transition:all .17s;margin-bottom:2px;text-decoration:none;color:inherit;position:relative;background:none;width:100%;}
.rm-sb-item svg{color:var(--i40);flex-shrink:0;transition:color .17s;}
.rm-sb-item span{font-size:12.5px;color:var(--i50);transition:color .17s;}
.rm-sb-item:hover{background:var(--i04);border-color:var(--i07);}
.rm-sb-item:hover svg,.rm-sb-item:hover span{color:var(--i70);}
.rm-sb-item.active{background:var(--i07);border-color:var(--i10);}
.rm-sb-item.active span{color:var(--ink);font-weight:500;}
.rm-sb-item.active svg{color:var(--ink);}
.rm-sb-item.active::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:2.5px;height:16px;background:var(--ink);border-radius:0 3px 3px 0;opacity:.55;}
.rm-sb-footer{padding:14px 13px;border-top:0.5px solid var(--i07);position:relative;}
.rm-sb-profile{display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:var(--r-xs);border:0.5px solid transparent;cursor:pointer;transition:all .17s;}
.rm-sb-profile:hover{background:var(--i04);border-color:var(--i07);}
.rm-sb-av{width:32px;height:32px;border-radius:8px;background:var(--i07);border:0.5px solid var(--i10);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:var(--i70);flex-shrink:0;}
.rm-sb-pname{font-size:12px;font-weight:500;color:var(--i70);}
.rm-sb-prole{font-size:10px;color:var(--i40);margin-top:1px;}
.rm-sb-dots{margin-left:auto;color:var(--i24);}
.rm-sb-dropdown{display:none;position:absolute;bottom:100%;left:14px;right:14px;margin-bottom:8px;background:var(--card);border:0.5px solid var(--i10);border-radius:var(--r-sm);box-shadow:0 4px 16px rgba(0,8,44,.12);overflow:hidden;z-index:40;animation:fadeUp .2s ease both;}
.rm-sb-dropdown.open{display:block;}
.rm-sb-dd-item{display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;transition:background .17s;text-decoration:none;color:inherit;background:none;border:none;width:100%;}
.rm-sb-dd-item:hover{background:var(--i04);}
.rm-sb-dd-item svg{width:14px;height:14px;color:var(--i40);flex-shrink:0;}
.rm-sb-dd-item span{font-size:12px;color:var(--i50);}
.rm-sb-dd-item:hover svg,.rm-sb-dd-item:hover span{color:var(--i70);}
.rm-sb-divider{height:0.5px;background:var(--i07);}

/* Topbar */
.rm-content{margin-left:var(--sb-w);flex:1;display:flex;flex-direction:column;min-height:100vh;min-width:0;}
.rm-topbar{height:var(--tb-h);background:rgba(240,240,244,.90);backdrop-filter:blur(24px) saturate(1.3);-webkit-backdrop-filter:blur(24px) saturate(1.3);border-bottom:0.5px solid var(--i07);position:fixed;top:0;left:var(--sb-w);right:17px;z-index:20;display:flex;align-items:center;padding:0 clamp(16px,3vw,32px);gap:12px;box-shadow:0 1px 0 rgba(255,255,255,.65),0 4px 16px rgba(0,8,44,.03);will-change:transform;}
.rm-tb-hamburger{display:none;width:34px;height:34px;border-radius:9px;border:0.5px solid var(--i10);background:rgba(255,255,255,.60);align-items:center;justify-content:center;cursor:pointer;color:var(--i50);flex-shrink:0;}
.rm-tb-bc{display:flex;align-items:center;gap:7px;}
.rm-tb-bc-root{font-size:12px;color:var(--i40);}
.rm-tb-bc-sep{font-size:11px;color:var(--i16);}
.rm-tb-bc-cur{font-size:12px;font-weight:500;color:var(--i70);}
.rm-tb-space{flex:1;}
.rm-tb-ico{width:34px;height:34px;border-radius:9px;border:0.5px solid var(--i10);background:rgba(255,255,255,.60);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--i50);transition:all .17s;position:relative;flex-shrink:0;}
.rm-tb-ico:hover{background:rgba(255,255,255,.88);color:var(--i70);}
.rm-notif-dot{position:absolute;top:7px;right:7px;width:5px;height:5px;background:var(--ink);border-radius:50%;border:1.5px solid var(--page);}
.rm-tb-avatar{width:34px;height:34px;border-radius:9px;background:var(--ink);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .17s;flex-shrink:0;border:0.5px solid transparent;outline:none;color:rgba(255,255,255,.75);}
.rm-tb-avatar:hover{background:#1a2a5e;transform:translateY(-1px);}

/* Page */
.rm-page{padding-top:calc(var(--tb-h) + 26px);padding-left:clamp(14px,3vw,32px);padding-right:clamp(14px,3vw,32px);padding-bottom:40px;flex:1;display:flex;flex-direction:column;gap:14px;}

/* Header */
.rm-ph{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
.rm-ph-left h1{font-size:20px;font-weight:500;letter-spacing:-.03em;line-height:1.2;margin-bottom:3px;}
.rm-ph-left p{font-size:12.5px;color:var(--i40);}
.rm-ph-status{display:flex;align-items:center;gap:8px;flex-shrink:0;}
.rm-ph-status span{font-size:11.5px;font-weight:500;color:var(--i70);}
.rm-ph-status.alert-mode span{color:#870505;}

/* Alert banner */
.rm-alert-banner{display:none;align-items:flex-start;gap:14px;padding:20px 24px;background:linear-gradient(135deg,rgba(135,5,5,.03) 0%,rgba(135,5,5,.01) 100%);border:0.5px solid rgba(135,5,5,.08);border-radius:var(--r-sm);box-shadow:0 1px 3px rgba(0,8,44,.04),0 4px 12px rgba(0,8,44,.02);}
.rm-alert-banner.visible{display:flex;}
.rm-alert-banner svg{flex-shrink:0;margin-top:1px;}
.rm-alert-banner-text{font-size:13px;font-weight:500;color:#870505;letter-spacing:-.005em;line-height:1.45;margin-bottom:3px;}
.rm-alert-banner-sensors{font-size:11.5px;color:rgba(135,5,5,.55);letter-spacing:-.005em;line-height:1.35;font-weight:400;}

/* Section label */
.rm-section-label{font-size:10px;font-weight:500;color:var(--i40);letter-spacing:.10em;text-transform:uppercase;}

/* Device picker */
.rm-dev-picker{position:relative;display:inline-block;}
.rm-dev-trigger{display:flex;align-items:center;gap:9px;padding:7px 13px 7px 11px;border-radius:var(--r-xs);border:0.5px solid var(--i10);background:rgba(255,255,255,.70);cursor:pointer;user-select:none;transition:background .18s,border-color .18s;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);}
.rm-dev-trigger:hover{background:rgba(255,255,255,.90);border-color:var(--i16);}
.rm-dev-trigger-name{font-size:12.5px;font-weight:500;color:var(--ink);}
.rm-dev-trigger-chevron{color:var(--i40);transition:transform .22s;flex-shrink:0;}
.rm-dev-picker.open .rm-dev-trigger-chevron{transform:rotate(180deg);}
.rm-dev-dropdown{display:none;position:absolute;top:calc(100% + 6px);left:0;min-width:200px;background:rgba(255,255,255,.96);border:0.5px solid var(--i10);border-radius:var(--r-sm);box-shadow:0 4px 20px rgba(0,8,44,.10);overflow:hidden;z-index:50;animation:fadeUp .18s ease both;}
.rm-dev-picker.open .rm-dev-dropdown{display:block;}
.rm-dev-option{display:flex;align-items:center;gap:10px;padding:9px 13px;cursor:pointer;transition:background .15s;}
.rm-dev-option:hover{background:var(--i04);}
.rm-dev-option.active{background:var(--i07);}
.rm-dev-option-name{font-size:12.5px;font-weight:400;color:var(--i50);}
.rm-dev-option.active .rm-dev-option-name{color:var(--i70);font-weight:500;}
.rm-dev-option-check{margin-left:auto;color:var(--green);opacity:0;flex-shrink:0;}
.rm-dev-option.active .rm-dev-option-check{opacity:1;}

/* Monitor header */
.rm-monitor-header{display:flex;align-items:center;justify-content:space-between;gap:12px;}

/* Sensor cards */
.rm-sensor-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.rm-sc{background:var(--card);border:0.5px solid var(--i07);border-radius:var(--r);box-shadow:var(--shadow);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);padding:18px 20px;display:flex;align-items:center;gap:16px;position:relative;overflow:hidden;transition:box-shadow .3s;}
.rm-sc::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.9) 50%,transparent);pointer-events:none;}
.rm-sc-status-corner{position:absolute;top:12px;right:12px;}
.rm-sc.alert-card{animation:alertRing 1.8s ease-in-out infinite;}
.rm-sc-icon{width:44px;height:44px;border-radius:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:20px;transition:background .3s,border-color .3s;}
.rm-sc-icon.mq2{background:#F4F6FA;border:0.5px solid rgba(29,78,216,.18);}
.rm-sc-icon.mq7{background:#F4F6FA;border:0.5px solid rgba(12,138,90,.18);}
.rm-sc-icon.mq4{background:#F4F6FA;border:0.5px solid rgba(124,58,237,.18);}
.rm-sc-icon.alert-icon{background:#F4F6FA!important;}
.rm-sc-icon.warn-icon{background:#F4F6FA!important;}
.rm-sc-body{flex:1;min-width:0;}
.rm-sc-label{font-size:10px;font-weight:500;color:var(--i40);letter-spacing:.08em;text-transform:uppercase;margin-bottom:3px;}
.rm-sc-val{font-size:28px;font-weight:600;letter-spacing:-.04em;line-height:1;font-variant-numeric:tabular-nums;transition:color .3s;color:#00082C;}
.rm-sc-unit{font-size:13px;color:var(--i40);}
.rm-sc-status{display:inline-flex;align-items:center;gap:5px;margin-top:6px;padding:3px 9px;border-radius:99px;font-size:10.5px;font-weight:500;transition:background .3s,color .3s;}
.rm-sc-status.safe{background:rgba(54,102,86,.08);color:#366656;border:0.5px solid rgba(54,102,86,.16);}
.rm-sc-status.warn{background:var(--amber-t);color:var(--amber);border:0.5px solid rgba(154,98,20,.18);}
.rm-sc-status.danger{background:rgba(135,5,5,.08);color:#870505;border:0.5px solid rgba(135,5,5,.18);}

/* Charts */
.rm-charts-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;}
.rm-chart-card{background:var(--card);border:0.5px solid var(--i07);border-radius:var(--r);box-shadow:var(--shadow);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);display:flex;flex-direction:column;overflow:hidden;position:relative;}
.rm-chart-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(0,8,44,.13) 50%,transparent);pointer-events:none;z-index:2;}
.rm-chart-card.alert-chart{border-color:rgba(192,57,43,.22);box-shadow:0 0 0 2px rgba(192,57,43,.08),var(--shadow);}
.rm-card-head{display:flex;align-items:center;padding:14px 18px 12px;gap:10px;border-bottom:0.5px solid var(--i07);background:rgba(255,255,255,.28);flex-shrink:0;}
.rm-ch-title{font-size:13px;font-weight:500;letter-spacing:-.015em;}
.rm-ch-space{flex:1;}
.rm-chart-body{padding:14px 16px 16px;flex:1;display:flex;flex-direction:column;min-height:0;}
.rm-chart-wrap{flex:1;min-height:200px;position:relative;}
.rm-chart-stats{display:flex;gap:0;margin-top:12px;border:0.5px solid var(--i07);border-radius:var(--r-xs);overflow:hidden;}
.rm-cs-item{flex:1;padding:8px 12px;text-align:center;border-right:0.5px solid var(--i07);}
.rm-cs-item:last-child{border-right:none;}
.rm-cs-val{font-size:13px;font-weight:600;letter-spacing:-.03em;font-variant-numeric:tabular-nums;color:var(--i70);}
.rm-cs-lbl{font-size:9.5px;color:var(--i40);margin-top:2px;text-transform:uppercase;letter-spacing:.05em;}

/* Responsive */
@media(max-width:1200px){.rm-charts-grid{grid-template-columns:1fr 1fr;}}
@media(min-width:961px) and (max-width:1100px){
  :root{--sb-w:64px;}
  .rm-sb-name,.rm-sb-tag,.rm-sb-item span,.rm-sb-pname,.rm-sb-prole,.rm-sb-dots{display:none;}
  .rm-sb-brand{padding:20px 12px;justify-content:center;}
  .rm-sb-mark{width:40px;height:40px;}
  .rm-sb-nav{padding:12px 8px;}
  .rm-sb-item{justify-content:center;padding:12px 8px;}
  .rm-sb-footer{padding:12px 8px;display:flex;justify-content:center;}
  .rm-sb-profile{justify-content:center;gap:0;padding:0;width:40px;height:40px;}
}
@media(max-width:960px){
  :root{--sb-w:0px;--tb-h:58px;}
  .rm-sidebar{width:100%!important;transform:translateX(-100%);position:fixed;top:0;left:0;bottom:0;height:100%!important;z-index:50;background:#f5f5f9!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;box-shadow:none!important;transition:transform .28s cubic-bezier(.4,0,.2,1);}
  .rm-sidebar.open{transform:translateX(0)!important;}
  .rm-sb-name,.rm-sb-tag,.rm-sb-item span,.rm-sb-pname,.rm-sb-prole,.rm-sb-dots{display:revert!important;}
  .rm-sb-brand{padding:28px 24px 24px;justify-content:flex-start!important;}
  .rm-sb-nav{padding:20px 18px;}
  .rm-sb-item{justify-content:flex-start!important;padding:0 14px!important;width:100%!important;margin:0 0 2px!important;height:48px!important;}
  .rm-sb-footer{padding:18px;}
  .rm-sb-profile{justify-content:flex-start!important;}
  .rm-sb-close{display:flex!important;}
  .rm-content{margin-left:0;}
  .rm-topbar{left:0;right:0;padding:0 20px;gap:10px;}
  .rm-tb-hamburger{display:flex!important;}
  .rm-page{padding:calc(var(--tb-h) + 20px) 16px 48px;}
}
@media(max-width:768px){
  :root{--tb-h:54px;}
  .rm-topbar{padding:0 14px;right:0;}
  .rm-tb-bc-root,.rm-tb-bc-sep{display:none;}
  .rm-page{padding-top:calc(var(--tb-h) + 16px);padding-left:12px;padding-right:12px;padding-bottom:32px;}
  .rm-ph-left h1{font-size:18px;}
  .rm-sensor-cards{grid-template-columns:1fr;gap:10px;}
  .rm-charts-grid{grid-template-columns:1fr;gap:12px;}
  .rm-chart-wrap{min-height:160px;}
}
@media(max-width:400px){
  .rm-page{padding-left:10px;padding-right:10px;}
}
.rm-chart-wrap svg,.rm-chart-wrap svg:focus,.rm-chart-wrap *:focus{outline:none!important;box-shadow:none!important;}
`;

/* ══════════════════════════════════════
   CORRECCIÓN: Inyectar CSS a nivel de módulo,
   FUERA de cualquier componente o useEffect.
   Esto garantiza que los estilos estén en el DOM
   antes del primer render de React.
══════════════════════════════════════ */
if (typeof document !== 'undefined') {
  const _id = 'rilambMonitoreoStyles';
  if (!document.getElementById(_id)) {
    const _style = document.createElement('style');
    _style.id = _id;
    _style.textContent = GLOBAL_CSS;
    document.head.appendChild(_style);
  }
}

/* ══ CONSTANTES ══ */
// Datos estáticos eliminados - ahora se cargan desde la API
const SENSORS = {
  mq2:{ min:100, max:400, warnAt:250, alertAt:300 },
  mq4:{ min:120, max:500, warnAt:300, alertAt:380 },
  mq7:{ min:80,  max:350, warnAt:200, alertAt:250 },
};

const STATUS_COLORS = {
  safe:   { line:'#366656', fill:'rgba(54,102,86,.18)'  },
  warn:   { line:'#c9964d', fill:'rgba(201,150,77,.18)' },
  danger: { line:'#870505', fill:'rgba(135,5,5,.18)'    },
};

const MAX_POINTS = 30;

/* ══ Helpers ══ */
function nowLabel() {
  const d = new Date();
  return d.getHours().toString().padStart(2,'0')+':'+d.getMinutes().toString().padStart(2,'0')+':'+d.getSeconds().toString().padStart(2,'0');
}

function nextVal(current, cfg) {
  let drift = (Math.random() - 0.49) * 28;
  let next = current + drift;
  if (next < cfg.min) next = cfg.min + Math.random() * 30;
  if (next > cfg.max) next = cfg.max - Math.random() * 30;
  if (Math.random() < 0.04) next = cfg.min + Math.random() * (cfg.max - cfg.min);
  return Math.round(next);
}

function sensorStatus(val, cfg) {
  if (val >= cfg.alertAt) return 'danger';
  if (val >= cfg.warnAt)  return 'warn';
  return 'safe';
}

/* ══ Icons ══ */
const IcoMenu   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IcoX      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoLogout = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.95)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IcoDots   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const IcoUser   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcoLock   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcoMonitor= () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IcoFile   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IcoDevice = () => <svg width="15" height="15" viewBox="0 0 40 40" fill="none"><rect x="1.5" y="1.5" width="37" height="37" rx="9" stroke="currentColor" strokeWidth="2.2" fill="none"/><circle cx="20" cy="22" r="10.5" stroke="currentColor" strokeWidth="1.6" fill="none" opacity=".5"/><circle cx="20" cy="22" r="1.7" fill="currentColor"/></svg>;

/* ══ Sensor icons ══ */
const IcoMQ2 = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3C12 3 4 10 4 16C4 20 7.6 23 12 23C16.4 23 20 20 20 16C20 10 12 3 12 3Z"/>
  </svg>
);
const IcoMQ3 = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3"/><circle cx="6" cy="16" r="3"/><circle cx="18" cy="16" r="3"/>
    <line x1="12" y1="8" x2="7.5" y2="13.5"/><line x1="12" y1="8" x2="16.5" y2="13.5"/>
  </svg>
);
const IcoMQ4 = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3C12 3 4 10 4 17C4 21 7.6 24 12 24C16.4 24 20 21 20 17C20 10 12 3 12 3Z"/>
    <circle cx="12" cy="17" r="4" strokeWidth="1" opacity=".7"/>
  </svg>
);

/* ══ Custom Tooltip for recharts ══ */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background:'rgba(0,8,44,.88)', border:'0.5px solid rgba(255,255,255,.08)', borderRadius:10, padding:'8px 12px' }}>
      <div style={{ fontSize:10, fontWeight:500, color:'rgba(255,255,255,.60)', marginBottom:3 }}>{label}</div>
      <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,.95)' }}>{payload[0].value} PPM</div>
    </div>
  );
}

/* ══ Chart Card ══ */
function ChartCard({ sensor, title, data, labels, isAlert }) {
  const chartData = labels.map((lbl, i) => ({ t: lbl, v: data[i] ?? 0 }));
  const lastVal   = data.length ? data[data.length - 1] : 0;
  const st        = sensorStatus(lastVal, SENSORS[sensor]);
  const color     = STATUS_COLORS[st].line;
  const min       = data.length ? Math.min(...data) : null;
  const max       = data.length ? Math.max(...data) : null;
  const avg       = data.length ? Math.round(data.reduce((a,b)=>a+b,0)/data.length) : null;
  const cfg       = SENSORS[sensor];
  const wrapRef   = useRef(null);

  const handleBlurFocus = () => {
    requestAnimationFrame(() => {
      if (!wrapRef.current) return;
      const svg = wrapRef.current.querySelector('svg');
      if (svg) svg.blur();
      wrapRef.current.blur();
    });
  };

  return (
    <div className={`rm-chart-card${isAlert ? ' alert-chart' : ''}`}>
      <div className="rm-card-head">
        <div><div className="rm-ch-title">{title}</div></div>
        <div className="rm-ch-space" />
      </div>
      <div className="rm-chart-body">
        <div className="rm-chart-wrap" ref={wrapRef} onMouseDown={handleBlurFocus} onTouchStart={handleBlurFocus}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top:4, right:4, left:0, bottom:0 }}>
              <CartesianGrid stroke="rgba(0,8,44,.05)" strokeDasharray="" vertical={false}/>
              <XAxis dataKey="t" tick={{ fontSize:9.5, fill:'rgba(0,8,44,.30)' }} tickLine={false} axisLine={false} interval="preserveStartEnd"/>
              <YAxis domain={[Math.round(cfg.min*0.88), Math.round(cfg.max*1.08)]} tick={{ fontSize:9.5, fill:'rgba(0,8,44,.30)' }} tickLine={false} axisLine={false} tickFormatter={v=>v+' PPM'} width={60}/>
              <Tooltip content={<CustomTooltip />} cursor={{ stroke:'rgba(0,8,44,.12)', strokeWidth:1, strokeDasharray:'3 3' }}/>
              <Line
                type="monotone" dataKey="v" stroke={color} strokeWidth={2}
                dot={false} activeDot={{ r:5, fill:color, stroke:'#fff', strokeWidth:2 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rm-chart-stats">
          <div className="rm-cs-item"><div className="rm-cs-val">{min ?? '—'}</div><div className="rm-cs-lbl">Mín</div></div>
          <div className="rm-cs-item"><div className="rm-cs-val">{avg ?? '—'}</div><div className="rm-cs-lbl">Prom</div></div>
          <div className="rm-cs-item"><div className="rm-cs-val">{max ?? '—'}</div><div className="rm-cs-lbl">Máx</div></div>
        </div>
      </div>
    </div>
  );
}

/* ══ MAIN ══ */
export default function RilAmbMonitoreo() {
  const navigate = useNavigate();
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasDevice,   setHasDevice]    = useState(false);
  const [loading,     setLoading]      = useState(true);
  const [snapshot,    setSnapshot]     = useState({ mq2:[], mq4:[], mq7:[], labels:[] });
  const [userData, setUserData] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/session-logo', { replace: true, state: { next: '/' } });
  };

  // CORRECCIÓN: El bloque useEffect que inyectaba el CSS fue eliminado.
  // Los estilos ahora se inyectan a nivel de módulo (ver bloque arriba),
  // garantizando que estén disponibles antes del primer render.

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = e => { if (!e.target.closest('.rm-sb-footer')) setDropdownOpen(false); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  /* Load sensor data from API */
  useEffect(() => {
    const loadSensorData = async () => {
      try {
        const data = await getSensorData();
        setHasDevice(data.has_device);
        
        if (data.has_device) {
          // Cargar historial inicial
          const history = await getSensorHistory(MAX_POINTS);
          if (history && history.length > 0) {
            const adaptedData = {
              mq2: history.map(h => h.mq2),
              mq4: history.map(h => h.mq4),
              mq7: history.map(h => h.mq7),
              labels: history.map(h => {
                const d = new Date(h.timestamp);
                return d.getHours().toString().padStart(2,'0')+':'+d.getMinutes().toString().padStart(2,'0')+':'+d.getSeconds().toString().padStart(2,'0');
              })
            };
            setSnapshot(adaptedData);
          } else {
            // Si no hay historial, usar datos actuales
            setSnapshot({
              mq2: [data.mq2],
              mq4: [data.mq4],
              mq7: [data.mq7],
              labels: [nowLabel()]
            });
          }
        } else {
          // No tiene dispositivo vinculado → no mostrar datos
          setSnapshot({
            mq2: [],
            mq4: [],
            mq7: [],
            labels: []
          });
        }
      } catch (error) {
        console.error('Error al cargar datos de sensores:', error);
        setHasDevice(false);
        setSnapshot({
          mq2: [],
          mq4: [],
          mq7: [],
          labels: []
        });
      } finally {
        setLoading(false);
      }
    };
    loadSensorData();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile();
        setUserData(data);
      } catch (error) {
        console.error('Error al cargar perfil de usuario:', error);
        setUserData({ nombre: 'Usuario' });
      }
    };

    loadProfile();
  }, []);

  /* Tick — update sensor data every 2s */
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const data = await getSensorData();
        setHasDevice(data.has_device);

        if (!data.has_device) {
          // No tiene dispositivo vinculado → limpiar datos
          setSnapshot({
            mq2: [],
            mq4: [],
            mq7: [],
            labels: []
          });
          return;
        }

        const lbl = nowLabel();
        setSnapshot(prev => {
          const newSnapshot = {
            mq2: [...prev.mq2, data.mq2],
            mq4: [...prev.mq4, data.mq4],
            mq7: [...prev.mq7, data.mq7],
            labels: [...prev.labels, lbl]
          };

          // Mantener solo MAX_POINTS
          if (newSnapshot.mq2.length > MAX_POINTS) {
            newSnapshot.mq2.shift();
            newSnapshot.mq4.shift();
            newSnapshot.mq7.shift();
            newSnapshot.labels.shift();
          }

          return newSnapshot;
        });
      } catch (error) {
        console.error('Error al actualizar datos de sensores:', error);
      }
    }, 2000);
    return () => clearInterval(id);
  }, []);

  /* Derived */
  const lastVals   = {
    mq2: snapshot.mq2.length ? snapshot.mq2[snapshot.mq2.length-1] : 0,
    mq4: snapshot.mq4.length ? snapshot.mq4[snapshot.mq4.length-1] : 0,
    mq7: snapshot.mq7.length ? snapshot.mq7[snapshot.mq7.length-1] : 0,
  };
  const statuses   = { mq2: sensorStatus(lastVals.mq2, SENSORS.mq2), mq4: sensorStatus(lastVals.mq4, SENSORS.mq4), mq7: sensorStatus(lastVals.mq7, SENSORS.mq7) };
  const alertSensors  = ['mq2','mq4','mq7'].filter(s => statuses[s] === 'danger');
  const hasAlert      = alertSensors.length > 0;

  const statusLabel = (st) => st === 'safe' ? 'Seguro' : st === 'warn' ? 'Precaución' : 'Alerta';

  const SENSOR_DEFS = [
    { key:'mq2', label:'Sensor MQ2', title:'MQ2 — Gas combustible / Humo',  Icon: IcoMQ2 },
    { key:'mq7', label:'Sensor MQ7', title:'MQ7 — Alcohol / Benceno',        Icon: IcoMQ3 },
    { key:'mq4', label:'Sensor MQ4', title:'MQ4 — Gas natural / Metano',     Icon: IcoMQ4 },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'var(--page)', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      {/* Fondo degradado — div real, no ::before */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0,
        background:'radial-gradient(ellipse 70% 50% at 8% 4%,rgba(0,8,44,.04) 0%,transparent 55%),radial-gradient(ellipse 55% 40% at 94% 92%,rgba(0,8,44,.032) 0%,transparent 55%)'
      }}/>

      {/* Overlay — fuera del layout */}
      <div className={`rm-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar — fuera del layout */}
      <aside className={`rm-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="rm-sb-brand">
          <div className="rm-sb-mark">
            <img src={whiteLogo} alt="RilAmb" style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
          </div>
          <div><div className="rm-sb-name">RilAmb</div><div className="rm-sb-tag">Platform</div></div>
          <button className="rm-sb-close" onClick={() => setSidebarOpen(false)}><IcoX /></button>
        </div>
        <nav className="rm-sb-nav">
          <button className="rm-sb-item active"><IcoMonitor /><span>Monitoreo</span></button>
          <button className="rm-sb-item" onClick={() => navigate('/reports')}><IcoFile /><span>Reportes</span></button>
          <button className="rm-sb-item" onClick={() => navigate('/devices')}><IcoDevice /><span>Dispositivos</span></button>
        </nav>
        <div className="rm-sb-footer">
          <div className="rm-sb-profile" onClick={() => setDropdownOpen(p => !p)}>
            <div className="rm-sb-av">{loading ? '...' : (userData?.nombre?.[0] || 'U')}</div>
            <div><div className="rm-sb-pname">{userData?.nombre || 'Usuario'}</div><div className="rm-sb-prole">Cuenta personal</div></div>
            <span className="rm-sb-dots"><IcoDots /></span>
          </div>
          <div className={`rm-sb-dropdown${dropdownOpen ? ' open' : ''}`}>
            <button className="rm-sb-dd-item" onClick={() => navigate('/perfil')}><IcoUser /><span>Ver perfil</span></button>
            <div className="rm-sb-divider"/>
            <button
              className="rm-sb-dd-item"
              onClick={() => {
                setDropdownOpen(false);
                setSidebarOpen(false);
                navigate('/perfil', { state: { section: 'seguridad' } });
              }}
            >
              <IcoLock /><span>Cambiar contraseña</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Layout */}
      <div className="rm-layout">
        <div className="rm-content">
          <header className="rm-topbar">
            <button className="rm-tb-hamburger" onClick={() => setSidebarOpen(true)}><IcoMenu /></button>
            <div className="rm-tb-bc">
              <span className="rm-tb-bc-root">RilAmb</span>
              <span className="rm-tb-bc-sep">/</span>
              <span className="rm-tb-bc-cur">Monitoreo en Tiempo Real</span>
            </div>
            <div className="rm-tb-space"/>
            <NotificationBell />
            <button className="rm-tb-avatar" onClick={handleLogout}><IcoLogout /></button>
          </header>

          <main className="rm-page">
            {/* Header */}
            <div className="rm-ph">
              <div className="rm-ph-left">
                <h1>Monitoreo en Tiempo Real</h1>
                <p>Visualización en vivo de sensores de gas</p>
              </div>
              <div className={`rm-ph-status${hasAlert ? ' alert-mode' : ''}`}>
                <span>{hasAlert ? 'Alerta activa' : 'Sistema conectado'}</span>
              </div>
            </div>

            {/* Alert banner */}
            <div className={`rm-alert-banner${hasAlert ? ' visible' : ''}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#870505" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3L22 21H2Z"/><line x1="12" y1="10" x2="12" y2="15" strokeWidth="1.6"/>
                <circle cx="12" cy="18" r="1.2" fill="#870505" stroke="none"/>
              </svg>
              <div>
                <div className="rm-alert-banner-text">Nivel elevado detectado</div>
                <div className="rm-alert-banner-sensors">
                  {hasAlert ? 'Sensores en alerta detectados' : ''}
                </div>
              </div>
            </div>

            {/* Monitor label */}
            <div className="rm-monitor-header">
              <div className="rm-section-label">Monitoreo en vivo</div>
            </div>

            {/* Sensor cards */}
            <div className="rm-sensor-cards">
              {SENSOR_DEFS.map(({ key, label, Icon }) => {
                const val = lastVals[key];
                const st  = statuses[key];
                return (
                  <div key={key} className={`rm-sc${st === 'danger' ? ' alert-card' : ''}`}>
                    <div className="rm-sc-status-corner">
                      <span className={`rm-sc-status ${st}`}>{statusLabel(st)}</span>
                    </div>
                    <div className={`rm-sc-icon ${key}${st === 'danger' ? ' alert-icon' : st === 'warn' ? ' warn-icon' : ''}`}>
                      <Icon />
                    </div>
                    <div className="rm-sc-body">
                      <div className="rm-sc-label">{label}</div>
                      <div>
                        <span className="rm-sc-val">{val || '—'}</span>
                        {' '}<span className="rm-sc-unit">PPM</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts */}
            <div className="rm-charts-grid">
              {SENSOR_DEFS.map(({ key, title }) => (
                <ChartCard
                  key={key}
                  sensor={key}
                  title={title}
                  data={snapshot[key]}
                  labels={snapshot.labels}
                  isAlert={statuses[key] === 'danger'}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}