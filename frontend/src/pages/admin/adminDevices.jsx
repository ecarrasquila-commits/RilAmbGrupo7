// COMENTARIOS
  // barra de desplazamiento cortada 

  import { useState, useEffect, useRef, useCallback } from "react";
  import { useNavigate } from "react-router-dom";
  import whiteLogo from "../../assets/whiteLogo.png";
  import { logout } from "../../services/authService";

  /*
    REGLAS APLICADAS:
    1. Sidebar y overlay: hijos DIRECTOS del root, FUERA de .ra-layout
    2. .ra-layout: sin overflow:hidden
    3. Fondo degradado: <div> real con position:fixed, NO ::before
    4. Sidebar base: sin backdrop-filter ni bg semitransparente → solo en @media(min-width:961px)
    5. Solo lo que estaba en el HTML original, nada añadido
  */

  const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --ink:#00082C;--i70:rgba(0,8,44,.70);--i50:rgba(0,8,44,.50);--i40:rgba(0,8,44,.40);
    --i24:rgba(0,8,44,.24);--i16:rgba(0,8,44,.16);--i10:rgba(0,8,44,.10);
    --i07:rgba(0,8,44,.07);--i04:rgba(0,8,44,.04);
    --page:#F0F0F4;--card:rgba(255,255,255,.82);--card-hi:rgba(255,255,255,.96);
    --green:#0C8A5A;--green-t:rgba(12,138,90,.10);
    --amber:#9A6214;--amber-t:rgba(154,98,20,.10);
    --red:#C0392B;--red-t:rgba(192,57,43,.10);
    --blue:#00082c;--blue-t:rgba(29,78,216,.10);
    --muted:rgba(0,8,44,.30);--muted-t:rgba(0,8,44,.07);
    --r:22px;--r-md:13px;--r-sm:9px;--r-xs:6px;
    --shadow:0 1px 1px rgba(0,8,44,.02),0 2px 4px rgba(0,8,44,.03),0 8px 24px rgba(0,8,44,.05),0 32px 64px rgba(0,8,44,.07);
    --sb-w:250px;--tb-h:62px;
  }
  html,body{min-height:100vh;width:100%;font-family:'DM Sans',system-ui,sans-serif;background:var(--page);color:var(--ink);-webkit-font-smoothing:antialiased;overflow-x:hidden;}

  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes blockIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
  @keyframes toastIn{from{opacity:0;transform:translateY(10px) scale(.95)}to{opacity:1;transform:none}}
  @keyframes toastOut{to{opacity:0;transform:translateY(6px) scale(.96)}}

  /* Overlay */
  .ra-overlay{display:none;position:fixed;inset:0;z-index:40;background:rgba(0,8,44,.50);animation:fadeIn .22s ease;}
  .ra-overlay.open{display:block;}

  /* Layout */
  .ra-layout{display:flex;min-height:100vh;position:relative;z-index:1;}

  /* Sidebar — sin backdrop ni rgba base */
  .ra-sidebar{width:var(--sb-w);background:#f5f5f9;border-right:0.5px solid var(--i07);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;height:100%;z-index:30;transition:transform .28s cubic-bezier(.4,0,.2,1);overflow-y:auto;}
  @media(min-width:961px){
    .ra-sidebar{background:rgba(255,255,255,.74);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);box-shadow:1px 0 0 rgba(255,255,255,.60),2px 0 12px rgba(0,8,44,.04);}
  }
  .ra-sidebar::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.90) 50%,transparent);pointer-events:none;}
  .ra-sidebar.open{transform:translateX(0)!important;}
  .ra-sb-brand{padding:26px 20px 22px;display:flex;align-items:center;gap:11px;}
  .ra-sb-close{display:none;margin-left:auto;width:28px;height:28px;border-radius:8px;border:0.5px solid var(--i10);background:var(--i04);align-items:center;justify-content:center;cursor:pointer;color:var(--i40);flex-shrink:0;}
  .ra-sb-mark{width:32px;height:32px;background:var(--ink);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 8px rgba(0,8,44,.22),inset 0 1px 0 rgba(255,255,255,.10);}
  .ra-sb-name{font-size:15px;font-weight:600;letter-spacing:-.02em;}
  .ra-sb-tag{font-size:9px;font-weight:500;color:var(--i40);letter-spacing:.09em;text-transform:uppercase;margin-top:1px;}
  .ra-sb-nav{padding:18px 13px;flex:1;}
  .ra-sb-item{display:flex;align-items:center;gap:10px;height:38px;padding:0 11px;border-radius:var(--r-xs);border:0.5px solid transparent;cursor:pointer;transition:all .17s;margin-bottom:2px;text-decoration:none;color:inherit;position:relative;background:none;width:100%;}
  .ra-sb-item svg{color:var(--i40);flex-shrink:0;transition:color .17s;}
  .ra-sb-item span{font-size:12.5px;color:var(--i50);transition:color .17s;}
  .ra-sb-item:hover{background:var(--i04);border-color:var(--i07);}
  .ra-sb-item:hover svg,.ra-sb-item:hover span{color:var(--i70);}
  .ra-sb-item.active{background:var(--i07);border-color:var(--i10);}
  .ra-sb-item.active span{color:var(--ink);font-weight:500;}
  .ra-sb-item.active svg{color:var(--ink);}
  .ra-sb-item.active::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:2.5px;height:16px;background:var(--ink);border-radius:0 3px 3px 0;opacity:.55;}
  .ra-sb-footer{padding:14px 13px;border-top:0.5px solid var(--i07);position:relative;}
  .ra-sb-profile{display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:var(--r-xs);border:0.5px solid transparent;cursor:pointer;transition:all .17s;}
  .ra-sb-profile:hover{background:var(--i04);border-color:var(--i07);}
  .ra-sb-av{width:32px;height:32px;border-radius:8px;background:var(--i07);border:0.5px solid var(--i10);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:var(--i70);flex-shrink:0;}
  .ra-sb-pname{font-size:12px;font-weight:500;color:var(--i70);}
  .ra-sb-prole{font-size:10px;color:var(--i40);margin-top:1px;}
  .ra-sb-dots{margin-left:auto;color:var(--i24);}
  .ra-sb-dropdown{display:none;position:absolute;bottom:100%;left:14px;right:14px;margin-bottom:8px;background:var(--card);border:0.5px solid var(--i10);border-radius:var(--r-sm);box-shadow:0 4px 16px rgba(0,8,44,.12);overflow:hidden;z-index:40;animation:fadeUp .2s ease both;}
  .ra-sb-dropdown.open{display:block;}
  .ra-sb-dd-item{display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;transition:background .17s;text-decoration:none;color:inherit;background:none;border:none;width:100%;}
  .ra-sb-dd-item:hover{background:var(--i04);}
  .ra-sb-dd-item svg{width:14px;height:14px;color:var(--i40);flex-shrink:0;}
  .ra-sb-dd-item span{font-size:12px;color:var(--i50);}
  .ra-sb-dd-item:hover svg,.ra-sb-dd-item:hover span{color:var(--i70);}
  .ra-sb-divider{height:0.5px;background:var(--i07);}

  /* Topbar */
  .ra-content{margin-left:var(--sb-w);flex:1;display:flex;flex-direction:column;min-height:100vh;min-width:0;}
  .ra-topbar{height:var(--tb-h);background:rgba(240,240,244,.88);backdrop-filter:blur(24px) saturate(1.3);-webkit-backdrop-filter:blur(24px) saturate(1.3);border-bottom:0.5px solid var(--i07);position:fixed;top:0;left:var(--sb-w);right:17px;z-index:20;display:flex;align-items:center;padding:0 clamp(16px,4vw,36px);gap:12px;box-shadow:0 1px 0 rgba(255,255,255,.65),0 4px 16px rgba(0,8,44,.03);}
  .ra-tb-hamburger{display:none;width:36px;height:36px;border-radius:10px;border:0.5px solid var(--i10);background:rgba(255,255,255,.60);align-items:center;justify-content:center;cursor:pointer;color:var(--i50);flex-shrink:0;backdrop-filter:blur(6px);transition:all .17s;}
  .ra-tb-hamburger:hover{background:rgba(255,255,255,.88);border-color:var(--i16);color:var(--i70);}
  .ra-tb-bc{display:flex;align-items:center;gap:8px;}
  .ra-tb-bc-root{font-size:12px;color:var(--i40);}
  .ra-tb-bc-sep{font-size:11px;color:var(--i16);}
  .ra-tb-bc-cur{font-size:12.5px;font-weight:500;color:var(--i70);}
  .ra-tb-space{flex:1;}
  .ra-tb-search{position:relative;width:clamp(140px,20vw,240px);}
  .ra-tb-search input{width:100%;height:36px;background:rgba(255,255,255,.65);border:0.5px solid var(--i10);border-radius:10px;padding:0 14px 0 35px;font-family:inherit;font-size:12.5px;color:var(--ink);outline:none;backdrop-filter:blur(6px);transition:all .2s;}
  .ra-tb-search input::placeholder{color:var(--i24);}
  .ra-tb-search input:focus{background:var(--card-hi);border-color:var(--i40);box-shadow:0 0 0 3px rgba(0,8,44,.055);}
  .ra-tb-search-ico{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--i24);pointer-events:none;}
  .ra-tb-ico{width:36px;height:36px;border-radius:10px;border:0.5px solid var(--i10);background:rgba(255,255,255,.60);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--i50);transition:all .17s;backdrop-filter:blur(6px);position:relative;outline:none;flex-shrink:0;}
  .ra-tb-ico:hover{background:rgba(255,255,255,.88);border-color:var(--i16);color:var(--i70);}
  .ra-notif-dot{position:absolute;top:8px;right:8px;width:5px;height:5px;background:var(--ink);border-radius:50%;border:1.5px solid var(--page);}
  .ra-tb-avatar{width:34px;height:34px;border-radius:9px;background:var(--ink);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .17s;flex-shrink:0;border:0.5px solid transparent;outline:none;color:rgba(255,255,255,.75);}
  .ra-tb-avatar:hover{background:#1a2a5e;transform:translateY(-1px);}

  /* Page */
  .ra-page{padding:calc(var(--tb-h) + clamp(16px,3vw,32px)) clamp(16px,4vw,38px) 60px;flex:1;}
  .ra-ph{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:24px;}
  .ra-ph-left h1{font-size:clamp(20px,3vw,24px);font-weight:500;color:var(--ink);letter-spacing:-.03em;line-height:1.2;margin-bottom:5px;}
  .ra-ph-left p{font-size:13px;color:var(--i40);}

  /* Filter bar */
  .ra-bar{display:flex;align-items:center;gap:8px;margin-bottom:20px;flex-wrap:wrap;}
  .ra-fp{height:29px;padding:0 14px;border-radius:99px;border:0.5px solid var(--i10);background:rgba(255,255,255,.55);font-family:inherit;font-size:11.5px;font-weight:500;color:var(--i40);cursor:pointer;transition:all .16s;backdrop-filter:blur(6px);white-space:nowrap;}
  .ra-fp:hover{border-color:var(--i24);background:rgba(255,255,255,.80);color:var(--i70);}
  .ra-fp.on{background:var(--ink);border-color:var(--ink);color:rgba(255,255,255,.88);box-shadow:0 2px 8px rgba(0,8,44,.18);}

  /* Mobile search button — solo visible en <=480px */
  .ra-fp-search-mobile{display:none;}
  @media(max-width:480px){
    .ra-fp-search-mobile{display:inline-flex;align-items:center;}
  }

  /* Mobile inline search input */
  .ra-mobile-search-wrap{display:none;margin-bottom:14px;position:relative;animation:fadeUp .18s ease both;}
  .ra-mobile-search-wrap.visible{display:block;}
  .ra-mobile-search-wrap input{width:100%;height:36px;background:rgba(255,255,255,.85);border:0.5px solid var(--i16);border-radius:10px;padding:0 14px 0 35px;font-family:inherit;font-size:13px;color:var(--ink);outline:none;transition:all .2s;}
  .ra-mobile-search-wrap input::placeholder{color:var(--i24);}
  .ra-mobile-search-wrap input:focus{background:#fff;border-color:var(--i40);box-shadow:0 0 0 3px rgba(0,8,44,.055);}
  .ra-mobile-search-ico{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--i24);pointer-events:none;}

  /* Card */
  .ra-card{background:var(--card);border:0.5px solid rgba(0,8,44,.07);border-radius:var(--r);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);box-shadow:var(--shadow);overflow:hidden;position:relative;animation:fadeUp .4s .05s ease both;}
  .ra-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent 0%,rgba(0,8,44,.10) 25%,rgba(0,8,44,.18) 50%,rgba(0,8,44,.10) 75%,transparent 100%);pointer-events:none;z-index:2;}
  .ra-card-head{display:flex;align-items:center;padding:18px 28px 16px;gap:14px;border-bottom:0.5px solid var(--i07);background:rgba(255,255,255,.30);flex-wrap:wrap;}
  .ra-card-head-title{font-size:14px;font-weight:500;color:var(--ink);letter-spacing:-.02em;}
  .ra-card-head-sub{font-size:11.5px;color:var(--i40);margin-top:2px;}
  .ra-ch-space{flex:1;}
  .ra-ch-sort-btn{display:flex;align-items:center;gap:6px;height:32px;padding:0 13px;border-radius:var(--r-xs);border:0.5px solid var(--i10);background:rgba(255,255,255,.50);font-family:inherit;font-size:11.5px;font-weight:500;color:var(--i40);cursor:pointer;transition:all .16s;}
  .ra-ch-sort-btn:hover{border-color:var(--i24);background:rgba(255,255,255,.80);color:var(--i70);}

  /* Devices grid */
  .ra-devices-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:0;background:transparent;}

  /* Device block */
  .ra-device-block{background:rgba(255,255,255,.62);padding:20px 24px;display:flex;align-items:center;gap:18px;position:relative;transition:background .18s ease,box-shadow .18s ease;cursor:default;overflow:hidden;animation:blockIn .35s ease both;border-bottom:0.5px solid var(--i07);border-right:0.5px solid var(--i07);}
  .ra-device-block:last-child{border-right:none;}
  .ra-device-block.last-row{border-bottom:none;}
  .ra-device-block::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.18) 0%,transparent 60%);pointer-events:none;opacity:0;transition:opacity .2s;}
  .ra-device-block:hover{background:#f1f3f5;}
  .ra-device-block:hover::before{opacity:1;}
  .ra-device-block:nth-child(1){animation-delay:.04s}
  .ra-device-block:nth-child(2){animation-delay:.08s}
  .ra-device-block:nth-child(3){animation-delay:.12s}
  .ra-device-block:nth-child(4){animation-delay:.16s}
  .ra-device-block:nth-child(5){animation-delay:.20s}
  .ra-device-block:nth-child(6){animation-delay:.24s}
  .ra-device-block:nth-child(7){animation-delay:.28s}
  .ra-device-block:nth-child(8){animation-delay:.32s}

  /* Device icon orb */
  .ra-dev-orb{width:42px;height:42px;border-radius:13px;flex-shrink:0;background:var(--i04);border:0.5px solid var(--i10);display:flex;align-items:center;justify-content:center;color:var(--i40);position:relative;overflow:hidden;transition:background .18s,border-color .18s,color .18s;}
  .ra-dev-orb::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.35) 0%,transparent 55%);pointer-events:none;}
  .ra-dev-orb.active-orb{background:rgba(29,78,216,.08);border-color:rgba(29,78,216,.20);color:var(--blue);}
  .ra-dev-orb.inactive-orb{background:var(--i04);border-color:var(--i10);color:var(--i24);}
  .ra-device-block:hover .ra-dev-orb{background:var(--i07);border-color:var(--i16);color:var(--i70);}
  .ra-device-block:hover .ra-dev-orb.active-orb{background:#E6E9FC;border-color:#00082C;color:#00082C;}

  /* Device info */
  .ra-dev-info{flex:1;min-width:0;}
  .ra-dev-id{font-size:13px;font-weight:600;color:var(--ink);letter-spacing:-.015em;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .ra-dev-meta{display:flex;align-items:center;gap:7px;margin-top:5px;}
  .ra-dev-label{font-size:9.5px;font-weight:500;color:var(--i24);letter-spacing:.09em;text-transform:uppercase;}

  /* Pills */
  .ra-pill{display:inline-flex;align-items:center;gap:5px;height:22px;padding:0 9px;border-radius:99px;font-size:10.5px;font-weight:500;letter-spacing:.02em;transition:all .18s ease;flex-shrink:0;}
  .ra-pill::before{content:'';width:5px;height:5px;border-radius:50%;flex-shrink:0;}
  .ra-pill-active{background:#FCFCFD;color:#5B6C9E;border:0.5px solid #5B6C9E;}
  .ra-pill-active::before{background:var(--blue);box-shadow:0 0 0 2px rgba(29,78,216,.18);}
  .ra-pill-inactive{background:#F7F4F2;color:#A6A9B5;border:0.5px solid #F7F4F2;}
  .ra-pill-inactive::before{background:var(--i24);}
  .ra-device-block:hover .ra-pill-active{background:#E6E9FC;border-color:#00082C;color:#00082C;}
  .ra-device-block:hover .ra-pill-inactive{background:var(--i07);border-color:var(--i16);color:var(--i70);}

  /* Actions */
  .ra-dev-actions{display:flex;align-items:center;gap:6px;flex-shrink:0;}
  .ra-btn-inactivar{display:flex;align-items:center;gap:6px;height:32px;padding:0 13px;border-radius:9px;width:90px;border:0.5px solid var(--i10);background:var(--i04);font-family:inherit;font-size:11.5px;font-weight:500;color:var(--i24);cursor:pointer;transition:all .18s ease;white-space:nowrap;outline:none;flex-shrink:0;justify-content:center;}
  .ra-btn-inactivar:hover{background:var(--i07);border-color:var(--i16);color:var(--i70);transform:translateY(-1px);box-shadow:0 3px 10px rgba(0,8,44,.12);}
  .ra-btn-inactivar:active{transform:scale(.96);opacity:.8;}
  .ra-device-block:hover .ra-btn-inactivar{background:var(--i07);border-color:var(--i16);color:var(--i70);}
  .ra-btn-activar{display:flex;align-items:center;gap:6px;height:32px;padding:0 13px;border-radius:9px;width:90px;border:0.5px solid #00082C;background:#FCFCFD;font-family:inherit;font-size:11.5px;font-weight:500;color:#00082C;cursor:pointer;transition:all .18s ease;white-space:nowrap;outline:none;flex-shrink:0;justify-content:center;}
  .ra-btn-activar:hover{background:#FCFCFD;border-color:#00082C;transform:translateY(-1px);box-shadow:0 3px 10px rgba(0,8,44,.12);}
  .ra-btn-activar:active{transform:scale(.96);opacity:.8;}

  /* Empty state */
  .ra-empty-state{padding:72px 32px;display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;}
  .ra-empty-icon{width:48px;height:48px;background:var(--i04);border-radius:14px;border:0.5px solid var(--i07);display:flex;align-items:center;justify-content:center;color:var(--i24);margin-bottom:6px;}
  .ra-empty-title{font-size:14px;font-weight:500;color:var(--i70);}
  .ra-empty-desc{font-size:12.5px;color:var(--i40);}

  /* Card footer */
  .ra-card-foot{display:flex;align-items:center;justify-content:space-between;padding:14px 28px;border-top:0.5px solid var(--i07);background:rgba(255,255,255,.22);}
  .ra-cf-info{font-size:11.5px;color:var(--i40);}
  .ra-pag{display:flex;align-items:center;gap:5px;}
  .ra-pg{width:30px;height:30px;border-radius:var(--r-xs);border:0.5px solid var(--i10);background:rgba(255,255,255,.55);display:flex;align-items:center;justify-content:center;font-family:inherit;font-size:12px;font-weight:500;color:var(--i40);cursor:pointer;transition:all .15s;}
  .ra-pg:hover{border-color:var(--i24);background:rgba(255,255,255,.88);color:var(--i70);}
  .ra-pg.cur{background:var(--ink);border-color:var(--ink);color:rgba(255,255,255,.88);box-shadow:0 2px 8px rgba(0,8,44,.20);}
  .ra-pg:disabled{opacity:.28;cursor:not-allowed;}

  /* Modal */
  .ra-modal-backdrop{position:fixed;inset:0;z-index:100;background:rgba(0,8,44,.55);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;pointer-events:none;transition:opacity .22s ease;}
  .ra-modal-backdrop.open{opacity:1;pointer-events:all;}
  .ra-modal{background:#f5f5f9;border:0.5px solid rgba(0,8,44,.11);border-radius:20px;box-shadow:0 8px 32px rgba(0,8,44,.16),0 32px 80px rgba(0,8,44,.22);width:100%;max-width:420px;max-height:calc(100vh - 40px);overflow-y:auto;position:relative;transform:translateY(20px) scale(.97);transition:transform .28s cubic-bezier(.34,1.28,.64,1),opacity .22s ease;opacity:0;}
  .ra-modal-backdrop.open .ra-modal{transform:translateY(0) scale(1);opacity:1;}
  .ra-modal-header{display:flex;align-items:center;gap:14px;padding:22px 22px 18px;border-bottom:0.5px solid var(--i07);background:#f5f5f9;position:sticky;top:0;z-index:2;}
  .ra-modal-icon{width:40px;height:40px;border-radius:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:rgba(0,8,44,.05);border:0.5px solid var(--i07);}
  .ra-modal-title{font-size:15px;font-weight:600;color:var(--ink);letter-spacing:-.025em;}
  .ra-modal-subtitle{font-size:11.5px;color:var(--i40);margin-top:3px;}
  .ra-modal-close{margin-left:auto;flex-shrink:0;width:30px;height:30px;border-radius:9px;border:0.5px solid var(--i10);background:var(--i04);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--i40);transition:all .16s;}
  .ra-modal-close:hover{background:rgba(255,255,255,.88);border-color:var(--i24);color:var(--i70);}
  .ra-modal-close:active{transform:scale(.9);}
  .ra-confirm-center{display:flex;flex-direction:column;align-items:center;gap:10px;padding:28px 28px 20px;text-align:center;}
  .ra-confirm-icon-wrap{width:60px;height:60px;border-radius:18px;display:flex;align-items:center;justify-content:center;margin-bottom:4px;}
  .ra-confirm-icon-wrap.warn{background:#00082C;border:0.5px solid #F0F5FF;}
  .ra-confirm-icon-wrap.success{background:#00082C;border:0.5px solid #F0F5FF;}
  .ra-confirm-title{font-size:16px;font-weight:600;color:var(--ink);letter-spacing:-.025em;}
  .ra-confirm-desc{font-size:12.5px;color:var(--i50);line-height:1.55;max-width:300px;}
  .ra-modal-footer{display:flex;align-items:center;gap:10px;justify-content:center;padding:16px 22px;border-top:0.5px solid var(--i07);background:#f5f5f9;position:sticky;bottom:0;z-index:2;}
  .ra-btn-m{display:flex;align-items:center;gap:7px;height:38px;padding:0 18px;border-radius:10px;font-family:inherit;font-size:12.5px;font-weight:500;cursor:pointer;transition:all .18s;border:0.5px solid transparent;}
  .ra-btn-m:active{transform:scale(.96);opacity:.8;}
  .ra-btn-cancel{background:rgba(255,255,255,.75);border-color:var(--i10);color:var(--i50);}
  .ra-btn-cancel:hover{background:rgba(255,255,255,.95);border-color:var(--i24);color:var(--i70);}
  .ra-btn-amber{background:#00082C;border-color:#F0F5FF;color:#F0F5FF;}
  .ra-btn-amber:hover{background:#00082C;border-color:#F0F5FF;}
  .ra-btn-success{background:#00082C;border-color:#F0F5FF;color:#F0F5FF;}
  .ra-btn-success:hover{background:#00082C;border-color:#F0F5FF;}

  /* Toast */
  .ra-toast-container{position:fixed;bottom:28px;right:28px;z-index:999;display:flex;flex-direction:column;align-items:flex-end;gap:8px;}
  .ra-toast{display:flex;align-items:center;gap:11px;background:var(--ink);color:rgba(255,255,255,.90);border-radius:12px;padding:12px 16px;font-size:12.5px;font-weight:500;box-shadow:0 4px 20px rgba(0,8,44,.28),0 1px 4px rgba(0,8,44,.14);animation:toastIn .28s cubic-bezier(.34,1.28,.64,1) both;pointer-events:none;letter-spacing:.005em;border:0.5px solid rgba(255,255,255,.08);}
  .ra-toast.out{animation:toastOut .22s ease both;}

  /* Responsive */
  @media(max-width:1100px){
    :root{--sb-w:64px;}
    .ra-sb-name,.ra-sb-tag,.ra-sb-item span,.ra-sb-pname,.ra-sb-prole,.ra-sb-dots{display:none;}
    .ra-sb-brand{padding:20px 12px;justify-content:center;}
    .ra-sb-nav{padding:12px 8px;}
    .ra-sb-item{justify-content:center;padding:0!important;width:40px!important;margin:0 auto 2px!important;}
    .ra-sb-footer{padding:12px 8px;}
    .ra-sb-profile{justify-content:center;}
  }
  @media(max-width:960px){
    :root{--sb-w:0px;--tb-h:58px;}
    .ra-sidebar{width:100%!important;transform:translateX(-100%);position:fixed;top:0;left:0;bottom:0;height:100%!important;z-index:50;background:#f5f5f9!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;box-shadow:none!important;transition:transform .28s cubic-bezier(.4,0,.2,1);}
    .ra-sidebar.open{transform:translateX(0)!important;}
    .ra-sb-name,.ra-sb-tag,.ra-sb-item span,.ra-sb-pname,.ra-sb-prole,.ra-sb-dots{display:revert!important;}
    .ra-sb-brand{padding:28px 24px 24px;justify-content:flex-start!important;}
    .ra-sb-nav{padding:20px 18px;}
    .ra-sb-item{justify-content:flex-start!important;padding:0 14px!important;width:100%!important;margin:0 0 2px!important;height:48px!important;}
    .ra-sb-footer{padding:18px;}
    .ra-sb-profile{justify-content:flex-start!important;}
    .ra-sb-close{display:flex!important;}
    .ra-content{margin-left:0;}
    .ra-topbar{left:0;right:0;padding:0 20px;gap:10px;}
    .ra-tb-hamburger{display:flex!important;}
    .ra-page{padding:calc(var(--tb-h) + 20px) 16px 48px;}
    .ra-devices-grid{grid-template-columns:1fr;}
  }
  @media(max-width:768px){
    :root{--tb-h:56px;}
    .ra-topbar{padding:0 16px;gap:10px;right:0;}
    .ra-tb-bc-root,.ra-tb-bc-sep{display:none;}
    .ra-page{padding:calc(var(--tb-h) + 20px) 16px 48px;}
    .ra-tb-search{width:150px;}
    .ra-bar{gap:6px;margin-bottom:14px;overflow-x:auto;padding-bottom:4px;flex-wrap:nowrap;}
    .ra-bar::-webkit-scrollbar{display:none;}
    .ra-card{border-radius:18px;}
    .ra-card-head{padding:14px 16px 12px;}
    .ra-card-foot{padding:12px 16px;}
    .ra-device-block{padding:16px 18px;gap:14px;}
    .ra-dev-orb{width:38px;height:38px;border-radius:11px;}
    .ra-btn-inactivar,.ra-btn-activar{font-size:11px;padding:0 10px;height:29px;}
    .ra-toast-container{bottom:14px;right:14px;left:14px;align-items:stretch;}
    /* Modal bottom sheet on mobile */
    .ra-modal-backdrop{background:transparent;align-items:flex-end;padding:0;}
    .ra-modal{width:100vw;max-width:100vw;border-radius:20px 20px 0 0;transform:translateY(100%);opacity:1;max-height:90dvh;}
    .ra-modal-backdrop.open .ra-modal{transform:translateY(0);opacity:1;}
  }
  @media(max-width:480px){
    .ra-tb-search{display:none;}
    .ra-device-block{flex-wrap:wrap;gap:12px;}
    .ra-dev-actions{margin-left:56px;}
  }
  `;

  /* Inject CSS at module level to avoid FOUC */
  (() => {
    const id = 'rilambAdminDevStyles';
    if (typeof document !== 'undefined' && !document.getElementById(id)) {
      const s = document.createElement('style'); s.id = id; s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
  })();

  /* ══ DATA ══ */
  const INITIAL_DB = [
    { id:'DEV-0001', s:'active'   },{ id:'DEV-0002', s:'active'   },{ id:'DEV-0003', s:'inactive' },
    { id:'DEV-0004', s:'active'   },{ id:'DEV-0005', s:'active'   },{ id:'DEV-0006', s:'inactive' },
    { id:'DEV-0007', s:'active'   },{ id:'DEV-0008', s:'inactive' },{ id:'DEV-0009', s:'active'   },
    { id:'DEV-0010', s:'active'   },{ id:'DEV-0011', s:'inactive' },{ id:'DEV-0012', s:'active'   },
    { id:'DEV-0013', s:'active'   },{ id:'DEV-0014', s:'inactive' },{ id:'DEV-0015', s:'active'   },
    { id:'DEV-0016', s:'active'   },{ id:'DEV-0017', s:'active'   },{ id:'DEV-0018', s:'inactive' },
    { id:'DEV-0019', s:'active'   },{ id:'DEV-0020', s:'inactive' },{ id:'DEV-0021', s:'active'   },
    { id:'DEV-0022', s:'active'   },{ id:'DEV-0023', s:'inactive' },{ id:'DEV-0024', s:'active'   },
    { id:'DEV-0025', s:'inactive' },{ id:'DEV-0026', s:'active'   },{ id:'DEV-0027', s:'active'   },
    { id:'DEV-0028', s:'inactive' },{ id:'DEV-0029', s:'active'   },{ id:'DEV-0030', s:'active'   },
  ];

  /* ══ Icons ══ */
  const IcoMenu    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
  const IcoX       = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
  const IcoXSm     = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
  const IcoBell    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
  const IcoLogout  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.95)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
  const IcoDots    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
  const IcoUser    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
  const IcoLock    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
  const IcoSearch  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
  const IcoSort    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/></svg>;
  const IcoCheck   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.75)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
  const IcoFile    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
  const IcoUsers   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
  const IcoDevice  = () => <svg width="15" height="15" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.5" y="1.5" width="37" height="37" rx="9" stroke="currentColor" strokeWidth="2.2" fill="none"/><circle cx="20" cy="22" r="10.5" stroke="currentColor" strokeWidth="1.6" fill="none" opacity=".5"/><circle cx="20" cy="22" r="6.5" stroke="currentColor" strokeWidth="1.3" fill="none" opacity=".38"/><circle cx="16" cy="18" r="1.3" fill="currentColor" opacity=".35"/><circle cx="20" cy="18" r="1.3" fill="currentColor" opacity=".6"/><circle cx="24" cy="18" r="1.3" fill="currentColor" opacity=".35"/><circle cx="16" cy="22" r="1.3" fill="currentColor" opacity=".6"/><circle cx="20" cy="22" r="1.7" fill="currentColor"/><circle cx="24" cy="22" r="1.3" fill="currentColor" opacity=".6"/><circle cx="16" cy="26" r="1.3" fill="currentColor" opacity=".35"/><circle cx="20" cy="26" r="1.3" fill="currentColor" opacity=".6"/><circle cx="24" cy="26" r="1.3" fill="currentColor" opacity=".35"/></svg>;
  const IcoLockSm  = ({ stroke = "currentColor" }) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
  const IcoLockAct = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 8.6-3.4"/></svg>;
  const IcoWarn    = ({ stroke = "#F0F5FF" }) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
  const IcoUnlock  = ({ stroke = "#F0F5FF" }) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>;

  /* Device SVG icon */
  const DevIcon = () => (
    <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="38" height="38" rx="9" stroke="currentColor" strokeWidth="1.6" fill="none"/>
      <circle cx="20" cy="22" r="11" stroke="currentColor" strokeWidth="1.2" fill="none" opacity=".55"/>
      <circle cx="20" cy="22" r="7" stroke="currentColor" strokeWidth="1.1" fill="none" opacity=".40"/>
      <circle cx="16" cy="18" r="1.1" fill="currentColor" opacity=".35"/>
      <circle cx="20" cy="18" r="1.1" fill="currentColor" opacity=".55"/>
      <circle cx="24" cy="18" r="1.1" fill="currentColor" opacity=".35"/>
      <circle cx="16" cy="22" r="1.1" fill="currentColor" opacity=".55"/>
      <circle cx="20" cy="22" r="1.4" fill="currentColor" opacity=".90"/>
      <circle cx="24" cy="22" r="1.1" fill="currentColor" opacity=".55"/>
      <circle cx="16" cy="26" r="1.1" fill="currentColor" opacity=".35"/>
      <circle cx="20" cy="26" r="1.1" fill="currentColor" opacity=".55"/>
      <circle cx="24" cy="26" r="1.1" fill="currentColor" opacity=".35"/>
      <circle cx="32" cy="8" r="2.2" fill="currentColor" opacity=".30"/>
    </svg>
  );

  /* ══ Toast ══ */
  function ToastContainer({ toasts }) {
    return (
      <div className="ra-toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`ra-toast${t.fading ? ' out' : ''}`}>
            <IcoCheck />{t.msg}
          </div>
        ))}
      </div>
    );
  }

  /* ══ Confirm Modal ══ */
  function ConfirmModal({ device, onClose, onConfirm }) {
    if (!device) return null;
    const active = device.s === 'active';
    return (
      <div className="ra-modal-backdrop open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="ra-modal">
          <div className="ra-modal-header">
            <div className="ra-modal-icon">
              <IcoLockSm stroke="#00082C" />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div className="ra-modal-title">{active ? 'Inactivar dispositivo' : 'Activar dispositivo'}</div>
              <div className="ra-modal-subtitle">{device.id}</div>
            </div>
            <button className="ra-modal-close" onClick={onClose}><IcoXSm /></button>
          </div>
          <div className="ra-confirm-center">
            <div className={`ra-confirm-icon-wrap ${active ? 'warn' : 'success'}`}>
              {active ? <IcoWarn /> : <IcoUnlock />}
            </div>
            <div className="ra-confirm-title">{active ? `¿Inactivar ${device.id}?` : `¿Activar ${device.id}?`}</div>
            <p className="ra-confirm-desc">
              {active
                ? 'El dispositivo quedará inactivo y no podrá ser utilizado hasta que sea reactivado.'
                : 'El dispositivo recuperará su estado activo y podrá ser utilizado nuevamente.'}
            </p>
          </div>
          <div className="ra-modal-footer">
            <button className="ra-btn-m ra-btn-cancel" onClick={onClose}>Cancelar</button>
            <button className={`ra-btn-m ${active ? 'ra-btn-amber' : 'ra-btn-success'}`} onClick={() => onConfirm(device.id)}>
              {active ? <><IcoLockSm stroke="currentColor" /> Inactivar</> : <><IcoLockAct /> Activar</>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ══ Device Block ══ */
  function DeviceBlock({ device, onToggle, isLastRow }) {
    const active = device.s === 'active';
    return (
      <div className={`ra-device-block${isLastRow ? ' last-row' : ''}`} data-id={device.id}>
        <div className={`ra-dev-orb ${active ? 'active-orb' : 'inactive-orb'}`}>
          <DevIcon />
        </div>
        <div className="ra-dev-info">
          <div className="ra-dev-id">{device.id}</div>
          <div className="ra-dev-meta">
            <span className={`ra-pill ${active ? 'ra-pill-active' : 'ra-pill-inactive'}`}>
              {active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
        <div className="ra-dev-actions">
          {active
            ? <button className="ra-btn-inactivar" onClick={() => onToggle(device)}>
                <IcoLockSm /> Inactivar
              </button>
            : <button className="ra-btn-activar" onClick={() => onToggle(device)}>
                <IcoLockAct /> Activar
              </button>
          }
        </div>
      </div>
    );
  }

  /* ══ MAIN ══ */
  export default function RilAmbDispositivosAdmin() {
    const navigate = useNavigate();
    const [db,           setDb]           = useState(INITIAL_DB);
    const [sidebarOpen,  setSidebarOpen]  = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filter,       setFilter]       = useState('all');
    const [query,        setQuery]        = useState('');
    const [sortDir,      setSortDir]      = useState('asc');
    const [page,         setPage]         = useState(1);
    const [confirmDev,   setConfirmDev]   = useState(null);
    const [toasts,       setToasts]       = useState([]);
    const [lastRowIds,   setLastRowIds]   = useState(new Set());
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    /* Close mobile search when viewport exceeds mobile breakpoint */
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth > 480 && mobileSearchOpen) {
          setMobileSearchOpen(false);
        }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [mobileSearchOpen]);

    // ── Row-based pagination state ──────────────────────────────────────────────
    // cols: number of visible grid columns, detected via ResizeObserver
    // perPage is derived as cols * ROWS_PER_PAGE (never stored separately)
    const ROWS_PER_PAGE = 8;
    const [cols, setCols] = useState(1);

    const gridRef     = useRef(null);
    const prevColsRef = useRef(1);

    /* CSS injected at module level — no useEffect needed */

    /* Close dropdown on outside click */
    useEffect(() => {
      const h = e => { if (!e.target.closest('.ra-sb-footer')) setDropdownOpen(false); };
      document.addEventListener('click', h);
      return () => document.removeEventListener('click', h);
    }, []);

    const handleLogout = () => {
      logout();
      navigate('/session-logo', { replace: true, state: { next: '/' } });
    };

    /* Keyboard ESC closes modal */
    useEffect(() => {
      const h = e => { if (e.key === 'Escape') setConfirmDev(null); };
      document.addEventListener('keydown', h);
      return () => document.removeEventListener('keydown', h);
    }, []);

    /* ── Detect visible columns via ResizeObserver on the grid ──────────────── */
    useEffect(() => {
      const grid = gridRef.current;
      if (!grid) return;

      const measure = () => {
        const blocks = [...grid.querySelectorAll('.ra-device-block')];
        if (blocks.length === 0) return;

        // Count how many blocks share the same top offset as the first block
        const firstTop = blocks[0].getBoundingClientRect().top;
        let detectedCols = 0;
        for (const b of blocks) {
          if (Math.abs(b.getBoundingClientRect().top - firstTop) <= 4) detectedCols++;
          else break;
        }
        detectedCols = Math.max(1, detectedCols);

        if (detectedCols !== prevColsRef.current) {
          prevColsRef.current = detectedCols;
          setCols(detectedCols);
          // Reset to page 1 whenever column count changes to avoid empty pages
          setPage(1);
        }
      };

      // Run once after mount / data changes
      measure();

      const ro = new ResizeObserver(() => { measure(); });
      ro.observe(grid);
      return () => ro.disconnect();
    // Re-attach when the visible slice changes (filter / query / sort / db)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, query, sortDir, db]);

    /* ── Compute last-row blocks after render ───────────────────────────────── */
    useEffect(() => {
      const grid = gridRef.current;
      if (!grid) return;
      const blocks = [...grid.querySelectorAll('.ra-device-block')];
      if (!blocks.length) { setLastRowIds(new Set()); return; }

      const firstTop = blocks[0].getBoundingClientRect().top;
      let detectedCols = 0;
      for (const b of blocks) {
        if (Math.abs(b.getBoundingClientRect().top - firstTop) <= 4) detectedCols++;
        else break;
      }
      detectedCols = Math.max(1, detectedCols);

      const lastRowStart = blocks.length - ((blocks.length % detectedCols) || detectedCols);
      const ids = new Set(
        blocks.slice(Math.max(0, lastRowStart)).map(b => b.dataset.id)
      );
      setLastRowIds(ids);
    }, [filter, query, sortDir, page, db, cols]);

    /* Toast */
    const showToast = useCallback((msg) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, msg, fading: false }]);
      setTimeout(() => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, fading: true } : t));
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 240);
      }, 2800);
    }, []);

    /* Filtered + sorted list */
    const filtered = db
      .filter(d => filter === 'all' || d.s === filter)
      .filter(d => !query || d.id.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => sortDir === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id));

    // ── Row-based pagination ───────────────────────────────────────────────────
    // Each page holds exactly ROWS_PER_PAGE rows, so perPage = cols * ROWS_PER_PAGE
    const perPage    = cols * ROWS_PER_PAGE;
    const total      = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const safePage   = Math.min(page, totalPages);
    const slice      = filtered.slice((safePage - 1) * perPage, safePage * perPage);
    // ──────────────────────────────────────────────────────────────────────────

    const handleToggleConfirm = (device) => setConfirmDev(device);

    const handleConfirm = (id) => {
      const dev = db.find(d => d.id === id);
      if (!dev) return;
      const wasActive = dev.s === 'active';
      setDb(prev => prev.map(d => d.id === id ? { ...d, s: wasActive ? 'inactive' : 'active' } : d));
      setConfirmDev(null);
      showToast(wasActive ? `${id} ha sido inactivado` : `${id} ha sido activado`);
    };

    return (
      <div style={{ minHeight:'100vh', background:'var(--page)', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
        {/* Background gradient — div real */}
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0,
          background:'radial-gradient(ellipse 70% 50% at 10% 5%,rgba(0,8,44,.045) 0%,transparent 55%),radial-gradient(ellipse 55% 40% at 92% 90%,rgba(0,8,44,.038) 0%,transparent 55%)'
        }}/>

        {/* Overlay — fuera del layout */}
        <div className={`ra-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

        {/* Toasts */}
        <ToastContainer toasts={toasts} />

        {/* Modal — fuera del layout */}
        {confirmDev && <ConfirmModal device={confirmDev} onClose={() => setConfirmDev(null)} onConfirm={handleConfirm} />}

        {/* Sidebar — fuera del layout */}
        <aside className={`ra-sidebar${sidebarOpen ? ' open' : ''}`}>
          <div className="ra-sb-brand">
            <div className="ra-sb-mark">
              <img src={whiteLogo} alt="RilAmb" style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
            </div>
            <div><div className="ra-sb-name">RilAmb</div><div className="ra-sb-tag">Platform</div></div>
            <button className="ra-sb-close" onClick={() => setSidebarOpen(false)}><IcoX /></button>
          </div>
          <nav className="ra-sb-nav">
            <button className="ra-sb-item" onClick={() => navigate('/admin/reports')}><IcoFile /><span>Reportes</span></button>
            <button className="ra-sb-item" onClick={() => navigate('/admin/users')}><IcoUsers /><span>Usuarios</span></button>
            <button className="ra-sb-item active" onClick={() => navigate('/admin/devices')}><IcoDevice /><span>Dispositivos</span></button>
          </nav>
          <div className="ra-sb-footer">
            <div className="ra-sb-profile" onClick={() => setDropdownOpen(p => !p)}>
              <div className="ra-sb-av">AS</div>
              <div><div className="ra-sb-pname">Admin S.</div><div className="ra-sb-prole">Administrador</div></div>
              <span className="ra-sb-dots"><IcoDots /></span>
            </div>
            <div className={`ra-sb-dropdown${dropdownOpen ? ' open' : ''}`}>
              <button className="ra-sb-dd-item" onClick={() => navigate('/admin/perfil')}><IcoUser /><span>Ver perfil</span></button>
              <div className="ra-sb-divider" />
              <button className="ra-sb-dd-item" onClick={() => navigate('/admin/perfil', { state: { section: 'seguridad' } })}><IcoLock /><span>Cambiar contraseña</span></button>
            </div>
          </div>
        </aside>

        {/* Layout */}
        <div className="ra-layout">
          <div className="ra-content">
            <header className="ra-topbar">
              <button className="ra-tb-hamburger" onClick={() => setSidebarOpen(true)}><IcoMenu /></button>
              <div className="ra-tb-bc">
                <span className="ra-tb-bc-root">RilAmb</span>
                <span className="ra-tb-bc-sep">/</span>
                <span className="ra-tb-bc-cur">Dispositivos</span>
              </div>
              <div className="ra-tb-space" />
              <div className="ra-tb-search">
                <input type="search" placeholder="Buscar dispositivo…" value={query}
                  onChange={e => { setQuery(e.target.value); setPage(1); }} autoComplete="off" />
                <span className="ra-tb-search-ico"><IcoSearch /></span>
              </div>
              <button className="ra-tb-ico"><IcoBell /><span className="ra-notif-dot" /></button>
              <button className="ra-tb-avatar" onClick={handleLogout}><IcoLogout /></button>
            </header>

            <main className="ra-page">
              <div className="ra-ph">
                <div className="ra-ph-left">
                  <h1>Dispositivos</h1>
                  <p>Monitorea y gestiona los dispositivos registrados</p>
                </div>
              </div>

              {/* Filter bar */}
              <div className="ra-bar">
                {[
                  { key:'all',      label:'Todos'     },
                  { key:'active',   label:'Activos'   },
                  { key:'inactive', label:'Inactivos' },
                ].map(f => (
                  <button key={f.key} className={`ra-fp${filter === f.key ? ' on' : ''}`}
                    onClick={() => { setFilter(f.key); setPage(1); }}>
                    {f.label}
                  </button>
                ))}
                {/* Botón Buscar — solo visible en móvil <=480px */}
                <button
                  className={`ra-fp ra-fp-search-mobile${mobileSearchOpen ? ' on' : ''}`}
                  onClick={() => {
                    setMobileSearchOpen(v => !v);
                    if (mobileSearchOpen) { setQuery(''); setPage(1); }
                  }}
                >
                  Buscar
                </button>
              </div>

              {/* Campo de búsqueda inline para móvil <=480px */}
              <div className={`ra-mobile-search-wrap${mobileSearchOpen ? ' visible' : ''}`}>
                <input
                  type="search"
                  placeholder="Buscar dispositivo…"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setPage(1); }}
                  autoComplete="off"
                  autoFocus
                />
                <span className="ra-mobile-search-ico"><IcoSearch /></span>
              </div>

              {/* Card */}
              <div className="ra-card">
                <div className="ra-card-head">
                  <div>
                    <div className="ra-card-head-title">Registro de dispositivos</div>
                    <div className="ra-card-head-sub">
                      {total === db.length
                        ? `${total} dispositivos registrados`
                        : `${total} resultado${total !== 1 ? 's' : ''}`}
                    </div>
                  </div>
                  <div className="ra-ch-space" />
                  <button className="ra-ch-sort-btn"
                    title={sortDir === 'asc' ? 'Código ↓' : 'Código ↑'}
                    onClick={() => { setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }}>
                    <IcoSort /> Ordenar
                  </button>
                </div>

                {/* Grid */}
                {slice.length > 0 ? (
                  <div className="ra-devices-grid" ref={gridRef}>
                    {slice.map(d => (
                      <DeviceBlock key={d.id} device={d}
                        isLastRow={lastRowIds.has(d.id)}
                        onToggle={handleToggleConfirm}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="ra-empty-state">
                    <div className="ra-empty-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                    </div>
                    <div className="ra-empty-title">Sin resultados</div>
                    <p className="ra-empty-desc">No hay dispositivos que coincidan con tu búsqueda.</p>
                  </div>
                )}

                {/* Footer */}
                <div className="ra-card-foot">
                  <span className="ra-cf-info">
                    {totalPages > 1 ? `Página ${safePage} de ${totalPages}` : ''}
                  </span>
                  {totalPages > 1 && (
                    <div className="ra-pag">
                      <button className="ra-pg" disabled={safePage <= 1} onClick={() => setPage(p => p-1)}>‹</button>
                      <div className="ra-pg cur">{safePage}</div>
                      <button className="ra-pg" disabled={safePage >= totalPages} onClick={() => setPage(p => p+1)}>›</button>
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