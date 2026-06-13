import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap');

*{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{width:100%;height:100%;background-color:#F0F0F4;}

@keyframes fadeIn{from{opacity:0;transform:scale(.99)}to{opacity:1;transform:none}}
@keyframes fadeOut{from{opacity:1;filter:blur(0px)}to{opacity:0;filter:blur(12px)}}

.session-splash{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background-color:#F0F0F4;color:#00082C;overflow:hidden;font-family:'Inter',system-ui,sans-serif;animation:fadeIn .12s ease both;}
.session-splash.fade-out{animation:fadeOut .22s ease forwards;}
.stage{width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;background-color:#F0F0F4;}
.logo-group{display:flex;align-items:center;justify-content:center;opacity:1;transition:opacity .22s ease,filter .22s ease,transform .22s ease;}
.logo-group.is-out{opacity:0;transform:scale(.99);filter:blur(8px);}
.logo-svg{width:clamp(200px,40vmin,400px);height:clamp(200px,40vmin,400px);overflow:visible;display:block;}
.cc-main{opacity:0;}
.cc-main.play{animation:ccMainIn 170ms cubic-bezier(.22,1,.36,1) forwards;}
@keyframes ccMainIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
.dot{opacity:0;transform:scale(.4);transform-origin:center;}
.dot.play{animation:dotPop 110ms cubic-bezier(.22,1,.36,1) forwards;}
@keyframes dotPop{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:scale(1)}}
.d-n.play{animation-delay:0ms;}
.d-ne.play{animation-delay:24ms;}
.d-e.play{animation-delay:48ms;}
.d-se.play{animation-delay:72ms;}
.d-s.play{animation-delay:96ms;}
.d-w.play{animation-delay:120ms;}
.d-nw.play{animation-delay:144ms;}
`;

function LogoSvg() {
  return (
    <svg className="logo-svg" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle id="cc-main" className="cc-main play" cx="80" cy="80" r="13" fill="#00082C" />
      <g id="d-n" className="dot d-n play" style={{ transformOrigin: "80px 57.9px" }}><circle cx="80" cy="57.9" r="3.5" fill="#00082C" /></g>
      <g id="d-e" className="dot d-e play" style={{ transformOrigin: "102.1px 80px" }}><circle cx="102.1" cy="80" r="5.4" fill="#00082C" /></g>
      <g id="d-w" className="dot d-w play" style={{ transformOrigin: "57.9px 80px" }}><circle cx="57.9" cy="80" r="2.8" fill="#00082C" /></g>
      <g id="d-s" className="dot d-s play" style={{ transformOrigin: "80px 102.1px" }}><circle cx="80" cy="102.1" r="3.5" fill="#00082C" /></g>
      <g id="d-ne" className="dot d-ne play" style={{ transformOrigin: "96.4px 63.6px" }}><circle cx="96.4" cy="63.6" r="2.25" fill="#00082C" /></g>
      <g id="d-nw" className="dot d-nw play" style={{ transformOrigin: "63.6px 63.6px" }}><circle cx="63.6" cy="63.6" r="2.25" fill="#00082C" /></g>
      <g id="d-se" className="dot d-se play" style={{ transformOrigin: "96.4px 96.4px" }}><circle cx="96.4" cy="96.4" r="2.25" fill="#00082C" /></g>
    </svg>
  );
}

export default function SessionLogo() {
  const navigate = useNavigate();
  const location = useLocation();
  const nextPath = location.state?.next || "/";
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setFadeOut(true), 430);
    const navTimer = window.setTimeout(() => navigate(nextPath, { replace: true }), 610);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(navTimer);
    };
  }, [navigate, nextPath]);

  return (
    <>
      <style>{css}</style>
      <div className={`session-splash${fadeOut ? " fade-out" : ""}`}>
        <div className="stage">
          <div className={`logo-group${fadeOut ? " is-out" : ""}`}>
            <LogoSvg />
          </div>
        </div>
      </div>
    </>
  );
}