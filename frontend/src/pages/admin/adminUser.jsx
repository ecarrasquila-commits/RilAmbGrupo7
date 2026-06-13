import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import whiteLogo from "../../assets/whiteLogo.png";
import { logout } from "../../services/authService";

/*
  REGLAS:
  1. Sidebar y overlay: fuera de .ru-layout
  2. .ru-layout: sin overflow:hidden
  3. Fondo: <div> real, NO ::before
  4. Sidebar base: sin backdrop-filter → solo @media(min-width:961px)
  5. Solo lo que estaba en el HTML original
*/

const GLOBAL_CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --ink:#00082C;--i70:rgba(0,8,44,.70);--i50:rgba(0,8,44,.50);--i40:rgba(0,8,44,.40);
  --i24:rgba(0,8,44,.24);--i16:rgba(0,8,44,.16);--i10:rgba(0,8,44,.10);
  --i07:rgba(0,8,44,.07);--i04:rgba(0,8,44,.04);
  --page:#F0F0F4;--card:rgba(255,255,255,.82);--card-hi:rgba(255,255,255,.96);
  --green:#0C8A5A;--green-t:rgba(12,138,90,.10);
  --amber:#9A6214;--amber-t:rgba(154,98,20,.10);
  --red:#C0392B;--red-t:rgba(192,57,43,.10);
  --blue:#1D4ED8;--muted:rgba(0,8,44,.30);--muted-t:rgba(0,8,44,.07);
  --r:22px;--r-md:13px;--r-sm:9px;--r-xs:6px;
  --shadow:0 1px 1px rgba(0,8,44,.02),0 2px 4px rgba(0,8,44,.03),0 8px 24px rgba(0,8,44,.05),0 32px 64px rgba(0,8,44,.07);
  --sb-w:250px;--tb-h:62px;
}
html,body{min-height:100vh;width:100%;font-family:'DM Sans',system-ui,sans-serif;background:var(--page);color:var(--ink);-webkit-font-smoothing:antialiased;overflow-x:hidden;}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes rowIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}

/* Overlay */
.ru-overlay{display:none;position:fixed;inset:0;z-index:40;background:rgba(0,8,44,.50);animation:fadeIn .22s ease;}
.ru-overlay.open{display:block;}
/* Layout */
.ru-layout{display:flex;min-height:100vh;position:relative;z-index:1;}
/* Sidebar */
.ru-sidebar{width:var(--sb-w);background:#f5f5f9;border-right:0.5px solid var(--i07);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;height:100%;z-index:30;transition:transform .28s cubic-bezier(.4,0,.2,1);overflow-y:auto;}
@media(min-width:961px){.ru-sidebar{background:rgba(255,255,255,.74);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);box-shadow:1px 0 0 rgba(255,255,255,.60),2px 0 12px rgba(0,8,44,.04);}}
.ru-sidebar::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.90) 50%,transparent);pointer-events:none;}
.ru-sidebar.open{transform:translateX(0)!important;}
.ru-sb-brand{padding:26px 20px 22px;display:flex;align-items:center;gap:11px;}
.ru-sb-close{display:none;margin-left:auto;width:28px;height:28px;border-radius:8px;border:0.5px solid var(--i10);background:var(--i04);align-items:center;justify-content:center;cursor:pointer;color:var(--i40);flex-shrink:0;}
.ru-sb-mark{width:32px;height:32px;background:var(--ink);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 8px rgba(0,8,44,.22),inset 0 1px 0 rgba(255,255,255,.10);}
.ru-sb-name{font-size:15px;font-weight:600;letter-spacing:-.02em;}
.ru-sb-tag{font-size:9px;font-weight:500;color:var(--i40);letter-spacing:.09em;text-transform:uppercase;margin-top:1px;}
.ru-sb-nav{padding:18px 13px;flex:1;}
.ru-sb-item{display:flex;align-items:center;gap:10px;height:38px;padding:0 11px;border-radius:var(--r-xs);border:0.5px solid transparent;cursor:pointer;transition:all .17s;margin-bottom:2px;text-decoration:none;color:inherit;position:relative;background:none;width:100%;}
.ru-sb-item svg{color:var(--i40);flex-shrink:0;transition:color .17s;}
.ru-sb-item span{font-size:12.5px;color:var(--i50);transition:color .17s;}
.ru-sb-item:hover{background:var(--i04);border-color:var(--i07);}
.ru-sb-item:hover svg,.ru-sb-item:hover span{color:var(--i70);}
.ru-sb-item.active{background:var(--i07);border-color:var(--i10);}
.ru-sb-item.active span{color:var(--ink);font-weight:500;}
.ru-sb-item.active svg{color:var(--ink);}
.ru-sb-item.active::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:2.5px;height:16px;background:var(--ink);border-radius:0 3px 3px 0;opacity:.55;}
.ru-sb-footer{padding:14px 13px;border-top:0.5px solid var(--i07);position:relative;}
.ru-sb-profile{display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:var(--r-xs);border:0.5px solid transparent;cursor:pointer;transition:all .17s;}
.ru-sb-profile:hover{background:var(--i04);border-color:var(--i07);}
.ru-sb-av{width:32px;height:32px;border-radius:8px;background:var(--i07);border:0.5px solid var(--i10);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:var(--i70);flex-shrink:0;}
.ru-sb-pname{font-size:12px;font-weight:500;color:var(--i70);}
.ru-sb-prole{font-size:10px;color:var(--i40);margin-top:1px;}
.ru-sb-dots{margin-left:auto;color:var(--i24);}
.ru-sb-dropdown{display:none;position:absolute;bottom:100%;left:14px;right:14px;margin-bottom:8px;background:var(--card);border:0.5px solid var(--i10);border-radius:var(--r-sm);box-shadow:0 4px 16px rgba(0,8,44,.12);overflow:hidden;z-index:40;animation:fadeUp .2s ease both;}
.ru-sb-dropdown.open{display:block;}
.ru-sb-dd-item{display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;transition:background .17s;text-decoration:none;color:inherit;background:none;border:none;width:100%;}
.ru-sb-dd-item:hover{background:var(--i04);}
.ru-sb-dd-item svg{width:14px;height:14px;color:var(--i40);flex-shrink:0;}
.ru-sb-dd-item span{font-size:12px;color:var(--i50);}
.ru-sb-dd-item:hover svg,.ru-sb-dd-item:hover span{color:var(--i70);}
.ru-sb-divider{height:0.5px;background:var(--i07);}
/* Topbar */
.ru-content{margin-left:var(--sb-w);flex:1;display:flex;flex-direction:column;min-height:100vh;min-width:0;padding-top:var(--tb-h);}
.ru-topbar{height:var(--tb-h);background:rgba(240,240,244,.88);backdrop-filter:blur(24px) saturate(1.3);-webkit-backdrop-filter:blur(24px) saturate(1.3);border-bottom:0.5px solid var(--i07);position:fixed;top:0;left:var(--sb-w);right:17px;z-index:20;display:flex;align-items:center;padding:0 clamp(16px,4vw,36px);gap:12px;box-shadow:0 1px 0 rgba(255,255,255,.65),0 4px 16px rgba(0,8,44,.03);will-change:transform;}
.ru-tb-hamburger{display:none;width:36px;height:36px;border-radius:10px;border:0.5px solid var(--i10);background:rgba(255,255,255,.60);align-items:center;justify-content:center;cursor:pointer;color:var(--i50);flex-shrink:0;backdrop-filter:blur(6px);transition:all .17s;}
.ru-tb-bc{display:flex;align-items:center;gap:8px;}
.ru-tb-bc-root{font-size:12px;color:var(--i40);}
.ru-tb-bc-sep{font-size:11px;color:var(--i16);}
.ru-tb-bc-cur{font-size:12.5px;font-weight:500;color:var(--i70);}
.ru-tb-space{flex:1;}
.ru-tb-search{position:relative;width:clamp(140px,20vw,240px);}
.ru-tb-search input{width:100%;height:36px;background:rgba(255,255,255,.65);border:0.5px solid var(--i10);border-radius:10px;padding:0 14px 0 35px;font-family:inherit;font-size:12.5px;color:var(--ink);outline:none;backdrop-filter:blur(6px);transition:all .2s;}
.ru-tb-search input::placeholder{color:var(--i24);}
.ru-tb-search input:focus{background:var(--card-hi);border-color:var(--i40);box-shadow:0 0 0 3px rgba(0,8,44,.055);}
.ru-tb-search-ico{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--i24);pointer-events:none;}
.ru-tb-ico{width:36px;height:36px;border-radius:10px;border:0.5px solid var(--i10);background:rgba(255,255,255,.60);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--i50);transition:all .17s;backdrop-filter:blur(6px);position:relative;outline:none;flex-shrink:0;}
.ru-tb-ico:hover{background:rgba(255,255,255,.88);border-color:var(--i16);color:var(--i70);}
.ru-notif-dot{position:absolute;top:8px;right:8px;width:5px;height:5px;background:var(--ink);border-radius:50%;border:1.5px solid var(--page);}
.ru-tb-avatar{width:34px;height:34px;border-radius:9px;background:var(--ink);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .17s;flex-shrink:0;border:0.5px solid transparent;outline:none;color:rgba(255,255,255,.75);}
.ru-tb-avatar:hover{background:#1a2a5e;transform:translateY(-1px);}
/* Page */
.ru-page{padding:clamp(16px,3vw,32px) clamp(16px,4vw,38px) 60px;flex:1;}
.ru-ph{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:24px;}
.ru-ph-left h1{font-size:clamp(20px,3vw,24px);font-weight:500;color:var(--ink);letter-spacing:-.03em;line-height:1.2;margin-bottom:5px;}
.ru-ph-left p{font-size:13px;color:var(--i40);}
.ru-ph-right{display:flex;align-items:center;gap:8px;}
.ru-btn-add{display:flex;align-items:center;gap:9px;height:44px;padding:0 clamp(16px,2vw,24px);background:var(--ink);border:none;border-radius:12px;font-family:inherit;font-size:13.5px;font-weight:500;color:rgba(255,255,255,.92);cursor:pointer;white-space:nowrap;transition:background .2s,transform .15s,box-shadow .2s,opacity .15s;box-shadow:0 1px 2px rgba(0,8,44,.08),0 4px 14px rgba(0,8,44,.22),inset 0 1px 0 rgba(255,255,255,.08);}
.ru-btn-add:hover{background:#0b1c50;transform:translateY(-1px);}
.ru-btn-add:active{opacity:.7;transform:scale(.97);}
/* Filter bar */
.ru-bar{display:flex;align-items:center;gap:8px;margin-bottom:16px;flex-wrap:wrap;}
.ru-bar-count{font-size:12px;font-weight:500;color:var(--i40);letter-spacing:.07em;text-transform:uppercase;margin-right:4px;}
.ru-fp{height:29px;padding:0 14px;border-radius:99px;border:0.5px solid var(--i10);background:rgba(255,255,255,.55);font-family:inherit;font-size:11.5px;font-weight:500;color:var(--i40);cursor:pointer;transition:all .16s;backdrop-filter:blur(6px);white-space:nowrap;}
.ru-fp:hover{border-color:var(--i24);background:rgba(255,255,255,.80);color:var(--i70);}
.ru-fp.on{background:var(--ink);border-color:var(--ink);color:rgba(255,255,255,.88);box-shadow:0 2px 8px rgba(0,8,44,.18);}
/* Card */
.ru-card{background:var(--card);border:0.5px solid rgba(0,8,44,.07);border-radius:var(--r);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);box-shadow:var(--shadow);overflow:hidden;position:relative;animation:fadeUp .4s .05s ease both;}
.ru-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent 0%,rgba(0,8,44,.10) 25%,rgba(0,8,44,.18) 50%,rgba(0,8,44,.10) 75%,transparent 100%);pointer-events:none;z-index:2;}
.ru-card-head{display:flex;align-items:center;padding:18px 28px 16px;gap:14px;border-bottom:0.5px solid var(--i07);background:rgba(255,255,255,.30);flex-wrap:wrap;}
.ru-card-head-title{font-size:14px;font-weight:500;color:var(--ink);letter-spacing:-.02em;}
.ru-card-head-sub{font-size:11.5px;color:var(--i40);margin-top:2px;}
.ru-ch-space{flex:1;}
.ru-sort-btn{display:flex;align-items:center;gap:6px;height:32px;padding:0 13px;border-radius:var(--r-xs);border:0.5px solid var(--i10);background:rgba(255,255,255,.50);font-family:inherit;font-size:11.5px;font-weight:500;color:var(--i40);cursor:pointer;transition:all .16s;}
.ru-sort-btn:hover{border-color:var(--i24);background:rgba(255,255,255,.80);color:var(--i70);}
/* Table */
.ru-tbl-wrap{overflow-x:hidden;}
.ru-tbl-wrap table{width:100%;min-width:820px;border-collapse:collapse;}
.ru-tbl-wrap thead tr{border-bottom:0.5px solid var(--i07);}
.ru-tbl-wrap thead th{height:42px;padding:0 20px;text-align:left;font-size:10.5px;font-weight:500;color:var(--i40);letter-spacing:.09em;text-transform:uppercase;background:rgba(255,255,255,.22);white-space:nowrap;user-select:none;}
.ru-tbl-wrap thead th:first-child{padding-left:28px;}
.ru-tbl-wrap thead th:last-child{padding-right:28px;}
.ru-tbl-wrap tbody tr{border-bottom:0.5px solid var(--i07);transition:background .15s;animation:rowIn .32s ease both;}
.ru-tbl-wrap tbody tr:last-child{border-bottom:none;}
.ru-tbl-wrap tbody tr:hover{background:rgba(0,8,44,.018);}
.ru-tbl-wrap td{height:68px;padding:0 20px;font-size:13px;color:var(--i70);vertical-align:middle;}
.ru-tbl-wrap td:first-child{padding-left:28px;}
.ru-tbl-wrap td:last-child{padding-right:28px;}
/* Mobile cards */
.ru-cards-wrap{display:none;padding:12px 16px;gap:10px;flex-direction:column;}
.ru-m-card{background:rgba(255,255,255,.9);border:0.5px solid var(--i07);border-radius:16px;padding:16px;box-shadow:0 1px 3px rgba(0,8,44,.04),0 4px 16px rgba(0,8,44,.06);animation:rowIn .3s ease both;}
.ru-m-card-top{display:flex;align-items:center;gap:12px;margin-bottom:14px;}
.ru-m-av{width:42px;height:42px;border-radius:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;border:0.5px solid rgba(0,8,44,.08);position:relative;overflow:hidden;}
.ru-m-av::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.28) 0%,transparent 55%);}
.ru-m-name{font-size:15px;font-weight:600;color:var(--ink);letter-spacing:-.015em;}
.ru-m-id{font-size:11px;color:var(--i40);margin-top:2px;}
.ru-m-status{margin-left:auto;flex-shrink:0;}
.ru-m-fields{display:grid;grid-template-columns:1fr 1fr;gap:10px 12px;margin-bottom:14px;}
.ru-m-label{font-size:9.5px;font-weight:500;color:var(--i24);letter-spacing:.09em;text-transform:uppercase;margin-bottom:3px;}
.ru-m-value{font-size:12.5px;color:var(--i70);word-break:break-all;}
.ru-m-field.full{grid-column:1/-1;}
.ru-m-divider{height:0.5px;background:var(--i07);margin-bottom:12px;}
.ru-m-actions{display:flex;align-items:center;gap:8px;}
.ru-m-act{display:flex;align-items:center;justify-content:center;gap:6px;height:34px;border-radius:9px;border:0.5px solid var(--i10);background:var(--i04);font-family:inherit;font-size:11.5px;font-weight:500;color:var(--i50);cursor:pointer;transition:all .16s;flex:1;}
.ru-m-act:hover{background:rgba(255,255,255,.88);border-color:var(--i16);color:var(--i70);}
/* Shared cell styles */
.ru-uc{display:flex;align-items:center;gap:13px;}
.ru-av{width:38px;height:38px;border-radius:11px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:12.5px;font-weight:600;border:0.5px solid rgba(0,8,44,.08);position:relative;overflow:hidden;}
.ru-av::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.24) 0%,transparent 55%);pointer-events:none;}
.ru-un{font-size:13.5px;font-weight:500;color:var(--ink);letter-spacing:-.01em;}
.ru-ui{font-size:11px;color:var(--i40);margin-top:1px;}
.ru-cell-sm{font-size:12.5px;color:var(--i50);}
.ru-cell-date{font-size:12px;color:var(--i40);font-variant-numeric:tabular-nums;}
.ru-pill{display:inline-flex;align-items:center;gap:6px;height:25px;padding:0 11px;border-radius:99px;font-size:11px;font-weight:500;letter-spacing:.03em;white-space:nowrap;min-width:80px;justify-content:center;}
.ru-p-active{background:#FCFCFD;color:#5B6C9E;border:0.5px solid #5B6C9E;}
.ru-p-inactive{background:var(--muted-t);color:var(--muted);border:0.5px solid rgba(0,8,44,.08);}
.ru-acts{display:flex;align-items:center;gap:4px;}
.ru-act{width:32px;height:32px;border-radius:var(--r-sm);border:0.5px solid transparent;background:transparent;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--i24);transition:all .16s;outline:none;}
.ru-act:hover{background:var(--i04);border-color:var(--i07);color:var(--i50);}
.ru-act:active{opacity:.6;transform:scale(.91);}
/* Footer/pagination */
.ru-card-foot{display:flex;align-items:center;justify-content:space-between;padding:13px 28px;border-top:0.5px solid var(--i07);background:rgba(255,255,255,.22);gap:12px;flex-wrap:wrap;}
.ru-cf-info{font-size:12px;color:var(--i40);}
.ru-pag{display:flex;gap:4px;}
.ru-pg{width:30px;height:30px;border-radius:var(--r-sm);border:0.5px solid var(--i10);background:rgba(255,255,255,.50);display:flex;align-items:center;justify-content:center;font-family:inherit;font-size:12px;font-weight:500;color:var(--i40);cursor:pointer;transition:all .15s;}
.ru-pg:hover{border-color:var(--i24);background:rgba(255,255,255,.88);color:var(--i70);}
.ru-pg.cur{background:var(--ink);border-color:var(--ink);color:rgba(255,255,255,.88);box-shadow:0 2px 8px rgba(0,8,44,.20);}
.ru-pg:disabled{opacity:.28;cursor:not-allowed;}
/* Modal */
.ru-modal-backdrop{position:fixed;inset:0;z-index:100;background:rgba(0,8,44,.55);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;pointer-events:none;transition:opacity .22s ease;}
.ru-modal-backdrop.open{opacity:1;pointer-events:all;}
.ru-modal{background:#f5f5f9;border:0.5px solid rgba(0,8,44,.11);border-radius:20px;box-shadow:0 8px 32px rgba(0,8,44,.16),0 32px 80px rgba(0,8,44,.22);width:100%;max-width:560px;max-height:calc(100vh - 40px);overflow-y:auto;position:relative;transform:translateY(20px) scale(.97);transition:transform .28s cubic-bezier(.34,1.28,.64,1),opacity .22s ease;opacity:0;}
.ru-modal-backdrop.open .ru-modal{transform:translateY(0) scale(1);opacity:1;}
.ru-modal-sm{max-width:420px;}
.ru-modal-header{display:flex;align-items:flex-start;gap:14px;padding:22px 22px 18px;border-bottom:0.5px solid var(--i07);background:#f5f5f9;position:sticky;top:0;z-index:2;}
.ru-modal-icon{width:40px;height:40px;border-radius:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:rgba(0,8,44,.05);border:0.5px solid var(--i07);}
.ru-modal-title{font-size:15px;font-weight:600;color:var(--ink);letter-spacing:-.025em;}
.ru-modal-subtitle{font-size:11.5px;color:var(--i40);margin-top:3px;}
.ru-modal-close{margin-left:auto;flex-shrink:0;width:30px;height:30px;border-radius:9px;border:0.5px solid var(--i10);background:var(--i04);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--i40);transition:all .16s;}
.ru-modal-close:hover{background:rgba(255,255,255,.88);border-color:var(--i24);color:var(--i70);}
.ru-modal-back-btn{display:none;align-items:center;justify-content:center;width:36px;height:36px;border-radius:10px;flex-shrink:0;border:0.5px solid var(--i10);background:var(--i04);cursor:pointer;color:var(--i50);transition:all .16s;}
.ru-modal-back-btn:hover{background:rgba(255,255,255,.88);border-color:var(--i24);color:var(--i70);}
.ru-modal-body{padding:20px 22px;flex:1;}
.ru-modal-footer{display:flex;align-items:center;gap:10px;justify-content:flex-end;padding:16px 22px;border-top:0.5px solid var(--i07);background:#f5f5f9;position:sticky;bottom:0;z-index:2;}
.ru-btn-m{display:flex;align-items:center;gap:7px;height:38px;padding:0 18px;border-radius:10px;font-family:inherit;font-size:12.5px;font-weight:500;cursor:pointer;transition:all .18s;border:0.5px solid transparent;}
.ru-btn-m:active{transform:scale(.96);opacity:.8;}
.ru-btn-cancel{background:rgba(255,255,255,.75);border-color:var(--i10);color:var(--i50);}
.ru-btn-cancel:hover{background:rgba(255,255,255,.95);border-color:var(--i24);color:var(--i70);}
.ru-btn-primary{background:var(--ink);color:rgba(255,255,255,.92);box-shadow:0 2px 8px rgba(0,8,44,.22);}
.ru-btn-primary:hover{background:#0b1c50;transform:translateY(-1px);}
.ru-btn-danger{background:#00082C;border-color:#F0F5FF;color:#F0F5FF;}
.ru-btn-danger:hover{background:#00082C;}
.ru-btn-success{background:#00082C;border-color:#F0F5FF;color:#F0F5FF;}
.ru-btn-success:hover{background:#00082C;}
/* View modal */
.ru-view-hero{display:flex;align-items:center;gap:16px;padding:16px;margin-bottom:18px;background:rgba(255,255,255,.65);border:0.5px solid var(--i07);border-radius:14px;}
.ru-view-av{width:52px;height:52px;border-radius:14px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;border:0.5px solid rgba(0,8,44,.08);position:relative;overflow:hidden;}
.ru-view-av::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.30) 0%,transparent 55%);}
.ru-view-name{font-size:17px;font-weight:600;color:var(--ink);letter-spacing:-.02em;}
.ru-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px;}
.ru-info-field.full{grid-column:1/-1;}
.ru-info-label{font-size:9.5px;font-weight:500;color:var(--i24);letter-spacing:.09em;text-transform:uppercase;margin-bottom:5px;}
.ru-info-value{font-size:13px;color:var(--i70);background:rgba(255,255,255,.65);border:0.5px solid var(--i07);border-radius:9px;padding:9px 12px;word-break:break-all;line-height:1.4;}
/* Form */
.ru-form-section-title{font-size:10px;font-weight:500;color:var(--i24);letter-spacing:.10em;text-transform:uppercase;margin-bottom:12px;padding-bottom:8px;border-bottom:0.5px solid var(--i07);}
.ru-form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;}
.ru-form-group{display:flex;flex-direction:column;gap:5px;}
.ru-form-group.full{grid-column:1/-1;}
.ru-form-label{font-size:11px;font-weight:500;color:var(--i50);letter-spacing:.03em;}
.ru-form-label .req{color:var(--ink);}
.ru-form-input,.ru-form-select{height:38px;width:100%;background:rgba(255,255,255,.80);border:0.5px solid var(--i16);border-radius:9px;padding:0 12px;font-family:inherit;font-size:12.5px;color:var(--ink);outline:none;transition:all .2s;appearance:none;}
.ru-form-input::placeholder{color:var(--i24);}
.ru-form-input:focus,.ru-form-select:focus{background:var(--card-hi);border-color:var(--ink);box-shadow:0 0 0 3px rgba(0,8,44,.07);}
.ru-form-input.error{border-color:rgba(192,57,43,.45);background:rgba(192,57,43,.04);}
.ru-form-error{font-size:10.5px;color:var(--red);display:none;}
.ru-form-error.show{display:block;}
/* Password field */
.ru-pw-wrap{position:relative;}
.ru-pw-wrap .ru-form-input{padding-right:44px;}
.ru-pw-toggle{position:absolute;right:13px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--i24);display:flex;align-items:center;justify-content:center;padding:5px;transition:color .15s;border-radius:6px;opacity:0;pointer-events:none;}
.ru-pw-toggle.show{opacity:1;pointer-events:auto;}
.ru-pw-toggle:hover{color:var(--i50);}
/* Strength */
.ru-strength-bar{display:flex;gap:4px;margin-top:8px;}
.ru-strength-seg{flex:1;height:3px;border-radius:99px;background:rgba(0,8,44,.08);transition:background .3s ease;}
.ru-strength-seg.s1{background:#D83030;}
.ru-strength-seg.s2{background:#E07020;}
.ru-strength-seg.s3{background:#C8A020;}
.ru-strength-seg.s4{background:#10A060;}
.ru-strength-label{font-size:11px;color:rgba(0,8,44,.35);margin-top:5px;}
.ru-pwd-reqs{display:flex;flex-direction:column;gap:5px;margin-top:10px;}
.ru-req-item{display:flex;align-items:center;gap:7px;font-size:11.5px;color:rgba(0,8,44,.35);transition:color .2s;}
.ru-req-item svg{width:13px;height:13px;flex-shrink:0;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;opacity:.4;transition:opacity .2s,color .2s;}
.ru-req-item.met{color:#10A060;}
.ru-req-item.met svg{opacity:1;}
/* Devices section */
.ru-devices-section{margin-top:18px;padding-top:18px;border-top:0.5px solid var(--i07);}
.ru-devices-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.ru-devices-title{font-size:10px;font-weight:500;color:var(--i24);letter-spacing:.10em;text-transform:uppercase;}
.ru-devices-count{font-size:10px;font-weight:500;color:var(--i40);background:var(--i07);padding:2px 8px;border-radius:99px;}
.ru-devices-list{display:flex;flex-direction:column;gap:8px;}
.ru-device-chip{display:flex;align-items:center;gap:12px;padding:10px 14px;background:rgba(255,255,255,.75);border:0.5px solid var(--i07);border-radius:12px;transition:all .16s;}
.ru-device-chip:hover{background:rgba(255,255,255,.95);border-color:var(--i10);}
.ru-device-icon-wrap{width:36px;height:36px;border-radius:10px;flex-shrink:0;background:rgba(0,8,44,.04);border:0.5px solid var(--i07);display:flex;align-items:center;justify-content:center;color:var(--i40);}
.ru-device-info-col{flex:1;min-width:0;}
.ru-device-code{font-size:12px;font-weight:600;color:var(--ink);letter-spacing:-.01em;font-variant-numeric:tabular-nums;}
.ru-device-sub{font-size:10.5px;color:var(--i40);margin-top:1px;}
.ru-device-remove{width:28px;height:28px;border-radius:8px;flex-shrink:0;border:0.5px solid transparent;background:transparent;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--i16);transition:all .16s;}
.ru-device-remove:hover{background:var(--red-t);border-color:rgba(192,57,43,.18);color:var(--red);}
.ru-device-add-btn{display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:8px;flex-shrink:0;border:0.5px solid var(--i16);background:rgba(255,255,255,.60);cursor:pointer;color:var(--i50);transition:all .16px;margin-left:auto;}
.ru-device-add-btn:hover{background:rgba(255,255,255,.92);border-color:var(--i24);color:var(--ink);}
.ru-device-add-row{display:none;align-items:center;gap:8px;padding:10px 14px;margin-top:8px;background:rgba(255,255,255,.80);border:0.5px solid var(--i16);border-radius:12px;animation:fadeUp .18s ease both;}
.ru-device-add-row.open{display:flex;margin-bottom:12px;flex-direction:column;}
.ru-device-add-input{flex:1;height:34px;background:rgba(255,255,255,.75);border:0.5px solid var(--i16);border-radius:8px;padding:0 11px;font-family:inherit;font-size:12.5px;color:var(--ink);outline:none;transition:all .2s;width:100%;}
.ru-device-add-input::placeholder{color:var(--i24);}
.ru-device-add-input:focus{background:var(--card-hi);box-shadow:0 0 0 3px rgba(0,8,44,.07);}
.ru-device-add-input.error{border-color:rgba(192,57,43,.45);background:rgba(192,57,43,.04);}
.ru-device-add-confirm{display:flex;align-items:center;justify-content:center;height:34px;padding:0 14px;border-radius:8px;flex-shrink:0;background:var(--ink);border:none;font-family:inherit;font-size:12px;font-weight:500;color:rgba(255,255,255,.92);cursor:pointer;transition:all .18s;gap:6px;}
.ru-device-add-confirm:hover{background:#0b1c50;}
.ru-device-add-cancel{display:flex;align-items:center;justify-content:center;height:34px;padding:0 14px;border-radius:8px;flex-shrink:0;border:0.5px solid var(--i10);background:transparent;cursor:pointer;color:var(--i40);transition:all .16s;font-family:inherit;font-size:12px;font-weight:500;}
.ru-device-add-cancel:hover{background:rgba(255,255,255,.88);border-color:var(--i24);color:var(--i70);}
.ru-device-add-error{font-size:10.5px;color:var(--red);display:none;margin-top:4px;}
.ru-devices-empty{padding:20px;text-align:center;background:var(--i04);border:0.5px solid var(--i07);border-radius:11px;font-size:12px;color:var(--i40);}
/* Confirm modal */
.ru-confirm-center{text-align:center;padding:24px 28px 20px;}
.ru-confirm-icon-wrap{width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;}
.ru-confirm-icon-wrap.warn{background:#00082C;border:0.5px solid #F0F5FF;}
.ru-confirm-icon-wrap.success{background:#00082C;border:0.5px solid #F0F5FF;}
.ru-confirm-title{font-size:15.5px;font-weight:600;color:var(--ink);margin-bottom:8px;}
.ru-confirm-desc{font-size:13px;color:var(--i50);line-height:1.55;}
/* Device confirm panel */
.ru-dcp{display:none;flex-direction:column;background:#f5f5f9;flex-shrink:0;position:sticky;bottom:0;z-index:2;border-radius:18px 18px 20px 20px;box-shadow:0 -4px 24px rgba(0,8,44,.10),0 -1px 0 rgba(0,8,44,.06);margin-top:2px;}
.ru-dcp.open{display:flex;}
.ru-dcp-chip-row{display:flex;align-items:center;gap:12px;padding:14px 22px 12px;border-bottom:0.5px solid var(--i07);}
.ru-dcp-chip-icon{width:36px;height:36px;border-radius:10px;flex-shrink:0;background:rgba(192,57,43,.08);border:0.5px solid rgba(192,57,43,.16);display:flex;align-items:center;justify-content:center;color:var(--red);}
.ru-dcp-chip-info{flex:1;min-width:0;}
.ru-dcp-chip-name{font-size:13px;font-weight:600;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ru-dcp-chip-sub{font-size:11px;color:var(--i40);margin-top:2px;}
.ru-dcp-chip-id{display:inline-flex;align-items:center;padding:1px 7px;border-radius:99px;background:rgba(0,8,44,.06);border:0.5px solid var(--i10);font-size:10.5px;font-weight:600;color:var(--i70);letter-spacing:.02em;font-variant-numeric:tabular-nums;}
.ru-dcp-chip-close{width:28px;height:28px;border-radius:8px;flex-shrink:0;border:0.5px solid var(--i10);background:transparent;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--i40);transition:all .16s;}
.ru-dcp-chip-close:hover{background:rgba(255,255,255,.88);border-color:var(--i24);color:var(--i70);}
.ru-dcp-body{display:flex;flex-direction:column;align-items:center;gap:8px;padding:20px 24px 16px;text-align:center;}
.ru-dcp-warn-icon{width:52px;height:52px;border-radius:16px;background:rgba(192,57,43,.07);border:0.5px solid rgba(192,57,43,.14);display:flex;align-items:center;justify-content:center;color:var(--red);margin-bottom:4px;}
.ru-dcp-title{font-size:15px;font-weight:600;color:var(--ink);letter-spacing:-.02em;}
.ru-dcp-desc{font-size:12.5px;color:var(--i50);line-height:1.55;max-width:340px;}
.ru-dcp-footer{display:flex;gap:10px;padding:4px 22px 22px;}
.ru-dcp-footer .ru-btn-m{flex:1;justify-content:center;height:44px;font-size:13px;border-radius:11px;}
/* Toast */
.ru-toast-container{position:fixed;bottom:26px;right:26px;z-index:200;display:flex;flex-direction:column;gap:8px;align-items:flex-end;pointer-events:none;}
.ru-toast{display:flex;align-items:center;gap:10px;padding:11px 16px;border-radius:12px;background:#00082C;color:rgba(255,255,255,.96);font-size:12.5px;font-weight:500;box-shadow:0 4px 20px rgba(29,78,216,.35);border:0.5px solid rgba(255,255,255,.12);transform:translateY(10px) scale(.97);opacity:0;transition:all .3s cubic-bezier(.34,1.28,.64,1);pointer-events:all;max-width:300px;}
.ru-toast.show{transform:translateY(0) scale(1);opacity:1;}
.ru-toast-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.50);flex-shrink:0;}
/* Empty state */
.ru-empty{padding:72px 32px;display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;}
.ru-empty-icon{width:48px;height:48px;background:var(--i04);border-radius:14px;border:0.5px solid var(--i07);display:flex;align-items:center;justify-content:center;color:var(--i24);margin-bottom:6px;}
/* Responsive */
@media(max-width:1100px){
  :root{--sb-w:64px;}
  .ru-sb-name,.ru-sb-tag,.ru-sb-item span,.ru-sb-pname,.ru-sb-prole,.ru-sb-dots{display:none;}
  .ru-sb-brand{padding:20px 12px;justify-content:center;}
  .ru-sb-nav{padding:12px 8px;}
  .ru-sb-item{justify-content:center;padding:0!important;width:40px!important;margin:0 auto 2px!important;}
  .ru-sb-footer{padding:12px 8px;}
  .ru-sb-profile{justify-content:center;}
}
@media(max-width:960px){
  :root{--sb-w:0px;--tb-h:58px;}
  .ru-sidebar{width:100%!important;transform:translateX(-100%);position:fixed;top:0;left:0;bottom:0;height:100%!important;z-index:50;background:#f5f5f9!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;box-shadow:none!important;transition:transform .28s cubic-bezier(.4,0,.2,1);}
  .ru-sidebar.open{transform:translateX(0)!important;}
  .ru-sb-name,.ru-sb-tag,.ru-sb-item span,.ru-sb-pname,.ru-sb-prole,.ru-sb-dots{display:revert!important;}
  .ru-sb-brand{padding:28px 24px 24px;justify-content:flex-start!important;}
  .ru-sb-nav{padding:20px 18px;}
  .ru-sb-item{justify-content:flex-start!important;padding:0 14px!important;width:100%!important;margin:0 0 2px!important;height:48px!important;}
  .ru-sb-footer{padding:18px;}
  .ru-sb-profile{justify-content:flex-start!important;}
  .ru-sb-close{display:flex!important;}
  .ru-content{margin-left:0;}
  .ru-topbar{left:0;right:0;padding:0 20px;gap:10px;}
  .ru-tb-hamburger{display:flex!important;}
  .ru-tbl-wrap table{min-width:0;width:100%;table-layout:fixed;}
  .ru-tbl-wrap thead th,.ru-tbl-wrap td{padding:0 8px;font-size:11.5px;}
  .ru-tbl-wrap thead th:first-child,.ru-tbl-wrap td:first-child{padding-left:16px;}
  .ru-tbl-wrap thead th:last-child,.ru-tbl-wrap td:last-child{padding-right:16px;}
  .ru-tbl-wrap td{height:58px;}
  .ru-modal-back-btn{display:flex!important;}
}
@media(max-width:768px){
  :root{--tb-h:56px;}
  .ru-topbar{padding:0 16px;gap:10px;right:0;}
  .ru-tb-bc-root,.ru-tb-bc-sep{display:none;}
  .ru-page{padding:16px 12px 60px;}
  .ru-ph{margin-bottom:16px;}
  .ru-ph-left h1{font-size:20px;}
  .ru-bar{gap:6px;margin-bottom:12px;overflow-x:auto;padding-bottom:4px;flex-wrap:nowrap;}
  .ru-bar::-webkit-scrollbar{display:none;}
  .ru-card{border-radius:18px;}
  .ru-card-head{padding:14px 16px 12px;}
  .ru-card-foot{padding:12px 16px;}
  .ru-tbl-wrap{display:none!important;}
  .ru-cards-wrap{display:flex;}
  .ru-form-row{grid-template-columns:1fr;}
  .ru-info-grid{grid-template-columns:1fr;}
  .ru-info-field.full{grid-column:1;}
  .ru-modal-backdrop{background:transparent;align-items:flex-end;padding:0;}
  .ru-modal{width:100vw;max-width:100vw;height:100dvh;max-height:100dvh;border-radius:0;display:flex;flex-direction:column;overflow:hidden;transform:translateY(100%);opacity:1;}
  .ru-modal-backdrop.open .ru-modal{transform:translateY(0);opacity:1;}
  .ru-modal-header{padding:14px 16px;gap:10px;flex-shrink:0;align-items:center;}
  .ru-modal-body{flex:1;overflow-y:auto;padding:16px;}
  .ru-modal-footer{flex-shrink:0;padding:12px 16px;gap:8px;}
  .ru-modal-footer .ru-btn-m{flex:1;justify-content:center;height:46px;font-size:13.5px;}
  .ru-modal-sm{height:auto;max-height:90dvh;border-radius:20px 20px 0 0;transform:translateY(100%);width:100vw;max-width:100vw;}
  .ru-dcp-chip-row{padding:12px 16px 10px;}
  .ru-dcp-body{padding:18px 20px 14px;}
  .ru-dcp-footer{padding:4px 16px 16px;gap:8px;}
  .ru-dcp-footer .ru-btn-m{height:48px;font-size:13.5px;border-radius:12px;}
}
@media(max-width:480px){
  .ru-tb-search{display:none;}
  .ru-btn-add span{display:none;}
  .ru-btn-add{width:40px;height:40px;padding:0;justify-content:center;border-radius:10px;}
  .ru-m-fields{grid-template-columns:1fr;}
  .ru-m-field.full{grid-column:1;}
  .ru-toast-container{bottom:14px;right:14px;left:14px;align-items:stretch;}
}
`;

/* ══════════════════════════════════════
   CORRECCIÓN: Inyectar CSS a nivel de módulo,
   FUERA de cualquier componente o useEffect.
   Esto garantiza que los estilos estén en el DOM
   antes del primer render de React.
══════════════════════════════════════ */
if (typeof document !== 'undefined') {
  const _id = 'rilambUsuariosStyles';
  if (!document.getElementById(_id)) {
    const _style = document.createElement('style');
    _style.id = _id;
    _style.textContent = GLOBAL_CSS;
    document.head.appendChild(_style);
  }
}


/* ══ DATA ══ */
const PAL = [
  {bg:'rgba(0,8,44,.08)',c:'#00082C'},
  {bg:'rgba(20,50,110,.09)',c:'#14336E'},
  {bg:'rgba(40,60,90,.09)',c:'#283C5A'},
  {bg:'rgba(60,80,120,.08)',c:'#3C5078'},
  {bg:'rgba(0,8,44,.11)',c:'#00082C'},
];
const DEVICES_DB = [
  {id:'D01',name:'Medidor Gas 02',serial:'MED-2024-01'},{id:'D02',name:'Medidor Gas 02',serial:'MED-2024-02'},
  {id:'D03',name:'Medidor Gas 02',serial:'MED-2024-03'},{id:'D04',name:'Medidor Gas 02',serial:'MED-2024-04'},
  {id:'D05',name:'Medidor Gas 02',serial:'MED-2024-05'},{id:'D06',name:'Medidor Gas 02',serial:'MED-2024-06'},
  {id:'D07',name:'Medidor Gas 02',serial:'MED-2024-07'},{id:'D08',name:'Medidor Gas 02',serial:'MED-2024-08'},
  {id:'D09',name:'Medidor Gas 02',serial:'MED-2024-09'},{id:'D10',name:'Medidor Gas 02',serial:'MED-2024-10'},
  {id:'D11',name:'Medidor Gas 02',serial:'MED-2024-11'},{id:'D12',name:'Medidor Gas 02',serial:'MED-2024-12'},
];
const INITIAL_DB = [
  {id:1, n:'Alejandro',a:'Morales Vega',  e:'a.morales@rilAmb.co', t:'+57 310 234 5678',c:'1020384756',s:'active',  d:'2024-01-14',devices:['D01','D03']},
  {id:2, n:'Valentina', a:'Torres Pinto',  e:'v.torres@rilAmb.co',  t:'+57 315 876 4321',c:'1097234561',s:'active',  d:'2024-02-03',devices:['D04','D06']},
  {id:3, n:'Santiago',  a:'Ríos Castillo', e:'s.rios@rilAmb.co',    t:'+57 321 112 9988',c:'1045678901',s:'active',  d:'2024-02-20',devices:['D02']},
  {id:4, n:'Camila',    a:'Núñez Herrera', e:'c.nunez@rilAmb.co',   t:'+57 300 445 6677',c:'1073456789',s:'inactive',d:'2024-03-08',devices:[]},
  {id:5, n:'Mateo',     a:'Vargas León',   e:'m.vargas@rilAmb.co',  t:'+57 318 990 1122',c:'1098765432',s:'active',  d:'2024-03-21',devices:['D05','D07','D08']},
  {id:6, n:'Isabella',  a:'Gómez Salazar', e:'i.gomez@rilAmb.co',   t:'+57 312 334 5566',c:'1054321098',s:'inactive',d:'2024-04-02',devices:[]},
  {id:7, n:'Sebastián', a:'Cruz Mendoza',  e:'s.cruz@rilAmb.co',    t:'+57 314 778 9900',c:'1032198765',s:'active',  d:'2024-05-15',devices:['D09','D10']},
  {id:8, n:'Luciana',   a:'Peña Ortega',   e:'l.pena@rilAmb.co',    t:'+57 320 556 7788',c:'1076543210',s:'active',  d:'2024-06-01',devices:['D11']},
  {id:9, n:'Andrés',    a:'Ramírez Soto',  e:'a.ramirez@rilAmb.co', t:'+57 311 223 4455',c:'1043219876',s:'inactive',d:'2024-07-18',devices:[]},
  {id:10,n:'Sofía',     a:'Jiménez Arango',e:'s.jimenez@rilAmb.co', t:'+57 317 667 8899',c:'1065432109',s:'active',  d:'2024-08-29',devices:['D12']},
  {id:11,n:'Felipe',    a:'Lozano Duarte', e:'f.lozano@rilAmb.co',  t:'+57 305 990 1234',c:'1087654321',s:'inactive',d:'2024-09-10',devices:[]},
  {id:12,n:'Daniela',   a:'Suárez Blanco', e:'d.suarez@rilAmb.co',  t:'+57 316 443 7766',c:'1021098765',s:'active',  d:'2024-10-05',devices:[]},
];
const PER = 8;
const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

/* ══ Helpers ══ */
const ini   = u => (u.n[0]+u.a[0]).toUpperCase();
const avs   = u => { const p=PAL[u.id%PAL.length]; return {background:p.bg,color:p.c}; };
const fmtD  = d => { const [y,m,day]=d.split('-'); return `${+day} ${MESES[+m-1]} ${y}`; };
const today = () => new Date().toISOString().split('T')[0];
const getDevice = id => DEVICES_DB.find(d => d.id === id);
function getStrength(pwd) {
  let s=0;
  if(pwd.length>=8) s++;
  if(/[A-Z]/.test(pwd)) s++;
  if(/[0-9]/.test(pwd)) s++;
  if(/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}
const SL = ['','Débil','Regular','Buena','Fuerte'];
const SC = ['','s1','s2','s3','s4'];

/* ══ Icons ══ */
const IcoMenu   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IcoX      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoXSm    = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoBack   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IcoBell   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const IcoLogout = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.95)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IcoDots   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const IcoUser   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcoLock   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcoPlus   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcoSearch = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IcoSort   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/></svg>;
const IcoCheck  = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoEye    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IcoEyeOff = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M10.73 10.73a3 3 0 0 0 4.24 4.24"/><path d="M6.35 6.35C3.86 8.16 2 10.68 2 12s4 8 10 8c1.89 0 3.63-.49 5.13-1.28"/><path d="M17.66 17.66C19.6 15.84 22 13.17 22 12c0-1.33-4-8-10-8-1.06 0-2.08.18-3.03.49"/></svg>;
const IcoView   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IcoEdit   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcoLockSm = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcoUnlock = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>;
const IcoFile   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IcoUsers  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcoDevice = () => <svg width="15" height="15" viewBox="0 0 40 40" fill="none"><rect x="1.5" y="1.5" width="37" height="37" rx="9" stroke="currentColor" strokeWidth="2.2" fill="none"/><circle cx="20" cy="22" r="10.5" stroke="currentColor" strokeWidth="1.6" fill="none" opacity=".5"/><circle cx="20" cy="22" r="1.7" fill="currentColor"/></svg>;
const IcoWarn   = ({stroke="#F0F5FF"}) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IcoDeviceIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/></svg>;

/* ══ Pill ══ */
const Pill = ({s}) => s==='active'
  ? <span className="ru-pill ru-p-active">Activo</span>
  : <span className="ru-pill ru-p-inactive">Inactivo</span>;

/* ══ Toast ══ */
function ToastContainer({toasts}) {
  return (
    <div className="ru-toast-container">
      {toasts.map(t=>(
        <div key={t.id} className={`ru-toast${t.show?' show':''}`}>
          <span className="ru-toast-dot"/>{t.msg}
        </div>
      ))}
    </div>
  );
}

/* ══ Password field ══ */
function PwField({id, placeholder, value, onChange, autoComplete='new-password'}) {
  const [show, setShow] = useState(false);
  const [hasVal, setHasVal] = useState(false);
  return (
    <div className="ru-pw-wrap">
      <input className="ru-form-input" id={id} type={show?'text':'password'}
        placeholder={placeholder} value={value} autoComplete={autoComplete}
        onChange={e=>{onChange(e.target.value);setHasVal(e.target.value.length>0);}}/>
      <button className={`ru-pw-toggle${hasVal?' show':''}`} type="button" onClick={()=>setShow(p=>!p)}>
        {show ? <IcoEyeOff/> : <IcoEye/>}
      </button>
    </div>
  );
}

/* ══ Strength indicator ══ */
function StrengthBar({pwd}) {
  if (!pwd) return null;
  const score = getStrength(pwd);
  const metLen=pwd.length>=8, metU=/[A-Z]/.test(pwd), metN=/[0-9]/.test(pwd), metS=/[^A-Za-z0-9]/.test(pwd);
  const allMet=metLen&&metU&&metN&&metS;
  return (
    <>
      <div className="ru-strength-bar">
        {[0,1,2,3].map(i=><div key={i} className={`ru-strength-seg${i<score?' '+SC[score]:''}`}/>)}
      </div>
      <div className="ru-strength-label">{SL[score]}</div>
      {!allMet && (
        <div className="ru-pwd-reqs">
          {!metLen && <div className="ru-req-item"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Mínimo 8 caracteres</div>}
          {!metU   && <div className="ru-req-item"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Una letra mayúscula</div>}
          {!metN   && <div className="ru-req-item"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Un número</div>}
          {!metS   && <div className="ru-req-item"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Un carácter especial</div>}
        </div>
      )}
    </>
  );
}

/* ══ Device chip (read) ══ */
function DeviceChipRead({dId}) {
  const d = getDevice(dId);
  if (!d) return null;
  return (
    <div className="ru-device-chip">
      <div className="ru-device-icon-wrap"><IcoDeviceIcon/></div>
      <div className="ru-device-info-col">
        <div className="ru-device-code">{d.id}</div>
        <div className="ru-device-sub">{d.name}</div>
      </div>
    </div>
  );
}

/* ══ Modal VER ══ */
function ModalView({user, onClose}) {
  if (!user) return null;
  return (
    <div className="ru-modal-backdrop open" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="ru-modal">
        <div className="ru-modal-header">
          <button className="ru-modal-back-btn" onClick={onClose}><IcoBack/></button>
          <div className="ru-modal-icon"><IcoView/></div>
          <div style={{flex:1,minWidth:0}}>
            <div className="ru-modal-title">Detalle de usuario</div>
            <div className="ru-modal-subtitle">{user.n} {user.a}</div>
          </div>
          <button className="ru-modal-close" onClick={onClose}><IcoXSm/></button>
        </div>
        <div className="ru-modal-body">
          <div className="ru-view-hero">
            <div className="ru-view-av" style={avs(user)}>{ini(user)}</div>
            <div>
              <div className="ru-view-name">{user.n} {user.a}</div>
              <div style={{marginTop:4}}><Pill s={user.s}/></div>
            </div>
          </div>
          <div className="ru-info-grid">
            <div className="ru-info-field"><div className="ru-info-label">Teléfono</div><div className="ru-info-value">{user.t}</div></div>
            <div className="ru-info-field"><div className="ru-info-label">Cédula</div><div className="ru-info-value">{user.c}</div></div>
            <div className="ru-info-field full"><div className="ru-info-label">Correo electrónico</div><div className="ru-info-value">{user.e}</div></div>
            <div className="ru-info-field"><div className="ru-info-label">Fecha de registro</div><div className="ru-info-value">{fmtD(user.d)}</div></div>
          </div>
          <div className="ru-devices-section">
            <div className="ru-devices-header">
              <span className="ru-devices-title">Dispositivos asociados</span>
              <span className="ru-devices-count">{user.devices.length}</span>
            </div>
            {user.devices.length>0
              ? <div className="ru-devices-list">{user.devices.map(id=><DeviceChipRead key={id} dId={id}/>)}</div>
              : <div className="ru-devices-empty">Sin dispositivos asignados</div>}
          </div>
        </div>
        <div className="ru-modal-footer">
          <button className="ru-btn-m ru-btn-cancel" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

/* ══ Modal CREAR ══ */
function ModalCreate({onClose, onSave}) {
  const [form, setForm] = useState({n:'',a:'',e:'',t:'',c:'',pwd:'',pwd2:''});
  const [errs, setErrs] = useState({});
  const f = k => v => { setForm(p=>({...p,[k]:v})); setErrs(p=>({...p,[k]:''})); };
  const validate = () => {
    const e={};
    if(form.n.trim().length<2) e.n='Mínimo 2 caracteres';
    if(form.a.trim().length<2) e.a='Mínimo 2 caracteres';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.e.trim())) e.e='Correo inválido';
    if(!/^[\d\s+\-()]{7,}$/.test(form.t.trim())) e.t='Número inválido';
    if(!/^\d{6,12}$/.test(form.c.trim())) e.c='6-12 dígitos';
    if(form.pwd.length<8) e.pwd='Mínimo 8 caracteres';
    if(form.pwd!==form.pwd2) e.pwd2='Las contraseñas no coinciden';
    setErrs(e); return Object.keys(e).length===0;
  };
  const submit = () => { if(validate()) onSave(form); };
  return (
    <div className="ru-modal-backdrop open" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="ru-modal">
        <div className="ru-modal-header">
          <button className="ru-modal-back-btn" onClick={onClose}><IcoBack/></button>
          <div className="ru-modal-icon"><IcoPlus/></div>
          <div style={{flex:1,minWidth:0}}>
            <div className="ru-modal-title">Nuevo usuario</div>
            <div className="ru-modal-subtitle">Completa los campos para registrar</div>
          </div>
          <button className="ru-modal-close" onClick={onClose}><IcoXSm/></button>
        </div>
        <div className="ru-modal-body">
          <div className="ru-form-section-title">Datos personales</div>
          <div className="ru-form-row">
            <div className="ru-form-group">
              <label className="ru-form-label">Nombre <span className="req">*</span></label>
              <input className={`ru-form-input${errs.n?' error':''}`} type="text" placeholder="Ej: Juan Carlos" value={form.n} onChange={e=>f('n')(e.target.value)}/>
              {errs.n && <span className="ru-form-error show">{errs.n}</span>}
            </div>
            <div className="ru-form-group">
              <label className="ru-form-label">Apellidos <span className="req">*</span></label>
              <input className={`ru-form-input${errs.a?' error':''}`} type="text" placeholder="Ej: Pérez García" value={form.a} onChange={e=>f('a')(e.target.value)}/>
              {errs.a && <span className="ru-form-error show">{errs.a}</span>}
            </div>
          </div>
          <div className="ru-form-row">
            <div className="ru-form-group">
              <label className="ru-form-label">Cédula <span className="req">*</span></label>
              <input className={`ru-form-input${errs.c?' error':''}`} type="text" placeholder="Ej: 1234567890" value={form.c} onChange={e=>f('c')(e.target.value)}/>
              {errs.c && <span className="ru-form-error show">{errs.c}</span>}
            </div>
            <div className="ru-form-group">
              <label className="ru-form-label">Teléfono <span className="req">*</span></label>
              <input className={`ru-form-input${errs.t?' error':''}`} type="tel" placeholder="+57 300 000 0000" value={form.t} onChange={e=>f('t')(e.target.value)}/>
              {errs.t && <span className="ru-form-error show">{errs.t}</span>}
            </div>
          </div>
          <div className="ru-form-section-title" style={{marginTop:18}}>Datos de Acceso</div>
          <div className="ru-form-row">
            <div className="ru-form-group full">
              <label className="ru-form-label">Correo electrónico <span className="req">*</span></label>
              <input className={`ru-form-input${errs.e?' error':''}`} type="email" placeholder="tu@empresa.com" value={form.e} onChange={e=>f('e')(e.target.value)}/>
              {errs.e && <span className="ru-form-error show">{errs.e}</span>}
            </div>
          </div>
          <div className="ru-form-row">
            <div className="ru-form-group full">
              <label className="ru-form-label">Contraseña <span className="req">*</span></label>
              <PwField id="cpwd" placeholder="Mínimo 8 caracteres" value={form.pwd} onChange={f('pwd')}/>
              {errs.pwd && <span className="ru-form-error show">{errs.pwd}</span>}
              <StrengthBar pwd={form.pwd}/>
            </div>
          </div>
          <div className="ru-form-row">
            <div className="ru-form-group full">
              <label className="ru-form-label">Confirmar contraseña <span className="req">*</span></label>
              <PwField id="cpwd2" placeholder="Repite tu contraseña" value={form.pwd2} onChange={f('pwd2')}/>
              {errs.pwd2 && <span className="ru-form-error show">{errs.pwd2}</span>}
            </div>
          </div>
        </div>
        <div className="ru-modal-footer">
          <button className="ru-btn-m ru-btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="ru-btn-m ru-btn-primary" onClick={submit}><IcoCheck/> Guardar usuario</button>
        </div>
      </div>
    </div>
  );
}

/* ══ Modal EDITAR ══ */
function ModalEdit({user, onClose, onSave}) {
  const [form, setForm] = useState({n:user.n,a:user.a,e:user.e,t:user.t,c:user.c});
  const [errs, setErrs] = useState({});
  const [devs, setDevs] = useState([...user.devices]);
  const [addOpen, setAddOpen] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [addCode, setAddCode] = useState('');
  const [addSite, setAddSite] = useState('');
  const [addErr,  setAddErr]  = useState('');
  const [foundDev, setFoundDev] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);
  const codeRef = useRef(null);
  const siteRef = useRef(null);

  useEffect(()=>{ if(addOpen&&addStep===1) setTimeout(()=>codeRef.current?.focus(),60); },[addOpen,addStep]);
  useEffect(()=>{ if(addStep===2) setTimeout(()=>siteRef.current?.focus(),60); },[addStep]);

  const f = k => v => { setForm(p=>({...p,[k]:v})); setErrs(p=>({...p,[k]:''})); };
  const validate = () => {
    const e={};
    if(form.n.trim().length<2) e.n='Mínimo 2 caracteres';
    if(form.a.trim().length<2) e.a='Mínimo 2 caracteres';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.e.trim())) e.e='Correo inválido';
    if(!/^[\d\s+\-()]{7,}$/.test(form.t.trim())) e.t='Número inválido';
    if(!/^\d{6,12}$/.test(form.c.trim())) e.c='6-12 dígitos';
    setErrs(e); return Object.keys(e).length===0;
  };
  const submit = () => { if(validate()) onSave({...form, devices:devs}); };

  const goStep2 = () => {
    const code = addCode.trim().toUpperCase();
    if(!code){setAddErr('Ingresa el código del dispositivo');return;}
    const d = getDevice(code)||{id:code,name:'Sensor ambiental',serial:''};
    setFoundDev(d); setAddStep(2); setAddErr('');
  };
  const confirmAdd = () => {
    const code = addCode.trim().toUpperCase();
    const site = addSite.trim();
    if(!site){setAddErr('Ingresa el nombre del sitio');return;}
    if(devs.includes(code)){setAddErr('Dispositivo ya asignado');return;}
    setDevs(p=>[...p,code]); setAddOpen(false); setAddStep(1); setAddCode(''); setAddSite(''); setAddErr('');
  };
  const closeAdd = () => { setAddOpen(false); setAddStep(1); setAddCode(''); setAddSite(''); setAddErr(''); };

  return (
    <div className="ru-modal-backdrop open" onClick={e=>{if(e.target===e.currentTarget&&!removeTarget)onClose();}}>
      <div className="ru-modal">
        <div className="ru-modal-header">
          <button className="ru-modal-back-btn" onClick={onClose}><IcoBack/></button>
          <div className="ru-modal-icon"><IcoEdit/></div>
          <div style={{flex:1,minWidth:0}}>
            <div className="ru-modal-title">Editar usuario</div>
            <div className="ru-modal-subtitle">{user.n} {user.a}</div>
          </div>
          <button className="ru-modal-close" onClick={onClose}><IcoXSm/></button>
        </div>
        <div className="ru-modal-body">
          <div className="ru-form-section-title">Datos personales</div>
          <div className="ru-form-row">
            <div className="ru-form-group">
              <label className="ru-form-label">Nombre <span className="req">*</span></label>
              <input className={`ru-form-input${errs.n?' error':''}`} type="text" value={form.n} onChange={e=>f('n')(e.target.value)}/>
              {errs.n && <span className="ru-form-error show">{errs.n}</span>}
            </div>
            <div className="ru-form-group">
              <label className="ru-form-label">Apellidos <span className="req">*</span></label>
              <input className={`ru-form-input${errs.a?' error':''}`} type="text" value={form.a} onChange={e=>f('a')(e.target.value)}/>
              {errs.a && <span className="ru-form-error show">{errs.a}</span>}
            </div>
          </div>
          <div className="ru-form-row">
            <div className="ru-form-group">
              <label className="ru-form-label">Teléfono <span className="req">*</span></label>
              <input className={`ru-form-input${errs.t?' error':''}`} type="tel" value={form.t} onChange={e=>f('t')(e.target.value)}/>
              {errs.t && <span className="ru-form-error show">{errs.t}</span>}
            </div>
            <div className="ru-form-group">
              <label className="ru-form-label">Cédula <span className="req">*</span></label>
              <input className={`ru-form-input${errs.c?' error':''}`} type="text" value={form.c} onChange={e=>f('c')(e.target.value)}/>
              {errs.c && <span className="ru-form-error show">{errs.c}</span>}
            </div>
          </div>
          <div className="ru-form-row">
            <div className="ru-form-group full">
              <label className="ru-form-label">Correo electrónico <span className="req">*</span></label>
              <input className={`ru-form-input${errs.e?' error':''}`} type="email" value={form.e} onChange={e=>f('e')(e.target.value)}/>
              {errs.e && <span className="ru-form-error show">{errs.e}</span>}
            </div>
          </div>
          <div className="ru-devices-section">
            <div className="ru-devices-header">
              <span className="ru-devices-title">Dispositivos asociados</span>
              <span className="ru-devices-count">{devs.length}</span>
              {user.s!=='inactive' && (
                <button className="ru-device-add-btn" onClick={()=>{setAddOpen(p=>!p);setAddStep(1);setAddCode('');setAddSite('');setAddErr('');}}>
                  <IcoPlus/>
                </button>
              )}
            </div>
            <div className={`ru-device-add-row${addOpen?' open':''}`}>
              {addStep===1 && (
                <div style={{display:'flex',alignItems:'center',gap:8,width:'100%'}}>
                  <input ref={codeRef} className={`ru-device-add-input${addErr?' error':''}`} type="text"
                    placeholder="Código del dispositivo (ej: D05)" value={addCode}
                    onChange={e=>{setAddCode(e.target.value);setAddErr('');}}
                    onKeyDown={e=>{if(e.key==='Enter') goStep2(); if(e.key==='Escape') closeAdd();}}/>
                  <button className="ru-device-add-confirm" onClick={goStep2}>Continuar</button>
                  <button className="ru-device-add-cancel" onClick={closeAdd}><IcoXSm/></button>
                </div>
              )}
              {addStep===2 && foundDev && (
                <div style={{display:'flex',flexDirection:'column',gap:12,width:'100%'}}>
                  <div style={{display:'flex',alignItems:'center',gap:11,padding:'10px 12px'}}>
                    <div style={{width:28,height:28,borderRadius:8,background:'#F2F3F5',border:'0.5px solid #E4E5E9',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:'#00082C'}}>
                      <IcoDeviceIcon/>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:500,color:'#00082C'}}>{foundDev.name}</div>
                      <div style={{fontSize:10,color:'rgba(0,8,44,.55)',marginTop:1}}>{addCode.toUpperCase()}</div>
                    </div>
                  </div>
                  <input ref={siteRef} className="ru-device-add-input" type="text"
                    placeholder="Nombre del sitio (ej: Terraza norte)" value={addSite}
                    onChange={e=>{setAddSite(e.target.value);setAddErr('');}}
                    onKeyDown={e=>{if(e.key==='Enter') confirmAdd();}}/>
                  <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
                    <button className="ru-device-add-cancel" onClick={()=>{setAddStep(1);setAddSite('');setAddErr('');}}>Atrás</button>
                    <button className="ru-device-add-confirm" onClick={confirmAdd}>Vincular</button>
                  </div>
                </div>
              )}
              {addErr && <div className="ru-device-add-error" style={{display:'block'}}>{addErr}</div>}
            </div>
            <div className="ru-devices-list">
              {devs.length>0
                ? devs.map(dId=>{
                    const d=getDevice(dId);
                    return (
                      <div key={dId} className="ru-device-chip">
                        <div className="ru-device-icon-wrap"><IcoDeviceIcon/></div>
                        <div className="ru-device-info-col">
                          <div className="ru-device-code">{dId}</div>
                          <div className="ru-device-sub">{d?d.name:'Sensor ambiental'}</div>
                        </div>
                        <button className="ru-device-remove" onClick={()=>setRemoveTarget(dId)}><IcoXSm/></button>
                      </div>
                    );
                  })
                : <div className="ru-devices-empty">Sin dispositivos asignados</div>}
            </div>
          </div>
        </div>
        {!removeTarget && (
          <div className="ru-modal-footer">
            <button className="ru-btn-m ru-btn-cancel" onClick={onClose}>Cancelar</button>
            <button className="ru-btn-m ru-btn-primary" onClick={submit}><IcoCheck/> Actualizar usuario</button>
          </div>
        )}
        {removeTarget && (()=>{
          const d = getDevice(removeTarget)||{id:removeTarget,name:'Dispositivo',serial:''};
          return (
            <div className="ru-dcp open">
              <div className="ru-dcp-chip-row">
                <div className="ru-dcp-chip-icon"><IcoDeviceIcon/></div>
                <div className="ru-dcp-chip-info">
                  <div className="ru-dcp-chip-name">{d.name}</div>
                  <div className="ru-dcp-chip-sub"><span className="ru-dcp-chip-id">{d.id}</span><span style={{marginLeft:6}}>{d.serial}</span></div>
                </div>
                <button className="ru-dcp-chip-close" onClick={()=>setRemoveTarget(null)}><IcoXSm/></button>
              </div>
              <div className="ru-dcp-body">
                <div className="ru-dcp-warn-icon"><IcoWarn stroke="var(--red)"/></div>
                <div className="ru-dcp-title">¿Quitar {d.name}?</div>
                <p className="ru-dcp-desc">El dispositivo dejará de estar asignado a este usuario. Podrás asignarlo a otro usuario cuando lo requieras.</p>
              </div>
              <div className="ru-dcp-footer">
                <button className="ru-btn-m ru-btn-cancel" onClick={()=>setRemoveTarget(null)}>Cancelar</button>
                <button className="ru-btn-m ru-btn-danger" onClick={()=>{setDevs(p=>p.filter(id=>id!==removeTarget));setRemoveTarget(null);}}>
                  <IcoXSm/> Quitar dispositivo
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

/* ══ Modal CONFIRMAR TOGGLE ══ */
function ModalConfirm({user, onClose, onConfirm}) {
  if(!user) return null;
  const active = user.s==='active';
  return (
    <div className="ru-modal-backdrop open" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="ru-modal ru-modal-sm">
        <div className="ru-modal-header">
          <div className="ru-modal-icon">{active?<IcoLockSm/>:<IcoUnlock/>}</div>
          <div>
            <div className="ru-modal-title">{active?'Inhabilitar usuario':'Habilitar usuario'}</div>
            <div className="ru-modal-subtitle">{user.n} {user.a}</div>
          </div>
          <button className="ru-modal-close" onClick={onClose}><IcoXSm/></button>
        </div>
        <div className="ru-confirm-center">
          <div className={`ru-confirm-icon-wrap ${active?'warn':'success'}`}>
            {active
              ? <IcoWarn/>
              : <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F0F5FF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>}
          </div>
          <div className="ru-confirm-title">{active?`¿Inhabilitar a ${user.n}?`:`¿Habilitar a ${user.n}?`}</div>
          <p className="ru-confirm-desc">{active
            ?'El usuario no podrá acceder al sistema mientras esté inhabilitado. Puedes reactivarlo en cualquier momento.'
            :'El usuario recuperará acceso completo al sistema. Podrás inhabilitarlo nuevamente cuando lo requieras.'}</p>
        </div>
        <div className="ru-modal-footer" style={{justifyContent:'center'}}>
          <button className="ru-btn-m ru-btn-cancel" onClick={onClose}>Cancelar</button>
          <button className={`ru-btn-m ${active?'ru-btn-danger':'ru-btn-success'}`} onClick={()=>onConfirm(user.id)}>
            {active?<><IcoLockSm/> Inhabilitar</>:<><IcoUnlock/> Habilitar</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══ MAIN ══ */
export default function RilAmbUsuarios() {
  const navigate = useNavigate();
  const [db,           setDb]           = useState(INITIAL_DB);
  const [nextId,       setNextId]        = useState(13);
  const [sidebarOpen,  setSidebarOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen]  = useState(false);
  const [flt,          setFlt]           = useState('all');
  const [qry,          setQry]           = useState('');
  const [sortKey,      setSortKey]       = useState('name');
  const [sortDir,      setSortDir]       = useState('asc');
  const [page,         setPage]          = useState(1);
  const [isMobile,     setIsMobile]      = useState(false);
  const [toasts,       setToasts]        = useState([]);
  const [modalView,    setModalView]     = useState(null);
  const [modalCreate,  setModalCreate]   = useState(false);
  const [modalEdit,    setModalEdit]     = useState(null);
  const [modalConfirm, setModalConfirm]  = useState(null);

  // CORRECCIÓN: El bloque useEffect que inyectaba el CSS fue eliminado.
  // Los estilos ahora se inyectan a nivel de módulo (ver bloque arriba),
  // garantizando que estén disponibles antes del primer render.

  useEffect(()=>{
    const h=e=>{if(!e.target.closest('.ru-sb-footer'))setDropdownOpen(false);};
    document.addEventListener('click',h);return()=>document.removeEventListener('click',h);
  },[]);
  useEffect(()=>{
    const check=()=>setIsMobile(window.innerWidth<=768);
    check();window.addEventListener('resize',check);return()=>window.removeEventListener('resize',check);
  },[]);
  useEffect(()=>{
    const h=e=>{if(e.key==='Escape'){setModalView(null);setModalCreate(false);setModalEdit(null);setModalConfirm(null);}};
    document.addEventListener('keydown',h);return()=>document.removeEventListener('keydown',h);
  },[]);

  const showToast = useCallback(msg=>{
    const id=Date.now();
    setToasts(p=>[...p,{id,msg,show:false}]);
    setTimeout(()=>setToasts(p=>p.map(t=>t.id===id?{...t,show:true}:t)),30);
    setTimeout(()=>{
      setToasts(p=>p.map(t=>t.id===id?{...t,show:false}:t));
      setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),350);
    },2800);
  },[]);

  const getList = () => {
    let l=[...db];
    if(flt!=='all') l=l.filter(u=>u.s===flt);
    if(qry){const q=qry.toLowerCase();l=l.filter(u=>[u.n,u.a,u.e,u.c].some(x=>x.toLowerCase().includes(q)));}
    l.sort((a,b)=>{
      let va='',vb='';
      if(sortKey==='name'){va=(a.n+a.a).toLowerCase();vb=(b.n+b.a).toLowerCase();}
      if(sortKey==='date'){va=a.d;vb=b.d;}
      return va<vb?(sortDir==='asc'?-1:1):va>vb?(sortDir==='asc'?1:-1):0;
    });
    return l;
  };
  const list=getList(), total=list.length;
  const pages=Math.max(1,Math.ceil(total/PER));
  const safePg=Math.min(page,pages);
  const slice=list.slice((safePg-1)*PER, safePg*PER);

  const toggleSort = () => {
    if(sortKey==='date'){setSortKey('name');setSortDir('asc');}
    else{setSortKey('date');setSortDir(d=>d==='asc'?'desc':'asc');}
    setPage(1);
  };

  const handleSaveCreate = form => {
    const id=nextId; setNextId(p=>p+1);
    setDb(p=>[{id,n:form.n.trim(),a:form.a.trim(),e:form.e.trim().toLowerCase(),t:form.t.trim(),c:form.c.trim(),s:'active',d:today(),devices:[]}, ...p]);
    setModalCreate(false); setPage(1); showToast('Usuario creado exitosamente');
  };
  const handleSaveEdit = (id, form) => {
    setDb(p=>p.map(u=>u.id===id?{...u,...form,n:form.n.trim(),a:form.a.trim(),e:form.e.trim().toLowerCase(),t:form.t.trim(),c:form.c.trim()}:u));
    setModalEdit(null); showToast('Usuario actualizado correctamente');
  };
  const handleToggle = id => {
    setDb(p=>p.map(u=>u.id===id?{...u,s:u.s==='active'?'inactive':'active'}:u));
    const u=db.find(x=>x.id===id);
    setModalConfirm(null);
    showToast(u?u.s==='active'?`${u.n} ha sido inhabilitado`:`${u.n} ha sido activado`:'');
  };

  const handleLogout = () => {
    logout();
    navigate('/session-logo', { replace: true, state: { next: '/' } });
  };

  return (
    <div style={{minHeight:'100vh',background:'var(--page)',fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,
        background:'radial-gradient(ellipse 70% 50% at 10% 5%,rgba(0,8,44,.045) 0%,transparent 55%),radial-gradient(ellipse 55% 40% at 92% 90%,rgba(0,8,44,.038) 0%,transparent 55%)'}}/>

      <div className={`ru-overlay${sidebarOpen?' open':''}`} onClick={()=>setSidebarOpen(false)}/>
      <ToastContainer toasts={toasts}/>

      {modalView    && <ModalView    user={modalView} onClose={()=>setModalView(null)}/>}
      {modalCreate  && <ModalCreate  onClose={()=>setModalCreate(false)} onSave={handleSaveCreate}/>}
      {modalEdit    && <ModalEdit    user={modalEdit} onClose={()=>setModalEdit(null)} onSave={(f)=>handleSaveEdit(modalEdit.id,f)}/>}
      {modalConfirm && <ModalConfirm user={modalConfirm} onClose={()=>setModalConfirm(null)} onConfirm={handleToggle}/>}

      <aside className={`ru-sidebar${sidebarOpen?' open':''}`}>
        <div className="ru-sb-brand">
          <div className="ru-sb-mark">
            <img src={whiteLogo} alt="RilAmb" style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
          </div>
          <div><div className="ru-sb-name">RilAmb</div><div className="ru-sb-tag">Platform</div></div>
          <button className="ru-sb-close" onClick={()=>setSidebarOpen(false)}><IcoX/></button>
        </div>
        <nav className="ru-sb-nav">
          <button className="ru-sb-item" onClick={() => navigate('/admin/reports')}><IcoFile/><span>Reportes</span></button>
          <button className="ru-sb-item active" onClick={() => navigate('/admin/users')}><IcoUsers/><span>Usuarios</span></button>
          <button className="ru-sb-item" onClick={() => navigate('/admin/devices')}><IcoDevice/><span>Dispositivos</span></button>
        </nav>
        <div className="ru-sb-footer">
          <div className="ru-sb-profile" onClick={()=>setDropdownOpen(p=>!p)}>
            <div className="ru-sb-av">AS</div>
            <div><div className="ru-sb-pname">Admin S.</div><div className="ru-sb-prole">Administrador</div></div>
            <span className="ru-sb-dots"><IcoDots/></span>
          </div>
          <div className={`ru-sb-dropdown${dropdownOpen?' open':''}`}>
            <button className="ru-sb-dd-item"><IcoUser/><span>Ver perfil</span></button>
            <div className="ru-sb-divider"/>
            <button className="ru-sb-dd-item"><IcoLock/><span>Cambiar contraseña</span></button>
          </div>
        </div>
      </aside>

      <div className="ru-layout">
        <div className="ru-content">
          <header className="ru-topbar">
            <button className="ru-tb-hamburger" onClick={()=>setSidebarOpen(true)}><IcoMenu/></button>
            <div className="ru-tb-bc">
              <span className="ru-tb-bc-root">RilAmb</span>
              <span className="ru-tb-bc-sep">/</span>
              <span className="ru-tb-bc-cur">Usuarios</span>
            </div>
            <div className="ru-tb-space"/>
            <div className="ru-tb-search">
              <input type="search" placeholder="Buscar usuario…" value={qry}
                onChange={e=>{setQry(e.target.value);setPage(1);}} autoComplete="off"/>
              <span className="ru-tb-search-ico"><IcoSearch/></span>
            </div>
            <button className="ru-tb-ico"><IcoBell/><span className="ru-notif-dot"/></button>
            <button className="ru-tb-avatar" onClick={handleLogout}><IcoLogout/></button>
          </header>

          <main className="ru-page">
            <div className="ru-ph">
              <div className="ru-ph-left">
                <h1>Usuarios</h1>
                <p>Gestiona los usuarios registrados en la plataforma</p>
              </div>
              <div className="ru-ph-right">
                <button className="ru-btn-add" onClick={()=>setModalCreate(true)}>
                  <IcoPlus/><span>Agregar usuario</span>
                </button>
              </div>
            </div>

            <div className="ru-bar">
              {[{k:'all',l:'Todos'},{k:'active',l:'Activos'},{k:'inactive',l:'Inactivos'}].map(f=>(
                <button key={f.k} className={`ru-fp${flt===f.k?' on':''}`}
                  onClick={()=>{setFlt(f.k);setPage(1);}}>{f.l}</button>
              ))}
            </div>

            <div className="ru-card">
              <div className="ru-card-head">
                <div>
                  <div className="ru-card-head-title">Registro de usuarios</div>
                  <div className="ru-card-head-sub">{qry?`Resultados para "${qry}"`:flt==='all'?'Todos los usuarios del sistema':flt==='active'?'Filtrado: Activos':'Filtrado: Inactivos'}</div>
                </div>
                <div className="ru-ch-space"/>
                <button className="ru-sort-btn" onClick={toggleSort}><IcoSort/> {sortKey==='date'?'Restablecer orden':'Ordenar'}</button>
              </div>

              <div className="ru-tbl-wrap">
                {slice.length===0
                  ? <div className="ru-empty"><div className="ru-empty-icon"><IcoUsers/></div><h3 style={{fontSize:14,fontWeight:500,color:'var(--i70)'}}>Sin resultados</h3><p style={{fontSize:12.5,color:'var(--i40)'}}>No hay usuarios que coincidan con tu búsqueda.</p></div>
                  : <table>
                      <thead><tr><th>Usuario</th><th>Correo</th><th>Teléfono</th><th>Estado</th><th>Registro</th><th>Acciones</th></tr></thead>
                      <tbody>
                        {slice.map((u,i)=>(
                          <tr key={u.id} style={{animationDelay:(i*.036)+'s'}}>
                            <td><div className="ru-uc"><div className="ru-av" style={avs(u)}>{ini(u)}</div><div><div className="ru-un">{u.n} {u.a}</div><div className="ru-ui">{u.c}</div></div></div></td>
                            <td><span className="ru-cell-sm">{u.e}</span></td>
                            <td><span className="ru-cell-sm">{u.t}</span></td>
                            <td><Pill s={u.s}/></td>
                            <td><span className="ru-cell-date">{fmtD(u.d)}</span></td>
                            <td>
                              <div className="ru-acts">
                                <button className="ru-act" title="Ver" onClick={()=>setModalView(u)}><IcoView/></button>
                                <button className="ru-act" title="Editar" onClick={()=>setModalEdit(u)}><IcoEdit/></button>
                                <button className="ru-act" title={u.s==='active'?'Inhabilitar':'Habilitar'} onClick={()=>setModalConfirm(u)}>
                                  {u.s==='active'?<IcoLockSm/>:<IcoUnlock/>}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>}
              </div>

              <div className="ru-cards-wrap">
                {slice.length===0
                  ? <div className="ru-empty"><div className="ru-empty-icon"><IcoUsers/></div><h3 style={{fontSize:14,fontWeight:500,color:'var(--i70)'}}>Sin resultados</h3></div>
                  : slice.map((u,i)=>(
                    <div key={u.id} className="ru-m-card" style={{animationDelay:(i*.05)+'s'}}>
                      <div className="ru-m-card-top">
                        <div className="ru-m-av" style={avs(u)}>{ini(u)}</div>
                        <div><div className="ru-m-name">{u.n} {u.a}</div><div className="ru-m-id">{u.c}</div></div>
                        <div className="ru-m-status"><Pill s={u.s}/></div>
                      </div>
                      <div className="ru-m-fields">
                        <div className="ru-m-field full"><div className="ru-m-label">Correo</div><div className="ru-m-value">{u.e}</div></div>
                        <div className="ru-m-field"><div className="ru-m-label">Teléfono</div><div className="ru-m-value">{u.t}</div></div>
                        <div className="ru-m-field"><div className="ru-m-label">Registro</div><div className="ru-m-value">{fmtD(u.d)}</div></div>
                      </div>
                      <div className="ru-m-divider"/>
                      <div className="ru-m-actions">
                        <button className="ru-m-act" onClick={()=>setModalView(u)}><IcoView/> Ver</button>
                        <button className="ru-m-act" onClick={()=>setModalEdit(u)}><IcoEdit/> Editar</button>
                        <button className="ru-m-act" style={{flex:'0 0 auto',width:34}} onClick={()=>setModalConfirm(u)}>
                          {u.s==='active'?<IcoLockSm/>:<IcoUnlock/>}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="ru-card-foot">
                <span className="ru-cf-info">
                  {total>0
                    ? <>{`Mostrando `}<strong>{(safePg-1)*PER+1}–{Math.min(safePg*PER,total)}</strong>{` de `}<strong>{total}</strong></>
                    : 'Sin resultados'}
                </span>
                {pages>1 && (
                  <div className="ru-pag">
                    <button className="ru-pg" disabled={safePg<=1} onClick={()=>setPage(p=>p-1)}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    {Array.from({length:pages},(_,i)=>i+1).map(p=>(
                      <button key={p} className={`ru-pg${p===safePg?' cur':''}`} onClick={()=>setPage(p)}>{p}</button>
                    ))}
                    <button className="ru-pg" disabled={safePg>=pages} onClick={()=>setPage(p=>p+1)}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}