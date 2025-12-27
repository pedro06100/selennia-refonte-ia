export function revealAnalysisSequence() {
  const steps = document.querySelectorAll(".analysis-step");
  steps.forEach((step, index) => {
    setTimeout(() => {
      step.classList.add("is-visible");
    }, 400 + index * 500);
  });
}
