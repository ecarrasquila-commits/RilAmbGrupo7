import { useState, useEffect, useInsertionEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import whiteLogo from "../../assets/whiteLogo.png";
import { logout } from "../../services/authService";

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --ink:#00082C;--i70:rgba(0,8,44,.70);--i50:rgba(0,8,44,.50);--i40:rgba(0,8,44,.40);
  --i24:rgba(0,8,44,.24);--i16:rgba(0,8,44,.16);--i10:rgba(0,8,44,.10);
  --i07:rgba(0,8,44,.07);--i04:rgba(0,8,44,.04);
  --page:#F0F0F4;--card:rgba(255,255,255,.86);
  --green:#0C8A5A;--green-t:rgba(12,138,90,.10);
  --blue:#1D4ED8;--blue-t:rgba(29,78,216,.10);
  --amber:#9A6214;
  --shadow:0 1px 2px rgba(0,8,44,.03),0 4px 12px rgba(0,8,44,.05),0 16px 40px rgba(0,8,44,.07);
  --shadow-sm:0 1px 2px rgba(0,8,44,.03),0 2px 8px rgba(0,8,44,.05);
  --sb-w:250px;--tb-h:62px;--r:18px;--r-sm:10px;--r-xs:8px;
}
html,body{min-height:100vh;width:100%;font-family:'DM Sans',system-ui,sans-serif;background:var(--page);color:var(--ink);-webkit-font-smoothing:antialiased;overflow-x:hidden;}

@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}

.rra-overlay{display:none;position:fixed;inset:0;z-index:40;background:rgba(0,8,44,.50);animation:fadeIn .22s ease;}
.rra-overlay.open{display:block;}

.rra-layout{display:flex;min-height:100vh;position:relative;z-index:1;}

.rra-sidebar{width:var(--sb-w);background:#f5f5f9;border-right:0.5px solid var(--i07);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;height:100%;z-index:30;transition:transform .28s cubic-bezier(.4,0,.2,1);overflow-y:auto;}
@media(min-width:961px){
  .rra-sidebar{background:rgba(255,255,255,.74);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);box-shadow:1px 0 0 rgba(255,255,255,.60),2px 0 12px rgba(0,8,44,.04);}
}
.rra-sidebar::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.9) 50%,transparent);pointer-events:none;}
.rra-sidebar.open{transform:translateX(0)!important;}
.rra-sb-brand{padding:26px 20px 22px;display:flex;align-items:center;gap:11px;}
.rra-sb-close{display:none;margin-left:auto;width:28px;height:28px;border-radius:8px;border:0.5px solid var(--i10);background:var(--i04);align-items:center;justify-content:center;cursor:pointer;color:var(--i40);flex-shrink:0;}
.rra-sb-mark{width:32px;height:32px;background:var(--ink);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 8px rgba(0,8,44,.22),inset 0 1px 0 rgba(255,255,255,.10);}
.rra-sb-name{font-size:15px;font-weight:600;letter-spacing:-.02em;}
.rra-sb-tag{font-size:9px;font-weight:500;color:var(--i40);letter-spacing:.09em;text-transform:uppercase;margin-top:1px;}
.rra-sb-nav{padding:18px 13px;flex:1;}
.rra-sb-item{display:flex;align-items:center;gap:10px;height:38px;padding:0 11px;border-radius:var(--r-xs);border:0.5px solid transparent;cursor:pointer;transition:all .17s;margin-bottom:2px;text-decoration:none;color:inherit;position:relative;background:none;width:100%;}
.rra-sb-item svg{color:var(--i40);flex-shrink:0;transition:color .17s;}
.rra-sb-item span{font-size:12.5px;color:var(--i50);transition:color .17s;}
.rra-sb-item:hover{background:var(--i04);border-color:var(--i07);}
.rra-sb-item:hover svg,.rra-sb-item:hover span{color:var(--i70);}
.rra-sb-item.active{background:var(--i07);border-color:var(--i10);}
.rra-sb-item.active span{color:var(--ink);font-weight:500;}
.rra-sb-item.active svg{color:var(--ink);}
.rra-sb-item.active::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:2.5px;height:16px;background:var(--ink);border-radius:0 3px 3px 0;opacity:.55;}
.rra-sb-footer{padding:14px 13px;border-top:0.5px solid var(--i07);position:relative;}
.rra-sb-profile{display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:var(--r-xs);border:0.5px solid transparent;cursor:pointer;transition:all .17s;}
.rra-sb-profile:hover{background:var(--i04);border-color:var(--i07);}
.rra-sb-av{width:32px;height:32px;border-radius:8px;background:var(--i07);border:0.5px solid var(--i10);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:var(--i70);flex-shrink:0;}
.rra-sb-pname{font-size:12px;font-weight:500;color:var(--i70);}
.rra-sb-prole{font-size:10px;color:var(--i40);margin-top:1px;}
.rra-sb-dots{margin-left:auto;color:var(--i24);}
.rra-sb-dropdown{display:none;position:absolute;bottom:100%;left:14px;right:14px;margin-bottom:8px;background:var(--card);border:0.5px solid var(--i10);border-radius:var(--r-sm);box-shadow:0 4px 16px rgba(0,8,44,.12);overflow:hidden;z-index:40;animation:fadeUp .2s ease both;}
.rra-sb-dropdown.open{display:block;}
.rra-sb-dd-item{display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;transition:background .17s;text-decoration:none;color:inherit;background:none;border:none;width:100%;}
.rra-sb-dd-item:hover{background:var(--i04);}
.rra-sb-dd-item svg{width:14px;height:14px;color:var(--i40);flex-shrink:0;}
.rra-sb-dd-item span{font-size:12px;color:var(--i50);}
.rra-sb-dd-item:hover svg,.rra-sb-dd-item:hover span{color:var(--i70);}
.rra-sb-divider{height:0.5px;background:var(--i07);}

.rra-content{margin-left:var(--sb-w);flex:1;display:flex;flex-direction:column;min-height:100vh;min-width:0;}
.rra-topbar{height:var(--tb-h);background:rgba(240,240,244,.90);backdrop-filter:blur(24px) saturate(1.3);-webkit-backdrop-filter:blur(24px) saturate(1.3);border-bottom:0.5px solid var(--i07);position:fixed;top:0;left:var(--sb-w);right:17px;z-index:20;display:flex;align-items:center;padding:0 clamp(16px,3vw,32px);gap:12px;box-shadow:0 1px 0 rgba(255,255,255,.65),0 4px 16px rgba(0,8,44,.03);}
.rra-tb-hamburger{display:none;width:34px;height:34px;border-radius:9px;border:0.5px solid var(--i10);background:rgba(255,255,255,.60);align-items:center;justify-content:center;cursor:pointer;color:var(--i50);flex-shrink:0;}
.rra-tb-bc{display:flex;align-items:center;gap:7px;}
.rra-tb-bc-root{font-size:12px;color:var(--i40);}
.rra-tb-bc-sep{font-size:11px;color:var(--i16);}
.rra-tb-bc-cur{font-size:12px;font-weight:500;color:var(--i70);}
.rra-tb-space{flex:1;}
.rra-tb-ico{width:34px;height:34px;border-radius:9px;border:0.5px solid var(--i10);background:rgba(255,255,255,.60);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--i50);transition:all .17s;position:relative;flex-shrink:0;}
.rra-tb-ico:hover{background:rgba(255,255,255,.88);color:var(--i70);}
.rra-notif-dot{position:absolute;top:7px;right:7px;width:5px;height:5px;background:var(--ink);border-radius:50%;border:1.5px solid var(--page);}
.rra-tb-avatar{border:0.5px solid var(--ink);width:32px;height:32px;border-radius:8px;background:var(--ink);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .17s;flex-shrink:0;color:rgba(255,255,255,.80);}
.rra-tb-avatar:hover{background:#1a2a5e;transform:translateY(-1px);}

.rra-page{padding-top:calc(var(--tb-h) + 26px);padding-left:clamp(14px,3vw,32px);padding-right:clamp(14px,3vw,32px);padding-bottom:40px;flex:1;display:flex;flex-direction:column;}
.rra-ph{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:20px;}
.rra-ph-left h1{font-size:20px;font-weight:500;letter-spacing:-.03em;line-height:1.2;margin-bottom:3px;}
.rra-ph-left p{font-size:12.5px;color:var(--i40);}

.rra-dash-grid{display:grid;grid-template-columns:1fr 270px;grid-template-rows:1fr;gap:14px;flex:1;min-height:0;max-height:680px;align-items:stretch;}

.rra-card{background:var(--card);border:0.5px solid rgba(0,8,44,.07);border-radius:var(--r);box-shadow:var(--shadow);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);overflow:hidden;position:relative;display:flex;flex-direction:column;}
.rra-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(0,8,44,.13) 50%,transparent);pointer-events:none;z-index:2;}
.rra-card-head{display:flex;align-items:center;padding:14px 18px 12px;gap:10px;border-bottom:0.5px solid var(--i07);background:rgba(255,255,255,.28);flex-shrink:0;}
.rra-ch-icon{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.rra-ch-icon.blue{background:var(--blue-t);border:0.5px solid rgba(29,78,216,.14);color:var(--blue);}
.rra-ch-icon.green{background:var(--green-t);border:0.5px solid rgba(12,138,90,.14);color:var(--green);}
.rra-ch-title{font-size:13px;font-weight:500;letter-spacing:-.015em;}
.rra-ch-sub{font-size:10.5px;color:var(--i40);margin-top:1px;}
.rra-ch-space{flex:1;}
.rra-ch-legend{display:flex;align-items:center;gap:14px;}
.rra-ch-leg-item{display:flex;align-items:center;gap:5px;font-size:11px;font-weight:500;color:var(--i50);}
.rra-ch-leg-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;display:inline-block;}
.rra-card-body{padding:16px 18px;flex:1;display:flex;flex-direction:column;min-height:0;}

.rra-card-bars{grid-column:1;display:flex;flex-direction:column;}
.rra-bars-area{flex:1;position:relative;min-height:300px;max-height:580px;}
.rra-bars-area canvas{position:absolute;inset:0;width:100%!important;height:100%!important;}

.rra-right-col{grid-column:2;display:flex;flex-direction:column;gap:12px;min-height:0;}

.rra-mini-cards{display:flex;flex-direction:column;gap:10px;flex-shrink:0;}
.rra-mini-card{background:var(--card);border:0.5px solid rgba(0,8,44,.07);border-radius:var(--r-sm);box-shadow:var(--shadow-sm);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);padding:20px 18px;display:flex;align-items:center;gap:14px;position:relative;overflow:hidden;flex-shrink:0;}
.rra-mini-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.9) 50%,transparent);pointer-events:none;}
.rra-mini-card:nth-child(1){animation:fadeUp .32s .04s ease both;}
.rra-mini-card:nth-child(2){animation:fadeUp .32s .09s ease both;}
.rra-mc-icon{width:42px;height:42px;border-radius:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:rgba(0,8,44,.03);color:#00082C;border:1px solid rgba(0,8,44,.06);}
.rra-mc-info{display:flex;flex-direction:column;flex:1;min-width:0;}
.rra-mc-val{font-size:26px;font-weight:600;letter-spacing:-.04em;line-height:1;font-variant-numeric:tabular-nums;}
.rra-mc-lbl{font-size:11px;color:var(--i50);margin-top:4px;}

.rra-card-donut{flex:1;min-height:0;}
.rra-donut-body{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:4px 0 8px;flex:1;}
.rra-donut-canvas-wrap{position:relative;width:min(100%,180px);aspect-ratio:1/1;min-width:80px;}
.rra-donut-canvas-wrap canvas{position:absolute;inset:0;width:100%!important;height:100%!important;display:block;}
.rra-donut-legend{display:flex;flex-direction:column;gap:7px;width:100%;}
.rra-dl-item{display:flex;align-items:center;gap:8px;padding:8px 11px;border-radius:8px;border:0.5px solid var(--i07);background:rgba(255,255,255,.55);}
.rra-dl-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.rra-dl-label{font-size:10.5px;color:var(--i50);flex:1;line-height:1.2;}
.rra-dl-val{font-size:12.5px;font-weight:600;font-variant-numeric:tabular-nums;}
.rra-dl-pct{font-size:9.5px;color:var(--i40);min-width:24px;text-align:right;}

/* Tooltip — shared */
.rra-tip{
  position:fixed;
  pointer-events:none;
  z-index:9999;
  background:rgba(0,8,44,.88);
  color:rgba(255,255,255,.95);
  font-family:'DM Sans',system-ui,sans-serif;
  font-size:11.5px;
  font-weight:500;
  padding:6px 11px;
  border-radius:8px;
  white-space:nowrap;
  box-shadow:0 4px 16px rgba(0,8,44,.25);
  /* NO transition on opacity — instant show/hide avoids stale position flash */
  opacity:0;
  /* fixed size estimate so positionTooltip can use it without measuring */
  min-width:80px;
  text-align:center;
}
.rra-tip.visible{opacity:1;}

@media(min-width:961px) and (max-width:1100px){
  :root{--sb-w:64px;}
  .rra-sb-name,.rra-sb-tag,.rra-sb-item span,.rra-sb-pname,.rra-sb-prole,.rra-sb-dots{display:none;}
  .rra-sb-brand{padding:20px 12px;justify-content:center;}
  .rra-sb-mark{width:40px;height:40px;}
  .rra-sb-nav{padding:12px 8px;}
  .rra-sb-item{justify-content:center;padding:12px 8px;}
  .rra-sb-footer{padding:12px 8px;display:flex;justify-content:center;}
  .rra-sb-profile{justify-content:center;gap:0;padding:0;width:40px;height:40px;}
}
@media(max-width:1050px){
  .rra-dash-grid{grid-template-columns:1fr;}
  .rra-right-col{grid-column:1;flex-direction:row;flex-wrap:wrap;gap:12px;}
  .rra-mini-cards{flex-direction:row;flex:1;min-width:0;}
  .rra-mini-card{flex:1;min-width:130px;}
  .rra-card-donut{flex:0 0 auto;min-width:260px;}
  .rra-donut-body{flex-direction:row;align-items:center;justify-content:center;gap:20px;}
  .rra-donut-canvas-wrap{width:120px!important;min-width:120px;flex-shrink:0;}
  .rra-donut-legend{width:auto;flex:1;min-width:130px;}
  .rra-bars-area{min-height:280px;}
}
@media(max-width:960px){
  :root{--sb-w:0px;--tb-h:58px;}
  .rra-sidebar{width:100%!important;transform:translateX(-100%);position:fixed;top:0;left:0;bottom:0;height:100%!important;z-index:50;background:#f5f5f9!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;box-shadow:none!important;transition:transform .28s cubic-bezier(.4,0,.2,1);}
  .rra-sidebar.open{transform:translateX(0)!important;}
  .rra-sb-name,.rra-sb-tag,.rra-sb-item span,.rra-sb-pname,.rra-sb-prole,.rra-sb-dots{display:revert!important;}
  .rra-sb-brand{padding:28px 24px 24px;justify-content:flex-start!important;}
  .rra-sb-nav{padding:20px 18px;}
  .rra-sb-item{justify-content:flex-start!important;padding:0 14px!important;width:100%!important;margin:0 0 2px!important;height:48px!important;}
  .rra-sb-footer{padding:18px;}
  .rra-sb-profile{justify-content:flex-start!important;}
  .rra-sb-close{display:flex!important;}
  .rra-content{margin-left:0;}
  .rra-topbar{left:0;right:0;padding:0 20px;gap:10px;}
  .rra-tb-hamburger{display:flex!important;}
  .rra-page{padding:calc(var(--tb-h) + 20px) 16px 48px;}
}
@media(max-width:768px){
  :root{--tb-h:54px;}
  .rra-topbar{padding:0 14px;right:0;}
  .rra-tb-bc-root,.rra-tb-bc-sep{display:none;}
  .rra-page{padding-top:calc(var(--tb-h) + 16px);padding-left:12px;padding-right:12px;padding-bottom:32px;}
  .rra-ph{margin-bottom:14px;}
  .rra-ph-left h1{font-size:18px;}
  .rra-dash-grid{gap:12px;}
  .rra-right-col{flex-direction:column;}
  .rra-mini-cards{flex-direction:row;}
  .rra-mini-card{flex:1;padding:14px 12px;}
  .rra-mc-val{font-size:20px;}
  .rra-mc-lbl{font-size:10.5px;}
  .rra-bars-area{min-height:220px;}
  .rra-card-donut{flex:0 0 auto;min-height:0;}
  .rra-donut-body{flex-direction:row;align-items:center;gap:16px;padding:4px 0;}
  .rra-donut-canvas-wrap{width:110px!important;min-width:110px;flex-shrink:0;}
  .rra-donut-legend{flex:1;min-width:120px;width:auto;}
  .rra-dl-item{padding:7px 10px;}
  .rra-ch-legend{gap:10px;}
  .rra-ch-leg-item{font-size:10.5px;}
  .rra-card-head{padding:12px 14px 10px;gap:8px;}
  .rra-card-body{padding:12px 14px;}
}
@media(max-width:560px){
  .rra-mini-cards{flex-direction:column;gap:8px;}
  .rra-mini-card{flex:none;}
  .rra-bars-area{min-height:180px;}
  .rra-donut-body{flex-direction:column;align-items:center;}
  .rra-donut-canvas-wrap{width:120px!important;min-width:120px;}
  .rra-donut-legend{width:100%;}
  .rra-ch-legend{display:none;}
}
@media(max-width:400px){
  .rra-page{padding-left:10px;padding-right:10px;}
  .rra-bars-area{min-height:160px;}
  .rra-card-head{flex-wrap:wrap;}
}
`;

/* ══ DATA ══ */
const D = {
  devices: { active:38, inactive:12 },
  users:   { active:57, inactive:11 },
  monthly: {
    labels:   ['Ene','Feb','Mar','Abr','May','Jun'],
    active:   [42,45,49,52,54,57],
    inactive: [14,13,13,12,11,11],
  }
};

/* ══ Helpers ══ */
function easeOut(t) { return 1 - Math.pow(1 - t, 4); }

/*
  SOLUCIÓN DEFINITIVA — TOOLTIP MONTADO EN document.body

  backdrop-filter en .rra-card crea un stacking context que atrapa
  cualquier position:fixed dentro de él: las coordenadas dejan de ser
  relativas al viewport real y el tooltip aparece desplazado.

  Solución: el nodo DOM del tooltip vive directamente en document.body,
  completamente fuera de cualquier contenedor con backdrop-filter.
  Es un singleton creado una sola vez y compartido por todos los charts.
*/
let _bodyTip = null;
function getBodyTip() {
  if (_bodyTip && document.body.contains(_bodyTip)) return _bodyTip;
  _bodyTip = document.createElement('div');
  _bodyTip.style.cssText = [
    'position:fixed',
    'pointer-events:none',
    'z-index:99999',
    'background:rgba(0,8,44,.88)',
    'color:rgba(255,255,255,.95)',
    "font-family:'DM Sans',system-ui,sans-serif",
    'font-size:11.5px',
    'font-weight:500',
    'padding:6px 11px',
    'border-radius:8px',
    'white-space:nowrap',
    'box-shadow:0 4px 16px rgba(0,8,44,.25)',
    'opacity:0',
    'top:0',
    'left:0',
    'transition:none',
  ].join(';');
  document.body.appendChild(_bodyTip);
  return _bodyTip;
}

function showTooltip(text, clientX, clientY) {
  const tip = getBodyTip();
  tip.textContent = text;
  // Medir ancho real — el elemento ya está en el DOM con contenido
  const TW = tip.offsetWidth;
  const vw = window.innerWidth;
  let left = clientX + 14;
  if (left + TW + 8 > vw) left = clientX - TW - 14;
  tip.style.left = left + 'px';
  tip.style.top  = (clientY - 36) + 'px';
  tip.style.opacity = '1';
}

function hideTooltip() {
  if (_bodyTip) _bodyTip.style.opacity = '0';
}

/* ══ Icons ══ */
const IcoMenu   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IcoX      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoBell   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const IcoLogout = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.92)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IcoDots   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const IcoUser   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcoLock   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcoFile   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IcoUsers  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcoDevice = () => <svg width="15" height="15" viewBox="0 0 40 40" fill="none"><rect x="1.5" y="1.5" width="37" height="37" rx="9" stroke="currentColor" strokeWidth="2.2" fill="none"/><circle cx="20" cy="22" r="10.5" stroke="currentColor" strokeWidth="1.6" fill="none" opacity=".5"/><circle cx="20" cy="22" r="6.5" stroke="currentColor" strokeWidth="1.3" fill="none" opacity=".38"/><circle cx="16" cy="18" r="1.3" fill="currentColor" opacity=".35"/><circle cx="20" cy="18" r="1.3" fill="currentColor" opacity=".6"/><circle cx="24" cy="18" r="1.3" fill="currentColor" opacity=".35"/><circle cx="16" cy="22" r="1.3" fill="currentColor" opacity=".6"/><circle cx="20" cy="22" r="1.7" fill="currentColor"/><circle cx="24" cy="22" r="1.3" fill="currentColor" opacity=".6"/><circle cx="16" cy="26" r="1.3" fill="currentColor" opacity=".35"/><circle cx="20" cy="26" r="1.3" fill="currentColor" opacity=".6"/><circle cx="24" cy="26" r="1.3" fill="currentColor" opacity=".35"/></svg>;

/* ══ Donut Chart ══ */
function DonutChart() {
  const canvasRef = useRef(null);
  const wrapRef   = useRef(null);
  const stateRef  = useRef({ SZ:0, segAngles:[], hovIdx:-1 });

  const devActive   = D.devices.active;
  const devInactive = D.devices.inactive;
  const devTotal    = devActive + devInactive;
  const GAP = 0.028;
  const segs = [
    { v: devActive,   color: '#00082C', label: 'Activos',   count: devActive   },
    { v: devInactive, color: '#8892A4', label: 'Inactivos', count: devInactive },
  ];

  const draw = useCallback((p, hovIdx) => {
    const canvas = canvasRef.current, wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const SZ = wrap.clientWidth; if (SZ < 1) return;
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== SZ * dpr) {
      canvas.width = SZ * dpr; canvas.height = SZ * dpr;
      canvas.style.width = SZ + 'px'; canvas.style.height = SZ + 'px';
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, SZ, SZ);
    const CX = SZ/2, CY = SZ/2, OR = SZ/2 - SZ*0.04, IR = OR*0.44;
    ctx.beginPath(); ctx.arc(CX,CY,OR,0,Math.PI*2); ctx.arc(CX,CY,IR,Math.PI*2,0,true);
    ctx.fillStyle='rgba(0,8,44,.06)'; ctx.fill();
    const angles = []; let angle = -Math.PI/2;
    segs.forEach(seg => {
      const sweep = (seg.v/devTotal)*Math.PI*2*p;
      angles.push({ start:angle, end:angle+sweep, ...seg }); angle += sweep;
    });
    stateRef.current.segAngles = angles;
    angles.forEach((seg, i) => {
      const sweep = seg.end - seg.start; if (sweep - GAP <= 0) return;
      ctx.beginPath();
      ctx.arc(CX,CY,OR,seg.start+GAP/2,seg.end-GAP/2);
      ctx.arc(CX,CY,IR,seg.end-GAP/2,seg.start+GAP/2,true);
      ctx.closePath();
      ctx.fillStyle = seg.color; ctx.globalAlpha = hovIdx===i?1:0.86; ctx.fill(); ctx.globalAlpha=1;
    });
    ctx.beginPath(); ctx.arc(CX,CY,IR-1,0,Math.PI*2);
    ctx.fillStyle='rgba(240,240,244,1)'; ctx.fill();
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current; if (!wrap) return;
    const ro = new ResizeObserver(() => draw(1, stateRef.current.hovIdx));
    ro.observe(wrap);
    let t0 = null; const DUR = 1000;
    const frame = ts => {
      if (!t0) t0 = ts;
      const p = easeOut(Math.min((ts-t0)/DUR, 1));
      draw(p, -1);
      if (ts-t0 < DUR) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => ro.disconnect();
  }, [draw]);

  const getHovIdx = (mx, my) => {
    const canvas = canvasRef.current, wrap = wrapRef.current; if (!canvas||!wrap) return -1;
    const SZ = wrap.clientWidth, rect = canvas.getBoundingClientRect();
    const CX=SZ/2, CY=SZ/2, OR=SZ/2-SZ*0.04, IR=OR*0.44;
    // Convertir coordenadas de pantalla a coordenadas del canvas (CSS pixels)
    const cx=mx-rect.left, cy=my-rect.top, dx=cx-CX, dy=cy-CY;
    const dist=Math.sqrt(dx*dx+dy*dy); if(dist<IR||dist>OR) return -1;
    let ang=Math.atan2(dy,dx); if(ang<-Math.PI/2) ang+=Math.PI*2;
    const angles = stateRef.current.segAngles;
    for (let i=0;i<angles.length;i++){
      let s=angles[i].start, e=angles[i].end;
      if(s<-Math.PI/2){s+=Math.PI*2;e+=Math.PI*2;}
      if(ang>=s&&ang<=e) return i;
    }
    return -1;
  };

  const handleMove = e => {
    const idx = getHovIdx(e.clientX, e.clientY);
    if (idx !== stateRef.current.hovIdx) {
      stateRef.current.hovIdx = idx;
      draw(1, idx);
    }
    if (idx >= 0) {
      showTooltip(`${segs[idx].label}: ${segs[idx].count}`, e.clientX, e.clientY);
    } else {
      hideTooltip();
    }
  };

  const handleLeave = () => {
    stateRef.current.hovIdx = -1;
    draw(1, -1);
    hideTooltip();
  };

  const pct = v => Math.round(v/devTotal*100)+'%';

  return (
    <>
      <div ref={wrapRef} className="rra-donut-canvas-wrap">
        <canvas ref={canvasRef} onMouseMove={handleMove} onMouseLeave={handleLeave}/>
      </div>
      <div className="rra-donut-legend">        <div className="rra-dl-item">
          <div className="rra-dl-dot" style={{background:'#00082C'}}/>
          <span className="rra-dl-label">Activos</span>
          <span className="rra-dl-val">{devActive}</span>
          <span className="rra-dl-pct">{pct(devActive)}</span>
        </div>
        <div className="rra-dl-item">
          <div className="rra-dl-dot" style={{background:'#8892A4'}}/>
          <span className="rra-dl-label">Inactivos</span>
          <span className="rra-dl-val">{devInactive}</span>
          <span className="rra-dl-pct">{pct(devInactive)}</span>
        </div>
      </div>
    </>
  );
}

/* ══ Bars Chart ══ */
function BarsChart() {
  const canvasRef = useRef(null);
  const wrapRef   = useRef(null);
  const barRects  = useRef([]);
  const hovBar    = useRef(null);

  const { labels, active, inactive } = D.monthly;
  const maxVal = Math.max(...active, ...inactive);

  const render = useCallback((p, hov) => {
    const canvas = canvasRef.current, wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const W = wrap.clientWidth || 520, H = wrap.clientHeight || 300;
    const dpr = window.devicePixelRatio || 1;

    // Solo redimensionar si cambió el tamaño — evita resetear barRects innecesariamente
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
    }

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // Resetear barRects en cada render completo
    barRects.current = [];

    const PL=40, PR=14, PT=16, PB=26;
    const cW=W-PL-PR, cH=H-PT-PB;
    const n=labels.length, grp=cW/n;
    const bW=Math.min(grp*0.27, 32), gap=grp*0.06;

    // Grid lines y labels del eje Y
    ctx.font = `10.5px 'DM Sans',system-ui,sans-serif`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i=0; i<=4; i++) {
      const v = Math.ceil(maxVal/4*i/5)*5;
      const y = PT + cH - (v/maxVal)*cH;
      ctx.beginPath(); ctx.moveTo(PL,y); ctx.lineTo(PL+cW,y);
      ctx.strokeStyle = i===0 ? 'rgba(0,8,44,.15)' : 'rgba(0,8,44,.07)';
      ctx.lineWidth = 0.5; ctx.stroke();
      ctx.fillStyle = 'rgba(0,8,44,.28)'; ctx.fillText(v, PL-5, y);
    }

    const rRect = (x, y, w, h, r, color, alpha) => {
      if (h < 1) return;
      r = Math.min(r, h/2, w/2);
      ctx.beginPath();
      ctx.moveTo(x+r, y); ctx.lineTo(x+w-r, y);
      ctx.quadraticCurveTo(x+w,y, x+w,y+r); ctx.lineTo(x+w, y+h);
      ctx.lineTo(x, y+h); ctx.lineTo(x, y+r);
      ctx.quadraticCurveTo(x,y, x+r,y); ctx.closePath();
      ctx.globalAlpha = alpha ?? 1; ctx.fillStyle = color; ctx.fill(); ctx.globalAlpha = 1;
    };

    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.font = `11px 'DM Sans',system-ui,sans-serif`;

    labels.forEach((lbl, i) => {
      const cx = PL + i*grp + grp/2;
      ctx.fillStyle = 'rgba(0,8,44,.30)'; ctx.fillText(lbl, cx, PT+cH+7);

      const hA = (active[i]/maxVal)*cH*p;
      const xA = cx - bW - gap/2;
      const yA = PT + cH - hA;
      const isHA = hov && hov.i===i && hov.s==='A';
      rRect(xA, yA, bW, hA, 7, '#00082C', isHA ? 1 : 0.82);
      barRects.current.push({x:xA, y:yA, w:bW, h:hA, label:lbl, value:active[i],   series:'Activos',   i, s:'A'});

      const hI = (inactive[i]/maxVal)*cH*p;
      const xI = cx + gap/2;
      const yI = PT + cH - hI;
      const isHI = hov && hov.i===i && hov.s==='I';
      rRect(xI, yI, bW, hI, 7, '#8892A4', isHI ? 1 : 0.82);
      barRects.current.push({x:xI, y:yI, w:bW, h:hI, label:lbl, value:inactive[i], series:'Inactivos', i, s:'I'});
    });
  }, [labels, active, inactive, maxVal]);

  useEffect(() => {
    let t0 = null; const DUR = 1000;
    const frame = ts => {
      if (!t0) t0 = ts;
      render(easeOut(Math.min((ts-t0)/DUR, 1)), null);
      if (ts-t0 < DUR) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);

    let timer;
    const onResize = () => { clearTimeout(timer); timer = setTimeout(() => render(1, hovBar.current), 130); };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); clearTimeout(timer); };
  }, [render]);

  /*
    FIX: getHov recibe clientX/clientY (coordenadas viewport).
    getBoundingClientRect() devuelve el rect del canvas en coordenadas viewport.
    La resta da coordenadas en CSS pixels relativas al canvas,
    que coinciden directamente con las coordenadas de dibujo (barRects
    se calculan en CSS pixels, NO en pixels físicos).
  */
  const getHov = (clientX, clientY) => {
    const canvas = canvasRef.current; if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const cx = clientX - rect.left;
    const cy = clientY - rect.top;
    for (const b of barRects.current) {
      if (cx >= b.x && cx <= b.x + b.w && cy >= b.y && cy <= b.y + b.h) return b;
    }
    return null;
  };

  const handleMove = e => {
    const b = getHov(e.clientX, e.clientY);
    const key  = b ? `${b.i}-${b.s}` : null;
    const prev = hovBar.current ? `${hovBar.current.i}-${hovBar.current.s}` : null;
    if (key !== prev) { hovBar.current = b; render(1, b); }
    if (b) {
      showTooltip(`${b.series}: ${b.value}`, e.clientX, e.clientY);
    } else {
      hideTooltip();
    }
  };

  const handleLeave = () => {
    hovBar.current = null;
    render(1, null);
    hideTooltip();
  };

  return (
    <div ref={wrapRef} className="rra-bars-area">
      <canvas ref={canvasRef} onMouseMove={handleMove} onMouseLeave={handleLeave}/>
    </div>
  );
}

/* ══ MAIN ══ */
export default function RilAmbReportesAdmin() {
  const navigate = useNavigate();
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const devTotal = D.devices.active + D.devices.inactive;
  const usrTotal = D.users.active + D.users.inactive;

  useInsertionEffect(() => {
    const id = 'rilambReportesAdminStyles';
    if (!document.getElementById(id)) {
      const s = document.createElement('style'); s.id=id; s.textContent=GLOBAL_CSS;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    const h = e => { if (!e.target.closest('.rra-sb-footer')) setDropdownOpen(false); };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/session-logo', { replace: true, state: { next: '/' } });
  };

  return (
    <div style={{minHeight:'100vh',background:'var(--page)',fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,
        background:'radial-gradient(ellipse 70% 50% at 8% 4%,rgba(0,8,44,.04) 0%,transparent 55%),radial-gradient(ellipse 55% 40% at 94% 92%,rgba(0,8,44,.032) 0%,transparent 55%)'}}/>

      <div className={`rra-overlay${sidebarOpen?' open':''}`} onClick={()=>setSidebarOpen(false)}/>

      <aside className={`rra-sidebar${sidebarOpen?' open':''}`}>
        <div className="rra-sb-brand">
          <div className="rra-sb-mark">
            <img src={whiteLogo} alt="RilAmb" style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
          </div>
          <div><div className="rra-sb-name">RilAmb</div><div className="rra-sb-tag">Platform</div></div>
          <button className="rra-sb-close" onClick={()=>setSidebarOpen(false)}><IcoX/></button>
        </div>
        <nav className="rra-sb-nav">
          <button className="rra-sb-item active" onClick={() => navigate('/admin/reports')}><IcoFile/><span>Reportes</span></button>
          <button className="rra-sb-item" onClick={() => navigate('/admin/users')}><IcoUsers/><span>Usuarios</span></button>
          <button className="rra-sb-item" onClick={() => navigate('/admin/devices')}><IcoDevice/><span>Dispositivos</span></button>
        </nav>
        <div className="rra-sb-footer">
          <div className="rra-sb-profile" onClick={()=>setDropdownOpen(p=>!p)}>
            <div className="rra-sb-av">AS</div>
            <div><div className="rra-sb-pname">Admin S.</div><div className="rra-sb-prole">Administrador</div></div>
            <span className="rra-sb-dots"><IcoDots/></span>
          </div>
          <div className={`rra-sb-dropdown${dropdownOpen?' open':''}`}>
            <button className="rra-sb-dd-item" onClick={() => navigate('/admin/perfil')}><IcoUser/><span>Ver perfil</span></button>
            <div className="rra-sb-divider"/>
            <button className="rra-sb-dd-item" onClick={() => navigate('/admin/perfil', { state: { section: 'seguridad' } })}><IcoLock/><span>Cambiar contraseña</span></button>
          </div>
        </div>
      </aside>

      <div className="rra-layout">
        <div className="rra-content">
          <header className="rra-topbar">
            <button className="rra-tb-hamburger" onClick={()=>setSidebarOpen(true)}><IcoMenu/></button>
            <div className="rra-tb-bc">
              <span className="rra-tb-bc-root">RilAmb</span>
              <span className="rra-tb-bc-sep">/</span>
              <span className="rra-tb-bc-cur">Reportes</span>
            </div>
            <div className="rra-tb-space"/>
            <button className="rra-tb-ico"><IcoBell/><span className="rra-notif-dot"/></button>
            <button className="rra-tb-avatar" onClick={handleLogout}><IcoLogout/></button>
          </header>

          <main className="rra-page">
            <div className="rra-ph">
              <div className="rra-ph-left">
                <h1>Reportes</h1>
                <p>Estadísticas generales del sistema</p>
              </div>
            </div>

            <div className="rra-dash-grid">
              <div className="rra-card rra-card-bars">
                <div className="rra-card-head">
                  <div>
                    <div className="rra-ch-title">Evolución mensual — Usuarios</div>
                    <div className="rra-ch-sub">Activos e inactivos por mes</div>
                  </div>
                  <div className="rra-ch-space"/>
                  <div className="rra-ch-legend">
                    <span className="rra-ch-leg-item"><span className="rra-ch-leg-dot" style={{background:'#00082C'}}/>Activos</span>
                    <span className="rra-ch-leg-item"><span className="rra-ch-leg-dot" style={{background:'#8892A4'}}/>Inactivos</span>
                  </div>
                </div>
                <div className="rra-card-body">
                  <BarsChart/>
                </div>
              </div>

              <div className="rra-right-col">
                <div className="rra-mini-cards">
                  <div className="rra-mini-card">
                    <div className="rra-mc-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1.7"/>
                        <circle cx="17" cy="9.5" r="0.95"/><circle cx="7" cy="14.5" r="0.95"/><circle cx="16.5" cy="16" r="0.95"/>
                        <line x1="13.3" y1="11.1" x2="16.1" y2="10"/><line x1="7.9" y1="13.7" x2="10.7" y2="12.6"/><line x1="13.2" y1="13.1" x2="15.6" y2="15.2"/>
                      </svg>
                    </div>
                    <div className="rra-mc-info">
                      <div className="rra-mc-val">{devTotal}</div>
                      <div className="rra-mc-lbl">Total dispositivos</div>
                    </div>
                  </div>
                  <div className="rra-mini-card">
                    <div className="rra-mc-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div className="rra-mc-info">
                      <div className="rra-mc-val">{usrTotal}</div>
                      <div className="rra-mc-lbl">Total usuarios</div>
                    </div>
                  </div>
                </div>

                <div className="rra-card rra-card-donut">
                  <div className="rra-card-head">
                    <div>
                      <div className="rra-ch-title">Dispositivos</div>
                      <div className="rra-ch-sub">Activos vs inactivos</div>
                    </div>
                  </div>
                  <div className="rra-card-body rra-donut-body">
                    <DonutChart/>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}