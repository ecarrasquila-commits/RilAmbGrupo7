import { useState, useEffect, useRef, useCallback } from "react";
import logo from "../assets/blackLogo.png";
import darkLogo from "../assets/whiteLogo.png";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@200;300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --ink:#05071A;
  --i80:rgba(5,7,26,.80);
  --i60:rgba(5,7,26,.60);
  --i40:rgba(5,7,26,.40);
  --i24:rgba(5,7,26,.24);
  --i14:rgba(5,7,26,.14);
  --i08:rgba(5,7,26,.08);
  --i04:rgba(5,7,26,.04);
  --page:#F2F3F8;
  --card:rgba(255,255,255,.90);
  --card-border:rgba(5,7,26,.07);
  --accent:#1A50E8;
  --accent2:#5B2DE8;
  --green:#0A8F5F;
  --green-bg:rgba(10,143,95,.08);
  --amber:#A06010;
  --amber-bg:rgba(160,96,16,.08);
  --red:#C03030;
  --mq2:#1A50E8;
  --mq7:#0A8F5F;
  --mq4:#7030D0;
  --shadow-xs:0 1px 3px rgba(5,7,26,.04),0 2px 8px rgba(5,7,26,.05);
  --shadow-sm:0 2px 4px rgba(5,7,26,.04),0 6px 20px rgba(5,7,26,.06),0 16px 40px rgba(5,7,26,.07);
  --shadow-md:0 4px 8px rgba(5,7,26,.05),0 12px 32px rgba(5,7,26,.08),0 32px 80px rgba(5,7,26,.09);
  --shadow-lg:0 8px 16px rgba(5,7,26,.05),0 24px 56px rgba(5,7,26,.09),0 64px 120px rgba(5,7,26,.11);
  --r-xs:8px; --r-sm:12px; --r-md:18px; --r-lg:24px; --r-xl:32px; --r-2xl:40px;
}
html{scroll-behavior:smooth;}
body{font-family:'Sora',system-ui,sans-serif;background:var(--page);color:var(--ink);-webkit-font-smoothing:antialiased;overflow-x:hidden;line-height:1.6;}

@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.75)}}
@keyframes pulse-ring{0%{opacity:.7;r:3}50%{opacity:0;r:8}100%{opacity:0;r:8}}
@keyframes pulse-core{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(.85)}}
@keyframes shimmer-glow{0%,100%{opacity:.6}50%{opacity:1}}

.reveal{opacity:0;transform:translateY(28px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1);}
.reveal.in{opacity:1;transform:none;}
.reveal-delay-1{transition-delay:.1s;}
.reveal-delay-2{transition-delay:.2s;}
.reveal-delay-3{transition-delay:.3s;}
.reveal-delay-4{transition-delay:.4s;}
.reveal-delay-5{transition-delay:.5s;}
.reveal-left{opacity:0;transform:translateX(-32px);transition:opacity .75s cubic-bezier(.22,1,.36,1),transform .75s cubic-bezier(.22,1,.36,1);}
.reveal-left.in{opacity:1;transform:none;}
.reveal-right{opacity:0;transform:translateX(32px);transition:opacity .75s cubic-bezier(.22,1,.36,1),transform .75s cubic-bezier(.22,1,.36,1);}
.reveal-right.in{opacity:1;transform:none;}

nav{position:sticky;top:0;left:0;right:0;z-index:202;height:66px;display:flex;align-items:center;padding:0 clamp(20px,5vw,72px);background:rgba(242,243,248,.82);backdrop-filter:blur(32px) saturate(1.5);-webkit-backdrop-filter:blur(32px) saturate(1.5);border-bottom:0.5px solid var(--card-border);box-shadow:0 1px 0 rgba(255,255,255,.75),0 6px 24px rgba(5,7,26,.04);transition:all .3s ease;box-sizing:border-box;}
nav.scrolled{background:rgba(242,243,248,.96);box-shadow:0 1px 0 rgba(255,255,255,.9),0 10px 40px rgba(5,7,26,.07);}
.nav-brand{display:flex;align-items:center;gap:11px;text-decoration:none;color:inherit;flex-shrink:0;}
.nav-logo-mark{width:40px;height:40px;background:transparent;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.nav-logo-mark svg{width:38px;height:38px;display:block;}
.nav-brand-name{font-size:18px;font-weight:600;letter-spacing:-.03em;color:var(--ink);}
.nav-links{display:flex;align-items:center;gap:2px;margin-left:44px;}
.nav-links a{font-size:12.5px;font-weight:400;color:var(--i60);text-decoration:none;padding:7px 14px;border-radius:var(--r-sm);border:0.5px solid transparent;transition:all .2s ease;letter-spacing:-.01em;}
.nav-links a:hover{color:var(--ink);background:var(--i04);border-color:var(--i08);}
.nav-space{flex:1;}
.nav-cta{margin-left:10px;padding:12px 20px;background:var(--ink);color:rgba(255,255,255,.92);border:none;border-radius:var(--r-sm);font-family:'Sora',sans-serif;font-size:12.5px;font-weight:500;letter-spacing:-.01em;cursor:pointer;box-shadow:0 2px 8px rgba(5,7,26,.18),inset 0 1px 0 rgba(255,255,255,.08);transition:all .2s ease;text-decoration:none;display:inline-block;line-height:normal;vertical-align:middle;}
.nav-cta:hover{background:#101e50;transform:translateY(-1px);}

.nav-hamburger{display:none;margin-left:10px;width:38px;height:38px;border-radius:var(--r-sm);background:transparent;border:none;cursor:pointer;flex-direction:column;align-items:center;justify-content:center;gap:7px;transition:background .2s ease;flex-shrink:0;}
.nav-hamburger:hover{background:rgba(5,7,26,.06);}
.nav-hamburger span{display:block;width:22px;height:1.8px;background:var(--ink);border-radius:2px;transition:all .3s cubic-bezier(.22,1,.36,1);transform-origin:center;}
.nav-hamburger.open span:nth-child(1){transform:translateY(8.8px) rotate(45deg);}
.nav-hamburger.open span:nth-child(2){opacity:0;transform:scaleX(0);}
.nav-hamburger.open span:nth-child(3){transform:translateY(-8.8px) rotate(-45deg);}

.nav-overlay{display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:200;background:rgba(5,7,26,.45);}
.nav-overlay.open{display:block;}

.nav-drawer{display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:201;background:#F1F2F7;flex-direction:column;padding-top:66px;overflow:hidden;}
.nav-drawer.open{display:flex;}
.nav-drawer a{font-size:17px;font-weight:400;color:var(--i80);text-decoration:none;padding:16px 24px;transition:background .15s ease;display:block;text-align:center;line-height:normal;}
.nav-drawer a:active{background:rgba(5,7,26,.05);}
.nav-drawer a.drawer-cta{margin:16px;padding:14px 20px;background:var(--ink);color:#fff;border-radius:var(--r-md);text-align:center;font-weight:500;font-size:15px;}
.nav-drawer a.drawer-cta:active{background:#101e50;}

/* Wave wrapper: background = color de la seccion SUPERIOR (lo que esta detras) */
.wave-wrap{display:block;width:100%;overflow:hidden;line-height:0;font-size:0;position:relative;z-index:2;margin-top:-1px;}
.wave-wrap svg{display:block;width:100%;height:auto;}

.hero{min-height:100vh;display:flex;flex-direction:column;padding:0;position:relative;overflow:hidden;background:var(--page);scroll-margin-top:66px;}
.hero-inner{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:40px;padding:42px clamp(20px,5vw,80px) 60px;align-content:start;align-items:center;max-width:1300px;margin:0 auto;width:100%;position:relative;z-index:1;}
.hero-bg{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:0;}
.hero-bg-gradient{position:absolute;inset:0;background:radial-gradient(ellipse 70% 55% at 30% -5%,rgba(26,80,232,.06) 0%,transparent 60%),radial-gradient(ellipse 50% 45% at 75% 80%,rgba(91,45,232,.04) 0%,transparent 55%),var(--page);}
.hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(5,7,26,.035) .5px,transparent .5px),linear-gradient(90deg,rgba(5,7,26,.035) .5px,transparent .5px);background-size:52px 52px;mask-image:radial-gradient(ellipse 100% 80% at 40% 30%,black 20%,transparent 80%);}

.hero-left{padding-right:4px;padding-bottom:0;animation:fadeUp .7s .1s cubic-bezier(.22,1,.36,1) both;}
.hero-h1{font-size:clamp(40px,5vw,68px);font-weight:300;letter-spacing:-.045em;line-height:1.06;color:var(--ink);margin-bottom:20px;}
.hero-h1 strong{font-weight:700;}
.hero-sub{font-size:15px;font-weight:300;color:var(--i60);line-height:1.7;margin-bottom:40px;max-width:460px;}
.hero-ctas{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:48px;}

/* Buttons — reset completo para evitar sobreescritura del entorno */
.btn-primary,.btn-secondary{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;line-height:1;vertical-align:middle;white-space:nowrap;width:170px;}
.btn-primary{gap:9px;padding:0 20px;height:52px;width:185px;background:var(--ink);color:rgba(255,255,255,.93);border:none;border-radius:20px;font-family:'Sora',sans-serif;font-size:13.5px;font-weight:500;letter-spacing:-.015em;cursor:pointer;text-decoration:none;box-shadow:0 2px 6px rgba(5,7,26,.12),0 10px 32px rgba(5,7,26,.22),inset 0 1px 0 rgba(255,255,255,.08);transition:all .22s ease;position:relative;overflow:hidden;}
.btn-primary:hover{background:#0d1e56;transform:translateY(-2px);}
.btn-secondary{gap:9px;padding:0 20px;height:52px;background:rgba(255,255,255,.85);color:var(--i80);border:0.5px solid rgba(5,7,26,.10);border-radius:20px;font-family:'Sora',sans-serif;font-size:13.5px;font-weight:500;letter-spacing:-.015em;cursor:pointer;text-decoration:none;box-shadow:0 2px 8px rgba(5,7,26,.06);transition:all .22s ease;}
.btn-secondary:hover{background:rgba(255,255,255,.95);transform:translateY(-1px);}
.btn-arrow{transition:transform .2s ease;flex-shrink:0;}
.btn-primary:hover .btn-arrow,.btn-secondary:hover .btn-arrow{transform:translateX(3px);}

.hero-right{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:24px;max-width:520px;margin:0 auto;margin-left:0;animation:fadeUp .8s .28s cubic-bezier(.22,1,.36,1) both;position:relative;}
.hero-right::before{content:'';position:absolute;top:-40px;right:-60px;width:380px;height:380px;background:radial-gradient(circle,rgba(37,99,235,.18) 0%,rgba(37,99,235,.08) 35%,transparent 70%);border-radius:50%;pointer-events:none;filter:blur(40px);z-index:-1;animation:float 8s ease-in-out infinite;}
.hero-right::after{content:'';position:absolute;bottom:-30px;left:-40px;width:320px;height:320px;background:radial-gradient(circle,rgba(10,143,95,.12) 0%,rgba(10,143,95,.05) 40%,transparent 65%);border-radius:50%;pointer-events:none;filter:blur(50px);z-index:-1;animation:float 10s ease-in-out infinite reverse;}

.hvc{background:var(--card);border:0.5px solid rgba(5,7,26,.08);border-radius:14px;padding:14px 14px 0;overflow:hidden;position:relative;transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s cubic-bezier(.22,1,.36,1);backdrop-filter:blur(20px) saturate(1.2);-webkit-backdrop-filter:blur(20px) saturate(1.2);box-shadow:0 2px 8px rgba(5,7,26,.04),0 8px 24px rgba(5,7,26,.06),0 20px 48px rgba(5,7,26,.07);}
.hvc:first-child{grid-column:1/-1;box-shadow:0 4px 12px rgba(5,7,26,.06),0 12px 32px rgba(5,7,26,.08),0 28px 64px rgba(5,7,26,.10);}
.hvc:nth-child(2),.hvc:nth-child(3){transform:translateY(-8px);}
.hvc:hover{transform:translateY(-4px);box-shadow:0 6px 16px rgba(5,7,26,.08),0 16px 40px rgba(5,7,26,.10);}
.hvc:first-child:hover{transform:translateY(-6px);}

.hvc-accent{position:absolute;top:0;left:14px;right:14px;height:2px;border-radius:0 0 2px 2px;opacity:.9;animation:shimmer-glow 3s ease-in-out infinite;}
.hvc-top{display:flex;align-items:center;gap:8px;margin-bottom:12px;padding:0 2px;}
.hvc-sensor-badge{font-size:8px;font-weight:600;letter-spacing:.09em;text-transform:uppercase;padding:3px 9px;border-radius:50px;font-family:'JetBrains Mono',monospace;border:0.5px solid;flex-shrink:0;}
.hvc-label{font-size:9px;color:rgba(5,7,26,.38);flex:1;letter-spacing:-.01em;font-weight:400;}
.hvc-status{font-size:7.5px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;padding:2.5px 8px;border-radius:50px;border:0.5px solid;}
.s-safe{background:rgba(10,143,95,.08);color:#0A8F5F;border-color:rgba(10,143,95,.20);}
.s-warn{background:rgba(217,119,6,.08);color:#D97706;border-color:rgba(217,119,6,.20);}
.s-alert{background:rgba(192,48,48,.08);color:#C03030;border-color:rgba(192,48,48,.20);}

.hvc-val-row{display:flex;align-items:baseline;gap:5px;margin-bottom:14px;padding-left:2px;}
.hvc-num{font-size:28px;font-weight:700;letter-spacing:-.07em;line-height:1;font-family:'JetBrains Mono',monospace;}
.hvc-unit{font-size:9px;color:rgba(5,7,26,.28);font-family:'JetBrains Mono',monospace;font-weight:400;}

.hvc-chart{position:relative;margin:0 -14px;height:64px;overflow:hidden;}
.hvc-svg{display:block;width:100%;height:64px;overflow:visible;}
.hvc.compact .hvc-num{font-size:22px;}
.hvc.compact .hvc-chart{height:48px;}
.hvc.compact .hvc-svg{height:48px;}

.live-ring{animation:pulse-ring 2.5s ease infinite;}
.live-core{animation:pulse-core 2.5s ease infinite;}

.hvc-live-row{display:flex;align-items:center;gap:6px;padding:8px 14px;border-top:0.5px solid rgba(5,7,26,.05);font-size:7.5px;font-weight:600;color:#0A8F5F;letter-spacing:.06em;text-transform:uppercase;margin:0 -14px;background:linear-gradient(180deg,rgba(10,143,95,.02) 0%,transparent 100%);}
.hvc-live-dot{width:4px;height:4px;border-radius:50%;background:#0A8F5F;animation:pulse-core 1.8s ease infinite;flex-shrink:0;box-shadow:0 0 8px rgba(10,143,95,.4);}

section{padding:80px clamp(24px,6vw,80px);position:relative;}
.section-label{font-size:10px;font-weight:500;color:var(--i40);letter-spacing:.14em;text-transform:uppercase;display:flex;align-items:center;gap:10px;margin-bottom:18px;}
.section-label::before{content:'';width:22px;height:0.5px;background:var(--i24);}
.section-h2{font-size:clamp(26px,3.5vw,44px);font-weight:300;letter-spacing:-.045em;line-height:1.1;color:var(--ink);margin-bottom:16px;}
.section-h2 strong{font-weight:700;}
.section-sub{font-size:15px;font-weight:300;color:var(--i60);max-width:500px;line-height:1.7;}

/* rgba(255,255,255,.52) sobre #F2F3F8 — igual que el original pero sólido para evitar artefactos */
.about-section{background:#F8F9FC;}
.about-layout{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;margin-top:0;}
.about-visual-wrap{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.about-metric{background:var(--card);border:0.5px solid var(--card-border);border-radius:var(--r-lg);padding:24px 22px;box-shadow:var(--shadow-sm);transition:all .28s cubic-bezier(.22,1,.36,1);position:relative;overflow:hidden;}
.about-metric::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.9) 50%,transparent);}
.about-metric:hover{transform:translateY(-4px);box-shadow:var(--shadow-md);}
.about-metric:nth-child(2){margin-top:24px;}
.about-metric:nth-child(4){margin-top:24px;}
.am-icon{width:36px;height:36px;border-radius:var(--r-xs);display:flex;align-items:center;justify-content:center;background:var(--i04);border:0.5px solid var(--i08);margin-bottom:14px;transition:all .28s ease;}
.about-metric:hover .am-icon{background:var(--ink);border-color:var(--ink);}
.about-metric:hover .am-icon svg{color:#fff!important;}
.am-icon svg{transition:color .28s ease;}
.am-num{font-size:28px;font-weight:700;letter-spacing:-.05em;color:var(--ink);line-height:1;margin-bottom:4px;}
.am-label{font-size:11.5px;font-weight:400;color:var(--i60);line-height:1.45;}

.sensors-section{background:#FBFBFD;}
.sensors-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-top:52px;}
.flip-card{cursor:default;}
.flip-inner{width:100%;position:relative;}
.flip-front{background:var(--card);border:0.5px solid var(--card-border);border-radius:var(--r-lg);padding:28px 22px 36px;min-height:260px;box-shadow:var(--shadow-sm);position:relative;overflow:hidden;display:flex;flex-direction:column;visibility:visible;}
.flip-front::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.9) 50%,transparent);}
.flip-accent-bar{position:absolute;top:0;left:0;right:0;height:2px;border-radius:var(--r-lg) var(--r-lg) 0 0;}
.bar-mq2,.bar-mq7,.bar-mq4{background:#05071A;}

.monitor-section{background:#F7F8FA;}
.monitor-layout{display:grid;grid-template-columns:1.1fr 0.9fr;gap:32px;align-items:start;margin-top:0;}
.monitor-left-col{display:flex;flex-direction:column;}
.monitor-left-col .section-label{margin-bottom:14px;}
.monitor-left-col .section-h2{margin-bottom:12px;}
.monitor-left-col .section-sub{margin-bottom:32px;}

.monitor-panel{background:#fff;border:1px solid rgba(5,7,26,.06);border-radius:20px;overflow:hidden;box-shadow:0 1px 2px rgba(5,7,26,.03),0 4px 16px rgba(5,7,26,.05);position:relative;}
.mp-header{padding:16px 20px 14px;border-bottom:1px solid rgba(5,7,26,.05);display:flex;align-items:center;gap:10px;}
.mp-sensor-dot{width:7px;height:7px;border-radius:50%;background:var(--ink);flex-shrink:0;}
.mp-title{font-size:12px;font-weight:500;color:rgba(5,7,26,.55);letter-spacing:-.01em;flex:1;}
.mp-live-badge{font-size:9px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:3px 10px;border-radius:50px;background:rgba(10,143,95,.07);color:var(--green);border:1px solid rgba(10,143,95,.12);display:flex;align-items:center;gap:5px;}
.mp-live-pulse{width:5px;height:5px;border-radius:50%;background:var(--green);animation:pulse-dot 1.6s ease infinite;}
.mp-chart-wrap{padding:20px 20px 0;position:relative;}
.mp-line-chart{width:100%;height:160px;display:block;overflow:visible;}
.mp-value-row{display:flex;align-items:baseline;gap:6px;padding:16px 20px 20px;border-top:1px solid rgba(5,7,26,.04);margin-top:4px;}
.mp-current-val{font-size:32px;font-weight:700;letter-spacing:-.06em;font-family:'JetBrains Mono',monospace;color:var(--ink);line-height:1;}
.mp-current-unit{font-size:12px;color:rgba(5,7,26,.35);font-family:'JetBrains Mono',monospace;font-weight:400;}

.monitor-text-col{display:flex;flex-direction:column;gap:14px;padding-top:52px;}
.mf-item{display:flex;align-items:flex-start;gap:18px;padding:22px 24px;background:#fff;border:1px solid rgba(5,7,26,.06);border-radius:18px;transition:border-color .2s ease,box-shadow .2s ease,transform .2s ease;position:relative;overflow:hidden;}
.mf-item::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.9) 50%,transparent);}
.mf-item:hover{border-color:rgba(5,7,26,.11);box-shadow:0 4px 20px rgba(5,7,26,.07),0 12px 40px rgba(5,7,26,.05);transform:translateY(-2px);}
.mf-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:rgba(5,7,26,.04);border:1px solid rgba(5,7,26,.07);transition:all .25s ease;margin-top:1px;}
.mf-item:hover .mf-icon{background:var(--ink);border-color:var(--ink);}
.mf-item:hover .mf-icon svg{color:#fff!important;}
.mf-icon svg{transition:color .25s ease;}
.mf-content{flex:1;}
.mf-content h4{font-size:15px;font-weight:600;letter-spacing:-.025em;color:var(--ink);margin-bottom:6px;line-height:1.3;}
.mf-content p{font-size:13.5px;color:rgba(5,7,26,.54);line-height:1.65;font-weight:400;}

.cta-section{background:#F2F3F8;text-align:center;overflow:hidden;position:relative;padding-bottom:90px;padding-top:40px;}
.cta-section::after{content:'';position:absolute;bottom:0;left:0;right:0;height:90px;background:url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 90' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,45 C360,0 1080,90 1440,45 L1440,90 L0,90 Z' fill='%2305071A'/%3E%3C/svg%3E") no-repeat bottom center;background-size:100% 100%;}
.cta-card{max-width:720px;margin:0 auto;background:var(--card);border:0.5px solid var(--card-border);border-radius:var(--r-2xl);padding:72px 48px;box-shadow:var(--shadow-lg);position:relative;overflow:hidden;}
.cta-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,1) 50%,transparent);}
.cta-glow{position:absolute;top:-80px;left:50%;transform:translateX(-50%);width:480px;height:480px;background:radial-gradient(circle,rgba(26,80,232,.07) 0%,transparent 65%);pointer-events:none;}
.cta-section .section-h2{margin:0 auto 16px;max-width:540px;text-align:center;}
.cta-sub{font-size:14.5px;color:var(--i60);font-weight:300;line-height:1.7;max-width:420px;margin:0 auto 36px;}
.cta-btns{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;}
.cta-btns .btn-primary{width:220px;}
.cta-btns .btn-secondary{width:190px;}

footer{background:var(--ink);padding:52px clamp(24px,6vw,80px) 32px;position:relative;}
.footer-inner{display:grid;grid-template-columns:2fr 1fr 1fr;gap:40px;margin-bottom:48px;}
.footer-logo{display:flex;align-items:center;gap:9px;margin-bottom:16px;}
.footer-logo-mark{width:30px;height:30px;background:rgba(255,255,255,.12);border:0.5px solid rgba(255,255,255,.16);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.footer-logo-name{font-size:14.5px;font-weight:600;color:rgba(255,255,255,.88);letter-spacing:-.03em;}
.footer-desc{font-size:12.5px;color:rgba(255,255,255,.35);line-height:1.65;font-weight:300;max-width:260px;margin-bottom:20px;}
.footer-contact{margin-top:18px;display:flex;flex-direction:column;gap:9px;}
.footer-contact-item{display:flex;align-items:center;gap:9px;font-size:12px;color:rgba(255,255,255,.35);font-weight:300;}
.footer-contact-item svg{flex-shrink:0;color:rgba(255,255,255,.25);}
.footer-col h4{font-size:10px;font-weight:500;color:rgba(255,255,255,.30);letter-spacing:.12em;text-transform:uppercase;margin-bottom:16px;}
.footer-col ul{list-style:none;}
.footer-col li{margin-bottom:10px;}
.footer-col a{font-size:12.5px;color:rgba(255,255,255,.38);text-decoration:none;font-weight:300;transition:color .15s ease;}
.footer-col a:hover{color:rgba(255,255,255,.72);}
.footer-bottom{padding-top:24px;border-top:0.5px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;}
.footer-copy{font-size:11.5px;color:rgba(255,255,255,.25);font-weight:300;}

@media(max-width:960px){
  .about-layout{grid-template-columns:1fr;}
  .nav-links{display:none;}
  .monitor-layout{grid-template-columns:1fr;gap:28px;}
  .monitor-text-col{padding-top:0;}
  .nav-hamburger{display:flex;}
  .nav-main-cta{display:none;}
}
@media(max-width:860px){
  .hero-inner{grid-template-columns:1fr;gap:48px;padding:42px clamp(20px,5vw,48px) 60px;text-align:center;}
  .hero-left{padding-right:0;padding-bottom:0;display:flex;flex-direction:column;align-items:center;}
  .hero-sub{max-width:100%;}
  .hero-ctas{justify-content:center;}
  .hero-right{max-width:100%;width:100%;margin:0 auto;}
}
@media(max-width:680px){
  .footer-inner{grid-template-columns:1fr;gap:32px;}
}
@media(max-width:640px){
  .cta-card{padding:48px 24px;}
  .about-visual-wrap{grid-template-columns:1fr 1fr;}
}
@media(max-width:520px){
  .hero-inner{padding:42px 20px 48px;}
  .hero-h1{font-size:clamp(32px,8vw,48px);}
  .hero-right{grid-template-columns:1fr;max-width:100%;margin:0 auto;padding:12px 0;}
  .hvc:first-child{grid-column:1;}
  .hvc:nth-child(2),.hvc:nth-child(3){transform:none;}
  .hvc-chart{height:80px;}
  .hvc-svg{height:80px;}
  .hvc.compact .hvc-chart{height:80px;}
  .hvc.compact .hvc-svg{height:80px;}
  .hvc.compact .hvc-num{font-size:28px;}
  .btn-primary,.btn-secondary{width:100%;justify-content:center;}
  .hero-ctas{flex-direction:column;width:100%;}
}
`;

// ── helpers ────────────────────────────────────────────────
function catmull(pts) {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const t = 0.5;
    const cp1x = p1.x + ((p2.x - p0.x) * t) / 3, cp1y = p1.y + ((p2.y - p0.y) * t) / 3;
    const cp2x = p2.x - ((p3.x - p1.x) * t) / 3, cp2y = p2.y - ((p3.y - p1.y) * t) / 3;
    d += ` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

function buildPaths(hist, N, W, H, step) {
  const PT = 8, PB = 4;
  const lo = Math.min(...hist) - step * 0.3;
  const hi = Math.max(...hist) + step * 0.3;
  const span = hi - lo || 1;
  const pts = hist.map((v, i) => ({ x: (i / (N - 1)) * W, y: PT + (1 - (v - lo) / span) * (H - PT - PB) }));
  const lineD = catmull(pts);
  const last = pts[pts.length - 1];
  return { lineD, fillD: lineD + ` L${W},${H} L0,${H} Z`, last };
}

function buildPathsMonitor(hist, N, W, H) {
  const PT = 12, PB = 8;
  const lo = Math.min(...hist) - 10, hi = Math.max(...hist) + 10, span = hi - lo || 1;
  const pts = hist.map((v, i) => ({ x: (i / (N - 1)) * W, y: PT + (1 - (v - lo) / span) * (H - PT - PB) }));
  const t = 0.45;
  if (pts.length < 2) return { lineD: "", fillD: "", last: pts[0] };
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + ((p2.x - p0.x) * t) / 3, cp1y = p1.y + ((p2.y - p0.y) * t) / 3;
    const cp2x = p2.x - ((p3.x - p1.x) * t) / 3, cp2y = p2.y - ((p3.y - p1.y) * t) / 3;
    d += ` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return { lineD: d, fillD: d + ` L${W},${H} L0,${H} Z`, last: pts[pts.length - 1] };
}

function initHist(N, startVal, min, max, step) {
  let v = startVal;
  const h = [];
  for (let i = 0; i < N; i++) {
    v = Math.round(Math.max(min, Math.min(max, v + (Math.random() - 0.5) * step)));
    h.push(v);
  }
  return h;
}

const IconArrow = () => (
  <svg className="btn-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);

// ── Wave wrapper component ────────────────────────────────
// bgTop  = color de la seccion de ARRIBA (fondo del div)
// bgDown = color de la seccion de ABAJO  (fill del SVG path)
function Wave({ bgTop, bgDown, path, viewBox = "0 0 1440 70" }) {
  return (
    <div className="wave-wrap" style={{ background: bgTop }}>
      <svg viewBox={viewBox} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }}>
        <rect width="1440" height="70" fill={bgTop} />
        <path d={path} fill={bgDown} />
      </svg>
    </div>
  );
}

// ── SensorCard ─────────────────────────────────────────────
function SensorCard({ id, color, label, status, statusClass, compact, W, H, N, hist, step }) {
  const { lineD, fillD, last } = buildPaths(hist, N, W, H, step);
  const val = Math.round(hist[hist.length - 1]);
  const gId = `g${id}`, glowId = `glow${id}`;

  return (
    <div className={`hvc${compact ? " compact" : ""}`}>
      <div className="hvc-accent" style={{ background: color }} />
      <div className="hvc-top">
        <div className="hvc-sensor-badge" style={{ background: `${color}12`, color, borderColor: `${color}28` }}>MQ-{id}</div>
        <span className="hvc-label">{label}</span>
        <span className={`hvc-status ${statusClass}`}>{status}</span>
      </div>
      <div className="hvc-val-row">
        <span className="hvc-num" style={{ color }}>{val}</span>
        <span className="hvc-unit">ppm</span>
      </div>
      <div className="hvc-chart">
        <svg className="hvc-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={gId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity=".10" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
            <filter id={glowId}>
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <path fill={`url(#${gId})`} d={fillD} />
          <path fill="none" stroke={color} strokeWidth={compact ? "1.1" : "1.2"} strokeLinecap="round" strokeLinejoin="round" filter={`url(#${glowId})`} d={lineD} />
          <circle className="live-ring" cx={last.x.toFixed(1)} cy={last.y.toFixed(1)} r={compact ? "2.5" : "3"} fill="none" stroke={color} strokeWidth="1" />
          <circle className="live-core" cx={last.x.toFixed(1)} cy={last.y.toFixed(1)} r={compact ? "2" : "2.2"} fill={color} />
        </svg>
      </div>
      <div className="hvc-live-row">
        <div className="hvc-live-dot" style={{ background: color, boxShadow: `0 0 8px ${color}66` }} />
        {compact ? "En vivo" : "En vivo · cada 2s"}
      </div>
    </div>
  );
}

// ── MonitorChart ──────────────────────────────────────────
function MonitorChart({ hist, currentVal }) {
  const W = 500, H = 160, N = 32;
  const { lineD, fillD, last } = buildPathsMonitor(hist, N, W, H);
  return (
    <div className="monitor-panel">
      <div className="mp-header">
        <div className="mp-sensor-dot" />
        <span className="mp-title">MQ-2 · Sala-01 · Últimas 24 lecturas</span>
        <div className="mp-live-badge"><div className="mp-live-pulse" />En vivo</div>
      </div>
      <div className="mp-chart-wrap">
        <svg className="mp-line-chart" viewBox="0 0 500 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="mp-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#05071A" stopOpacity=".10" />
              <stop offset="85%" stopColor="#05071A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="32" x2="500" y2="32" stroke="rgba(5,7,26,.05)" strokeWidth="1" />
          <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(5,7,26,.05)" strokeWidth="1" />
          <line x1="0" y1="128" x2="500" y2="128" stroke="rgba(5,7,26,.05)" strokeWidth="1" />
          <path fill="url(#mp-grad)" d={fillD} />
          <path fill="none" stroke="#05071A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d={lineD} />
          <circle r="5" fill="none" stroke="#05071A" strokeWidth="1" opacity=".3" cx={last.x.toFixed(1)} cy={last.y.toFixed(1)} />
          <circle r="3" fill="#05071A" cx={last.x.toFixed(1)} cy={last.y.toFixed(1)} />
        </svg>
      </div>
      <div className="mp-value-row">
        <span className="mp-current-val">{currentVal}</span>
        <span className="mp-current-unit">ppm</span>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────
export default function RilAmb() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const N2 = 52, N7 = 32, N4 = 32, NM = 32;

  // Historial limpio en refs — nunca se contamina con jitter
  const hist2Ref = useRef(null);
  const hist7Ref = useRef(null);
  const hist4Ref = useRef(null);
  const histMRef = useRef(null);

  // State de display: copia del ref + jitter temporal en el último punto
  const [disp2, setDisp2] = useState(() => initHist(N2, 247, 100, 490, 28));
  const [disp7, setDisp7] = useState(() => initHist(N7, 83, 18, 260, 13));
  const [disp4, setDisp4] = useState(() => initHist(N4, 162, 55, 430, 22));
  const [dispM, setDispM] = useState(() => initHist(NM, 247, 150, 450, 28));

  const phaseRef = useRef(0);
  const rafRef = useRef(null);

  // Inicializar refs una sola vez
  useEffect(() => {
    if (!hist2Ref.current) hist2Ref.current = [...disp2];
    if (!hist7Ref.current) hist7Ref.current = [...disp7];
    if (!hist4Ref.current) hist4Ref.current = [...disp4];
    if (!histMRef.current) histMRef.current = [...dispM];
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    document.querySelectorAll(".reveal,.reveal-left,.reveal-right").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const frame = () => {
      phaseRef.current += 0.012;
      const p = phaseRef.current;

      // Lee el historial limpio del ref, aplica jitter SOLO en el último punto
      setDisp2([...hist2Ref.current.slice(0, -1),
        hist2Ref.current[hist2Ref.current.length - 1] + Math.sin(p * 1.7) * 0.6]);
      setDisp7([...hist7Ref.current.slice(0, -1),
        hist7Ref.current[hist7Ref.current.length - 1] + Math.sin(p * 1.7 + 2.3) * 0.6]);
      setDisp4([...hist4Ref.current.slice(0, -1),
        hist4Ref.current[hist4Ref.current.length - 1] + Math.sin(p * 1.7 + 4.6) * 0.6]);
      setDispM([...histMRef.current.slice(0, -1),
        histMRef.current[histMRef.current.length - 1] + Math.sin(p * 1.8) * 0.5]);

      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const update = (ref, setter, N, min, max, step) => {
      const last = ref.current[ref.current.length - 1];
      const next = Math.round(Math.max(min, Math.min(max, last + (Math.random() - 0.47) * step)));
      ref.current = [...ref.current, next];
      if (ref.current.length > N) ref.current = ref.current.slice(1);
      // El RAF ya lo mostrará en el próximo frame, no necesitamos setear aquí
    };
    const t2 = setInterval(() => update(hist2Ref, setDisp2, N2, 100, 490, 28), 1800);
    const t7 = setInterval(() => update(hist7Ref, setDisp7, N7, 18, 260, 13), 2060);
    const t4 = setInterval(() => update(hist4Ref, setDisp4, N4, 55, 430, 22), 2320);
    const tM = setInterval(() => update(histMRef, setDispM, NM, 150, 450, 28), 2000);
    return () => { clearInterval(t2); clearInterval(t7); clearInterval(t4); clearInterval(tM); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  const monitorVal = Math.round(dispM[dispM.length - 1]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* NAV */}
      <nav className={navScrolled ? "scrolled" : ""}>
        <a href="#inicio" className="nav-brand" onClick={(e) => handleNavClick(e, '#inicio')}>
          <img src={logo} alt="RilAmb Logo" style={{ width: "45px", height: "36px", borderRadius: "10px", objectFit: "contain" }} />
          <div className="nav-brand-name">RilAmb</div>
        </a>
        <div className="nav-space" />
        <div className="nav-links">
          <a href="#inicio" onClick={(e) => handleNavClick(e, '#inicio')}>Inicio</a>
          <a href="#nosotros" onClick={(e) => handleNavClick(e, '#nosotros')}>Nosotros</a>
          <a href="#plataforma" onClick={(e) => handleNavClick(e, '#plataforma')}>Plataforma</a>
          <a href="#sensores" onClick={(e) => handleNavClick(e, '#sensores')}>Sensores</a>
          <a href="#monitoreo" onClick={(e) => handleNavClick(e, '#monitoreo')}>Monitoreo</a>
        </div>
        <a href="/login" className="nav-cta nav-main-cta">Acceder</a>
        <button className={`nav-hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(o => !o)} aria-label="Menú">
          <span /><span /><span />
        </button>
      </nav>

      {/* DRAWER */}
      <div className={`nav-overlay${menuOpen ? " open" : ""}`} onClick={closeMenu} />
      <div className={`nav-drawer${menuOpen ? " open" : ""}`}>
        <a href="#inicio" onClick={(e) => handleNavClick(e, '#inicio')}>Inicio</a>
        <a href="#nosotros" onClick={(e) => handleNavClick(e, '#nosotros')}>Nosotros</a>
        <a href="#plataforma" onClick={(e) => handleNavClick(e, '#plataforma')}>Plataforma</a>
        <a href="#sensores" onClick={(e) => handleNavClick(e, '#sensores')}>Sensores</a>
        <a href="#monitoreo" onClick={(e) => handleNavClick(e, '#monitoreo')}>Monitoreo</a>
        <a href="/login" className="drawer-cta" onClick={closeMenu}>Acceder</a>
      </div>

      {/* ── HERO ── bg: var(--page) = #F2F3F8 */}
      <section className="hero" id="inicio">
        <div className="hero-bg">
          <div className="hero-bg-gradient" />
          <div className="hero-grid" />
        </div>
        <div className="hero-inner">
          <div className="hero-left">
            <h1 className="hero-h1">Protege tu hogar<br />de gases<br /><strong>invisibles</strong></h1>
            <p className="hero-sub">Detección avanzada de gases en tiempo real. Monitoreo continuo, alertas automáticas y gestión centralizada para espacios cerrados críticos.</p>
            <div className="hero-ctas">
              <a href="/register" className="btn-primary">Comenzar ahora <IconArrow /></a>
              <a href="/login" className="btn-secondary">Ver monitoreo <IconArrow /></a>
            </div>
          </div>
          <div className="hero-right">
            <SensorCard id="2" color="#2563EB" label="Gas inflamable & humo" status="Seguro" statusClass="s-safe" compact={false} W={400} H={64} N={N2} hist={disp2} step={28} />
            <SensorCard id="7" color="#0A8F5F" label="Monóxido de carbono" status="Alerta" statusClass="s-alert" compact={true} W={200} H={48} N={N7} hist={disp7} step={13} />
            <SensorCard id="4" color="#D97706" label="Metano" status="Precaución" statusClass="s-warn" compact={true} W={200} H={48} N={N4} hist={disp4} step={22} />
          </div>
        </div>
      </section>

      {/* Wave: hero (#F2F3F8) → nosotros (#F8F9FC) */}
      <Wave bgTop="#F2F3F8" bgDown="#F8F9FC" path="M0,0 C360,70 1080,70 1440,0 L1440,70 L0,70 Z" />

      {/* ── NOSOTROS ── */}
      <section className="about-section" id="nosotros">
        <div className="about-layout">
          <div className="about-left">
            <div className="section-label reveal">Nosotros</div>
            <h2 className="section-h2 reveal reveal-delay-1">Tecnología diseñada<br />para <strong>entornos críticos</strong></h2>
            <p className="section-sub reveal reveal-delay-2" style={{ marginBottom: 28 }}>RilAmb nace de la necesidad real de proteger personas en espacios donde los gases invisibles representan un peligro constante. Combinamos hardware de precisión con software inteligente para ofrecer una plataforma unificada, escalable y confiable.</p>
            <p className="section-sub reveal reveal-delay-3">Nuestro sistema aprende patrones de comportamiento para anticipar situaciones de riesgo antes de que ocurran, reduciendo falsas alarmas y maximizando la seguridad efectiva.</p>
          </div>
          <div className="about-visual-wrap reveal-right">
            <div className="about-metric">
              <div className="am-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "var(--ink)" }} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg></div>
              <div className="am-num">24/7</div><div className="am-label">Monitoreo continuo automatizado</div>
            </div>
            <div className="about-metric">
              <div className="am-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "var(--ink)" }} strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg></div>
              <div className="am-num">&lt;2s</div><div className="am-label">Detección y alerta temprana</div>
            </div>
            <div className="about-metric">
              <div className="am-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "var(--ink)" }} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg></div>
              <div className="am-num">∞</div><div className="am-label">Escalabilidad de dispositivos</div>
            </div>
            <div className="about-metric">
              <div className="am-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "var(--ink)" }} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg></div>
              <div className="am-num">99.8%</div><div className="am-label">Precisión validada en campo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Micro-wave suave: nosotros (#F8F9FC) → plataforma (#F2F3F8) */}
      <Wave bgTop="#F8F9FC" bgDown="#F2F3F8" path="M0,40 C480,0 960,70 1440,40 L1440,70 L0,70 Z" />

      {/* ── PLATAFORMA ── */}
      <section style={{ background: "#F2F3F8", padding: "80px clamp(24px,6vw,80px)" }} id="plataforma">
        <div className="section-label reveal">Plataforma</div>
        <h2 className="section-h2 reveal reveal-delay-1">Una plataforma.<br /><strong>Control total.</strong></h2>
        <p className="section-sub reveal reveal-delay-2">Panel unificado que integra hardware de precisión y software inteligente para proteger lo que más importa.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 14, marginTop: 52 }}>
          <div className="about-metric reveal reveal-delay-1" style={{ borderRadius: "var(--r-lg)" }}>
            <div className="am-icon" style={{ width: 40, height: 40, borderRadius: "var(--r-sm)" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "var(--ink)" }} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg></div>
            <h3 style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-.025em", marginBottom: 8, color: "var(--ink)" }}>Alertas automáticas</h3>
            <p style={{ fontSize: 12.5, color: "var(--i60)", lineHeight: 1.6, fontWeight: 300 }}>Notificaciones instantáneas cuando los niveles superan umbrales definidos. Reglas personalizadas por zona.</p>
          </div>
          <div className="about-metric reveal reveal-delay-2" style={{ borderRadius: "var(--r-lg)", marginTop: 0 }}>
            <div className="am-icon" style={{ width: 40, height: 40, borderRadius: "var(--r-sm)" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "var(--ink)" }} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg></div>
            <h3 style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-.025em", marginBottom: 8, color: "var(--ink)" }}>Gestión centralizada</h3>
            <p style={{ fontSize: 12.5, color: "var(--i60)", lineHeight: 1.6, fontWeight: 300 }}>Panel único para usuarios, roles, dispositivos y reportes. Control total desde cualquier lugar.</p>
          </div>
          <div className="about-metric reveal reveal-delay-3" style={{ borderRadius: "var(--r-lg)", marginTop: 0 }}>
            <div className="am-icon" style={{ width: 40, height: 40, borderRadius: "var(--r-sm)" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "var(--ink)" }} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg></div>
            <h3 style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-.025em", marginBottom: 8, color: "var(--ink)" }}>Reportes y analítica</h3>
            <p style={{ fontSize: 12.5, color: "var(--i60)", lineHeight: 1.6, fontWeight: 300 }}>Historiales detallados, gráficas de tendencia y reportes exportables para cumplimiento normativo.</p>
          </div>
          <div className="about-metric reveal reveal-delay-2" style={{ borderRadius: "var(--r-lg)", marginTop: 0 }}>
            <div className="am-icon" style={{ width: 40, height: 40, borderRadius: "var(--r-sm)" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "var(--ink)" }} strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg></div>
            <h3 style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-.025em", marginBottom: 8, color: "var(--ink)" }}>Monitoreo inteligente</h3>
            <p style={{ fontSize: 12.5, color: "var(--i60)", lineHeight: 1.6, fontWeight: 300 }}>El sistema aprende patrones de comportamiento para anticipar situaciones de riesgo antes de que ocurran.</p>
          </div>
        </div>
      </section>

      {/* Wave: plataforma → sensores */}
      <Wave bgTop="#F2F3F8" bgDown="#FBFBFD" path="M0,72 C360,0 1080,0 1440,72 L1440,72 L0,72 Z" viewBox="0 0 1440 70" />

      {/* ── SENSORES ── marginTop:-1px tapa cualquier gap subpixel */}
      <section className="sensors-section" id="sensores" style={{ background: "#FBFBFD" }}>
        <div className="section-label reveal">Tecnología de sensores</div>
        <h2 className="section-h2 reveal reveal-delay-1">Tres sensores.<br /><strong>Cobertura total.</strong></h2>
        <p className="section-sub reveal reveal-delay-2">Calibrados para detección específica con mínimas falsas alarmas.</p>
        <div className="sensors-grid">
          <div className="flip-card reveal reveal-delay-1"><div className="flip-inner"><div className="flip-front">
            <div className="flip-accent-bar bar-mq2" />
            <div className="am-icon" style={{ width: 40, height: 40, borderRadius: "var(--r-sm)" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "var(--ink)" }} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c0 0-5 5-5 10a5 5 0 0 0 10 0c0-5-5-10-5-10z" /><line x1="12" y1="12" x2="12" y2="22" /></svg></div>
            <h3 style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-.03em", marginBottom: 10, color: "var(--ink)" }}>MQ-2</h3>
            <p style={{ fontSize: 13, color: "var(--i60)", lineHeight: 1.65, fontWeight: 400 }}>Gas inflamable y humo</p>
            <p style={{ fontSize: 12, color: "var(--i40)", lineHeight: 1.6, fontWeight: 300, marginTop: 10 }}>Detecta gases combustibles y humo en espacios industriales y domésticos.</p>
          </div></div></div>
          <div className="flip-card reveal reveal-delay-2"><div className="flip-inner"><div className="flip-front">
            <div className="flip-accent-bar bar-mq7" />
            <div className="am-icon" style={{ width: 40, height: 40, borderRadius: "var(--r-sm)" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "var(--ink)" }} strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31l-3.21 3.21A8 8 0 1 0 20 12.5" /><path d="M10 2h6" /><line x1="16" y1="2" x2="16" y2="9" /></svg></div>
            <h3 style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-.03em", marginBottom: 10, color: "var(--ink)" }}>MQ-7</h3>
            <p style={{ fontSize: 13, color: "var(--i60)", lineHeight: 1.65, fontWeight: 400 }}>Monóxido de carbono</p>
            <p style={{ fontSize: 12, color: "var(--i40)", lineHeight: 1.6, fontWeight: 300, marginTop: 10 }}>Especializado en la detección de monóxido de carbono en ambientes cerrados e industriales.</p>
          </div></div></div>
          <div className="flip-card reveal reveal-delay-3"><div className="flip-inner"><div className="flip-front">
            <div className="flip-accent-bar bar-mq4" />
            <div className="am-icon" style={{ width: 40, height: 40, borderRadius: "var(--r-sm)" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "var(--ink)" }} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg></div>
            <h3 style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-.03em", marginBottom: 10, color: "var(--ink)" }}>MQ-4</h3>
            <p style={{ fontSize: 13, color: "var(--i60)", lineHeight: 1.65, fontWeight: 400 }}>Gas natural y metano</p>
            <p style={{ fontSize: 12, color: "var(--i40)", lineHeight: 1.6, fontWeight: 300, marginTop: 10 }}>Alta precisión para fugas de gas natural doméstico e industrial.</p>
          </div></div></div>
        </div>
      </section>

      {/* Wave: sensores (#FBFBFD) → monitoreo (#F7F8FA) */}
      <Wave bgTop="#FBFBFD" bgDown="#F7F8FA" path="M0,0 C720,70 1440,0 1440,0 L1440,70 L0,70 Z" />

      {/* ── MONITOREO ── bg: #F7F8FA */}
      <section className="monitor-section" id="monitoreo" style={{ padding: "80px clamp(20px,5vw,80px)" }}>
        <div className="monitor-layout">
          <div className="monitor-left-col">
            <div className="section-label reveal">Monitoreo</div>
            <h2 className="section-h2 reveal reveal-delay-1">Datos en<br /><strong>tiempo real</strong></h2>
            <p className="section-sub reveal reveal-delay-2" style={{ marginBottom: 32 }}>Visualiza el estado de cada sensor al instante. Actualización cada 2 segundos con análisis de tendencia automático.</p>
            <div className="reveal-left">
              <MonitorChart hist={dispM} currentVal={monitorVal} />
            </div>
          </div>
          <div className="monitor-text-col reveal-right" style={{ transitionDelay: ".1s" }}>
            <div className="mf-item">
              <div className="mf-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "var(--ink)" }} strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg></div>
              <div className="mf-content"><h4>Tendencia en vivo</h4><p>Visualización continua con actualización automática cada 2 segundos.</p></div>
            </div>
            <div className="mf-item">
              <div className="mf-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "var(--ink)" }} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div>
              <div className="mf-content"><h4>Historial completo</h4><p>Registro con timestamps precisos, exportación de reportes en excel para auditorías y cumplimiento normativo.</p></div>
            </div>
            <div className="mf-item">
              <div className="mf-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "var(--ink)" }} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg></div>
              <div className="mf-content"><h4>Alertas automáticas</h4><p>Notificaciones instantáneas al superar umbrales definidos. Alertas por zona.</p></div>
            </div>
            <div className="mf-item">
              <div className="mf-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "var(--ink)" }} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg></div>
              <div className="mf-content"><h4>Análisis continuo de sensores</h4><p>Diseñado para detectar automáticamente cambios críticos y variaciones en la concentración de gases con alta precisión.</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave: monitoreo (#F7F8FA) → CTA (#F2F3F8) */}
      <Wave bgTop="#F7F8FA" bgDown="#F2F3F8" path="M0,35 C360,70 1080,0 1440,35 L1440,70 L0,70 Z" />

      {/* ── CTA ── bg: #F2F3F8 */}
      <section className="cta-section">
        <div className="cta-card reveal">
          <div className="cta-glow" />
          <h2 className="section-h2 reveal reveal-delay-1">Protege tu espacio con<br /><strong>tecnología inteligente</strong></h2>
          <p className="cta-sub reveal reveal-delay-2">Configura tu primera instalación en minutos. Conecta tus dispositivos y empieza a monitorear de inmediato.</p>
          <div className="cta-btns reveal reveal-delay-3">
            <a href="/register" className="btn-primary">Crear cuenta gratuita <IconArrow /></a>
            <a href="/login" className="btn-secondary">Acceder a mi cuenta</a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-inner">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <img src={darkLogo} alt="RilAmb Logo" style={{ width: "30px", height: "24px", borderRadius: "9px", objectFit: "contain" }} />
              <span className="footer-logo-name">RilAmb</span>
            </div>
            <p className="footer-desc">Plataforma de detección y monitoreo de gases en espacios cerrados.</p>
            <div className="footer-contact">
              <div className="footer-contact-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.92.32 1.82.6 2.67a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.41-1.26a2 2 0 0 1 2.11-.45c.85.28 1.75.48 2.67.6A2 2 0 0 1 22 16.92z" /></svg>+57 311 636 5936</div>
              <div className="footer-contact-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>contacto@rilamb.xyz</div>
            </div>
          </div>
          <div className="footer-col">
            <h4>Plataforma</h4>
            <ul>
              <li><a href="#sensores" onClick={(e) => handleNavClick(e, '#sensores')}>Sensores</a></li>
              <li><a href="#monitoreo" onClick={(e) => handleNavClick(e, '#monitoreo')}>Monitoreo</a></li>
              <li><a href="#nosotros" onClick={(e) => handleNavClick(e, '#nosotros')}>Nosotros</a></li>
              <li><a href="#plataforma" onClick={(e) => handleNavClick(e, '#plataforma')}>Características</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Acceso</h4>
            <ul>
              <li><a href="/login">Iniciar sesión</a></li>
              <li><a href="/register">Crear cuenta</a></li>
              <li><a href="/recover-password">Recuperar contraseña</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 RilAmb — Todos los derechos reservados</span>
        </div>
      </footer>
    </>
  );
}