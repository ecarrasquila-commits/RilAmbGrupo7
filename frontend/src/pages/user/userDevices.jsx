// COMENTARIOS
// barra de desplazamiento cortada 
//visualizar que al bajar en movil toca darle dos veces, se traba como un paso.

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import whiteLogo from "../../assets/whiteLogo.png";
import NotificationBell from "../../components/Notifications";
import { logout } from "../../services/authService";
import { getUserProfile } from "../../services/userService";
import { getMyDevices, linkDevice, unlinkDevice } from "../../services/deviceService";
/* ══ CSS ══ */
const GLOBAL_CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --ink:#00082C;
  --i70:rgba(0,8,44,.70);
  --i50:rgba(0,8,44,.50);
  --i40:rgba(0,8,44,.40);
  --i24:rgba(0,8,44,.24);
  --i16:rgba(0,8,44,.16);
  --i10:rgba(0,8,44,.10);
  --i07:rgba(0,8,44,.07);
  --i04:rgba(0,8,44,.04);
  --page:#F0F0F4;
  --card:rgba(255,255,255,.86);
  --card-solid:#ffffff;
  --active:#00028C;
  --active-t:rgba(0,2,140,.09);
  --active-b:rgba(0,2,140,.20);
  --red:#C0392B;
  --red-t:rgba(192,57,43,.09);
  --red-b:rgba(192,57,43,.20);
  --green:#0C8A5A;
  --green-t:rgba(12,138,90,.10);
  --blue:#1D4ED8;
  --blue-t:rgba(29,78,216,.10);
  --amber:#9A6214;
  --shadow:0 1px 2px rgba(0,8,44,.03),0 4px 12px rgba(0,8,44,.05),0 16px 40px rgba(0,8,44,.07);
  --shadow-sm:0 1px 2px rgba(0,8,44,.03),0 2px 8px rgba(0,8,44,.05);
  --shadow-hov:0 2px 4px rgba(0,8,44,.04),0 8px 28px rgba(0,8,44,.10),0 28px 60px rgba(0,8,44,.11);
  --sb-w:250px;
  --tb-h:62px;
  --r:18px;
  --r-md:13px;
  --r-sm:10px;
  --r-xs:8px;
}

html,body{min-height:100vh;width:100%;font-family:'DM Sans',system-ui,sans-serif;background:var(--page);color:var(--ink);-webkit-font-smoothing:antialiased;overflow-x:hidden;}

@keyframes fadeIn {from{opacity:0}to{opacity:1}}
@keyframes fadeUp {from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes scaleIn{from{opacity:0;transform:scale(.96) translateY(6px)}to{opacity:1;transform:none}}
@keyframes spin   {to{transform:rotate(360deg)}}
@keyframes popIn  {0%{opacity:0;transform:translateY(14px) scale(.97)}60%{transform:translateY(-2px) scale(1.01)}100%{opacity:1;transform:none}}
@keyframes toastOut{to{opacity:0;transform:translateY(8px)}}
@keyframes ledPulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(0,2,140,.4)}50%{opacity:.7;box-shadow:0 0 0 4px rgba(0,2,140,0)}}
@keyframes orbitSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes iconGlow{0%,100%{opacity:.55}50%{opacity:.9}}

/* ── Overlay ── */
.rd-overlay{display:none;position:fixed;inset:0;z-index:40;background:rgba(0,8,44,.50);animation:fadeIn .22s ease;}
.rd-overlay.open{display:block;}

/* ── Layout ── */
.rd-layout{display:flex;min-height:100vh;position:relative;z-index:1;}

/* ── Sidebar ── */
.rd-sidebar{
  width:var(--sb-w);background:#f5f5f9;border-right:0.5px solid var(--i07);
  display:flex;flex-direction:column;
  position:fixed;top:0;left:0;bottom:0;height:100%;z-index:30;
  transition:transform .28s cubic-bezier(.4,0,.2,1);
  overflow-y:auto;overflow-x:hidden;
  will-change:transform;
}
@media(min-width:961px){
  .rd-sidebar{
    background:rgba(255,255,255,.74);
    backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);
    box-shadow:1px 0 0 rgba(255,255,255,.60),2px 0 12px rgba(0,8,44,.04);
  }
}
.rd-sidebar::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.9) 50%,transparent);pointer-events:none;}
.rd-sidebar.open{transform:translateX(0)!important;}

.rd-sb-brand{padding:26px 20px 22px;display:flex;align-items:center;gap:11px;}
.rd-sb-close{display:none;margin-left:auto;width:28px;height:28px;border-radius:8px;border:0.5px solid var(--i10);background:var(--i04);align-items:center;justify-content:center;cursor:pointer;color:var(--i40);flex-shrink:0;}
.rd-sb-mark{width:32px;height:32px;background:var(--ink);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 8px rgba(0,8,44,.22),inset 0 1px 0 rgba(255,255,255,.10);}
.rd-sb-name{font-size:15px;font-weight:600;letter-spacing:-.02em;}
.rd-sb-tag{font-size:9px;font-weight:500;color:var(--i40);letter-spacing:.09em;text-transform:uppercase;margin-top:1px;}
.rd-sb-nav{padding:18px 13px;flex:1;}
.rd-sb-item{display:flex;align-items:center;gap:10px;height:38px;padding:0 11px;border-radius:var(--r-xs);border:0.5px solid transparent;cursor:pointer;transition:all .17s;margin-bottom:2px;text-decoration:none;color:inherit;position:relative;background:none;width:100%;}
.rd-sb-item svg{color:var(--i40);flex-shrink:0;transition:color .17s;}
.rd-sb-item span{font-size:12.5px;color:var(--i50);transition:color .17s;}
.rd-sb-item:hover{background:var(--i04);border-color:var(--i07);}
.rd-sb-item:hover svg,.rd-sb-item:hover span{color:var(--i70);}
.rd-sb-item.active{background:var(--i07);border-color:var(--i10);}
.rd-sb-item.active span{color:var(--ink);font-weight:500;}
.rd-sb-item.active svg{color:var(--ink);}
.rd-sb-item.active::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:2.5px;height:16px;background:var(--ink);border-radius:0 3px 3px 0;opacity:.55;}
.rd-sb-footer{padding:14px 13px;border-top:0.5px solid var(--i07);position:relative;}
.rd-sb-profile{display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:var(--r-xs);border:0.5px solid transparent;cursor:pointer;transition:all .17s;}
.rd-sb-profile:hover{background:var(--i04);border-color:var(--i07);}
.rd-sb-av{width:32px;height:32px;border-radius:8px;background:var(--i07);border:0.5px solid var(--i10);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:var(--i70);flex-shrink:0;}
.rd-sb-pname{font-size:12px;font-weight:500;color:var(--i70);}
.rd-sb-prole{font-size:10px;color:var(--i40);margin-top:1px;}
.rd-sb-dots{margin-left:auto;color:var(--i24);}
.rd-sb-dropdown{display:none;position:absolute;bottom:100%;left:14px;right:14px;margin-bottom:8px;background:var(--card);border:0.5px solid var(--i10);border-radius:var(--r-sm);box-shadow:0 4px 16px rgba(0,8,44,.12);overflow:hidden;z-index:40;animation:fadeUp .2s ease both;}
.rd-sb-dropdown.open{display:block;}
.rd-sb-dd-item{display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;transition:background .17s;text-decoration:none;color:inherit;background:none;border:none;width:100%;}
.rd-sb-dd-item:hover{background:var(--i04);}
.rd-sb-dd-item svg{width:14px;height:14px;color:var(--i40);flex-shrink:0;}
.rd-sb-dd-item span{font-size:12px;color:var(--i50);}
.rd-sb-dd-item:hover svg,.rd-sb-dd-item:hover span{color:var(--i70);}
.rd-sb-divider{height:0.5px;background:var(--i07);}

/* ── Topbar ── */
.rd-content{margin-left:var(--sb-w);flex:1;display:flex;flex-direction:column;min-height:100vh;min-width:0;}
.rd-topbar{height:var(--tb-h);background:rgba(240,240,244,.90);backdrop-filter:blur(24px) saturate(1.3);-webkit-backdrop-filter:blur(24px) saturate(1.3);border-bottom:0.5px solid var(--i07);position:fixed;top:0;left:var(--sb-w);right:17px;z-index:20;display:flex;align-items:center;padding:0 clamp(16px,3vw,32px);gap:12px;box-shadow:0 1px 0 rgba(255,255,255,.65),0 4px 16px rgba(0,8,44,.03);will-change:transform;}
.rd-tb-hamburger{display:none;width:34px;height:34px;border-radius:9px;border:0.5px solid var(--i10);background:rgba(255,255,255,.60);align-items:center;justify-content:center;cursor:pointer;color:var(--i50);flex-shrink:0;}
.rd-tb-bc{display:flex;align-items:center;gap:7px;}
.rd-tb-bc-root{font-size:12px;color:var(--i40);}
.rd-tb-bc-sep{font-size:11px;color:var(--i16);}
.rd-tb-bc-cur{font-size:12px;font-weight:500;color:var(--i70);}
.rd-tb-space{flex:1;}
.rd-tb-ico{width:34px;height:34px;border-radius:9px;border:0.5px solid var(--i10);background:rgba(255,255,255,.60);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--i50);transition:all .17s;position:relative;flex-shrink:0;}
.rd-tb-ico:hover{background:rgba(255,255,255,.88);color:var(--i70);}
.rd-notif-dot{position:absolute;top:7px;right:7px;width:5px;height:5px;background:var(--ink);border-radius:50%;border:1.5px solid var(--page);}
.rd-tb-avatar{width:34px;height:34px;border-radius:9px;background:var(--ink);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .17s;flex-shrink:0;border:0.5px solid transparent;outline:none;color:rgba(255,255,255,.75);}
.rd-tb-avatar:hover{background:#1a2a5e;transform:translateY(-1px);}

/* ── Page ── */
.rd-page{padding-top:calc(var(--tb-h) + 28px);padding-left:clamp(14px,3vw,32px);padding-right:clamp(14px,3vw,32px);padding-bottom:52px;flex:1;display:flex;flex-direction:column;}
.rd-ph{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:24px;animation:fadeUp .30s ease both;}
.rd-ph-left h1{font-size:20px;font-weight:500;letter-spacing:-.03em;line-height:1.2;margin-bottom:3px;}
.rd-ph-left p{font-size:12.5px;color:var(--i40);}
.rd-btn-primary{display:inline-flex;align-items:center;gap:7px;height:38px;padding:0 18px;background:var(--ink);color:rgba(255,255,255,.93);border:none;border-radius:var(--r-sm);font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;transition:all .2s;white-space:nowrap;flex-shrink:0;box-shadow:0 1px 2px rgba(0,8,44,.10),0 4px 14px rgba(0,8,44,.22),inset 0 1px 0 rgba(255,255,255,.08);}
.rd-btn-primary:hover{background:#0b1c50;transform:translateY(-1px);}
.rd-btn-primary:active{opacity:.80;transform:scale(.97);}

/* ── Device grid ── */
.rd-device-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(292px,1fr));gap:14px;}

/* ── Device card ── */
.rd-device-card{background:var(--card-solid);border:0.5px solid var(--i07);border-radius:var(--r);box-shadow:var(--shadow);position:relative;overflow:hidden;display:flex;flex-direction:column;transition:box-shadow .26s ease,transform .26s ease,border-color .26s ease;}
.rd-device-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(0,8,44,.10) 50%,transparent);pointer-events:none;z-index:2;}
.rd-device-card:hover{box-shadow:var(--shadow-hov);transform:translateY(-3px);border-color:var(--i10);}
.rd-dc-band{height:3px;width:100%;flex-shrink:0;border-radius:var(--r) var(--r) 0 0;}
.rd-dc-band.active{background:linear-gradient(90deg,var(--active),rgba(0,2,140,.30));}
.rd-dc-band.inactive{background:linear-gradient(90deg,rgba(0,8,44,.18),rgba(0,8,44,.06));}
.rd-dc-head{display:flex;align-items:flex-start;gap:12px;padding:22px 20px 18px;border-bottom:0.5px solid var(--i07);}
.rd-dc-device-wrap{width:68px;height:68px;flex-shrink:0;position:relative;display:flex;align-items:center;justify-content:center;}
.rd-dc-device-wrap::before{content:'';position:absolute;inset:-6px;border-radius:50%;background:radial-gradient(circle,rgba(0,2,140,.10) 0%,transparent 72%);animation:iconGlow 3.5s ease-in-out infinite;pointer-events:none;}
.rd-dc-device-wrap::after{content:'';position:absolute;inset:2px;border-radius:50%;border:1px dashed rgba(0,2,140,.12);animation:orbitSpin 18s linear infinite;pointer-events:none;}
.rd-dc-icon-circle{width:60px;height:60px;border-radius:50%;flex-shrink:0;position:relative;display:flex;align-items:center;justify-content:center;background:linear-gradient(145deg,#f8f8fc 0%,#eeeef6 100%);border:1px solid rgba(0,2,140,.10);box-shadow:0 0 0 3px rgba(255,255,255,.90),0 4px 16px rgba(0,2,140,.10),0 1px 3px rgba(0,0,0,.06),inset 0 1px 0 rgba(255,255,255,.95);transition:box-shadow .26s ease,transform .26s ease;}
.rd-device-card:hover .rd-dc-icon-circle{box-shadow:0 0 0 3px rgba(255,255,255,.90),0 6px 22px rgba(0,2,140,.16),0 2px 6px rgba(0,0,0,.07),inset 0 1px 0 rgba(255,255,255,.95);transform:scale(1.04);}
.rd-dc-icon-led{position:absolute;bottom:3px;right:3px;width:8px;height:8px;border-radius:50%;background:var(--active);border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,2,140,.15);animation:ledPulse 2.8s ease-in-out infinite;z-index:2;}
.rd-dc-icon-led.inactive{background:rgba(0,8,44,.22);animation:none;box-shadow:0 0 0 1px rgba(0,8,44,.08);}
.rd-dc-info{flex:1;min-width:0;}
.rd-dc-name{font-size:14px;font-weight:500;letter-spacing:-.015em;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.25;}
.rd-dc-type{font-size:11px;color:var(--i40);margin-top:3px;}
.rd-dc-body{padding:20px;flex:1;display:flex;flex-direction:column;gap:13px;}
.rd-dc-row{display:flex;align-items:center;gap:9px;}
.rd-dc-row-icon{width:15px;height:15px;flex-shrink:0;color:var(--i24);}
.rd-dc-row-lbl{font-size:10.5px;color:var(--i40);min-width:70px;flex-shrink:0;}
.rd-dc-row-val{font-size:12px;color:var(--i70);font-weight:500;font-variant-numeric:tabular-nums;}
.rd-dc-foot{padding:13px 20px 16px;border-top:0.5px solid var(--i07);background:rgba(255,255,255,.30);display:flex;align-items:center;justify-content:space-between;gap:8px;}
.rd-btn-edit{display:inline-flex;align-items:center;gap:5px;height:31px;padding:0 13px;background:transparent;color:var(--i50);border:0.5px solid var(--i10);border-radius:var(--r-xs);font-family:inherit;font-size:11.5px;font-weight:500;cursor:pointer;transition:all .18s;}
.rd-btn-edit:hover{background:var(--i04);border-color:var(--i16);color:var(--i70);transform:translateY(-1px);}
.rd-btn-edit:active{opacity:.75;transform:scale(.97);}
.rd-btn-unlink{display:inline-flex;align-items:center;gap:6px;height:31px;padding:0 13px;background:#00082C;color:#FCFCFD;border:0.5px solid #00082C;border-radius:var(--r-xs);font-family:inherit;font-size:11.5px;font-weight:500;cursor:pointer;transition:all .18s;}
.rd-btn-unlink:hover{background:#071452;transform:translateY(-1px);}
.rd-btn-unlink:active{opacity:.75;transform:scale(.97);}

/* ── Empty ── */
.rd-empty{display:none;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:80px 24px;animation:fadeUp .38s ease both;}
.rd-empty.visible{display:flex;}
.rd-empty-icon{width:72px;height:72px;border-radius:20px;background:var(--i04);border:0.5px solid var(--i10);display:flex;align-items:center;justify-content:center;color:var(--i24);margin-bottom:22px;}
.rd-empty-title{font-size:16px;font-weight:500;color:var(--ink);letter-spacing:-.02em;margin-bottom:7px;}
.rd-empty-sub{font-size:13px;color:var(--i40);line-height:1.60;max-width:300px;margin-bottom:26px;}

/* ── Modal backdrop ── */
.rd-modal-bg{position:fixed;inset:0;z-index:100;background:rgba(0,8,44,.55);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;pointer-events:none;transition:opacity .22s ease;}
.rd-modal-bg.open{opacity:1;pointer-events:all;}

/* ── Modal box (link & edit) ── */
.rd-modal{width:100%;max-width:428px;background:rgba(255,255,255,.98);border:0.5px solid var(--i10);border-radius:var(--r);position:relative;overflow:hidden;box-shadow:0 8px 32px rgba(0,8,44,.14),0 40px 80px rgba(0,8,44,.18);animation:scaleIn .28s cubic-bezier(.34,1.56,.64,1) both;}
.rd-modal::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.9) 50%,transparent);pointer-events:none;}
.rd-modal-head{display:flex;align-items:center;gap:12px;padding:20px 22px 16px;border-bottom:0.5px solid var(--i07);}
.rd-modal-head-icon{width:36px;height:36px;border-radius:10px;flex-shrink:0;background:var(--i04);border:0.5px solid var(--i10);color:var(--i50);display:flex;align-items:center;justify-content:center;}
.rd-modal-title{font-size:15px;font-weight:500;letter-spacing:-.02em;}
.rd-modal-sub{font-size:11.5px;color:var(--i40);margin-top:2px;}
.rd-modal-close{margin-left:auto;width:28px;height:28px;border-radius:8px;border:0.5px solid var(--i10);background:var(--i04);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--i40);transition:all .17s;flex-shrink:0;}
.rd-modal-close:hover{background:rgba(255,255,255,.90);border-color:var(--i16);color:var(--i70);}
.rd-modal-body{padding:22px;display:flex;flex-direction:column;gap:18px;}
.rd-modal-foot{display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:14px 22px 18px;border-top:0.5px solid var(--i07);background:rgba(255,255,255,.25);}

/* ── Confirm box ── */
.rd-confirm-box{width:100%;max-width:360px;background:rgba(255,255,255,.98);border:0.5px solid var(--i10);border-radius:var(--r);padding:24px;box-shadow:0 8px 32px rgba(0,8,44,.14),0 40px 80px rgba(0,8,44,.18);animation:scaleIn .28s cubic-bezier(.34,1.56,.64,1) both;position:relative;overflow:hidden;}
.rd-confirm-box::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.9) 50%,transparent);pointer-events:none;}
.rd-confirm-ico{width:44px;height:44px;border-radius:13px;flex-shrink:0;background:#00082C;border:0.5px solid #F0F5FF;color:#F0F5FF;display:flex;align-items:center;justify-content:center;margin-bottom:14px;}
.rd-confirm-title{font-size:15px;font-weight:500;letter-spacing:-.02em;margin-bottom:7px;}
.rd-confirm-sub{font-size:12.5px;color:var(--i50);line-height:1.60;margin-bottom:22px;}
.rd-confirm-btns{display:flex;gap:8px;justify-content:flex-end;}

/* ── Form fields ── */
.rd-field{display:flex;flex-direction:column;gap:7px;}
.rd-field-label{font-size:10.5px;font-weight:500;color:var(--i40);letter-spacing:.07em;text-transform:uppercase;}
.rd-field-input{width:100%;height:44px;background:rgba(255,255,255,.85);border:0.5px solid var(--i16);border-radius:var(--r-sm);padding:0 14px;font-family:inherit;font-size:13.5px;color:var(--ink);outline:none;transition:all .2s;letter-spacing:.03em;}
.rd-field-input::placeholder{color:var(--i24);letter-spacing:0;}
.rd-field-input:hover{border-color:var(--i24);background:rgba(255,255,255,.95);}
.rd-field-input:focus{background:#fff;border-color:var(--ink);box-shadow:0 0 0 3px rgba(0,8,44,.07);}
.rd-field-input.error{border-color:rgba(192,57,43,.45);background:rgba(192,57,43,.03);}
.rd-field-input.error:focus{box-shadow:0 0 0 3px rgba(192,57,43,.10);}
.rd-field-hint{font-size:11px;color:var(--i40);line-height:1.5;}
.rd-field-error{font-size:11px;color:var(--red);}

/* ── Found chip ── */
.rd-found-chip{display:flex;align-items:center;gap:11px;padding:12px 14px;border-radius:var(--r-sm);background:var(--active-t);border:0.5px solid var(--active-b);animation:fadeUp .22s ease both;}
.rd-found-chip-icon{width:32px;height:32px;border-radius:9px;flex-shrink:0;background:rgba(0,2,140,.12);border:0.5px solid var(--active-b);display:flex;align-items:center;justify-content:center;color:var(--active);}
.rd-found-chip-info{flex:1;min-width:0;}
.rd-found-chip-name{font-size:13px;font-weight:500;color:var(--active);}
.rd-found-chip-code{font-size:10.5px;color:rgba(0,2,140,.55);margin-top:2px;}

/* ── Buttons ── */
.rd-btn-ghost{height:38px;padding:0 16px;border-radius:var(--r-sm);border:0.5px solid var(--i10);background:rgba(255,255,255,.70);font-family:inherit;font-size:13px;font-weight:500;color:var(--i50);cursor:pointer;transition:all .18s;}
.rd-btn-ghost:hover{background:rgba(255,255,255,.95);border-color:var(--i24);color:var(--i70);}
.rd-btn-submit{display:inline-flex;align-items:center;gap:7px;height:38px;padding:0 20px;border-radius:var(--r-sm);background:var(--ink);color:rgba(255,255,255,.93);border:none;font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;transition:all .2s;box-shadow:0 1px 2px rgba(0,8,44,.10),0 4px 14px rgba(0,8,44,.22),inset 0 1px 0 rgba(255,255,255,.08);}
.rd-btn-submit:hover{background:#0b1c50;transform:translateY(-1px);}
.rd-btn-submit:active{opacity:.80;transform:scale(.97);}
.rd-btn-submit:disabled{opacity:.45;cursor:not-allowed;transform:none;}
.rd-btn-danger{height:38px;padding:0 18px;border-radius:var(--r-sm);background:#00082C;color:#F0F5FF;border:0.5px solid #F0F5FF;font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;transition:all .18s;box-shadow:0 1px 2px rgba(0,8,44,.14),0 4px 12px rgba(0,8,44,.28);}
.rd-btn-danger:hover{background:#071452;transform:translateY(-1px);}
.rd-btn-danger:active{opacity:.80;transform:scale(.97);}
.rd-spinner{width:14px;height:14px;border:2px solid rgba(255,255,255,.28);border-top-color:rgba(255,255,255,.90);border-radius:50%;flex-shrink:0;animation:spin .7s linear infinite;}

/* ── Toast ── */
.rd-toast-region{position:fixed;bottom:26px;right:26px;z-index:200;display:flex;flex-direction:column;gap:8px;align-items:flex-end;pointer-events:none;}
.rd-toast{display:inline-flex;align-items:center;gap:9px;padding:10px 18px;border-radius:99px;background:rgba(0,8,44,.92);color:rgba(255,255,255,.93);font-size:12.5px;font-weight:500;box-shadow:0 4px 20px rgba(0,8,44,.30);animation:popIn .35s ease both;pointer-events:auto;white-space:nowrap;}
.rd-toast.ok{background:#00082C;}
.rd-toast.err{background:rgba(160,40,30,.92);}

/* ── Responsive ── */
@media(min-width:961px) and (max-width:1100px){
  :root{--sb-w:64px;}
  .rd-sb-name,.rd-sb-tag,.rd-sb-item span,.rd-sb-pname,.rd-sb-prole,.rd-sb-dots{display:none;}
  .rd-sb-brand{padding:20px 12px;justify-content:center;}
  .rd-sb-mark{width:40px;height:40px;}
  .rd-sb-nav{padding:12px 8px;}
  .rd-sb-item{justify-content:center;padding:12px 8px;}
  .rd-sb-footer{padding:12px 8px;display:flex;justify-content:center;}
  .rd-sb-profile{justify-content:center;gap:0;padding:0;width:40px;height:40px;}
}
@media(max-width:960px){
  :root{--sb-w:0px;--tb-h:58px;}
  .rd-sidebar{width:100%!important;transform:translateX(-100%);position:fixed;top:0;left:0;bottom:0;height:100%!important;z-index:50;background:#f5f5f9!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;box-shadow:none!important;transition:transform .28s cubic-bezier(.4,0,.2,1);}
  .rd-sidebar.open{transform:translateX(0)!important;}
  .rd-sb-name,.rd-sb-tag,.rd-sb-item span,.rd-sb-pname,.rd-sb-prole,.rd-sb-dots{display:revert!important;}
  .rd-sb-brand{padding:28px 24px 24px;justify-content:flex-start!important;}
  .rd-sb-nav{padding:20px 18px;}
  .rd-sb-item{justify-content:flex-start!important;padding:0 14px!important;width:100%!important;margin:0 0 2px!important;height:48px!important;}
  .rd-sb-footer{padding:18px;}
  .rd-sb-profile{justify-content:flex-start!important;}
  .rd-sb-close{display:flex!important;}
  .rd-content{margin-left:0;}
  .rd-topbar{left:0;right:0;padding:0 20px;gap:10px;}
  .rd-tb-hamburger{display:flex!important;}
  .rd-page{padding:calc(var(--tb-h) + 20px) 16px 48px;}
}
@media(max-width:768px){
  :root{--tb-h:54px;}
  .rd-topbar{padding:0 14px;right:0;}
  .rd-tb-bc-root,.rd-tb-bc-sep{display:none;}
  .rd-page{padding-top:calc(var(--tb-h) + 16px);padding-left:12px;padding-right:12px;padding-bottom:36px;}
  .rd-ph{margin-bottom:18px;}
  .rd-ph-left h1{font-size:18px;}
  .rd-device-grid{grid-template-columns:1fr;gap:12px;}
}
@media(max-width:480px){
  .rd-ph{flex-direction:column;align-items:flex-start;gap:10px;}
  .rd-btn-primary{width:100%;justify-content:center;}
  .rd-modal-bg{padding:12px;}
  .rd-confirm-box{padding:18px;}
  .rd-toast-region{bottom:16px;right:12px;left:12px;align-items:stretch;}
  .rd-toast{white-space:normal;}
}
`;

/* ══════════════════════════════════════
   CORRECCIÓN: Inyectar CSS a nivel de módulo,
   FUERA de cualquier componente o useEffect.
   Esto garantiza que los estilos estén en el DOM
   antes del primer render de React.
══════════════════════════════════════ */
if (typeof document !== 'undefined') {
  const _id = 'rilambDispositivosStyles';
  if (!document.getElementById(_id)) {
    const _style = document.createElement('style');
    _style.id = _id;
    _style.textContent = GLOBAL_CSS;
    document.head.appendChild(_style);
  }
}

/* ══ DATOS ══ */
// Datos estáticos eliminados - ahora se cargan desde la API

/* ══ Helpers ══ */
function fmtDate(str) {
  const d = new Date(str + 'T00:00:00');
  return d.toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' });
}

/* ══ Device molecule SVG ══ */
function MolSVG({ type, status }) {
  const inactive = status !== 'active';
  const c1 = inactive ? 'rgba(0,8,44,.30)' : '#00028C';
  const c2 = inactive ? 'rgba(0,8,44,.18)' : 'rgba(0,2,140,.58)';
  const c3 = inactive ? 'rgba(0,8,44,.10)' : 'rgba(0,2,140,.28)';
  const lc = inactive ? 'rgba(0,8,44,.09)' : 'rgba(0,2,140,.20)';
  const speeds = {
    'Estación meteorológica':     [3.8,5.1,4.4,6.2],
    'Sensor de calidad del aire': [4.5,3.2,5.8,4.1],
    'Monitor de agua':            [5.2,4.0,3.6,5.5],
    'Sensor de suelo':            [3.4,5.7,4.9,3.8],
  };
  const [d1,d2,d3,d4] = speeds[type] || [4.2,5.0,3.7,4.8];
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36" style={{position:'relative',zIndex:1,overflow:'visible'}}>
      <circle cx="18" cy="18" r="3.2" fill={c1}/>
      <g><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur={d1+'s'} repeatCount="indefinite"/>
        <circle cx="29" cy="18" r="2" fill={c2}/>
        <line x1="21.2" y1="18" x2="27" y2="18" stroke={lc} strokeWidth="1"/>
      </g>
      <g><animateTransform attributeName="transform" type="rotate" from="60 18 18" to="420 18 18" dur={d2+'s'} repeatCount="indefinite"/>
        <circle cx="7" cy="18" r="1.5" fill={c2}/>
        <line x1="14.8" y1="18" x2="8.5" y2="18" stroke={lc} strokeWidth="1"/>
      </g>
      <g><animateTransform attributeName="transform" type="rotate" from="110 18 18" to="470 18 18" dur={d3+'s'} repeatCount="indefinite"/>
        <circle cx="18" cy="8" r="1.7" fill={c3}/>
        <line x1="18" y1="14.8" x2="18" y2="9.7" stroke={lc} strokeWidth="1"/>
      </g>
      <g><animateTransform attributeName="transform" type="rotate" from="200 18 18" to="-160 18 18" dur={d4+'s'} repeatCount="indefinite"/>
        <circle cx="26" cy="11" r="1.2" fill={c3}/>
        <line x1="20.2" y1="15.8" x2="24.8" y2="11.8" stroke={lc} strokeWidth="0.8"/>
      </g>
    </svg>
  );
}

/* ══ ICONS ══ */
const IcoMenu = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IcoX = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoXSm = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoLogout = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.95)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IcoDots = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const IcoUser = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcoLock = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcoPlus = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcoLink = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
const IcoEdit = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcoUnlink = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 0 1 0 10h-2"/><line x1="9" y1="12" x2="10.5" y2="12"/><line x1="13.5" y1="12" x2="15" y2="12"/><line x1="6" y1="3" x2="7" y2="5"/><line x1="18" y1="19" x2="17" y2="21"/></svg>;
const IcoCalendar = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" width="100%" height="100%"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcoCode = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>;
const IcoChevron = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IcoCheck = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoCheckSm = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoMonitor = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IcoFile = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IcoDevice = () => <svg width="15" height="15" viewBox="0 0 40 40" fill="none"><rect x="1.5" y="1.5" width="37" height="37" rx="9" stroke="currentColor" strokeWidth="2.2" fill="none"/><circle cx="20" cy="22" r="10.5" stroke="currentColor" strokeWidth="1.6" fill="none" opacity=".5"/><circle cx="20" cy="22" r="1.7" fill="currentColor"/></svg>;

/* ══ Toast ══ */
function ToastRegion({ toasts }) {
  return (
    <div className="rd-toast-region">
      {toasts.map(t => (
        <div key={t.id} className={`rd-toast ${t.type}`} style={t.fading ? {animation:'toastOut .3s ease forwards'} : {}}>
          {t.type === 'ok' ? <IcoCheckSm /> : t.type === 'err' ? <IcoXSm /> : null}
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ══ Device Card ══ */
function DeviceCard({ device, onEdit, onUnlink, style }) {
  return (
    <div className="rd-device-card" style={style}>
      <div className={`rd-dc-band ${device.status}`} />
      <div className="rd-dc-head">
        <div className="rd-dc-device-wrap">
          <div className="rd-dc-icon-circle">
            <div className={`rd-dc-icon-led${device.status !== 'active' ? ' inactive' : ''}`} />
            <MolSVG type={device.type} status={device.status} />
          </div>
        </div>
        <div className="rd-dc-info">
          <div className="rd-dc-name" title={device.name}>{device.name}</div>
          <div className="rd-dc-type">Sensor de Gas</div>
        </div>
      </div>
      <div className="rd-dc-body">
        <div className="rd-dc-row">
          <div className="rd-dc-row-icon"><IcoCode /></div>
          <span className="rd-dc-row-lbl">Código</span>
          <span className="rd-dc-row-val">{device.code}</span>
        </div>
        <div className="rd-dc-row">
          <div className="rd-dc-row-icon"><IcoCalendar /></div>
          <span className="rd-dc-row-lbl">Vinculado</span>
          <span className="rd-dc-row-val">{fmtDate(device.linked)}</span>
        </div>
      </div>
      <div className="rd-dc-foot">
        <button className="rd-btn-edit" onClick={() => onEdit(device)}>
          <IcoEdit /> Editar nombre
        </button>
        <button className="rd-btn-unlink" onClick={() => onUnlink(device)}>
          <IcoUnlink /> Desvincular
        </button>
      </div>
    </div>
  );
}

/* ══ Modal — Vincular ══ */
function ModalLink({ open, onClose, onLinked }) {
  const [step, setStep]           = useState(1);
  const [code, setCode]           = useState('');
  const [codeErr, setCodeErr]     = useState('');
  const [site, setSite]           = useState('');
  const [siteErr, setSiteErr]     = useState('');
  const [verified, setVerified]   = useState(null);
  const [loading, setLoading]     = useState(false);
  const codeRef = useRef(null);
  const siteRef = useRef(null);

  useEffect(() => {
    if (open) {
      setStep(1); setCode(''); setCodeErr(''); setSite(''); setSiteErr(''); setVerified(null); setLoading(false);
      setTimeout(() => codeRef.current?.focus(), 80);
    }
  }, [open]);

  useEffect(() => {
    if (step === 2) setTimeout(() => siteRef.current?.focus(), 80);
  }, [step]);

  const handleStep1 = () => {
    const val = code.trim().toUpperCase();
    if (!val) { setCodeErr('Por favor ingresa un código.'); return; }
    // Ya no usamos VALID_POOL, el backend validará el código
    setVerified({ code: val, name: 'Dispositivo', type: 'Sensor ambiental' });
    setStep(2);
  };

  const handleStep2 = () => {
    const val = site.trim();
    if (!val) { setSiteErr('Por favor ingresa un nombre para el sitio.'); return; }
    if (val.length < 2) { setSiteErr('El nombre debe tener al menos 2 caracteres.'); return; }
    setLoading(true);
    setTimeout(() => {
      onLinked({ id: Date.now(), name: val, type: verified.type, code: verified.code, status: 'active', linked: new Date().toISOString().split('T')[0] });
      setLoading(false);
      onClose();
    }, 1200);
  };

  const handleKey = (e) => { if (e.key === 'Enter') step === 1 ? handleStep1() : handleStep2(); };

  if (!open) return null;
  return (
    <div className={`rd-modal-bg open`} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="rd-modal">
        <div className="rd-modal-head">
          <div className="rd-modal-head-icon"><IcoLink /></div>
          <div>
            <div className="rd-modal-title">Vincular dispositivo</div>
            <div className="rd-modal-sub">{step === 1 ? 'Ingresa el código que aparece en tu dispositivo' : 'Dispositivo encontrado — ponle un nombre al sitio'}</div>
          </div>
          <button className="rd-modal-close" onClick={onClose}><IcoXSm /></button>
        </div>
        <div className="rd-modal-body">
          {step === 1 && (
            <div className="rd-field">
              <label className="rd-field-label">Código del dispositivo</label>
              <input ref={codeRef} className={`rd-field-input${codeErr ? ' error' : ''}`} type="text"
                placeholder="Ej: RIL-2025-G7H8" maxLength={20} autoComplete="off" spellCheck={false}
                value={code} onChange={e => { setCode(e.target.value); setCodeErr(''); }} onKeyDown={handleKey} />
              {codeErr && <span className="rd-field-error">{codeErr}</span>}
              <span className="rd-field-hint">El código aparece en la etiqueta del dispositivo o en su app de configuración.</span>
            </div>
          )}
          {step === 2 && verified && (
            <>
              <div className="rd-found-chip">
                <div className="rd-found-chip-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <g style={{animation:'molRotate 7s linear infinite',transformOrigin:'12px 11px'}}>
                      <circle cx="12" cy="5" r="2.5"/><circle cx="6" cy="16" r="2.5"/><circle cx="18" cy="16" r="2.5"/>
                      <line x1="12" y1="7.5" x2="7.5" y2="13.5"/><line x1="12" y1="7.5" x2="16.5" y2="13.5"/>
                    </g>
                  </svg>
                </div>
                <div className="rd-found-chip-info">
                  <div className="rd-found-chip-name">{verified.name}</div>
                  <div className="rd-found-chip-code">{verified.code}</div>
                </div>
              </div>
              <div className="rd-field">
                <label className="rd-field-label">Nombre del sitio <span style={{color:'var(--red)',fontSize:10}}>*</span></label>
                <input ref={siteRef} className={`rd-field-input${siteErr ? ' error' : ''}`} type="text"
                  placeholder="Ej: Terraza norte, Laboratorio, Sala 2…" maxLength={60} autoComplete="off"
                  value={site} onChange={e => { setSite(e.target.value); setSiteErr(''); }} onKeyDown={handleKey} />
                {siteErr && <span className="rd-field-error">{siteErr}</span>}
                <span className="rd-field-hint">Este nombre te ayudará a identificar el lugar donde está instalado el dispositivo.</span>
              </div>
            </>
          )}
        </div>
        <div className="rd-modal-foot">
          {step === 2 && <button className="rd-btn-ghost" onClick={() => setStep(1)}>Atrás</button>}
          {step === 1 && <button className="rd-btn-ghost" onClick={onClose}>Cancelar</button>}
          <button className="rd-btn-submit" disabled={loading} onClick={step === 1 ? handleStep1 : handleStep2}>
            {loading ? <><span className="rd-spinner" /> Vinculando…</> : step === 1 ? <>Continuar <IcoChevron /></> : <><IcoLink /> Vincular</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══ Modal — Confirmar desvinculación ══ */
function ModalConfirm({ device, onClose, onConfirm }) {
  if (!device) return null;
  return (
    <div className="rd-modal-bg open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="rd-confirm-box">
        <div className="rd-confirm-ico"><IcoUnlink /></div>
        <div className="rd-confirm-title">Desvincular dispositivo</div>
        <div className="rd-confirm-sub">¿Seguro que deseas desvincular "{device.name}"? Dejarás de recibir datos de este dispositivo.</div>
        <div className="rd-confirm-btns">
          <button className="rd-btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="rd-btn-danger" onClick={() => onConfirm(device.id)}>Desvincular</button>
        </div>
      </div>
    </div>
  );
}

/* ══ Modal — Editar nombre ══ */
function ModalEdit({ device, onClose, onSave }) {
  const [val, setVal]   = useState('');
  const [err, setErr]   = useState('');
  const inputRef        = useRef(null);

  useEffect(() => {
    if (device) {
      setVal(device.name); setErr('');
      setTimeout(() => { inputRef.current?.focus(); inputRef.current?.select(); }, 80);
    }
  }, [device]);

  const handleSave = () => {
    const v = val.trim();
    if (!v) { setErr('El nombre no puede estar vacío.'); return; }
    if (v.length < 2) { setErr('Mínimo 2 caracteres.'); return; }
    onSave(device.id, v);
    onClose();
  };

  if (!device) return null;
  return (
    <div className="rd-modal-bg open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="rd-modal" style={{maxWidth:390}}>
        <div className="rd-modal-head">
          <div className="rd-modal-head-icon"><IcoEdit /></div>
          <div>
            <div className="rd-modal-title">Editar nombre del sitio</div>
            <div className="rd-modal-sub">Código: {device.code}</div>
          </div>
          <button className="rd-modal-close" onClick={onClose}><IcoXSm /></button>
        </div>
        <div className="rd-modal-body">
          <div className="rd-field">
            <label className="rd-field-label">Nombre del sitio</label>
            <input ref={inputRef} className={`rd-field-input${err ? ' error' : ''}`} type="text"
              maxLength={60} autoComplete="off"
              value={val} onChange={e => { setVal(e.target.value); setErr(''); }}
              onKeyDown={e => e.key === 'Enter' && handleSave()} />
            {err && <span className="rd-field-error">{err}</span>}
            <span className="rd-field-hint">Solo puedes modificar el nombre del sitio donde está instalado el dispositivo.</span>
          </div>
        </div>
        <div className="rd-modal-foot">
          <button className="rd-btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="rd-btn-submit" onClick={handleSave}><IcoCheck /> Guardar cambios</button>
        </div>
      </div>
    </div>
  );
}

/* ══ MAIN APP ══ */
export default function RilAmbDispositivos() {
  const navigate = useNavigate();
  const [devices, setDevices]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalLink, setModalLink]       = useState(false);
  const [confirmDev, setConfirmDev]     = useState(null);
  const [editDev, setEditDev]           = useState(null);
  const [toasts, setToasts]             = useState([]);
  const [userData, setUserData]         = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/session-logo', { replace: true, state: { next: '/' } });
  };

  // CORRECCIÓN: El bloque useEffect que inyectaba el CSS fue eliminado.
  // Los estilos ahora se inyectan a nivel de módulo (ver bloque arriba),
  // garantizando que estén disponibles antes del primer render.

  /* Load devices from API */
  useEffect(() => {
    const loadDevices = async () => {
      try {
        const data = await getMyDevices();
        // Adaptar formato de datos de la API al formato del componente
        const adaptedDevices = data.map(d => ({
          id: d.id,
          name: d.alias || `Dispositivo ${d.pairing_code}`,
          type: 'Sensor ambiental',
          code: d.pairing_code,
          status: d.estado === 'online' ? 'active' : 'inactive',
          linked: d.created_at ? new Date(d.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        }));
        setDevices(adaptedDevices);
      } catch (error) {
        console.error('Error al cargar dispositivos:', error);
        showToast('Error al cargar dispositivos', 'err');
      } finally {
        setLoading(false);
      }
    };
    loadDevices();
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

  /* Keyboard shortcuts */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        setModalLink(false); setConfirmDev(null); setEditDev(null); setSidebarOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => { if (!e.target.closest('.rd-sb-footer')) setDropdownOpen(false); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  /* Toast */
  const showToast = useCallback((msg, type = 'ok') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type, fading: false }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, fading: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 320);
    }, 3000);
  }, []);

  const handleLinked = async (dev) => {
    try {
      const result = await linkDevice(dev.code, dev.name);
      // Adaptar formato de respuesta de la API
      const newDevice = {
        id: result.dispositivo_id,
        name: result.alias || dev.name,
        type: 'Sensor ambiental',
        code: dev.code,
        status: 'active',
        linked: new Date(result.linked_at).toISOString().split('T')[0]
      };
      setDevices(prev => [newDevice, ...prev]);
      showToast(`"${newDevice.name}" vinculado correctamente`, 'ok');
    } catch (error) {
      console.error('Error al vincular dispositivo:', error);
      showToast(error.message || 'Error al vincular dispositivo', 'err');
    }
  };
  const handleUnlink = async (id) => {
    try {
      await unlinkDevice(id);
      setDevices(prev => prev.filter(d => d.id !== id));
      setConfirmDev(null);
      showToast('Dispositivo desvinculado', 'ok');
    } catch (error) {
      console.error('Error al desvincular dispositivo:', error);
      showToast(error.message || 'Error al desvincular dispositivo', 'err');
    }
  };
  const handleEditSave = (id, name) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, name } : d));
    showToast(`Nombre actualizado a "${name}"`, 'ok');
  };

  return (
    <div className="rilambDisp" style={{ minHeight:'100vh', background:'var(--page)', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      {/* Background gradient — real div, NOT ::before to avoid stacking context */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0,
        background:'radial-gradient(ellipse 70% 50% at 8% 4%, rgba(0,8,44,.04) 0%, transparent 55%), radial-gradient(ellipse 55% 40% at 94% 92%, rgba(0,8,44,.032) 0%, transparent 55%)'
      }} />

      {/* Overlay — fuera del layout */}
      <div className={`rd-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Toasts */}
      <ToastRegion toasts={toasts} />

      {/* Modals */}
      <ModalLink open={modalLink} onClose={() => setModalLink(false)} onLinked={handleLinked} />
      {confirmDev && <ModalConfirm device={confirmDev} onClose={() => setConfirmDev(null)} onConfirm={handleUnlink} />}
      {editDev    && <ModalEdit    device={editDev}    onClose={() => setEditDev(null)}    onSave={handleEditSave} />}

      {/* Sidebar — fuera del layout */}
      <aside className={`rd-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="rd-sb-brand">
          <div className="rd-sb-mark">
            <img src={whiteLogo} alt="RilAmb" style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
          </div>
          <div><div className="rd-sb-name">RilAmb</div><div className="rd-sb-tag">Platform</div></div>
          <button className="rd-sb-close" onClick={() => setSidebarOpen(false)}><IcoX /></button>
        </div>
        <nav className="rd-sb-nav">
          <button className="rd-sb-item" onClick={() => navigate('/dashboard')}><IcoMonitor /><span>Monitoreo</span></button>
          <button className="rd-sb-item" onClick={() => navigate('/reports')}><IcoFile /><span>Reportes</span></button>
          <button className="rd-sb-item active"><IcoDevice /><span>Dispositivos</span></button>
        </nav>
        <div className="rd-sb-footer">
          <div className="rd-sb-profile" onClick={() => setDropdownOpen(p => !p)}>
            <div className="rd-sb-av">{loading ? '...' : (userData?.nombre?.[0] || 'U')}</div>
            <div><div className="rd-sb-pname">{userData?.nombre || 'Usuario'}</div><div className="rd-sb-prole">Cuenta personal</div></div>
            <span className="rd-sb-dots"><IcoDots /></span>
          </div>
          <div className={`rd-sb-dropdown${dropdownOpen ? ' open' : ''}`}>
            <button className="rd-sb-dd-item" onClick={() => navigate('/perfil')}><IcoUser /><span>Ver perfil</span></button>
            <div className="rd-sb-divider" />
            <button
              className="rd-sb-dd-item"
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
      <div className="rd-layout">
        <div className="rd-content">
          <header className="rd-topbar">
            <button className="rd-tb-hamburger" onClick={() => setSidebarOpen(true)}><IcoMenu /></button>
            <div className="rd-tb-bc">
              <span className="rd-tb-bc-root">RilAmb</span>
              <span className="rd-tb-bc-sep">/</span>
              <span className="rd-tb-bc-cur">Mis dispositivos</span>
            </div>
            <div className="rd-tb-space" />
            <NotificationBell />
            <button className="rd-tb-avatar" onClick={handleLogout}><IcoLogout /></button>
          </header>

          <main className="rd-page">
            <div className="rd-ph">
              <div className="rd-ph-left">
                <h1>Mis dispositivos</h1>
                <p>Gestiona los dispositivos vinculados a tu cuenta</p>
              </div>
              <button className="rd-btn-primary" onClick={() => setModalLink(true)}>
                <IcoPlus /> Vincular dispositivo
              </button>
            </div>

            {/* Grid */}
            {devices.length > 0 ? (
              <div className="rd-device-grid">
                {devices.map((d, i) => (
                  <DeviceCard key={d.id} device={d}
                    style={{ animation: `fadeUp .34s ${(0.06 + i * 0.07).toFixed(2)}s ease both` }}
                    onEdit={dev => setEditDev(dev)}
                    onUnlink={dev => setConfirmDev(dev)}
                  />
                ))}
              </div>
            ) : (
              <div className="rd-empty visible">
                <div className="rd-empty-icon">
                  <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                    <rect x="1.5" y="1.5" width="37" height="37" rx="9" stroke="currentColor" strokeWidth="2.2" fill="none"/>
                    <circle cx="20" cy="22" r="10.5" stroke="currentColor" strokeWidth="1.6" fill="none" opacity=".4"/>
                    <circle cx="20" cy="22" r="6.5"  stroke="currentColor" strokeWidth="1.3" fill="none" opacity=".28"/>
                    <circle cx="20" cy="22" r="1.7" fill="currentColor" opacity=".35"/>
                  </svg>
                </div>
                <div className="rd-empty-title">No tienes dispositivos vinculados</div>
                <div className="rd-empty-sub">
                  Vincula tu primer dispositivo usando el código que aparece en su etiqueta o en la app de configuración.
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}