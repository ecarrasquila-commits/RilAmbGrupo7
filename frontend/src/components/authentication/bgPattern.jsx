// frontend/src/components/auth/bgPattern.jsx

// ======================================================
// Patrón SVG de fondo
// Fondo decorativo fijo utilizado en vistas de autenticación.
// ======================================================

const BgPattern = () => (
  <svg
    style={{
      position: "fixed",
      inset: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 0,
    }}
    viewBox="0 0 1440 900"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Estilos SVG compartidos */}
    <defs>
      <style>{`
        .bc  { fill: none; stroke: rgba(0,8,44,0.07); }
        .bf  { fill: rgba(217,218,219,0.279); }
        .bfn { fill: #e7e7eca6; }
        .bms { fill: none; stroke: #D0D0D8; }
      `}</style>
    </defs>

    {/* ======================================================
        SECCIÓN IZQUIERDA
    ====================================================== */}

    {/* Izquierda superior */}
    <circle className="bc" cx="47" cy="38" r="4" strokeWidth="0.6" />
    <circle className="bc" cx="112" cy="22" r="9" strokeWidth="0.7" />
    <circle className="bc" cx="83" cy="74" r="6" strokeWidth="0.6" />
    <circle className="bc" cx="31" cy="112" r="14" strokeWidth="0.7" />
    <circle className="bc" cx="148" cy="95" r="5" strokeWidth="0.5" />
    <circle className="bc" cx="193" cy="48" r="11" strokeWidth="0.7" />
    <circle className="bc" cx="228" cy="130" r="7" strokeWidth="0.6" />
    <circle className="bc" cx="66" cy="165" r="18" strokeWidth="0.7" />
    <circle className="bc" cx="170" cy="172" r="4" strokeWidth="0.5" />

    {/* Izquierda media */}
    <circle className="bf" cx="55" cy="295" r="30" strokeWidth="0.8" />
    <circle className="bc" cx="148" cy="258" r="10" strokeWidth="0.6" />
    <circle className="bc" cx="205" cy="312" r="20" strokeWidth="0.7" />
    <circle className="bc" cx="32" cy="368" r="8" strokeWidth="0.6" />
    <circle className="bc" cx="165" cy="390" r="5" strokeWidth="0.5" />
    <circle className="bc" cx="97" cy="430" r="14" strokeWidth="0.7" />
    <circle className="bc" cx="222" cy="445" r="7" strokeWidth="0.6" />
    <circle className="bc" cx="44" cy="480" r="22" strokeWidth="0.7" />
    <circle className="bc" cx="182" cy="490" r="4" strokeWidth="0.5" />

    {/* Izquierda inferior */}
    <circle className="bf" cx="148" cy="620" r="50" strokeWidth="0.8" />
    <circle className="bc" cx="52" cy="570" r="12" strokeWidth="0.7" />
    <circle className="bc" cx="232" cy="598" r="9" strokeWidth="0.6" />
    <circle className="bc" cx="78" cy="660" r="18" strokeWidth="0.7" />
    <circle className="bc" cx="205" cy="672" r="6" strokeWidth="0.5" />
    <circle className="bc" cx="34" cy="720" r="5" strokeWidth="0.5" />
    <circle className="bc" cx="162" cy="738" r="13" strokeWidth="0.7" />
    <circle className="bc" cx="112" cy="795" r="7" strokeWidth="0.6" />
    <circle className="bc" cx="228" cy="810" r="4" strokeWidth="0.5" />
    <circle className="bc" cx="68" cy="850" r="10" strokeWidth="0.6" />

    {/* ======================================================
        SECCIÓN DERECHA
    ====================================================== */}

    {/* Derecha superior */}
    <circle className="bc" cx="1398" cy="55" r="6" strokeWidth="0.6" />
    <circle className="bc" cx="1328" cy="18" r="12" strokeWidth="0.7" />
    <circle className="bc" cx="1272" cy="62" r="5" strokeWidth="0.5" />
    <circle className="bc" cx="1405" cy="118" r="18" strokeWidth="0.7" />
    <circle className="bc" cx="1348" cy="140" r="8" strokeWidth="0.6" />
    <circle className="bc" cx="1248" cy="95" r="4" strokeWidth="0.5" />
    <circle className="bc" cx="1218" cy="148" r="14" strokeWidth="0.7" />
    <circle className="bc" cx="1375" cy="188" r="5" strokeWidth="0.5" />
    <circle className="bc" cx="1292" cy="195" r="9" strokeWidth="0.6" />

    {/* Derecha media */}
    <circle className="bf" cx="1385" cy="280" r="35" strokeWidth="0.8" />
    <circle className="bc" cx="1298" cy="255" r="7" strokeWidth="0.6" />
    <circle className="bc" cx="1232" cy="298" r="16" strokeWidth="0.7" />
    <circle className="bc" cx="1412" cy="355" r="11" strokeWidth="0.7" />
    <circle className="bc" cx="1265" cy="372" r="5" strokeWidth="0.5" />
    <circle className="bc" cx="1340" cy="400" r="20" strokeWidth="0.7" />
    <circle className="bc" cx="1215" cy="438" r="8" strokeWidth="0.6" />
    <circle className="bc" cx="1398" cy="460" r="4" strokeWidth="0.5" />
    <circle className="bc" cx="1275" cy="478" r="13" strokeWidth="0.7" />

    {/* Derecha inferior */}
    <circle className="bf" cx="1295" cy="635" r="58" strokeWidth="0.8" />
    <circle className="bc" cx="1398" cy="585" r="10" strokeWidth="0.6" />
    <circle className="bc" cx="1218" cy="608" r="15" strokeWidth="0.7" />
    <circle className="bc" cx="1368" cy="695" r="7" strokeWidth="0.6" />
    <circle className="bc" cx="1232" cy="680" r="20" strokeWidth="0.7" />
    <circle className="bc" cx="1410" cy="748" r="5" strokeWidth="0.5" />
    <circle className="bc" cx="1308" cy="760" r="9" strokeWidth="0.6" />
    <circle className="bc" cx="1258" cy="820" r="14" strokeWidth="0.7" />
    <circle className="bc" cx="1388" cy="838" r="4" strokeWidth="0.5" />
    <circle className="bc" cx="1195" cy="852" r="8" strokeWidth="0.6" />

    {/* ======================================================
        BLOBOS CENTRALES
    ====================================================== */}

    {/* Blob izquierdo */}
    <circle className="bfn" cx="318" cy="430" r="88" strokeWidth="0.8" />
    <circle className="bms" cx="242" cy="348" r="12" strokeWidth="0.7" />
    <circle className="bms" cx="220" cy="375" r="5" strokeWidth="0.5" />
    <circle className="bms" cx="410" cy="342" r="9" strokeWidth="0.6" />
    <circle className="bms" cx="438" cy="365" r="4" strokeWidth="0.5" />
    <circle className="bms" cx="248" cy="512" r="14" strokeWidth="0.7" />
    <circle className="bms" cx="228" cy="540" r="6" strokeWidth="0.5" />
    <circle className="bms" cx="406" cy="525" r="10" strokeWidth="0.6" />
    <circle className="bms" cx="210" cy="428" r="7" strokeWidth="0.6" />
    <circle className="bms" cx="428" cy="492" r="5" strokeWidth="0.5" />
    <circle className="bms" cx="334" cy="318" r="6" strokeWidth="0.5" />
    <circle className="bms" cx="302" cy="545" r="8" strokeWidth="0.6" />

    {/* Blob derecho */}
    <circle className="bfn" cx="1122" cy="468" r="78" strokeWidth="0.8" />
    <circle className="bms" cx="1048" cy="388" r="10" strokeWidth="0.6" />
    <circle className="bms" cx="1028" cy="415" r="5" strokeWidth="0.5" />
    <circle className="bms" cx="1205" cy="395" r="13" strokeWidth="0.7" />
    <circle className="bms" cx="1228" cy="420" r="5" strokeWidth="0.5" />
    <circle className="bms" cx="1042" cy="548" r="9" strokeWidth="0.6" />
    <circle className="bms" cx="1022" cy="572" r="4" strokeWidth="0.5" />
    <circle className="bms" cx="1200" cy="555" r="12" strokeWidth="0.7" />
    <circle className="bms" cx="1038" cy="468" r="7" strokeWidth="0.6" />
    <circle className="bms" cx="1215" cy="488" r="5" strokeWidth="0.5" />
    <circle className="bms" cx="1140" cy="385" r="6" strokeWidth="0.5" />
    <circle className="bms" cx="1108" cy="558" r="8" strokeWidth="0.6" />

    {/* ======================================================
        ELEMENTOS DECORATIVOS DISPERSOS
    ====================================================== */}

    <circle className="bc" cx="370" cy="80" r="6" strokeWidth="0.5" />
    <circle className="bc" cx="420" cy="195" r="10" strokeWidth="0.6" />
    <circle className="bc" cx="285" cy="228" r="4" strokeWidth="0.5" />
    <circle className="bc" cx="460" cy="640" r="8" strokeWidth="0.6" />
    <circle className="bc" cx="302" cy="750" r="5" strokeWidth="0.5" />
    <circle className="bc" cx="398" cy="840" r="11" strokeWidth="0.7" />
    <circle className="bc" cx="1070" cy="72" r="7" strokeWidth="0.6" />
    <circle className="bc" cx="988" cy="158" r="5" strokeWidth="0.5" />
    <circle className="bc" cx="1155" cy="205" r="9" strokeWidth="0.6" />
    <circle className="bc" cx="975" cy="620" r="6" strokeWidth="0.5" />
    <circle className="bc" cx="1145" cy="728" r="12" strokeWidth="0.7" />
    <circle className="bc" cx="1042" cy="845" r="5" strokeWidth="0.5" />
  </svg>
);

export default BgPattern;