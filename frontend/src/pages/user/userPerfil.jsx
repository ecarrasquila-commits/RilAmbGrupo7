//COMENTARIO IMPORTANTE 
// -en escritorio: la barra de desplazamiento sale cortado.

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import whiteLogo from "../../assets/whiteLogo.png";
import NotificationBell from "../../components/Notifications";
import { getUserProfile, updateUserProfile } from "../../services/userService";
import { forgotPassword, verifyResetCode, resetPassword, logout } from "../../services/authService";
/* ══════════════════════════════════════
   CSS Variables + Global Styles injected
══════════════════════════════════════ */
const GLOBAL_CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --ink:     #00082C;
  --i70:     rgba(0,8,44,.70);
  --i50:     rgba(0,8,44,.50);
  --i40:     rgba(0,8,44,.40);
  --i24:     rgba(0,8,44,.24);
  --i16:     rgba(0,8,44,.16);
  --i10:     rgba(0,8,44,.10);
  --i07:     rgba(0,8,44,.07);
  --i04:     rgba(0,8,44,.04);
  --page:    #F0F0F4;
  --card:    rgba(255,255,255,.82);
  --card-hi: rgba(255,255,255,.96);
  --green:   #0C8A5A;
  --green-t: rgba(12,138,90,.10);
  --amber:   #9A6214;
  --amber-t: rgba(154,98,20,.10);
  --red:     #C0392B;
  --red-t:   rgba(192,57,43,.10);
  --r:       22px;
  --r-md:    13px;
  --r-sm:    9px;
  --r-xs:    6px;
  --shadow:  0 1px 1px rgba(0,8,44,.02), 0 2px 4px rgba(0,8,44,.03), 0 8px 24px rgba(0,8,44,.05), 0 32px 64px rgba(0,8,44,.07);
  --sb-w:    250px;
  --tb-h:    62px;
}

html, body { min-height:100vh; width:100%; font-family:'DM Sans',system-ui,sans-serif; background:var(--page); color:var(--ink); -webkit-font-smoothing:antialiased; overflow-x:hidden; }

@keyframes fadeIn  { from{opacity:0} to{opacity:1} }
@keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
@keyframes toastIn { from{opacity:0;transform:translateY(10px) scale(.96)} to{opacity:1;transform:none} }
@keyframes spin    { to{transform:rotate(360deg)} }

.rilambRoot { font-family:'DM Sans',system-ui,sans-serif; }
/* background gradient handled via inline div in JSX */

/* Overlay */
.rl-overlay { display:none; position:fixed; inset:0; z-index:40; background:rgba(0,8,44,.50); animation:fadeIn .22s ease; }
.rl-overlay.open { display:block; }

/* Layout */
.rl-layout { display:flex; min-height:100vh; position:relative; z-index:1; }

/* ── Sidebar ── */
.rl-sidebar{
  width:var(--sb-w);background:#f5f5f9;border-right:0.5px solid var(--i07);
  display:flex;flex-direction:column;
  position:fixed;top:0;left:0;bottom:0;height:100%;z-index:30;
  transition:transform .28s cubic-bezier(.4,0,.2,1);
  overflow-y:auto;overflow-x:hidden;
  will-change:transform;
}
@media(min-width:961px){
  .rl-sidebar{
    background:rgba(255,255,255,.74);
    backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);
    box-shadow:1px 0 0 rgba(255,255,255,.60),2px 0 12px rgba(0,8,44,.04);
  }
}
.rl-sidebar::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.9) 50%,transparent);pointer-events:none;}
.rl-sidebar.open{transform:translateX(0)!important;}

.rl-sb-brand{padding:26px 20px 22px;display:flex;align-items:center;gap:11px;}
.rl-sb-close-btn{display:none;margin-left:auto;width:28px;height:28px;border-radius:8px;border:0.5px solid var(--i10);background:var(--i04);align-items:center;justify-content:center;cursor:pointer;color:var(--i40);flex-shrink:0;}
.rl-sb-mark{width:32px;height:32px;background:var(--ink);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 8px rgba(0,8,44,.22),inset 0 1px 0 rgba(255,255,255,.10);}
.rl-sb-mark svg{color:rgba(255,255,255,.85);}
.rl-sb-name{font-size:15px;font-weight:600;letter-spacing:-.02em;}
.rl-sb-tag{font-size:9px;font-weight:500;color:var(--i40);letter-spacing:.09em;text-transform:uppercase;margin-top:1px;}
.rl-sb-nav{padding:18px 13px;flex:1;}
.rl-sb-item{display:flex;align-items:center;gap:10px;height:38px;padding:0 11px;border-radius:var(--r-xs);border:0.5px solid transparent;cursor:pointer;transition:all .17s;margin-bottom:2px;text-decoration:none;color:inherit;position:relative;background:none;width:100%;}
.rl-sb-item svg{color:var(--i40);flex-shrink:0;transition:color .17s;}
.rl-sb-item span{font-size:12.5px;color:var(--i50);transition:color .17s;}
.rl-sb-item:hover{background:var(--i04);border-color:var(--i07);}
.rl-sb-item:hover svg,.rl-sb-item:hover span{color:var(--i70);}
.rl-sb-item.active{background:var(--i07);border-color:var(--i10);}
.rl-sb-item.active span{color:var(--ink);font-weight:500;}
.rl-sb-item.active svg{color:var(--ink);}
.rl-sb-item.active::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:2.5px;height:16px;background:var(--ink);border-radius:0 3px 3px 0;opacity:.55;}
.rl-sb-footer{padding:14px 13px;border-top:0.5px solid var(--i07);position:relative;}
.rl-sb-profile{display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:var(--r-xs);border:0.5px solid transparent;cursor:pointer;transition:all .17s;}
.rl-sb-profile:hover{background:var(--i04);border-color:var(--i07);}
.rl-sb-av{width:32px;height:32px;border-radius:8px;background:var(--i07);border:0.5px solid var(--i10);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:var(--i70);flex-shrink:0;}
.rl-sb-pname{font-size:12px;font-weight:500;color:var(--i70);}
.rl-sb-prole{font-size:10px;color:var(--i40);margin-top:1px;}
.rl-sb-dots{margin-left:auto;color:var(--i24);}
.rl-sb-dropdown{display:none;position:absolute;bottom:100%;left:14px;right:14px;margin-bottom:8px;background:var(--card);border:0.5px solid var(--i10);border-radius:var(--r-sm);box-shadow:0 4px 16px rgba(0,8,44,.12);overflow:hidden;z-index:40;animation:fadeUp .2s ease both;}
.rl-sb-dropdown.open{display:block;}
.rl-sb-dropdown-item{display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;transition:background .17s;text-decoration:none;color:inherit;background:none;border:none;width:100%;}
.rl-sb-dropdown-item:hover{background:var(--i04);}
.rl-sb-dropdown-item svg{width:14px;height:14px;color:var(--i40);flex-shrink:0;}
.rl-sb-dropdown-item span{font-size:12px;color:var(--i50);}
.rl-sb-dropdown-item:hover svg,.rl-sb-dropdown-item:hover span{color:var(--i70);}
.rl-sb-divider{height:0.5px;background:var(--i07);}

/* ── TOPBAR ── */
.rl-content { margin-left:var(--sb-w); flex:1; display:flex; flex-direction:column; min-height:100vh; min-width:0; }
.rl-topbar {
  height:var(--tb-h); background:rgba(240,240,244,.88);
  backdrop-filter:blur(24px) saturate(1.3); -webkit-backdrop-filter:blur(24px) saturate(1.3);
  border-bottom:0.5px solid var(--i07); position:fixed; top:0; left:var(--sb-w); right:17px; z-index:20;
  display:flex; align-items:center; padding:0 clamp(16px,4vw,36px); gap:12px;
  box-shadow:0 1px 0 rgba(255,255,255,.65),0 4px 16px rgba(0,8,44,.03);
  transition:left .28s cubic-bezier(.4,0,.2,1);
  will-change:transform;
}
.rl-tb-hamburger {
  display:none; width:36px; height:36px; border-radius:10px;
  border:0.5px solid var(--i10); background:rgba(255,255,255,.60);
  align-items:center; justify-content:center; cursor:pointer; color:var(--i50); flex-shrink:0;
  backdrop-filter:blur(6px); transition:all .17s;
}
.rl-tb-hamburger:hover { background:rgba(255,255,255,.88); border-color:var(--i16); color:var(--i70); }
.rl-tb-breadcrumb { display:flex; align-items:center; gap:8px; }
.rl-tb-bc-root { font-size:12px; color:var(--i40); }
.rl-tb-bc-sep  { font-size:11px; color:var(--i16); }
.rl-tb-bc-cur  { font-size:12.5px; font-weight:500; color:var(--i70); }
.rl-tb-space   { flex:1; }
.rl-tb-ico {
  width:36px; height:36px; border-radius:10px; border:0.5px solid var(--i10);
  background:rgba(255,255,255,.60); display:flex; align-items:center; justify-content:center;
  cursor:pointer; color:var(--i50); transition:all .17s; backdrop-filter:blur(6px);
  position:relative; outline:none; flex-shrink:0; border-style:solid;
}
.rl-tb-ico:hover { background:rgba(255,255,255,.88); border-color:var(--i16); color:var(--i70); }
.rl-notif-dot { position:absolute; top:8px; right:8px; width:5px; height:5px; background:var(--ink); border-radius:50%; border:1.5px solid var(--page); }
.rl-tb-avatar {
  width:34px; height:34px; border-radius:9px; background:var(--ink);
  display:flex; align-items:center; justify-content:center; cursor:pointer;
  transition:all .17s; flex-shrink:0; border:0.5px solid transparent; outline:none; color:rgba(255,255,255,.75);
}
.rl-tb-avatar:hover { background:#1a2a5e; transform:translateY(-1px); }

/* ── PAGE ── */
.rl-page { padding:calc(var(--tb-h) + 32px) clamp(16px,4vw,38px) 60px; flex:1; }
.rl-ph { display:flex; align-items:flex-end; justify-content:space-between; gap:16px; flex-wrap:wrap; margin-bottom:28px; }
.rl-ph-left h1 { font-size:clamp(20px,3vw,24px); font-weight:500; color:var(--ink); letter-spacing:-.03em; line-height:1.2; margin-bottom:5px; }
.rl-ph-left p  { font-size:13px; color:var(--i40); }

/* ── PROFILE LAYOUT ── */
.rl-profile-shell { display:grid; grid-template-columns:280px 1fr; gap:18px; align-items:stretch; }

/* LEFT panel */
.rl-identity-panel {
  display:flex; flex-direction:column; gap:0; animation:fadeUp .4s .05s ease both;
  background:var(--card); border:0.5px solid var(--i07); border-radius:var(--r);
  backdrop-filter:blur(28px); -webkit-backdrop-filter:blur(28px); box-shadow:var(--shadow);
  overflow:hidden; position:relative;
}
.rl-identity-panel::before {
  content:''; position:absolute; top:0; left:0; right:0; height:1px;
  background:linear-gradient(90deg,transparent,rgba(0,8,44,.12) 40%,rgba(0,8,44,.20) 50%,rgba(0,8,44,.12) 60%,transparent);
  pointer-events:none; z-index:1;
}

/* Avatar block */
.rl-av-block { padding:28px 24px 22px; text-align:center; position:relative; }
.rl-av-block::after { content:''; position:absolute; bottom:0; left:0; right:0; height:0.5px; background:var(--i07); }
.rl-av-ring {
  width:72px; height:72px; border-radius:50%; background:var(--ink);
  display:inline-flex; align-items:center; justify-content:center;
  font-size:22px; font-weight:600; color:rgba(255,255,255,.88);
  border:2px solid rgba(0,8,44,.12);
  box-shadow:0 4px 20px rgba(0,8,44,.18),inset 0 1px 0 rgba(255,255,255,.08);
  position:relative; margin-bottom:14px;
  transition:transform .25s ease,box-shadow .25s ease; cursor:pointer;
}
.rl-av-ring:hover { transform:scale(1.04); box-shadow:0 8px 28px rgba(0,8,44,.24),inset 0 1px 0 rgba(255,255,255,.08); }
.rl-av-online {
  position:absolute; bottom:2px; right:2px; width:13px; height:13px; border-radius:50%;
  background:var(--green); border:2px solid var(--card-hi);
}
.rl-av-name { font-size:16px; font-weight:600; color:var(--ink); letter-spacing:-.025em; margin-bottom:6px; }
.rl-av-role {
  display:inline-flex; align-items:center; gap:5px;
  font-size:10.5px; font-weight:500; color:var(--i40); letter-spacing:.07em; text-transform:uppercase;
  background:var(--i04); border:0.5px solid var(--i07); border-radius:99px; padding:3px 10px;
}
.rl-av-role-dot { width:4px; height:4px; border-radius:50%; background:var(--green); }

/* Section navigator */
.rl-section-nav { flex:1; display:flex; flex-direction:column; }
.rl-sn-header { padding:14px 18px 10px; border-bottom:0.5px solid var(--i07); }
.rl-sn-label { font-size:9px; font-weight:500; color:var(--i24); letter-spacing:.12em; text-transform:uppercase; }
.rl-sn-list { padding:8px; display:flex; flex-direction:column; gap:2px; flex:1; }
.rl-sn-item {
  display:flex; align-items:center; gap:12px; height:44px; padding:0 10px;
  border-radius:10px; border:0.5px solid transparent;
  cursor:pointer; transition:all .18s ease; position:relative; user-select:none;
  background:none; width:100%;
}
.rl-sn-item:hover { background:var(--i04); border-color:var(--i07); }
.rl-sn-item.active { background:var(--ink); border-color:rgba(0,8,44,.15); box-shadow:0 2px 10px rgba(0,8,44,.16),inset 0 1px 0 rgba(255,255,255,.06); }
.rl-sn-item-ico {
  width:28px; height:28px; border-radius:8px; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
  background:var(--i04); border:0.5px solid var(--i07); color:var(--i40); transition:all .18s;
}
.rl-sn-item.active .rl-sn-item-ico { background:rgba(255,255,255,.10); border-color:rgba(255,255,255,.08); color:rgba(255,255,255,.70); }
.rl-sn-item-text { flex:1; text-align:left; }
.rl-sn-item-label { font-size:12.5px; font-weight:400; color:var(--i50); transition:color .18s; }
.rl-sn-item.active .rl-sn-item-label { color:rgba(255,255,255,.88); font-weight:500; }
.rl-sn-item-sub { font-size:10px; color:var(--i24); margin-top:1px; transition:color .18s; }
.rl-sn-item.active .rl-sn-item-sub { color:rgba(255,255,255,.38); }
.rl-sn-item-arrow { color:var(--i16); transition:all .18s; }
.rl-sn-item.active .rl-sn-item-arrow { color:rgba(255,255,255,.25); }
.rl-sn-item:hover .rl-sn-item-arrow { color:var(--i40); }

/* RIGHT */
.rl-profile-main { display:flex; flex-direction:column; gap:0; }
.rl-section-panel { display:none; animation:fadeUp .32s ease both; flex:1; }
.rl-section-panel.visible { display:flex; flex-direction:column; flex:1; }

/* pcard */
.rl-pcard {
  background:var(--card); border:0.5px solid var(--i07); border-radius:var(--r);
  backdrop-filter:blur(28px); -webkit-backdrop-filter:blur(28px); box-shadow:var(--shadow);
  overflow:hidden; position:relative; display:flex; flex-direction:column; flex:1; min-height:390px;
}
.rl-pcard::before {
  content:''; position:absolute; top:0; left:0; right:0; height:1px;
  background:linear-gradient(90deg,transparent 0%,rgba(0,8,44,.10) 25%,rgba(0,8,44,.18) 50%,rgba(0,8,44,.10) 75%,transparent 100%);
  pointer-events:none; z-index:2;
}
.rl-pcard-head {
  display:flex; align-items:center; gap:14px; padding:20px 26px 18px;
  border-bottom:0.5px solid var(--i07); background:rgba(255,255,255,.30); flex-shrink:0;
}
.rl-pcard-head-ico {
  width:36px; height:36px; border-radius:11px; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
  background:var(--i04); border:0.5px solid var(--i07); color:var(--i50);
}
.rl-pcard-head-title { font-size:13.5px; font-weight:500; color:var(--ink); letter-spacing:-.02em; }
.rl-pcard-head-sub   { font-size:11px; color:var(--i40); margin-top:2px; }
.rl-pcard-body { padding:24px 26px; flex:1; }

/* Form */
.rl-pf-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.rl-pf-group { display:flex; flex-direction:column; gap:5px; }
.rl-pf-group.full { grid-column:1/-1; }
.rl-pf-label { font-size:10.5px; font-weight:500; color:var(--i40); letter-spacing:.06em; text-transform:uppercase; }
.rl-pf-input {
  height:40px; width:100%; background:rgba(255,255,255,.80); border:0.5px solid var(--i16);
  border-radius:var(--r-sm); padding:0 14px; font-family:inherit; font-size:13px; color:var(--ink);
  outline:none; transition:all .2s;
}
.rl-pf-input::placeholder { color:var(--i24); }
.rl-pf-input:focus { background:var(--card-hi); border-color:var(--ink); box-shadow:0 0 0 3px rgba(0,8,44,.07); }
.rl-pf-input.error { border-color:rgba(192,57,43,.45); background:rgba(192,57,43,.04); }

.rl-pcard-foot {
  display:flex; align-items:center; justify-content:flex-end; gap:10px;
  padding:16px 26px; border-top:0.5px solid var(--i07);
  background:rgba(255,255,255,.22); flex-shrink:0;
}
.rl-btn-ghost-sm {
  height:36px; padding:0 16px; border-radius:var(--r-sm);
  border:0.5px solid var(--i10); background:rgba(255,255,255,.60);
  font-family:inherit; font-size:12.5px; font-weight:500; color:var(--i50);
  cursor:pointer; transition:all .18s;
}
.rl-btn-ghost-sm:hover { background:rgba(255,255,255,.90); border-color:var(--i24); color:var(--i70); }
.rl-btn-save {
  display:flex; align-items:center; gap:7px; height:36px; padding:0 18px;
  background:var(--ink); border:none; border-radius:var(--r-sm);
  font-family:inherit; font-size:12.5px; font-weight:500; color:rgba(255,255,255,.92);
  cursor:pointer; transition:all .18s;
  box-shadow:0 1px 2px rgba(0,8,44,.08),0 4px 14px rgba(0,8,44,.22),inset 0 1px 0 rgba(255,255,255,.08);
}
.rl-btn-save:hover { background:#0b1c50; transform:translateY(-1px); }
.rl-btn-save:active { opacity:.75; transform:scale(.97); }
.rl-btn-save:disabled { opacity:.65; cursor:not-allowed; transform:none; }

/* Security / password */
.rl-pwd-fields { display:flex; flex-direction:column; gap:14px; }
.rl-pwd-field  { display:flex; flex-direction:column; gap:6px; }
.rl-pwd-label  { font-size:10.5px; font-weight:500; color:var(--i40); letter-spacing:.06em; text-transform:uppercase; }
.rl-pwd-input-wrap { position:relative; }
.rl-pwd-input {
  width:100%; height:40px; background:rgba(255,255,255,.80); border:0.5px solid var(--i16);
  border-radius:var(--r-sm); padding:0 40px 0 14px;
  font-family:inherit; font-size:13px; color:var(--ink); outline:none; transition:all .2s;
}
.rl-pwd-input::placeholder { color:var(--i24); }
.rl-pwd-input:hover { border-color:var(--i24); background:rgba(255,255,255,.90); }
.rl-pwd-input:focus { background:var(--card-hi); border-color:var(--ink); box-shadow:0 0 0 3px rgba(0,8,44,.07); }
.rl-pwd-input.error { border-color:rgba(192,57,43,.45); background:rgba(192,57,43,.04); }
.rl-pwd-input.error:focus { box-shadow:0 0 0 3px rgba(192,57,43,.10); }
.rl-pwd-input.valid { border-color:rgba(12,138,90,.40); background:rgba(12,138,90,.03); }
.rl-eye-btn {
  position:absolute; right:12px; top:50%; transform:translateY(-50%);
  background:none; border:none; cursor:pointer; padding:4px;
  color:var(--i24); display:flex; align-items:center; transition:color .15s; border-radius:5px;
}
.rl-eye-btn:hover { color:var(--i50); }
.rl-pwd-error-msg { font-size:11px; color:var(--red); }

/* Strength */
.rl-strength-bar { display:flex; gap:4px; margin-top:8px; }
.rl-strength-seg { flex:1; height:3px; border-radius:99px; background:var(--i10); transition:background .3s ease; }
.rl-strength-seg.s1 { background:#D83030; }
.rl-strength-seg.s2 { background:#E07020; }
.rl-strength-seg.s3 { background:#C8A020; }
.rl-strength-seg.s4 { background:#10A060; }
.rl-strength-label { font-size:11px; color:var(--i40); margin-top:5px; }

/* Requirements */
.rl-pwd-reqs { display:flex; flex-direction:column; gap:5px; margin-top:10px; }
.rl-req-item { display:flex; align-items:center; gap:7px; font-size:11.5px; color:var(--i40); transition:color .2s; }
.rl-req-item svg { width:13px; height:13px; flex-shrink:0; stroke:currentColor; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; opacity:.4; transition:opacity .2s,color .2s; }
.rl-req-item.met { color:var(--green); }
.rl-req-item.met svg { opacity:1; }

/* Alert */
.rl-pwd-alert {
  display:none; padding:11px 13px; border-radius:10px;
  font-size:12.5px; line-height:1.5; margin-bottom:14px;
}
.rl-pwd-alert.visible { display:flex; gap:9px; align-items:flex-start; }
.rl-pwd-alert svg { width:14px; height:14px; flex-shrink:0; margin-top:1px; stroke:currentColor; fill:none; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
.rl-pwd-alert.danger  { background:rgba(192,57,43,.07); color:rgba(160,20,20,.85); border:0.5px solid rgba(192,57,43,.18); }
.rl-pwd-alert.success { background:var(--green-t); color:var(--green); border:0.5px solid rgba(12,138,90,.20); }

/* OTP */
.rl-otp-wrap { display:flex; gap:8px; justify-content:center; margin-bottom:4px; }
.rl-otp-box {
  width:46px; height:52px; border-radius:11px; text-align:center;
  background:rgba(0,8,44,.022); border:0.5px solid var(--i10);
  font-family:inherit; font-size:20px; font-weight:500; color:var(--ink);
  outline:none; transition:border-color .2s,background .2s,box-shadow .2s;
  -webkit-appearance:none; -moz-appearance:textfield;
}
.rl-otp-box::-webkit-outer-spin-button,.rl-otp-box::-webkit-inner-spin-button { -webkit-appearance:none; }
.rl-otp-box:hover  { border-color:var(--i24); background:rgba(0,8,44,.03); }
.rl-otp-box:focus  { border-color:var(--ink); background:var(--card-hi); box-shadow:0 0 0 3px rgba(0,8,44,.07); }
.rl-otp-box.filled { border-color:var(--i40); background:var(--i04); }
.rl-otp-box.error  { border-color:rgba(192,57,43,.45); background:rgba(192,57,43,.04); }
.rl-otp-box.valid  { border-color:rgba(12,138,90,.40)!important; background:rgba(12,138,90,.03)!important; }

/* Progress dots */
.rl-pdot { width:5px; height:5px; border-radius:99px; background:var(--i16); transition:all .3s ease; }
.rl-pdot.active { width:16px; background:var(--ink); }
.rl-pdot.done   { background:var(--i40); }

/* Toast */
.rl-toast-container { position:fixed; bottom:24px; right:24px; z-index:200; display:flex; flex-direction:column; gap:8px; align-items:flex-end; }
.rl-toast {
  display:flex; align-items:center; gap:10px; padding:11px 16px;
  background:var(--ink); border-radius:12px; color:rgba(255,255,255,.90);
  font-size:12.5px; font-weight:500; box-shadow:0 4px 20px rgba(0,8,44,.28);
  animation:toastIn .28s cubic-bezier(.34,1.28,.64,1) both; max-width:320px;
  transition:opacity .22s ease,transform .22s ease;
}

/* Spinner */
.rl-btn-spinner {
  width:13px; height:13px; border:1.8px solid rgba(255,255,255,.3);
  border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite;
}

/* Step animation */
.rl-pwd-step { animation:fadeUp .28s ease both; }

/* ── RESPONSIVE ── */
@media (max-width:1100px) {
  :root { --sb-w:64px; }
  .rl-sb-name,.rl-sb-tag,.rl-sb-item span,.rl-sb-pname,.rl-sb-prole,.rl-sb-dots { display:none; }
  .rl-sb-brand   { padding:20px 12px; justify-content:center; }
  .rl-sb-nav     { padding:12px 8px; }
  .rl-sb-item    { justify-content:center; padding:0!important; width:40px!important; margin:0 auto 2px!important; }
  .rl-sb-footer  { padding:12px 8px; }
  .rl-sb-profile { justify-content:center; }
  .rl-profile-shell { grid-template-columns:240px 1fr; }
}

@media (max-width:960px) {
  :root { --sb-w:0px; --tb-h:58px; }

  /* Sidebar: full screen drawer on mobile */
  .rl-sidebar {
    width:100% !important;
    max-width:100% !important;
    position:fixed !important;
    top:0 !important; left:0 !important; right:0 !important; bottom:0 !important;
    height:100% !important;
    transform:translateX(-100%) !important;
    z-index:50 !important;
    background:#f5f5f9 !important;
    backdrop-filter:none !important;
    -webkit-backdrop-filter:none !important;
    box-shadow:none !important;
    transition:transform .28s cubic-bezier(.4,0,.2,1) !important;
    overflow-y:auto !important;
    border-right:none !important;
  }
  .rl-sidebar.open { transform:translateX(0) !important; }

  /* Overlay */
  .rl-overlay { position:absolute !important; z-index:49 !important; }

  /* Restore text labels hidden at 1100px */
  .rl-sb-name,
  .rl-sb-tag,
  .rl-sb-item span,
  .rl-sb-pname,
  .rl-sb-prole,
  .rl-sb-dots { display:revert !important; }

  .rl-sb-brand   { padding:28px 24px 24px; justify-content:flex-start !important; }
  .rl-sb-nav     { padding:20px 18px; }
  .rl-sb-item    { justify-content:flex-start !important; padding:0 14px !important; width:100% !important; margin:0 0 2px !important; height:48px !important; }
  .rl-sb-footer  { padding:18px; }
  .rl-sb-profile { justify-content:flex-start !important; }
  .rl-sb-close-btn { display:flex !important; }

  /* Content takes full width */
  .rl-content    { margin-left:0 !important; }
  .rl-topbar     { left:0 !important; right:0 !important; padding:0 20px; gap:10px; }
  .rl-tb-hamburger { display:flex !important; }

  /* Profile layout: single column */
  .rl-profile-shell { grid-template-columns:1fr; gap:14px; }

  /* Identity panel: horizontal on tablet, vertical on phone */
  .rl-identity-panel { flex-direction:column; }
  .rl-av-block { flex:1; min-width:0; }

  .rl-page { padding:calc(var(--tb-h) + 20px) 16px 48px; }

  /* Password header: allow dots to wrap below */
  .rl-pcard-head { flex-wrap:wrap; gap:10px; }
  #progress-dots { margin-left:0 !important; width:100%; }
}

@media (max-width:768px) {
  :root { --tb-h:56px; }
  .rl-topbar { padding:0 16px; gap:10px; right:0; }
  .rl-tb-bc-root,.rl-tb-bc-sep { display:none !important; }
  .rl-page { padding:calc(var(--tb-h) + 20px) 14px 60px; }

  /* Form: single column */
  .rl-pf-grid { grid-template-columns:1fr !important; }
  .rl-pf-group.full { grid-column:1 !important; }

  /* Card spacing */
  .rl-pcard-body { padding:16px !important; }
  .rl-pcard-head { padding:14px 16px !important; }
  .rl-pcard-foot { padding:12px 16px !important; flex-wrap:wrap; gap:8px; }
  .rl-pcard-foot .rl-btn-save,
  .rl-pcard-foot .rl-btn-ghost-sm { flex:1; justify-content:center; }

  /* Password card head: stack dots below on very small */
  .rl-pcard-head { flex-wrap:wrap; }

  /* OTP boxes smaller on phone */
  .rl-otp-box { width:38px; height:46px; font-size:17px; }
  .rl-otp-wrap { gap:6px; }

  /* Section nav items */
  .rl-sn-item { height:48px; }

  /* Toast full width bottom */
  .rl-toast-container { bottom:16px; right:12px; left:12px; align-items:stretch; }
  .rl-toast { max-width:100%; }
}
`;

/* ══════════════════════════════════════
   CORRECCIÓN #1: Inyectar CSS a nivel de módulo,
   FUERA de cualquier componente o useEffect.
   Esto garantiza que los estilos estén en el DOM
   antes del primer render de React.
══════════════════════════════════════ */
if (typeof document !== 'undefined') {
  const _id = 'rilambStyles';
  if (!document.getElementById(_id)) {
    const _style = document.createElement('style');
    _style.id = _id;
    _style.textContent = GLOBAL_CSS;
    document.head.appendChild(_style);
  }
}

/* ══ SVG Icons ══ */
const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconLock = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconFile = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
  </svg>
);
const IconUsers = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconDevice = () => (
  <svg width="15" height="15" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1.5" y="1.5" width="37" height="37" rx="9" stroke="currentColor" strokeWidth="2.2" fill="none"/>
    <circle cx="20" cy="22" r="10.5" stroke="currentColor" strokeWidth="1.6" fill="none" opacity=".5"/>
    <circle cx="20" cy="22" r="6.5" stroke="currentColor" strokeWidth="1.3" fill="none" opacity=".38"/>
    <circle cx="16" cy="18" r="1.3" fill="currentColor" opacity=".35"/>
    <circle cx="20" cy="18" r="1.3" fill="currentColor" opacity=".6"/>
    <circle cx="24" cy="18" r="1.3" fill="currentColor" opacity=".35"/>
    <circle cx="16" cy="22" r="1.3" fill="currentColor" opacity=".6"/>
    <circle cx="20" cy="22" r="1.7" fill="currentColor"/>
    <circle cx="24" cy="22" r="1.3" fill="currentColor" opacity=".6"/>
    <circle cx="16" cy="26" r="1.3" fill="currentColor" opacity=".35"/>
    <circle cx="20" cy="26" r="1.3" fill="currentColor" opacity=".6"/>
    <circle cx="24" cy="26" r="1.3" fill="currentColor" opacity=".35"/>
  </svg>
);
const IconDots = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
  </svg>
);
const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.95)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconChevron = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const IconCheck = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconSend = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const IconMenu = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const IconX = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconMail = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconMonitor = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const IconAlertCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14}}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const EyeOpen = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeClosed = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

/* ══ Strength helpers ══ */
const STRENGTH_LABELS = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
const STRENGTH_CLASSES = ['', 's1', 's2', 's3', 's4'];

function getStrength(pwd) {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}

/* ══ Toast ══ */
function ToastContainer({ toasts }) {
  return (
    <div className="rl-toast-container">
      {toasts.map(t => (
        <div key={t.id} className="rl-toast" style={t.fading ? { opacity: 0, transform: 'translateY(6px)' } : {}}>
          <IconCheck size={13} />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ══ Password Section (3-step) ══ */
const STEP_META = [
  null,
  { title: 'Cambiar contraseña',  sub: 'Enviaremos un código de verificación a tu correo' },
  { title: 'Verificar código',    sub: 'Ingresa el código de 6 dígitos enviado a tu correo' },
  { title: 'Nueva contraseña',    sub: 'Elige una contraseña segura que no hayas usado antes' },
];

function PasswordSection({ userEmail, onDone }) {
  const [step, setStep]           = useState(1);
  const [loading, setLoading]     = useState(false);
  const [otp, setOtp]             = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError]   = useState(false);
  const [otpBoxErrors, setOtpBoxErrors] = useState([false, false, false, false, false, false]);
  const [alert, setAlert]         = useState({ visible: false, type: '', msg: '' });
  const [resendAlert, setResendAlert] = useState(false);
  const [resendCD, setResendCD]   = useState(0);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [newPwd1, setNewPwd1]     = useState('');
  const [newPwd2, setNewPwd2]     = useState('');
  const [showPwd1, setShowPwd1]   = useState(false);
  const [showPwd2, setShowPwd2]   = useState(false);
  const [pwd1Error, setPwd1Error] = useState(false);
  const [pwd2Error, setPwd2Error] = useState(false);
  const [step3Alert, setStep3Alert] = useState({ visible: false, msg: '' });

  const otpRefs = useRef([]);
  const resendTimerRef = useRef(null);

  const score = getStrength(newPwd1);
  const metLen = newPwd1.length >= 8;
  const metUpper = /[A-Z]/.test(newPwd1);
  const metNum = /[0-9]/.test(newPwd1);
  const metSpecial = /[^A-Za-z0-9]/.test(newPwd1);
  const allMet = metLen && metUpper && metNum && metSpecial;

  const pwd2Match = newPwd1 === newPwd2 && newPwd2.length > 0;
  const pwd2Mismatch = newPwd1 !== newPwd2 && newPwd2.length > 0;

  const startResend = useCallback((seconds) => {
    setResendDisabled(true);
    let remaining = seconds;
    setResendCD(remaining);
    clearInterval(resendTimerRef.current);
    resendTimerRef.current = setInterval(() => {
      remaining--;
      setResendCD(remaining);
      if (remaining <= 0) {
        clearInterval(resendTimerRef.current);
        setResendDisabled(false);
        setResendCD(0);
      }
    }, 1000);
  }, []);

  const goToStep = useCallback((n, resendSeconds = 60) => {
    setStep(n);
    setAlert({ visible: false, type: '', msg: '' });
    setResendAlert(false);
    if (n === 2) {
      setOtp(['', '', '', '', '', '']);
      setOtpBoxErrors([false, false, false, false, false, false]);
      setOtpError(false);
      startResend(resendSeconds);
      setTimeout(() => otpRefs.current[0]?.focus(), 200);
    }
  }, [startResend]);

  const handleSendCode = async () => {
    if (!userEmail) {
      setAlert({ visible: true, type: 'danger', msg: 'No se pudo cargar el correo del usuario.' });
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(userEmail);
      goToStep(2, 600);
    } catch (error) {
      setAlert({ visible: true, type: 'danger', msg: error.message || 'No se pudo enviar el código.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (idx, val) => {
    const digit = val.replace(/[^0-9]/g, '').slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    setOtpError(false);
    setOtpBoxErrors([false, false, false, false, false, false]);
    setAlert({ visible: false, type: '', msg: '' });
    if (digit && idx < 5) setTimeout(() => otpRefs.current[idx + 1]?.focus(), 0);
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace') {
      if (!otp[idx] && idx > 0) {
        const next = [...otp];
        next[idx - 1] = '';
        setOtp(next);
        setTimeout(() => otpRefs.current[idx - 1]?.focus(), 0);
      }
    }
    if (e.key === 'ArrowLeft' && idx > 0)  setTimeout(() => otpRefs.current[idx - 1]?.focus(), 0);
    if (e.key === 'ArrowRight' && idx < 5) setTimeout(() => otpRefs.current[idx + 1]?.focus(), 0);
    if (e.key === 'Enter') handleVerify();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
    const next = ['', '', '', '', '', ''];
    paste.split('').forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    setTimeout(() => otpRefs.current[Math.min(paste.length, 5)]?.focus(), 0);
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setOtpBoxErrors(otp.map(v => !v));
      setOtpError(true);
      return;
    }
    if (!userEmail) {
      setAlert({ visible: true, type: 'danger', msg: 'No se pudo cargar el correo del usuario.' });
      return;
    }
    setLoading(true);
    try {
      await verifyResetCode({ correo: userEmail, code });
      clearInterval(resendTimerRef.current);
      goToStep(3);
    } catch (error) {
      setAlert({ visible: true, type: 'danger', msg: error.message || 'Código incorrecto. Inténtalo de nuevo.' });
      setOtpBoxErrors([true, true, true, true, true, true]);
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => otpRefs.current[0]?.focus(), 0);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!userEmail) {
      setAlert({ visible: true, type: 'danger', msg: 'No se pudo cargar el correo del usuario.' });
      return;
    }

    setOtp(['', '', '', '', '', '']);
    setOtpBoxErrors([false, false, false, false, false, false]);
    setOtpError(false);
    setAlert({ visible: false, type: '', msg: '' });
    try {
      await forgotPassword(userEmail);
      goToStep(2, 600);
      setResendAlert(true);
      setTimeout(() => setResendAlert(false), 3500);
    } catch (error) {
      setResendAlert(false);
      setAlert({ visible: true, type: 'danger', msg: error.message || 'No se pudo reenviar el código.' });
    }
  };

  const handleSavePwd = async () => {
    setStep3Alert({ visible: false, msg: '' });
    let ok = true;
    if (newPwd1.length < 8) { setPwd1Error(true); ok = false; }
    if (newPwd1 !== newPwd2) { setPwd2Error(true); ok = false; }
    if (!ok) return;
    if (!userEmail) {
      setStep3Alert({ visible: true, msg: 'No se pudo cargar el correo del usuario.' });
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ correo: userEmail, code: otp.join(''), new_password: newPwd1 });
      setNewPwd1(''); setNewPwd2('');
      setPwd1Error(false); setPwd2Error(false);
      setStep(1);
      window.dispatchEvent(new CustomEvent('rilambToast', { detail: 'Contraseña actualizada correctamente' }));
      onDone?.('general');
    } catch (error) {
      setStep3Alert({ visible: true, msg: error.message || 'No se pudo restablecer la contraseña.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rl-pcard">
      {/* Header */}
      <div className="rl-pcard-head">
        <div className="rl-pcard-head-ico"><IconLock size={16} /></div>
        <div>
          <div className="rl-pcard-head-title">{STEP_META[step].title}</div>
          <div className="rl-pcard-head-sub">{STEP_META[step].sub}</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 5, alignItems: 'center' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className={`rl-pdot${i < step ? ' done' : i === step ? ' active' : ''}`} />
          ))}
        </div>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="rl-pwd-step">
          <div className="rl-pcard-body">
            {alert.visible && (
              <div className={`rl-pwd-alert ${alert.type} visible`}>
                <IconAlertCircle /><span>{alert.msg}</span>
              </div>
            )}
            <div className="rl-pwd-fields">
              <div className="rl-pwd-field">
                <label className="rl-pwd-label">Correo electrónico</label>
                <div className="rl-pwd-input-wrap">
                  <input type="email" className="rl-pwd-input"
                    value={userEmail || 'Cargando...'} readOnly
                    style={{ background: 'var(--i04)', color: 'var(--i50)', cursor: 'default', paddingRight: 40 }} />
                  <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--i24)' }}>
                    <IconLock size={14} />
                  </span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--i40)', marginTop: 4 }}>Este es el correo asociado a tu cuenta</div>
              </div>
            </div>
          </div>
          <div className="rl-pcard-foot">
            <button className="rl-btn-save" onClick={handleSendCode} disabled={loading || !userEmail}>
              {loading ? <span className="rl-btn-spinner" /> : <IconSend />}
              <span style={{ opacity: loading ? .6 : 1 }}>Enviar código de verificación</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="rl-pwd-step">
          <div className="rl-pcard-body">
            {alert.visible && (
              <div className={`rl-pwd-alert ${alert.type} visible`}>
                <IconAlertCircle /><span>{alert.msg}</span>
              </div>
            )}
            {resendAlert && (
              <div className="rl-pwd-alert success visible">
                <IconCheck size={14} /><span>Código reenviado. Revisa tu bandeja de entrada.</span>
              </div>
            )}
            <div className="rl-pwd-fields">
              <div className="rl-pwd-field">
                <label className="rl-pwd-label">Código de verificación</label>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--i04)', border: '0.5px solid var(--i07)', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 500, color: 'var(--i70)', marginBottom: 14, width: 'fit-content' }}>
                  <IconMail />
                  {userEmail || 'Cargando...'}
                </div>
                <div className="rl-otp-wrap" onPaste={handleOtpPaste}>
                  {otp.map((val, idx) => (
                    <input key={idx}
                      ref={el => otpRefs.current[idx] = el}
                      className={`rl-otp-box${otpBoxErrors[idx] ? ' error' : ''}${val ? ' filled' : ''}`}
                      type="number" inputMode="numeric" pattern="[0-9]*"
                      value={val}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      onFocus={e => e.target.select()}
                      autoComplete={idx === 0 ? 'one-time-code' : undefined}
                    />
                  ))}
                </div>
                {otpError && <span className="rl-pwd-error-msg" style={{ textAlign: 'center' }}>Ingresa los 6 dígitos del código</span>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--i40)', textAlign: 'center' }}>
                ¿No llegó?{' '}
                <button onClick={handleResend} disabled={resendDisabled}
                  style={{ background: 'none', border: 'none', cursor: resendDisabled ? 'default' : 'pointer', fontSize: 12, fontWeight: 500, color: 'var(--i50)', fontFamily: 'inherit', borderBottom: '0.5px solid var(--i24)', paddingBottom: 1, transition: 'color .15s' }}>
                  Reenviar código
                </button>
                {resendCD > 0 && <span style={{ color: 'var(--i40)', fontVariantNumeric: 'tabular-nums' }}> ({resendCD}s)</span>}
              </div>
            </div>
          </div>
          <div className="rl-pcard-foot">
            <button className="rl-btn-ghost-sm" onClick={() => goToStep(1)}>Volver</button>
            <button className="rl-btn-save" onClick={handleVerify} disabled={loading}>
              {loading ? <span className="rl-btn-spinner" /> : <IconCheck />}
              <span style={{ opacity: loading ? .6 : 1 }}>Verificar código</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="rl-pwd-step">
          <div className="rl-pcard-body">
            {step3Alert.visible && (
              <div className="rl-pwd-alert danger visible">
                <IconAlertCircle /><span>{step3Alert.msg}</span>
              </div>
            )}
            <div className="rl-pwd-fields">
              {/* New password */}
              <div className="rl-pwd-field">
                <label className="rl-pwd-label">Nueva contraseña</label>
                <div className="rl-pwd-input-wrap">
                  <input type={showPwd1 ? 'text' : 'password'}
                    className={`rl-pwd-input${pwd1Error ? ' error' : ''}`}
                    placeholder="Mínimo 8 caracteres"
                    value={newPwd1}
                    onChange={e => { setNewPwd1(e.target.value); setPwd1Error(false); }} />
                  <button className="rl-eye-btn" onClick={() => setShowPwd1(p => !p)} type="button">
                    {showPwd1 ? <EyeClosed /> : <EyeOpen />}
                  </button>
                </div>
                {pwd1Error && <span className="rl-pwd-error-msg">Mínimo 8 caracteres</span>}
                {newPwd1.length > 0 && (
                  <>
                    <div className="rl-strength-bar">
                      {[0, 1, 2, 3].map(i => (
                        <div key={i} className={`rl-strength-seg${i < score ? ' ' + STRENGTH_CLASSES[score] : ''}`} />
                      ))}
                    </div>
                    <div className="rl-strength-label">{STRENGTH_LABELS[score]}</div>
                    {!allMet && (
                      <div className="rl-pwd-reqs">
                        {!metLen    && <div className="rl-req-item"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Mínimo 8 caracteres</div>}
                        {!metUpper  && <div className="rl-req-item"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Una letra mayúscula</div>}
                        {!metNum    && <div className="rl-req-item"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Un número</div>}
                        {!metSpecial && <div className="rl-req-item"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Un carácter especial (!@#$...)</div>}
                      </div>
                    )}
                  </>
                )}
              </div>
              {/* Confirm password */}
              <div className="rl-pwd-field">
                <label className="rl-pwd-label">Confirmar contraseña</label>
                <div className="rl-pwd-input-wrap">
                  <input type={showPwd2 ? 'text' : 'password'}
                    className={`rl-pwd-input${pwd2Error || pwd2Mismatch ? ' error' : pwd2Match ? ' valid' : ''}`}
                    placeholder="Repite tu contraseña"
                    value={newPwd2}
                    onChange={e => { setNewPwd2(e.target.value); setPwd2Error(false); }} />
                  <button className="rl-eye-btn" onClick={() => setShowPwd2(p => !p)} type="button">
                    {showPwd2 ? <EyeClosed /> : <EyeOpen />}
                  </button>
                </div>
                {(pwd2Error || pwd2Mismatch) && <span className="rl-pwd-error-msg">Las contraseñas no coinciden</span>}
              </div>
            </div>
          </div>
          <div className="rl-pcard-foot">
            <button className="rl-btn-ghost-sm" onClick={() => goToStep(2)}>Volver</button>
            <button className="rl-btn-save" onClick={handleSavePwd} disabled={loading || !userEmail}>
              {loading ? <span className="rl-btn-spinner" /> : <IconCheck />}
              <span style={{ opacity: loading ? .6 : 1 }}>Guardar contraseña</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══ Personal data section ══ */
function GeneralSection({ showToast, userData, onUserUpdated }) {
  const [nombre, setNombre]   = useState(userData?.nombre || '');
  const [apellido, setApellido] = useState(userData?.apellido || '');
  const [cedula, setCedula]   = useState(userData?.cedula || '');
  const [telefono, setTelefono] = useState(userData?.telefono || '');
  const [correo, setCorreo]   = useState(userData?.correo || '');
  const [cedulaErr, setCedulaErr] = useState(false);
  const [correoErr, setCorreoErr] = useState(false);
  const [saving, setSaving] = useState(false);

  // Update local state when userData changes
  useEffect(() => {
    if (userData) {
      setNombre(userData.nombre || '');
      setApellido(userData.apellido || '');
      setCedula(userData.cedula || '');
      setTelefono(userData.telefono || '');
      setCorreo(userData.correo || '');
    }
  }, [userData]);

  const validateCedula = (v) => {
    const valid = /^\d+$/.test(v) && v.length >= 5 && v.length <= 12;
    setCedulaErr(!valid);
    return valid;
  };
  const validateEmail = (v) => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    setCorreoErr(!valid);
    return valid;
  };

  const handleSave = async () => {
    const emailOk = validateEmail(correo);
    if (!nombre.trim() || !apellido.trim() || !telefono.trim() || !emailOk) {
      showToast('Revisa los datos antes de guardar');
      return;
    }

    setSaving(true);
    try {
      const updatedUser = await updateUserProfile({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        telefono: telefono.trim(),
        correo: correo.trim(),
      });

      if (onUserUpdated) {
        onUserUpdated(updatedUser);
      }

      showToast('Perfil actualizado correctamente');
    } catch (error) {
      showToast(error.message || 'No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rl-pcard">
      <div className="rl-pcard-head">
        <div className="rl-pcard-head-ico"><IconUser /></div>
        <div>
          <div className="rl-pcard-head-title">Información personal</div>
          <div className="rl-pcard-head-sub">Tus datos de identificación en la plataforma</div>
        </div>
      </div>
      <div className="rl-pcard-body">
        <div className="rl-pf-grid">
          <div className="rl-pf-group">
            <label className="rl-pf-label">Nombre</label>
            <input className="rl-pf-input" type="text" value={nombre} placeholder="Nombre"
              onChange={e => setNombre(e.target.value)} />
          </div>
          <div className="rl-pf-group">
            <label className="rl-pf-label">Apellido</label>
            <input className="rl-pf-input" type="text" value={apellido} placeholder="Apellido"
              onChange={e => setApellido(e.target.value)} />
          </div>
          <div className="rl-pf-group">
            <label className="rl-pf-label">Cédula</label>
            <input className={`rl-pf-input${cedulaErr ? ' error' : ''}`} type="text"
              value={cedula} placeholder="1234567890" inputMode="numeric" maxLength={12}
              readOnly
              style={{ backgroundColor: 'var(--i04)', cursor: 'not-allowed' }} />
            <span style={{ fontSize: 10, color: 'var(--i40)', marginTop: 2 }}>La cédula no se puede modificar</span>
          </div>
          <div className="rl-pf-group">
            <label className="rl-pf-label">Teléfono</label>
            <input className="rl-pf-input" type="tel" value={telefono} placeholder="Teléfono"
              onChange={e => setTelefono(e.target.value)} />
          </div>
          <div className="rl-pf-group full">
            <label className="rl-pf-label">Correo Electrónico</label>
            <input className={`rl-pf-input${correoErr ? ' error' : ''}`} type="email"
              value={correo} placeholder="tu@empresa.com"
              onChange={e => { setCorreo(e.target.value); validateEmail(e.target.value); }} />
            {correoErr && <span style={{ fontSize: 11, color: 'var(--red)', marginTop: 2 }}>Ingresa un correo válido</span>}
          </div>
        </div>
      </div>
      <div className="rl-pcard-foot">
        <button className="rl-btn-ghost-sm" onClick={() => {
          setNombre('Admin'); setApellido('Sánchez');
          setCedula('10000000001'); setTelefono('+57 300 000 0000');
          setCorreo('admin@rilambplatform.co');
          setCedulaErr(false); setCorreoErr(false);
        }}>Descartar</button>
        <button className="rl-btn-save" onClick={handleSave} disabled={saving}>
          {saving ? <span className="rl-btn-spinner" /> : <IconCheck />}
          <span>{saving ? 'Guardando...' : 'Guardar cambios'}</span>
        </button>
      </div>
    </div>
  );
}

/* ══ Main App ══ */
export default function RilAmbPerfil() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(() => (
    location.state?.section === 'seguridad' ? 'seguridad' : 'general'
  ));
  const [toasts, setToasts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // CORRECCIÓN #1: El bloque useEffect que inyectaba el CSS fue eliminado.
  // Los estilos ahora se inyectan a nivel de módulo (ver bloque arriba),
  // garantizando que estén disponibles antes del primer render.

  // Listen for toast events from child (password section)
  useEffect(() => {
    const handler = (e) => showToast(e.detail);
    window.addEventListener('rilambToast', handler);
    return () => window.removeEventListener('rilambToast', handler);
  }, []);

  // Load user data from backend
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await getUserProfile();
        setUserData(data);
      } catch (error) {
        console.error('Error loading user data:', error);
        // Fallback to default values if API fails
        setUserData({
          cedula: '',
          nombre: 'Usuario',
          apellido: '',
          correo: 'usuario@ejemplo.com',
          telefono: '',
          rol: 'Cuenta personal'
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const showToast = (msg) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, fading: false }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, fading: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 240);
    }, 2800);
  };

  const switchSection = (section) => {
    setActiveSection(section);
    setDropdownOpen(false);
    setSidebarOpen(false);
  };

  const handleLogout = useCallback(() => {
    logout();
    navigate('/session-logo', { replace: true, state: { next: '/' } });
  }, [navigate]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.rl-sb-footer')) setDropdownOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <div className="rilambRoot" style={{ minHeight: '100vh', background: 'var(--page)', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Background gradient — real div instead of ::before to avoid stacking context issues */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0,
        background:'radial-gradient(ellipse 70% 50% at 10% 5%, rgba(0,8,44,.045) 0%, transparent 55%), radial-gradient(ellipse 55% 40% at 92% 90%, rgba(0,8,44,.038) 0%, transparent 55%)'
      }} />
      {/* Overlay */}
      <div className={`rl-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Toast */}
      <ToastContainer toasts={toasts} />

      {/* ── SIDEBAR (fuera del layout para que fixed funcione correctamente) ── */}
      <aside className={`rl-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="rl-sb-brand">
          <div className="rl-sb-mark">
            <img src={whiteLogo} alt="RilAmb" style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
          </div>
          <div>
            <div className="rl-sb-name">RilAmb</div>
            <div className="rl-sb-tag">Platform</div>
          </div>
          <button className="rl-sb-close-btn" onClick={() => setSidebarOpen(false)}><IconX /></button>
        </div>
        <nav className="rl-sb-nav">
          <button className="rl-sb-item" onClick={() => navigate('/dashboard')}><IconMonitor /><span>Monitoreo</span></button>
          <button className="rl-sb-item" onClick={() => navigate('/reports')}><IconFile /><span>Reportes</span></button>
          <button className="rl-sb-item" onClick={() => navigate('/devices')}><IconDevice /><span>Dispositivos</span></button>
        </nav>
        <div className="rl-sb-footer">
          <div className="rl-sb-profile" onClick={() => setDropdownOpen(p => !p)}>
            <div className="rl-sb-av">{loading ? '...' : (userData?.nombre?.[0] || 'U')}</div>
            <div><div className="rl-sb-pname">{loading ? 'Cargando...' : (userData?.nombre || 'Usuario')}</div><div className="rl-sb-prole">Cuenta Personal</div></div>
            <span className="rl-sb-dots"><IconDots /></span>
          </div>
          <div className={`rl-sb-dropdown${dropdownOpen ? ' open' : ''}`}>
            <button className="rl-sb-dropdown-item" onClick={() => {
              setDropdownOpen(false);
              if (location.pathname === '/perfil') {
                setActiveSection('general');
              } else {
                navigate('/perfil', { state: { section: 'general' } });
              }
            }}>
              <IconUser /><span>Ver perfil</span>
            </button>
            <div className="rl-sb-divider" />
            <button className="rl-sb-dropdown-item" onClick={() => switchSection('seguridad')}>
              <IconLock size={14} /><span>Cambiar contraseña</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="rl-layout">
        {/* ── CONTENT ── */}
        <div className="rl-content">
          <header className="rl-topbar">
            <button className="rl-tb-hamburger" onClick={() => setSidebarOpen(true)}><IconMenu /></button>
            <div className="rl-tb-breadcrumb">
              <span className="rl-tb-bc-root">RilAmb</span>
              <span className="rl-tb-bc-sep">/</span>
              <span className="rl-tb-bc-cur">Perfil</span>
            </div>
            <div className="rl-tb-space" />
            <NotificationBell />
            <button className="rl-tb-avatar" type="button" onClick={handleLogout} aria-label="Cerrar sesión">
              <IconLogout />
            </button>
          </header>

          <main className="rl-page">
            <div className="rl-ph">
              <div className="rl-ph-left">
                <h1>Mi Perfil</h1>
                <p>Gestiona tu identidad, acceso y preferencias del sistema</p>
              </div>
            </div>

            <div className="rl-profile-shell">
              {/* LEFT panel */}
              <div className="rl-identity-panel">
                <div className="rl-av-block">
                  <div className="rl-av-ring" onClick={() => showToast('Cambiar foto próximamente')}>
                    {loading ? '...' : (userData?.nombre?.[0] || 'U')}
                    <div className="rl-av-online" />
                  </div>
                  <div className="rl-av-name">{loading ? 'Cargando...' : `${userData?.nombre || ''} ${userData?.apellido || ''}`}</div>
                  <div className="rl-av-role"><span className="rl-av-role-dot" />{loading ? '...' : (userData?.rol || 'Usuario')}</div>
                </div>
                <div className="rl-section-nav">
                  <div className="rl-sn-header">
                    <div className="rl-sn-label">Configuración</div>
                  </div>
                  <div className="rl-sn-list">
                    <button className={`rl-sn-item${activeSection === 'general' ? ' active' : ''}`}
                      onClick={() => switchSection('general')}>
                      <div className="rl-sn-item-ico"><IconUser /></div>
                      <div className="rl-sn-item-text">
                        <div className="rl-sn-item-label">Datos personales</div>
                        <div className="rl-sn-item-sub">Nombre, correo, teléfono</div>
                      </div>
                      <span className="rl-sn-item-arrow"><IconChevron /></span>
                    </button>
                    <button className={`rl-sn-item${activeSection === 'seguridad' ? ' active' : ''}`}
                      onClick={() => switchSection('seguridad')}>
                      <div className="rl-sn-item-ico"><IconLock /></div>
                      <div className="rl-sn-item-text">
                        <div className="rl-sn-item-label">Cambiar Contraseña</div>
                        <div className="rl-sn-item-sub">Verificación por correo</div>
                      </div>
                      <span className="rl-sn-item-arrow"><IconChevron /></span>
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="rl-profile-main">
                <div className={`rl-section-panel${activeSection === 'general' ? ' visible' : ''}`} id="panel-general">
                  <GeneralSection showToast={showToast} userData={userData} onUserUpdated={setUserData} />
                </div>
                <div className={`rl-section-panel${activeSection === 'seguridad' ? ' visible' : ''}`} id="panel-seguridad">
                  <PasswordSection userEmail={userData?.correo} onDone={switchSection} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}