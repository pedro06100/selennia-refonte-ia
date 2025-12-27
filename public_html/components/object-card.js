export function objectCard(item) {
  return `
    <div class="object-card" onclick="window.__focus(${item.id})">
      <img src="${item.image}" alt="${item.title}" />
      <h3>${item.title}</h3>
      <p class="human">${item.human}</p>
      <span class="price">${item.price}</span>
    </div>
  `;
}
