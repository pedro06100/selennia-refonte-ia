// frontend/app/ia.service.js

export async function estimateFromPhoto({ file, category, description }) {
  const form = new FormData();
  form.append("image", file);
  form.append("category", category || "");
  form.append("description", description || "");

  const res = await fetch("/api/ia/estimate", {
    method: "POST",
    body: form
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "IA_ERROR");
  }

  return await res.json();
}
