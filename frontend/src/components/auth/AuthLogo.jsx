// frontend/src/components/auth/AuthLogo.jsx

import logoImg from "../../assets/whiteLogo.png";

export default function AuthLogo({
  containerClassName = "",
  markClassName = "",
  textClassName = "",
}) {
  return (
    <div className={containerClassName}>
      <div className={markClassName}>
        <img src={logoImg} alt="" />
      </div>

      <span className={textClassName}>
        RilAmb
      </span>
    </div>
  );
}