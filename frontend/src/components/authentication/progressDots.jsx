// frontend/src/components/auth/progressDots.jsx

export default function ProgressDots({ step }) {
  return (
    <div className="rp-progress-dots">
      <div
        className={`rp-dot ${
          step > 1 ? "done" : step === 1 ? "active" : ""
        }`}
      />

      <div
        className={`rp-dot ${
          step > 2 ? "done" : step === 2 ? "active" : ""
        }`}
      />

      <div
        className={`rp-dot ${
          step > 3 ? "done" : step === 3 ? "active" : ""
        }`}
      />
    </div>
  );
}