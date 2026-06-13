// COMENTARIOS
// barra de desplazamiento cortada 

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import whiteLogo from "../../assets/whiteLogo.png";
import NotificationBell from "../../components/Notifications";
import { logout } from "../../services/authService";
import { getUserProfile } from "../../services/userService";
import { getReportSummary, getSensorHistory } from "../../services/deviceService";
import * as XLSX from "xlsx";

/* ══ CSS ══ */
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
  --amber:#9A6214;--amber-t:rgba(154,98,20,.10);
  --red:#C0392B;--red-t:rgba(192,57,43,.10);
  --violet:#7C3AED;--violet-t:rgba(124,58,237,.10);
  --shadow:0 1px 2px rgba(0,8,44,.03),0 4px 12px rgba(0,8,44,.05),0 16px 40px rgba(0,8,44,.07);
  --shadow-sm:0 1px 2px rgba(0,8,44,.03),0 2px 8px rgba(0,8,44,.05);
  --sb-w:250px;--tb-h:62px;--r:18px;--r-sm:10px;--r-xs:8px;
}
html,body{min-height:100vh;width:100%;font-family:'DM Sans',system-ui,sans-serif;background:var(--page);color:var(--ink);-webkit-font-smoothing:antialiased;overflow-x:hidden;}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes countUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

/* Overlay */
.rr-overlay{display:none;position:fixed;inset:0;z-index:40;background:rgba(0,8,44,.50);animation:fadeIn .22s ease;}
.rr-overlay.open{display:block;}

/* Layout */
.rr-layout{display:flex;min-height:100vh;position:relative;z-index:1;}

/* Sidebar base — sin backdrop ni rgba para que móvil sea opaco */
.rr-sidebar{width:var(--sb-w);background:#f5f5f9;border-right:0.5px solid var(--i07);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;height:100%;z-index:30;transition:transform .28s cubic-bezier(.4,0,.2,1);overflow-y:auto;overflow-x:hidden;}
@media(min-width:961px){
  .rr-sidebar{background:rgba(255,255,255,.74);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);box-shadow:1px 0 0 rgba(255,255,255,.60),2px 0 12px rgba(0,8,44,.04);}
}
.rr-sidebar::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.9) 50%,transparent);pointer-events:none;}
.rr-sidebar.open{transform:translateX(0)!important;}
.rr-sb-brand{padding:26px 20px 22px;display:flex;align-items:center;gap:11px;}
.rr-sb-close{display:none;margin-left:auto;width:28px;height:28px;border-radius:8px;border:0.5px solid var(--i10);background:var(--i04);align-items:center;justify-content:center;cursor:pointer;color:var(--i40);flex-shrink:0;}
.rr-sb-mark{width:32px;height:32px;background:var(--ink);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 8px rgba(0,8,44,.22),inset 0 1px 0 rgba(255,255,255,.10);}
.rr-sb-name{font-size:15px;font-weight:600;letter-spacing:-.02em;}
.rr-sb-tag{font-size:9px;font-weight:500;color:var(--i40);letter-spacing:.09em;text-transform:uppercase;margin-top:1px;}
.rr-sb-nav{padding:18px 13px;flex:1;}
.rr-sb-item{display:flex;align-items:center;gap:10px;height:38px;padding:0 11px;border-radius:var(--r-xs);border:0.5px solid transparent;cursor:pointer;transition:all .17s;margin-bottom:2px;text-decoration:none;color:inherit;position:relative;background:none;width:100%;}
.rr-sb-item svg{color:var(--i40);flex-shrink:0;transition:color .17s;}
.rr-sb-item span{font-size:12.5px;color:var(--i50);transition:color .17s;}
.rr-sb-item:hover{background:var(--i04);border-color:var(--i07);}
.rr-sb-item:hover svg,.rr-sb-item:hover span{color:var(--i70);}
.rr-sb-item.active{background:var(--i07);border-color:var(--i10);}
.rr-sb-item.active span{color:var(--ink);font-weight:500;}
.rr-sb-item.active svg{color:var(--ink);}
.rr-sb-item.active::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:2.5px;height:16px;background:var(--ink);border-radius:0 3px 3px 0;opacity:.55;}
.rr-sb-footer{padding:14px 13px;border-top:0.5px solid var(--i07);position:relative;}
.rr-sb-profile{display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:var(--r-xs);border:0.5px solid transparent;cursor:pointer;transition:all .17s;}
.rr-sb-profile:hover{background:var(--i04);border-color:var(--i07);}
.rr-sb-av{width:32px;height:32px;border-radius:8px;background:var(--i07);border:0.5px solid var(--i10);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:var(--i70);flex-shrink:0;}
.rr-sb-pname{font-size:12px;font-weight:500;color:var(--i70);}
.rr-sb-prole{font-size:10px;color:var(--i40);margin-top:1px;}
.rr-sb-dots{margin-left:auto;color:var(--i24);}
.rr-sb-dropdown{display:none;position:absolute;bottom:100%;left:14px;right:14px;margin-bottom:8px;background:var(--card);border:0.5px solid var(--i10);border-radius:var(--r-sm);box-shadow:0 4px 16px rgba(0,8,44,.12);overflow:hidden;z-index:40;animation:fadeUp .2s ease both;}
.rr-sb-dropdown.open{display:block;}
.rr-sb-dd-item{display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;transition:background .17s;text-decoration:none;color:inherit;background:none;border:none;width:100%;}
.rr-sb-dd-item:hover{background:var(--i04);}
.rr-sb-dd-item svg{width:14px;height:14px;color:var(--i40);flex-shrink:0;}
.rr-sb-dd-item span{font-size:12px;color:var(--i50);}
.rr-sb-dd-item:hover svg,.rr-sb-dd-item:hover span{color:var(--i70);}
.rr-sb-divider{height:0.5px;background:var(--i07);}

/* Topbar */
.rr-content{margin-left:var(--sb-w);flex:1;display:flex;flex-direction:column;min-height:100vh;min-width:0;}
.rr-topbar{height:var(--tb-h);background:rgba(240,240,244,.90);backdrop-filter:blur(24px) saturate(1.3);-webkit-backdrop-filter:blur(24px) saturate(1.3);border-bottom:0.5px solid var(--i07);position:fixed;top:0;left:var(--sb-w);right:17px;z-index:20;display:flex;align-items:center;padding:0 clamp(16px,3vw,32px);gap:12px;box-shadow:0 1px 0 rgba(255,255,255,.65),0 4px 16px rgba(0,8,44,.03);}
.rr-tb-hamburger{display:none;width:34px;height:34px;border-radius:9px;border:0.5px solid var(--i10);background:rgba(255,255,255,.60);align-items:center;justify-content:center;cursor:pointer;color:var(--i50);flex-shrink:0;}
.rr-tb-bc{display:flex;align-items:center;gap:7px;}
.rr-tb-bc-root{font-size:12px;color:var(--i40);}
.rr-tb-bc-sep{font-size:11px;color:var(--i16);}
.rr-tb-bc-cur{font-size:12px;font-weight:500;color:var(--i70);}
.rr-tb-space{flex:1;}
.rr-tb-ico{width:34px;height:34px;border-radius:9px;border:0.5px solid var(--i10);background:rgba(255,255,255,.60);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--i50);transition:all .17s;position:relative;flex-shrink:0;}
.rr-tb-ico:hover{background:rgba(255,255,255,.88);color:var(--i70);}
.rr-tb-avatar{width:34px;height:34px;border-radius:9px;background:var(--ink);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .17s;flex-shrink:0;border:0.5px solid transparent;outline:none;color:rgba(255,255,255,.75);}
.rr-tb-avatar:hover{background:#1a2a5e;transform:translateY(-1px);}

/* Page — CAMBIO 1: padding-bottom aumentado de 48px a 340px para dar espacio al panel de filtros */
.rr-page{padding-top:calc(var(--tb-h) + 28px);padding-left:clamp(14px,3vw,32px);padding-right:clamp(14px,3vw,32px);padding-bottom:32px;flex:1;display:flex;flex-direction:column;gap:20px;}

/* Page header */
.rr-ph{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;}
.rr-ph-left h1{font-size:21px;font-weight:500;letter-spacing:-.03em;line-height:1.2;margin-bottom:4px;}
.rr-ph-left p{font-size:12.5px;color:var(--i40);}

/* Section label */
.rr-sec-label{font-size:9.5px;font-weight:500;color:var(--i40);letter-spacing:.12em;text-transform:uppercase;margin-bottom:2px;}

/* Stat cards */
.rr-stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
.rr-stat-card{background:#FAFBFC;border:1px solid #E8ECF4;border-radius:16px;box-shadow:0 1px 3px rgba(0,8,44,.04),0 4px 12px rgba(0,8,44,.04);padding:14px 18px;display:flex;flex-direction:column;gap:10px;position:relative;overflow:hidden;transition:all .3s cubic-bezier(.4,0,.2,1);cursor:default;}
.rr-stat-card:hover{box-shadow:0 2px 8px rgba(0,8,44,.06),0 8px 24px rgba(0,8,44,.08);transform:translateY(-2px);}
.rr-stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(91,108,158,.15) 50%,transparent);pointer-events:none;}
.rr-sc-top{display:flex;align-items:center;justify-content:space-between;gap:12px;}
.rr-sc-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:rgba(0,8,44,.03);color:#00082C;border:1px solid rgba(0,8,44,.06);}
.rr-sc-trend{font-size:11px;font-weight:500;padding:5px 10px;border-radius:8px;flex-shrink:0;background:rgba(91,108,158,.06);color:#5B6C9E;border:0.5px solid rgba(91,108,158,.12);}
.rr-sc-bottom{display:flex;flex-direction:column;gap:8px;}
.rr-sc-val{font-size:28px;font-weight:600;letter-spacing:-.04em;line-height:1;font-variant-numeric:tabular-nums;color:#00082C;}
.rr-sc-label{font-size:11px;color:#9EA6B4;margin-top:1px;font-weight:500;letter-spacing:-.01em;}

/* Generic card */
.rr-card{background:var(--card);border:0.5px solid var(--i07);border-radius:var(--r);box-shadow:var(--shadow);display:flex;flex-direction:column;position:relative;overflow:visible;}
.rr-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(0,8,44,.10) 50%,transparent);pointer-events:none;z-index:2;}
.rr-card-head{display:flex;align-items:center;padding:15px 18px 13px;gap:10px;border-bottom:0.5px solid var(--i07);background:rgba(255,255,255,.22);flex-shrink:0;overflow:visible;position:relative;z-index:2;}
.rr-ch-title{font-size:13px;font-weight:500;letter-spacing:-.015em;}
.rr-ch-sub{font-size:10.5px;color:var(--i40);margin-top:1px;}
.rr-ch-space{flex:1;}
.rr-card-body{padding:16px 18px;flex:1;display:flex;flex-direction:column;min-height:0;}

/* Charts duo */
.rr-charts-duo{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:stretch;overflow:visible;}
.rr-charts-duo>div{min-width:0;display:flex;flex-direction:column;overflow:visible;}
.rr-charts-duo>div>.rr-card{flex:1;display:flex;flex-direction:column;}
.rr-chart-area{position:relative;width:100%;min-height:240px;flex:1;}
.rr-chart-area canvas{position:absolute;inset:0;width:100%!important;height:100%!important;}

/* Device filter dropdown */
.rr-dev-filter{position:relative;flex-shrink:0;z-index:9999;}
.rr-dev-filter-btn{display:flex;align-items:center;gap:6px;padding:5px 10px;border-radius:var(--r-xs);border:0.5px solid var(--i10);background:rgba(255,255,255,.65);cursor:pointer;font-family:'DM Sans',system-ui,sans-serif;font-size:11px;font-weight:500;color:var(--i50);transition:background .17s,border-color .17s;white-space:nowrap;}
.rr-dev-filter-btn:hover{background:rgba(255,255,255,.90);border-color:var(--i16);color:var(--i70);}
.rr-dev-chevron{transition:transform .22s;flex-shrink:0;color:var(--i40);}
.rr-dev-filter.open .rr-dev-chevron{transform:rotate(180deg);}
.rr-dev-filter-menu{display:block;position:fixed;max-height:260px;overflow-y:auto;overflow-x:hidden;background:rgba(255,255,255,.97);border:0.5px solid var(--i10);border-radius:var(--r-sm);box-shadow:0 4px 20px rgba(0,8,44,.10);z-index:9999;animation:fadeUp .17s ease both;}


.rr-dev-filter-opt{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 13px;cursor:pointer;transition:background .14s;font-size:12px;color:var(--i50);}
.rr-dev-filter-opt:hover{background:var(--i04);color:var(--i70);}
.rr-dev-filter-opt.active{background:var(--i07);color:var(--ink);font-weight:500;}
.rr-dev-filter-opt svg{opacity:0;flex-shrink:0;color:var(--green);}
.rr-dev-filter-opt.active svg{opacity:1;}

/* PPM legend */
.rr-ppm-legend{display:flex;align-items:center;gap:16px;flex-shrink:0;}
.rr-ppm-leg-item{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:500;color:var(--i50);white-space:nowrap;}
.rr-ppm-leg-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;display:inline-block;}

/* Wave tooltip */
.rr-wave-tip{position:absolute;pointer-events:none;z-index:10;background:rgba(255,255,255,.97);border:0.5px solid var(--i10);border-radius:var(--r-sm);box-shadow:0 4px 20px rgba(0,8,44,.12);padding:10px 14px;min-width:145px;opacity:0;transition:opacity .15s ease;font-family:'DM Sans',system-ui,sans-serif;}
.rr-wave-tip-date{font-size:10px;color:var(--i40);margin-bottom:7px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;}
.rr-wave-tip-row{display:flex;align-items:center;gap:7px;margin-bottom:4px;}
.rr-wave-tip-row:last-child{margin-bottom:0;}
.rr-wave-tip-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.rr-wave-tip-label{font-size:11px;color:var(--i50);flex:1;}
.rr-wave-tip-val{font-size:12.5px;font-weight:600;font-variant-numeric:tabular-nums;}

/* Table */
.rr-tbl-wrap{overflow-x:auto;}
.rr-tbl-wrap table{width:100%;border-collapse:collapse;}
.rr-tbl-wrap thead th{font-size:12.5px;font-weight:400;color:#00082C;letter-spacing:0;text-transform:none;padding:14px 24px 12px;text-align:left;border-bottom:0.5px solid var(--i07);white-space:nowrap;}
.rr-tbl-wrap tbody tr{transition:background .15s;cursor:default;}
.rr-tbl-wrap tbody tr:hover td{background:rgba(0,8,44,.018);}
.rr-tbl-wrap tbody td{font-size:12.5px;color:var(--i50);padding:11px 24px;border-bottom:0.5px solid var(--i07);white-space:nowrap;vertical-align:middle;font-weight:400;}
.rr-tbl-wrap tbody tr:last-child td{border-bottom:none;}

/* Table status — plain text, same style as other cells */
.rr-tbl-status{font-size:12.5px;color:var(--i50);font-weight:400;}

/* Pagination */
.rr-tbl-pg-btn{min-width:28px;height:28px;padding:0 8px;border-radius:7px;border:0.5px solid var(--i10);background:transparent;font-family:'DM Sans',system-ui,sans-serif;font-size:11.5px;font-weight:500;color:var(--i50);cursor:pointer;transition:background .15s,border-color .15s,color .15s;}
.rr-tbl-pg-btn:hover:not(:disabled):not(.active){background:var(--i04);border-color:var(--i16);color:var(--i70);}
.rr-tbl-pg-btn.active{background:var(--ink);border-color:var(--ink);color:#fff;}
.rr-tbl-pg-btn:disabled{opacity:.35;cursor:not-allowed;}

/* Filter panel */
.rr-tbl-filter-wrap{position:relative;flex-shrink:0;z-index:9999;}
.rr-tbl-filter-btn{display:flex;align-items:center;gap:6px;height:32px;padding:0 12px;border-radius:8px;border:0.5px solid var(--i10);background:rgba(255,255,255,.65);cursor:pointer;font-family:'DM Sans',system-ui,sans-serif;font-size:11.5px;font-weight:500;color:var(--i50);transition:background .17s,border-color .17s,color .17s;}
.rr-tbl-filter-btn:hover{background:rgba(255,255,255,.90);border-color:var(--i16);color:var(--i70);}
.rr-tbl-filter-btn.has-filter{background:rgba(0,8,44,.06);border-color:rgba(0,8,44,.18);color:var(--ink);}
.rr-tbl-filter-dot{width:5px;height:5px;border-radius:50%;background:var(--ink);display:none;flex-shrink:0;}
.rr-tbl-filter-btn.has-filter .rr-tbl-filter-dot{display:block;}
.rr-filter-panel{display:none;position:fixed;width:290px;max-height:calc(100vh - 120px);overflow-y:auto;background:rgba(255,255,255,.99);border:0.5px solid var(--i10);border-radius:14px;box-shadow:0 8px 32px rgba(0,8,44,.11),0 2px 8px rgba(0,8,44,.06);z-index:9999;padding:20px 18px 16px;animation:fadeUp .18s ease both;}
.rr-filter-panel.open{display:block;}
.rr-fp-title{font-size:9px;font-weight:600;color:var(--i24);letter-spacing:.14em;text-transform:uppercase;margin-bottom:16px;}
.rr-fp-group{margin-bottom:14px;}
.rr-fp-label{font-size:10.5px;font-weight:500;color:var(--i50);margin-bottom:7px;display:block;}
.rr-fp-select{width:100%;height:38px;padding:0 12px;background:var(--i04);border:0.5px solid var(--i10);border-radius:9px;font-family:'DM Sans',system-ui,sans-serif;font-size:12.5px;color:var(--i70);outline:none;transition:border-color .18s;appearance:none;cursor:pointer;padding-right:32px;background-image:url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='rgba(0,8,44,.25)' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 11px center;}
.rr-fp-select:focus{border-color:rgba(0,8,44,.28);background-color:rgba(0,8,44,.03);}
.rr-fp-divider{height:0.5px;background:var(--i07);margin:16px 0 14px;}
.rr-fp-actions{display:flex;gap:8px;}
.rr-fp-btn-apply{flex:1;height:36px;background:var(--ink);border:none;border-radius:9px;color:#fff;font-family:'DM Sans',system-ui,sans-serif;font-size:12px;font-weight:500;cursor:pointer;transition:background .17s;}
.rr-fp-btn-apply:hover{background:#0b1c50;}
.rr-fp-btn-clear{height:36px;padding:0 14px;background:transparent;border:0.5px solid var(--i10);border-radius:9px;color:var(--i50);font-family:'DM Sans',system-ui,sans-serif;font-size:12px;cursor:pointer;transition:background .17s,border-color .17s;white-space:nowrap;}
.rr-fp-btn-clear:hover{background:var(--i04);border-color:var(--i16);color:var(--i70);}

/* Mobile cards */
.rr-dev-cards-list{display:none;flex-direction:column;padding:12px 16px;gap:10px;}
.rr-dev-card{background:rgba(255,255,255,.90);border:0.5px solid var(--i07);border-radius:16px;padding:16px;box-shadow:0 1px 3px rgba(0,8,44,.04),0 4px 16px rgba(0,8,44,.06);animation:fadeUp .30s ease both;overflow:hidden;}
.rr-dc-top{display:flex;align-items:center;gap:12px;margin-bottom:14px;}
.rr-dc-av{width:42px;height:42px;border-radius:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:var(--i70);background:var(--i07);border:0.5px solid var(--i10);position:relative;overflow:hidden;letter-spacing:.01em;}
.rr-dc-av::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.28) 0%,transparent 55%);pointer-events:none;}
.rr-dc-av-info{flex:1;min-width:0;}
.rr-dc-name{font-size:14.5px;font-weight:600;color:var(--ink);letter-spacing:-.015em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer;transition:color .17s;}
.rr-dc-name:hover{color:#5B6C9E;}
.rr-dc-name.expanded{white-space:normal;overflow:visible;text-overflow:unset;}
.rr-dc-sub{font-size:11px;color:var(--i40);margin-top:2px;}
.rr-dc-status-wrap{margin-left:auto;flex-shrink:0;}
.rr-dc-pill{display:inline-flex;align-items:center;gap:6px;height:25px;padding:0 11px;border-radius:99px;font-size:11px;font-weight:500;letter-spacing:.03em;white-space:nowrap;background:rgba(91,108,158,0.10);color:#5B6C9E;border:0.5px solid rgba(91,108,158,0.14);}
.rr-dc-fields{display:grid;grid-template-columns:1fr 1fr;gap:10px 12px;margin-bottom:14px;}
.rr-dc-flabel{font-size:9.5px;font-weight:500;color:var(--i24);letter-spacing:.09em;text-transform:uppercase;margin-bottom:3px;}
.rr-dc-fval{font-size:12.5px;color:var(--i70);}
.rr-dc-divider{height:0.5px;background:var(--i07);margin-bottom:12px;}
.rr-dc-meta{display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--i50);}
.rr-dc-meta-sep{width:2px;height:2px;border-radius:50%;background:var(--i24);flex-shrink:0;}

/* Responsive */
@media(max-width:1200px){.rr-stat-grid{grid-template-columns:repeat(2,1fr);}.rr-charts-duo{grid-template-columns:1fr 1fr;}}
@media(min-width:961px) and (max-width:1100px){
  :root{--sb-w:64px;}
  .rr-sb-name,.rr-sb-tag,.rr-sb-item span,.rr-sb-pname,.rr-sb-prole,.rr-sb-dots{display:none;}
  .rr-sb-brand{padding:20px 12px;justify-content:center;}
  .rr-sb-mark{width:34px;height:34px;border-radius:10px;}
  .rr-sb-nav{padding:12px 8px;display:flex;flex-direction:column;align-items:center;}
  .rr-sb-item{justify-content:center;gap:0;height:40px;padding:0;border-radius:var(--r-sm);width:40px;}
  .rr-sb-footer{padding:12px 8px;display:flex;justify-content:center;}
  .rr-sb-profile{justify-content:center;gap:0;padding:0;width:40px;height:40px;}
}
@media(max-width:960px){
  :root{--sb-w:0px;--tb-h:58px;}
  .rr-sidebar{width:100%!important;transform:translateX(-100%);position:fixed;top:0;left:0;bottom:0;height:100%!important;z-index:50;background:#f5f5f9!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;box-shadow:none!important;transition:transform .28s cubic-bezier(.4,0,.2,1);}
  .rr-sidebar.open{transform:translateX(0)!important;}
  .rr-sb-name,.rr-sb-tag,.rr-sb-item span,.rr-sb-pname,.rr-sb-prole,.rr-sb-dots{display:revert!important;}
  .rr-sb-brand{padding:28px 24px 24px;justify-content:flex-start!important;}
  .rr-sb-nav{padding:20px 18px;}
  .rr-sb-item{justify-content:flex-start!important;padding:0 14px!important;width:100%!important;margin:0 0 2px!important;height:48px!important;}
  .rr-sb-footer{padding:18px;}
  .rr-sb-profile{justify-content:flex-start!important;}
  .rr-sb-close{display:flex!important;}
  .rr-content{margin-left:0;}
  .rr-topbar{left:0;right:0;padding:0 20px;gap:10px;}
  .rr-tb-hamburger{display:flex!important;}
  .rr-page{padding:calc(var(--tb-h) + 20px) 16px 32px;}
  .rr-charts-duo{grid-template-columns:1fr;}
}
@media(max-width:768px){
  :root{--tb-h:54px;}
  .rr-topbar{padding:0 14px;right:0;}
  .rr-tb-bc-root,.rr-tb-bc-sep{display:none;}
  .rr-page{padding-top:calc(var(--tb-h) + 16px);padding-left:12px;padding-right:12px;padding-bottom:32px;gap:16px;}
  .rr-ph-left h1{font-size:18px;}
  .rr-stat-grid{grid-template-columns:repeat(2,1fr);gap:10px;}
  .rr-charts-duo{gap:12px;}
  .rr-chart-area{min-height:200px;}
  .rr-card-head{padding:12px 14px 10px;flex-wrap:wrap;row-gap:8px;overflow:visible;position:relative;z-index:2;}
  .rr-card-body{padding:12px 14px;}
  .rr-ppm-legend{gap:10px;flex-wrap:wrap;}
  .rr-tbl-wrap{display:none!important;}
  .rr-dev-cards-list{display:flex;}

}
@media(max-width:500px){
  .rr-stat-grid{grid-template-columns:1fr 1fr;}
  .rr-sc-val{font-size:24px;}
  .rr-charts-duo{grid-template-columns:1fr;}
  .rr-dc-fields{grid-template-columns:1fr;}
  /* Panel de filtros: ancho completo */

}
@media(max-width:380px){
  .rr-stat-grid{grid-template-columns:1fr;}
  .rr-page{padding-left:10px;padding-right:10px;}
}
`;

/* ══ Inyectar CSS a nivel de módulo, ANTES del primer render ══ */
if (typeof document !== 'undefined') {
  const _id = 'rilambReportesStyles';
  if (!document.getElementById(_id)) {
    const _style = document.createElement('style');
    _style.id = _id;
    _style.textContent = GLOBAL_CSS;
    document.head.appendChild(_style);
  }
}

/* ══ DATA ══ */
// Datos estáticos eliminados - ahora se cargan desde la API
const GASES = [
  { key:'mq2', color:'#00082C', label:'MQ-2' },
  { key:'mq7', color:'#a2b8f5', label:'MQ-7' },
  { key:'mq4', color:'#5B6C9E', label:'MQ-4' },
];

const TBL_PAGE_SIZE = 8;
const WEEKDAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DEFAULT_REPORT_SUMMARY = {
  linked_devices_count: 0,
  total_alerts_count: 0,
  top_device_label: null,
  top_device_alerts: 0,
  top_day_label: null,
  top_day_alerts: 0,
};

/* ══ Helpers ══ */
function easeOut(t) { return 1 - Math.pow(1 - t, 4); }
function getInitials(name) { return name.split(' ').map(w=>w[0]).filter(Boolean).slice(0,2).join('').toUpperCase(); }
function statusClass(s) { if(s==='Seguro') return 'seguro'; if(s==='Precaución') return 'precaucion'; if(s==='Alerta') return 'alerta'; return ''; }
function pluralize(count, singular, plural) { return `${count} ${count === 1 ? singular : plural}`; }

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function buildReportRows(sensorHistory) {
  return sensorHistory.map(h => {
    const d = new Date(h.timestamp);
    const fecha = d.toLocaleDateString('es-CO', { day:'2-digit', month:'2-digit', year:'numeric' });
    const hora = d.getHours().toString().padStart(2,'0')+':'+d.getMinutes().toString().padStart(2,'0');

    let status = 'Seguro';
    if (h.mq2 > 300 || h.mq7 > 250 || h.mq4 > 380) status = 'Alerta';
    else if (h.mq2 > 250 || h.mq7 > 200 || h.mq4 > 300) status = 'Precaución';

    return {
      Dispositivo: h.alias || 'Dispositivo vinculado',
      Estado: status,
      'MQ-2': `${h.mq2} ppm`,
      'MQ-7': `${h.mq7} ppm`,
      'MQ-4': `${h.mq4} ppm`,
      Fecha: fecha,
      Hora: hora,
    };
  });
}

function catmullRomPath(ctx, pts, tension) {
  if (pts.length < 2) return;
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i-1,0)], p1 = pts[i], p2 = pts[i+1], p3 = pts[Math.min(i+2,pts.length-1)];
    const t = tension ?? 0.5;
    const cp1x = p1.x+(p2.x-p0.x)*t/3, cp1y = p1.y+(p2.y-p0.y)*t/3;
    const cp2x = p2.x-(p3.x-p1.x)*t/3, cp2y = p2.y-(p3.y-p1.y)*t/3;
    ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,p2.x,p2.y);
  }
}

/* ══ Icons ══ */
const IcoMenu    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IcoX       = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoDots    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const IcoUser    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcoLock    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcoLogout  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.95)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IcoDownload= () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IcoMonitor = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IcoFile    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IcoDevice  = () => <svg width="15" height="15" viewBox="0 0 40 40" fill="none"><rect x="1.5" y="1.5" width="37" height="37" rx="9" stroke="currentColor" strokeWidth="2.2" fill="none"/><circle cx="20" cy="22" r="10.5" stroke="currentColor" strokeWidth="1.6" fill="none" opacity=".5"/><circle cx="20" cy="22" r="1.7" fill="currentColor"/></svg>;
const IcoFilter  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const IcoClock   = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{color:'var(--i24)',flexShrink:0}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

/* ══ Wave chart (PPM por gas) ══ */
function WaveChart({ sensorHistory }) {
  const wrapRef   = useRef(null);
  const canvasRef = useRef(null);
  const tipRef    = useRef(null);
  const lineRef   = useRef(null);
  const animRef   = useRef(null);
  const hovRef    = useRef(-1);
  const animProgRef = useRef(0);

  const getData = useCallback(() => {
    if (!sensorHistory || sensorHistory.length === 0) {
      return { labels: [], mq2: [], mq7: [], mq4: [] };
    }
    const now = new Date();
    now.setHours(23, 59, 59, 999);

    const buckets = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(now);
      day.setDate(now.getDate() - (6 - index));
      return {
        key: toDateKey(day),
        label: WEEKDAY_LABELS[day.getDay()],
        mq2: [],
        mq7: [],
        mq4: [],
      };
    });

    const bucketByKey = new Map(buckets.map(bucket => [bucket.key, bucket]));

    sensorHistory.forEach(entry => {
      const date = new Date(entry.timestamp);
      if (Number.isNaN(date.getTime())) return;
      if (date > now) return;
      const lowerBound = new Date(now);
      lowerBound.setDate(now.getDate() - 6);
      lowerBound.setHours(0, 0, 0, 0);
      if (date < lowerBound) return;

      const bucket = bucketByKey.get(toDateKey(date));
      if (!bucket) return;
      bucket.mq2.push(entry.mq2);
      bucket.mq7.push(entry.mq7);
      bucket.mq4.push(entry.mq4);
    });

    const labels = buckets.map(bucket => bucket.label);
    const mq2 = buckets.map(bucket => bucket.mq2.length ? bucket.mq2.reduce((sum, value) => sum + value, 0) / bucket.mq2.length : null);
    const mq7 = buckets.map(bucket => bucket.mq7.length ? bucket.mq7.reduce((sum, value) => sum + value, 0) / bucket.mq7.length : null);
    const mq4 = buckets.map(bucket => bucket.mq4.length ? bucket.mq4.reduce((sum, value) => sum + value, 0) / bucket.mq4.length : null);
    return { labels, mq2, mq7, mq4 };
  }, [sensorHistory]);

  const render = useCallback((p) => {
    animProgRef.current = p;
    const wrap = wrapRef.current, canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = wrap.clientWidth || 600, H = wrap.clientHeight || 300;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W+'px'; canvas.style.height = H+'px';
    const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
    ctx.clearRect(0,0,W,H);
    const data = getData();
    const PL=64, PR=24, PT=20, PB=44;
    const cW=W-PL-PR, cH=H-PT-PB, n=data.labels.length;
    const allVals = GASES.flatMap(g => data[g.key]).filter(Number.isFinite);
    const minV = Math.max(0, Math.min(...allVals)-20), maxV = Math.max(...allVals)+30;
    const range = maxV - minV;
    const yOf = v => PT+cH-((v-minV)/range)*cH;
    const xOf = i => PL+i*(cW/(n-1));
    const hovDay = hovRef.current;

    ctx.font = `10px 'DM Sans',system-ui,sans-serif`;
    for (let i=0; i<=5; i++) {
      const v=minV+range/5*i, y=yOf(v);
      ctx.beginPath(); ctx.moveTo(PL,y); ctx.lineTo(PL+cW,y);
      ctx.strokeStyle=i===0?'rgba(0,8,44,.15)':'rgba(0,8,44,.07)'; ctx.lineWidth=0.5; ctx.stroke();
      ctx.fillStyle='rgba(0,8,44,.30)'; ctx.textAlign='right'; ctx.textBaseline='middle';
      ctx.fillText(Math.round(v)+' ppm', PL-8, y);
    }
    ctx.fillStyle='rgba(0,8,44,.38)'; ctx.textAlign='center'; ctx.textBaseline='top';
    ctx.font=`10.5px 'DM Sans',system-ui,sans-serif`;
    data.labels.forEach((lbl,i) => {
      const isHov = i===hovDay;
      ctx.fillStyle = isHov?'rgba(0,8,44,.75)':'rgba(0,8,44,.38)';
      ctx.font = isHov?`600 10.5px 'DM Sans',system-ui,sans-serif`:`10.5px 'DM Sans',system-ui,sans-serif`;
      ctx.fillText(lbl, xOf(i), PT+cH+10);
    });
    if (p>=1 && hovDay>=0) {
      const x=xOf(hovDay);
      ctx.beginPath(); ctx.moveTo(x,PT); ctx.lineTo(x,PT+cH);
      ctx.strokeStyle='rgba(0,8,44,.12)'; ctx.lineWidth=1; ctx.setLineDash([4,3]); ctx.stroke(); ctx.setLineDash([]);
    }
    [...GASES].reverse().forEach(gas => {
      const vals=data[gas.key], pts=vals
        .map((v,i)=>Number.isFinite(v) ? {x:xOf(i),y:yOf(v),val:v} : null)
        .filter(Boolean);
      const visPts=pts.slice(0,Math.max(2,Math.round(p*n)));
      ctx.beginPath(); catmullRomPath(ctx,visPts,0.45);
      ctx.strokeStyle=gas.color; ctx.lineWidth=2.5; ctx.lineJoin='round'; ctx.lineCap='round';
      ctx.globalAlpha=0.92; ctx.stroke(); ctx.globalAlpha=1;
      visPts.forEach((pt,idx) => {
        const isHovPt=hovDay>=0&&idx===hovDay, r=isHovPt?6:4;
        ctx.beginPath(); ctx.arc(pt.x,pt.y,r,0,Math.PI*2);
        ctx.fillStyle=gas.color; ctx.globalAlpha=isHovPt?1:0.88; ctx.fill(); ctx.globalAlpha=1;
        ctx.beginPath(); ctx.arc(pt.x,pt.y,r-1.8,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();
      });
    });
  }, [getData]);

  const startAnim = useCallback(() => {
    hovRef.current = -1;
    if (tipRef.current) tipRef.current.style.opacity='0';
    if (lineRef.current) lineRef.current.style.opacity='0';
    if (animRef.current) cancelAnimationFrame(animRef.current);
    let t0=null; const DUR=1100;
    const frame = ts => { if(!t0) t0=ts; const p=easeOut(Math.min((ts-t0)/DUR,1)); render(p); if(ts-t0<DUR) animRef.current=requestAnimationFrame(frame); };
    animRef.current = requestAnimationFrame(frame);
  }, [render]);

  useEffect(() => { startAnim(); }, [sensorHistory, startAnim]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => { if (animProgRef.current >= 1) render(1); });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [render]);

  const getHovDay = (mx) => {
    const wrap=wrapRef.current; if(!wrap) return -1;
    const data=getData(), W=wrap.clientWidth, PL=64, PR=24, cW=W-PL-PR, n=data.labels.length;
    const relX=mx-PL; let nearest=-1, minD=Infinity;
    for(let i=0;i<n;i++){const x=i*(cW/(n-1)),d=Math.abs(relX-x);if(d<minD){minD=d;nearest=i;}}
    return minD<cW/n?nearest:-1;
  };

  const showTip = (dayIdx) => {
    const tip=tipRef.current, line=lineRef.current, wrap=wrapRef.current;
    if (!tip||!wrap) return;
    if (dayIdx<0) { tip.style.opacity='0'; if(line) line.style.opacity='0'; return; }
    const data=getData();
    tip.querySelector('.rr-wt-date').textContent=data.labels[dayIdx];
    tip.querySelector('.rr-wt-mq2').textContent=data.mq2[dayIdx]+' PPM';
    tip.querySelector('.rr-wt-mq3').textContent=data.mq3[dayIdx]+' PPM';
    tip.querySelector('.rr-wt-mq4').textContent=data.mq4[dayIdx]+' PPM';
    const W=wrap.clientWidth, PL=64, PR=24, cW=W-PL-PR, n=data.labels.length;
    const x=PL+dayIdx*(cW/(n-1));
    if (line) { line.style.left=x+'px'; line.style.opacity='1'; }
    const tipW=145; let left=x+14; if(left+tipW>W-10) left=x-tipW-10; left=Math.max(8,left);
    tip.style.left=left+'px'; tip.style.top='18px'; tip.style.opacity='1';
  };

  const handleMouseMove = e => {
    const rect=canvasRef.current?.getBoundingClientRect(); if(!rect) return;
    const mx=e.clientX-rect.left, dayIdx=getHovDay(mx);
    if (dayIdx!==hovRef.current) { hovRef.current=dayIdx; if(animProgRef.current>=1) render(1); }
    showTip(dayIdx);
  };
  const handleMouseLeave = () => { hovRef.current=-1; if(tipRef.current) tipRef.current.style.opacity='0'; if(lineRef.current) lineRef.current.style.opacity='0'; if(animProgRef.current>=1) render(1); };

  return (
    <div ref={wrapRef} style={{position:'relative',width:'100%',flex:1,minHeight:240}}>
      <canvas ref={canvasRef} style={{position:'absolute',inset:0,width:'100%',height:'100%'}}
        onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />
      <div ref={tipRef} className="rr-wave-tip">
        <div className="rr-wave-tip-date rr-wt-date"></div>
        <div className="rr-wave-tip-row"><span className="rr-wave-tip-dot" style={{background:'#00082C'}}></span><span className="rr-wave-tip-label">MQ-2</span><span className="rr-wave-tip-val rr-wt-mq2">—</span></div>
        <div className="rr-wave-tip-row"><span className="rr-wave-tip-dot" style={{background:'#a2b8f5'}}></span><span className="rr-wave-tip-label">MQ-7</span><span className="rr-wave-tip-val rr-wt-mq7">—</span></div>
        <div className="rr-wave-tip-row"><span className="rr-wave-tip-dot" style={{background:'#5B6C9E'}}></span><span className="rr-wave-tip-label">MQ-4</span><span className="rr-wave-tip-val rr-wt-mq4">—</span></div>
      </div>
      <div ref={lineRef} style={{position:'absolute',top:20,bottom:44,width:1,background:'rgba(0,8,44,.10)',pointerEvents:'none',opacity:0,transition:'opacity .15s'}}></div>
    </div>
  );
}

/* ══ Week bars chart ══ */
function WeekBarsChart({ sensorHistory }) {
  const wrapRef   = useRef(null);
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const barRects  = useRef([]);
  const hovBar    = useRef(null);
  const tipRef    = useRef(null);

  const getData = useCallback(() => {
    if (!sensorHistory || sensorHistory.length === 0) {
      return { labels: [], values: [] };
    }
    // Agrupar datos por día de la semana (últimos 7 días)
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const now = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      last7Days.push(days[d.getDay()]);
    }
    
    // Contar alertas por día (valores > alert threshold)
    const alertCounts = last7Days.map(() => 0);
    sensorHistory.forEach(h => {
      const d = new Date(h.timestamp);
      const dayIndex = (now.getDate() - d.getDate()) % 7;
      if (dayIndex >= 0 && dayIndex < 7) {
        // Contar como alerta si algún sensor está en nivel alto
        if (h.mq2 > 300 || h.mq7 > 250 || h.mq4 > 380) {
          alertCounts[6 - dayIndex]++;
        }
      }
    });
    
    return { labels: last7Days, values: alertCounts };
  }, [sensorHistory]);

  const render = useCallback((p, hov) => {
    const wrap=wrapRef.current, canvas=canvasRef.current;
    if (!wrap||!canvas) return;
    const dpr=window.devicePixelRatio||1;
    const {labels,values}=getData();
    const maxVal=Math.max(...values)+1;
    const W=wrap.clientWidth||560, H=wrap.clientHeight||220;
    canvas.width=W*dpr; canvas.height=H*dpr;
    canvas.style.width=W+'px'; canvas.style.height=H+'px';
    const ctx=canvas.getContext('2d'); ctx.scale(dpr,dpr);
    ctx.clearRect(0,0,W,H); barRects.current=[];
    const PL=30,PR=14,PT=14,PB=34,cW=W-PL-PR,cH=H-PT-PB,n=labels.length,grp=cW/n;
    const bW=Math.min(grp*0.55,52);
    ctx.font=`10px 'DM Sans',system-ui,sans-serif`;
    for(let i=0;i<=4;i++){
      const v=Math.ceil(maxVal/4*i), y=PT+cH-(v/maxVal)*cH;
      ctx.beginPath(); ctx.moveTo(PL,y); ctx.lineTo(PL+cW,y);
      ctx.strokeStyle=i===0?'rgba(0,8,44,.14)':'rgba(0,8,44,.06)'; ctx.lineWidth=0.5; ctx.stroke();
      ctx.fillStyle='rgba(0,8,44,.28)'; ctx.textAlign='right'; ctx.textBaseline='middle';
      ctx.fillText(v,PL-5,y);
    }
    const rRect=(x,y,w,h,r,color)=>{
      if(h<1) return; r=Math.min(r,h/2,w/2);
      ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
      ctx.quadraticCurveTo(x+w,y,x+w,y+r); ctx.lineTo(x+w,y+h); ctx.lineTo(x,y+h);
      ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
      ctx.fillStyle=color; ctx.fill();
    };
    labels.forEach((lbl,i)=>{
      const cx=PL+i*grp+grp/2, val=values[i], h=(val/maxVal)*cH*p, x=cx-bW/2, y=PT+cH-h;
      const isH=hov===i;
      rRect(x,y,bW,h,8,isH?'#00082C':'#2E3552');
      barRects.current.push({x,y,w:bW,h,label:lbl,value:val,i});
      ctx.fillStyle=isH?'rgba(0,8,44,.55)':'rgba(0,8,44,.35)'; ctx.textAlign='center'; ctx.textBaseline='top';
      ctx.font=`10.5px 'DM Sans',system-ui,sans-serif`;
      ctx.fillText(lbl,cx,PT+cH+8);
      if(p>=0.98&&val>0){
        ctx.fillStyle=isH?'rgba(0,8,44,.80)':'rgba(0,8,44,.45)';
        ctx.font=`600 11px 'DM Sans',system-ui,sans-serif`;
        ctx.textAlign='center'; ctx.textBaseline='bottom';
        ctx.fillText(val,cx,y-3);
      }
    });
  }, [getData]);

  const startAnim = useCallback(() => {
    hovBar.current=null;
    if(animRef.current) cancelAnimationFrame(animRef.current);
    let t0=null; const DUR=850;
    const frame=ts=>{ if(!t0) t0=ts; render(easeOut(Math.min((ts-t0)/DUR,1)),null); if(ts-t0<DUR) animRef.current=requestAnimationFrame(frame); };
    animRef.current=requestAnimationFrame(frame);
  }, [render]);

  useEffect(()=>{ startAnim(); },[sensorHistory,startAnim]);

  useEffect(()=>{
    const wrap=wrapRef.current; if(!wrap) return;
    const ro=new ResizeObserver(()=>render(1,hovBar.current));
    ro.observe(wrap); return ()=>ro.disconnect();
  },[render]);

  const getHov=(mx,my)=>{
    const rect=canvasRef.current?.getBoundingClientRect(); if(!rect) return null;
    const cx=mx-rect.left,cy=my-rect.top;
    const wrap=wrapRef.current; if(!wrap) return null;
    const H=wrap.clientHeight||220;
    for(const b of barRects.current) if(cx>=b.x&&cx<=b.x+b.w&&cy>=0&&cy<=H) return b.i;
    return null;
  };

  useEffect(() => {
    const tip = document.createElement('div');
    tip.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;opacity:0;transition:opacity .12s;';
    document.body.appendChild(tip);
    tipRef.current = tip;
    return () => { tip.remove(); tipRef.current = null; };
  }, []);

  const handleMouseMove=e=>{
    const b=getHov(e.clientX,e.clientY);
    if(b!==hovBar.current){ hovBar.current=b; render(1,hovBar.current); }
    const tip=tipRef.current; if(!tip) return;
    if(b!==null){
      const bar=barRects.current.find(r=>r.i===b);
      tip.textContent=`${bar.label}: ${bar.value} alertas`;
      tip.style.cssText=`position:fixed;pointer-events:none;z-index:9999;background:rgba(0,8,44,.88);color:rgba(255,255,255,.95);font-family:'DM Sans',system-ui,sans-serif;font-size:11.5px;font-weight:500;padding:6px 11px;border-radius:8px;white-space:nowrap;box-shadow:0 4px 16px rgba(0,8,44,.25);opacity:0;left:0px;top:0px;transition:opacity .12s;`;
      const tipW=tip.offsetWidth||140, tipH=tip.offsetHeight||32;
      const vw=window.innerWidth, vh=window.innerHeight, margin=10;
      let left=e.clientX+14;
      if(left+tipW+margin>vw) left=e.clientX-tipW-14;
      left=Math.max(margin,Math.min(left,vw-tipW-margin));
      let top=e.clientY-tipH-8;
      if(top<margin) top=e.clientY+16;
      top=Math.max(margin,Math.min(top,vh-tipH-margin));
      tip.style.left=left+'px'; tip.style.top=top+'px'; tip.style.opacity='1';
    } else { tip.style.opacity='0'; }
  };
  const handleMouseLeave=()=>{ hovBar.current=null; render(1,null); if(tipRef.current) tipRef.current.style.opacity='0'; };

  return (
    <div ref={wrapRef} className="rr-chart-area" style={{minHeight:240}}>
      <canvas ref={canvasRef} style={{position:'absolute',inset:0,width:'100%',height:'100%'}}
        onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}/>
    </div>
  );
}

/* ══ Table ══ */
function ReportTable({ sensorHistory }) {
  const [page, setPage]           = useState(1);
  const [filterStatus, setFS]     = useState('');
  const [pendingFS, setPFS]       = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const hasFilter = !!filterStatus;
  const panelRef = useRef(null);
  const btnRef = useRef(null);
  const panelDivRef = useRef(null);
  const [panelStyle, setPanelStyle] = useState({});

  useEffect(()=>{
    const h=e=>{ if(panelRef.current&&!panelRef.current.contains(e.target)) setPanelOpen(false); };
    document.addEventListener('click',h); return ()=>document.removeEventListener('click',h);
  },[]);

  useEffect(()=>{
    const onScroll = () => {
      if(!panelOpen || !btnRef.current || !panelDivRef.current) return;
      const b = btnRef.current.getBoundingClientRect();
      const panelW = Math.min(290, window.innerWidth - 24);
      const left = Math.max(12, b.right - panelW);
      panelDivRef.current.style.top = (b.bottom + 6) + "px";
      panelDivRef.current.style.left = left + "px";
    };
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll, true); window.removeEventListener('resize', onScroll); };
  },[panelOpen]);

  const tableData = buildReportRows(sensorHistory).map(row => ({
    name: row.Dispositivo,
    status: row.Estado,
    mq2: row['MQ-2'],
    mq7: row['MQ-7'],
    mq4: row['MQ-4'],
    fecha: row.Fecha,
    hora: row.Hora,
  }));

  const filtered = tableData.filter(d => {
    const okS = !filterStatus || d.status===filterStatus;
    return okS;
  });
  const total=filtered.length, totalPages=Math.max(1,Math.ceil(total/TBL_PAGE_SIZE));
  const safePage=Math.min(page,totalPages), start=(safePage-1)*TBL_PAGE_SIZE, end=Math.min(start+TBL_PAGE_SIZE,total);
  const slice=filtered.slice(start,end);

  const applyFilters=()=>{ setFS(pendingFS); setPage(1); setPanelOpen(false); };
  const clearFilters=()=>{ setFS(''); setPFS(''); setPage(1); setPanelOpen(false); };

  return (
    <div className="rr-card">
      <div className="rr-card-head" style={{padding:'20px 24px 16px'}}>
        <div>
          <div className="rr-ch-title" style={{fontSize:15,fontWeight:500,letterSpacing:'-.02em'}}>Registro histórico</div>
          <div className="rr-ch-sub">Detecciones registradas por dispositivo</div>
        </div>
        <div className="rr-ch-space"/>
        <div ref={panelRef} className="rr-tbl-filter-wrap">
          <button ref={btnRef} className={`rr-tbl-filter-btn${hasFilter?' has-filter':''}`} onClick={()=>{
            if(btnRef.current){
              const b = btnRef.current.getBoundingClientRect();
              const panelW = Math.min(290, window.innerWidth - 24);
              const left = Math.max(12, b.right - panelW);
              setPanelStyle({position:'fixed',top:b.bottom+6,left,width:panelW,zIndex:9999});
            }
            setPanelOpen(p=>!p);
          }}>
            <IcoFilter /> Filtrar <span className="rr-tbl-filter-dot"/>
          </button>
          <div ref={panelDivRef} className={`rr-filter-panel${panelOpen?' open':''}`} style={panelOpen ? panelStyle : {}}>
            <div className="rr-fp-title">Filtros</div>
            <div className="rr-fp-group" style={{marginBottom:0}}>
              <label className="rr-fp-label">Estado</label>
              <select className="rr-fp-select" value={pendingFS} onChange={e=>setPFS(e.target.value)}>
                <option value="">Todos los estados</option>
                <option value="Seguro">Seguro</option>
                <option value="Precaución">Precaución</option>
                <option value="Alerta">Alerta</option>
              </select>
            </div>
            <div className="rr-fp-divider"/>
            <div className="rr-fp-actions">
              <button className="rr-fp-btn-apply" onClick={applyFilters}>Aplicar</button>
              <button className="rr-fp-btn-clear" onClick={clearFilters}>Limpiar</button>
            </div>
          </div>
        </div>
      </div>
      {/* CAMBIO 2: minHeight:300 garantiza espacio mínimo para el panel aunque haya pocos o ningún resultado */}
      <div className="rr-card-body" style={{padding:0, minHeight:300}}>
        {/* Desktop table */}
        <div className="rr-tbl-wrap">
          <table>
            <thead><tr><th>Dispositivo</th><th>Estado</th><th>MQ-2</th><th>MQ-7</th><th>MQ-4</th><th>Fecha</th><th>Hora</th></tr></thead>
            <tbody>
              {slice.length===0
                ? <tr><td colSpan={7} style={{textAlign:'center',color:'var(--i24)',padding:'120px 24px',fontSize:12.5}}>Sin resultados para los filtros aplicados</td></tr>
                : slice.map((dev,i)=>(
                  <tr key={i}>
                    <td style={{fontSize:12.5,color:'var(--i50)'}}>{dev.name}</td>
                    <td><span className={`rr-tbl-status ${statusClass(dev.status)}`}>{dev.status}</span></td>
                    <td style={{fontSize:12.5,color:'var(--i50)'}}>{dev.mq2}</td>
                    <td style={{fontSize:12.5,color:'var(--i50)'}}>{dev.mq7}</td>
                    <td style={{fontSize:12.5,color:'var(--i50)'}}>{dev.mq4}</td>
                    <td style={{fontSize:12.5,color:'var(--i50)'}}>{dev.fecha}</td>
                    <td style={{fontSize:12.5,color:'var(--i50)'}}>{dev.hora}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        {/* Mobile cards */}
        <div className="rr-dev-cards-list">
          {slice.length===0
            ? <div style={{textAlign:'center',color:'var(--i24)',padding:'120px 16px',fontSize:12.5}}>Sin resultados para los filtros aplicados</div>
            : slice.map((dev,i)=>(
              <div key={i} className="rr-dev-card" style={{animationDelay:(i*0.05)+'s'}}>
                <div className="rr-dc-top">
                  <div className="rr-dc-av">{getInitials(dev.name)}</div>
                  <div className="rr-dc-av-info">
                    <div className="rr-dc-name" onClick={e=>e.currentTarget.classList.toggle('expanded')}>{dev.name}</div>
                    <div className="rr-dc-sub">Sensor ambiental</div>
                  </div>
                  <div className="rr-dc-status-wrap"><span className={`rr-dc-pill ${statusClass(dev.status)}`}>{dev.status}</span></div>
                </div>
                <div className="rr-dc-fields">
                  <div><div className="rr-dc-flabel">MQ-2</div><div className="rr-dc-fval">{dev.mq2}</div></div>
                  <div><div className="rr-dc-flabel">MQ-7</div><div className="rr-dc-fval">{dev.mq7}</div></div>
                  <div><div className="rr-dc-flabel">MQ-4</div><div className="rr-dc-fval">{dev.mq4}</div></div>
                  <div><div className="rr-dc-flabel">Registro</div><div className="rr-dc-fval">{dev.fecha}</div></div>
                </div>
                <div className="rr-dc-divider"/>
                <div className="rr-dc-meta">
                  <IcoClock/><span>{dev.fecha}</span><span className="rr-dc-meta-sep"/><span>{dev.hora}</span>
                </div>
              </div>
            ))
          }
        </div>
        {/* Pagination */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 24px',borderTop:'0.5px solid var(--i07)'}}>
          <span style={{fontSize:11.5,color:'var(--i40)'}}>
            {total>0?`Mostrando ${start+1}–${end} de ${total} registro${total!==1?'s':''}`:'Sin resultados'}
          </span>
          <div style={{display:'flex',gap:6}}>
            <button className="rr-tbl-pg-btn" disabled={safePage<=1} onClick={()=>setPage(p=>p-1)}>←</button>
            {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
              <button key={p} className={`rr-tbl-pg-btn${p===safePage?' active':''}`} onClick={()=>setPage(p)}>{p}</button>
            ))}
            <button className="rr-tbl-pg-btn" disabled={safePage>=totalPages} onClick={()=>setPage(p=>p+1)}>→</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ MAIN ══ */
export default function RilAmbReportes() {
  const navigate = useNavigate();
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasDevice,   setHasDevice]    = useState(false);
  const [loading,     setLoading]      = useState(true);
  const [sensorHistory, setSensorHistory] = useState([]);
  const [reportSummary, setReportSummary] = useState(DEFAULT_REPORT_SUMMARY);
  const [userData, setUserData] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/session-logo', { replace: true, state: { next: '/' } });
  };

  const handleExportExcel = () => {
    if (!sensorHistory.length) return;

    const rows = buildReportRows(sensorHistory);
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');

    worksheet['!cols'] = [
      { wch: 18 },
      { wch: 14 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 14 },
      { wch: 10 },
    ];

    const fileName = `reporte_usuario_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  useEffect(()=>{
    const h=e=>{ if(!e.target.closest('.rr-sb-footer')) setDropdownOpen(false); };
    document.addEventListener('click',h); return ()=>document.removeEventListener('click',h);
  },[]);

  /* Load sensor history from API */
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const [historyResult, summaryResult] = await Promise.allSettled([
          getSensorHistory(100), // Get last 100 readings
          getReportSummary(),
        ]);

        const history = historyResult.status === "fulfilled" ? historyResult.value : [];
        const summary = summaryResult.status === "fulfilled" ? summaryResult.value : DEFAULT_REPORT_SUMMARY;

        setSensorHistory(Array.isArray(history) ? history : []);
        setReportSummary(summary);
        setHasDevice((summary.linked_devices_count || 0) > 0 || (Array.isArray(history) && history.length > 0));
      } catch (error) {
        console.error('Error al cargar historial de sensores:', error);
        setHasDevice(false);
        setSensorHistory([]);
        setReportSummary(DEFAULT_REPORT_SUMMARY);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
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

  return (
    <div style={{minHeight:'100vh',background:'var(--page)',fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,
        background:'radial-gradient(ellipse 70% 50% at 8% 4%,rgba(0,8,44,.04) 0%,transparent 55%),radial-gradient(ellipse 55% 40% at 94% 92%,rgba(0,8,44,.032) 0%,transparent 55%)'}}/>

      <div className={`rr-overlay${sidebarOpen?' open':''}`} onClick={()=>setSidebarOpen(false)}/>

      <aside className={`rr-sidebar${sidebarOpen?' open':''}`}>
        <div className="rr-sb-brand">
          <div className="rr-sb-mark">
            <img src={whiteLogo} alt="RilAmb" style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
          </div>
          <div><div className="rr-sb-name">RilAmb</div><div className="rr-sb-tag">Platform</div></div>
          <button className="rr-sb-close" onClick={()=>setSidebarOpen(false)}><IcoX/></button>
        </div>
        <nav className="rr-sb-nav">
          <button className="rr-sb-item" onClick={() => navigate('/dashboard')}><IcoMonitor/><span>Monitoreo</span></button>
          <button className="rr-sb-item active"><IcoFile/><span>Reportes</span></button>
          <button className="rr-sb-item" onClick={() => navigate('/devices')}><IcoDevice/><span>Dispositivos</span></button>
        </nav>
        <div className="rr-sb-footer">
          <div className="rr-sb-profile" onClick={()=>setDropdownOpen(p=>!p)}>
            <div className="rr-sb-av">{loading ? '...' : (userData?.nombre?.[0] || 'U')}</div>
            <div><div className="rr-sb-pname">{userData?.nombre || 'Usuario'}</div><div className="rr-sb-prole">Cuenta personal</div></div>
            <span className="rr-sb-dots"><IcoDots/></span>
          </div>
          <div className={`rr-sb-dropdown${dropdownOpen?' open':''}`}>
            <button className="rr-sb-dd-item" onClick={() => navigate('/perfil')}><IcoUser/><span>Ver perfil</span></button>
            <div className="rr-sb-divider"/>
            <button
              className="rr-sb-dd-item"
              onClick={() => {
                setDropdownOpen(false);
                setSidebarOpen(false);
                navigate('/perfil', { state: { section: 'seguridad' } });
              }}
            >
              <IcoLock/><span>Cambiar contraseña</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="rr-layout">
        <div className="rr-content">
          <header className="rr-topbar">
            <button className="rr-tb-hamburger" onClick={()=>setSidebarOpen(true)}><IcoMenu/></button>
            <div className="rr-tb-bc">
              <span className="rr-tb-bc-root">RilAmb</span>
              <span className="rr-tb-bc-sep">/</span>
              <span className="rr-tb-bc-cur">Reporte General del Sistema</span>
            </div>
            <div className="rr-tb-space"/>
            <button className="rr-tb-ico" onClick={handleExportExcel} title="Exportar a Excel" aria-label="Exportar a Excel">
              <IcoDownload/>
            </button>
            <NotificationBell />
            <button className="rr-tb-avatar" onClick={handleLogout}><IcoLogout/></button>
          </header>

          <main className="rr-page">
            <div className="rr-ph">
              <div className="rr-ph-left">
                <h1>Reporte General del Sistema</h1>
                <p>Análisis global de todos los dispositivos vinculados · Historial acumulado</p>
              </div>
            </div>

            {!hasDevice && !loading && (
              <div style={{textAlign:'center',padding:'80px 24px',color:'var(--i40)'}}>
                <div style={{fontSize:48,marginBottom:'16px'}}>📊</div>
                <div style={{fontSize:16,fontWeight:500,marginBottom:'8px'}}>No hay dispositivo vinculado</div>
                <div style={{fontSize:13.5}}>Vincula un dispositivo en la sección de Dispositivos para ver reportes</div>
              </div>
            )}

            {hasDevice && (
            <>
            <div>
              <div className="rr-sec-label">Resumen global</div>
              <div style={{height:10}}/>
              <div className="rr-stat-grid">
                <div className="rr-stat-card" style={{animation:'fadeUp .4s .06s cubic-bezier(.4,0,.2,1) both'}}>
                  <div className="rr-sc-top">
                    <div className="rr-sc-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1.7"/><circle cx="17" cy="9.5" r="0.95"/><circle cx="7" cy="14.5" r="0.95"/><circle cx="16.5" cy="16" r="0.95"/><line x1="13.3" y1="11.1" x2="16.1" y2="10"/><line x1="7.9" y1="13.7" x2="10.7" y2="12.6"/><line x1="13.2" y1="13.1" x2="15.6" y2="15.2"/></svg>
                    </div>
                    <span className="rr-sc-trend">{pluralize(reportSummary.linked_devices_count, 'activo', 'activos')}</span>
                  </div>
                  <div className="rr-sc-bottom">
                    <div><span className="rr-sc-val">{reportSummary.linked_devices_count}</span></div>
                    <div className="rr-sc-label">Dispositivos vinculados</div>
                  </div>
                </div>
                <div className="rr-stat-card" style={{animation:'fadeUp .4s .12s cubic-bezier(.4,0,.2,1) both'}}>
                  <div className="rr-sc-top">
                    <div className="rr-sc-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </div>
                    <span className="rr-sc-trend">{pluralize(reportSummary.total_alerts_count, 'alerta', 'alertas')}</span>
                  </div>
                  <div className="rr-sc-bottom">
                    <div><span className="rr-sc-val">{reportSummary.total_alerts_count}</span></div>
                    <div className="rr-sc-label">N° total de alertas</div>
                  </div>
                </div>
                <div className="rr-stat-card" style={{animation:'fadeUp .4s .18s cubic-bezier(.4,0,.2,1) both'}}>
                  <div className="rr-sc-top">
                    <div className="rr-sc-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                    </div>
                    <span className="rr-sc-trend">{pluralize(reportSummary.top_device_alerts, 'alerta', 'alertas')}</span>
                  </div>
                  <div className="rr-sc-bottom">
                    <div><span className="rr-sc-val" style={{fontSize:20,letterSpacing:'-.02em'}}>{reportSummary.top_device_label || 'Sin datos'}</span></div>
                    <div className="rr-sc-label">Dispositivo con más alertas</div>
                  </div>
                </div>
                <div className="rr-stat-card" style={{animation:'fadeUp .4s .24s cubic-bezier(.4,0,.2,1) both'}}>
                  <div className="rr-sc-top">
                    <div className="rr-sc-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    </div>
                    <span className="rr-sc-trend">{reportSummary.top_day_alerts > 0 ? pluralize(reportSummary.top_day_alerts, 'alerta', 'alertas') : 'Sin datos'}</span>
                  </div>
                  <div className="rr-sc-bottom">
                    <div><span className="rr-sc-val" style={{fontSize:20,letterSpacing:'-.02em'}}>{reportSummary.top_day_label || 'Sin datos'}</span></div>
                    <div className="rr-sc-label">Día con más alertas</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rr-charts-duo">
              <div>
                <div className="rr-sec-label">Reporte por gas · esta semana</div>
                <div style={{height:10}}/>
                <div className="rr-card">
                  <div className="rr-card-head" style={{flexWrap:'wrap',gap:10,padding:'16px 18px 13px'}}>
                    <div>
                      <div className="rr-ch-title" style={{fontSize:13.5,fontWeight:600,letterSpacing:'-.02em'}}>Niveles promedio por gas</div>
                      <div className="rr-ch-sub" style={{marginTop:2}}>Tendencias semanales por sensor</div>
                    </div>
                    <div className="rr-ch-space"/>
                    <div className="rr-ppm-legend">
                      <span className="rr-ppm-leg-item"><span className="rr-ppm-leg-dot" style={{background:'#00082C',boxShadow:'0 0 0 3px rgba(0,8,44,.15)'}}/> MQ-2</span>
                      <span className="rr-ppm-leg-item"><span className="rr-ppm-leg-dot" style={{background:'#a2b8f5',boxShadow:'0 0 0 3px rgba(162,184,245,.15)'}}/> MQ-7</span>
                      <span className="rr-ppm-leg-item"><span className="rr-ppm-leg-dot" style={{background:'#5B6C9E',boxShadow:'0 0 0 3px rgba(91,108,158,.15)'}}/> MQ-4</span>
                    </div>
                  </div>
                  <div style={{padding:'4px 0 0',flex:1,display:'flex',flexDirection:'column',minHeight:240}}>
                    <WaveChart sensorHistory={sensorHistory}/>
                  </div>
                </div>
              </div>
              <div>
                <div className="rr-sec-label">Alertas de la semana</div>
                <div style={{height:10}}/>
                <div className="rr-card">
                  <div className="rr-card-head">
                    <div>
                      <div className="rr-ch-title">Alertas de la semana</div>
                      <div className="rr-ch-sub">Total de alertas por día esta semana</div>
                    </div>
                  </div>
                  <div className="rr-card-body">
                    <WeekBarsChart sensorHistory={sensorHistory}/>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="rr-sec-label">Dispositivos</div>
              <div style={{height:10}}/>
              <ReportTable sensorHistory={sensorHistory}/>
            </div>
            </>)}
          </main>
        </div>
      </div>
    </div>
  );
}