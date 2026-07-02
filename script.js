document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initProducts();
  initModal();
});

function initNav() {
  const navLinks = document.querySelectorAll(".nav-link, .scroll-cue, .btn-primary");
  const burger = document.getElementById("navBurger");
  const mobileMenu = document.getElementById("navLinksMobile");

  function closeMobileMenu() {
    mobileMenu.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }

  function openMobileMenu() {
    mobileMenu.classList.add("is-open");
    burger.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
  }

  navLinks.forEach((el) => {
    el.addEventListener("click", () => {
      const targetSel = el.dataset.target;
      if (!targetSel) return;
      const target = document.querySelector(targetSel);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      closeMobileMenu();
    });
  });

  burger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("is-open");
    if (isOpen) closeMobileMenu();
    else openMobileMenu();
  });

  document.addEventListener("click", (e) => {
    if (!mobileMenu.classList.contains("is-open")) return;
    if (mobileMenu.contains(e.target) || burger.contains(e.target)) return;
    closeMobileMenu();
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 720) closeMobileMenu();
    }, 150);
  });

  const sections = ["#sobre", "#produtos", "#contato"]
    .map((sel) => document.querySelector(sel))
    .filter(Boolean);

  const allNavButtons = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = `#${entry.target.id}`;
          allNavButtons.forEach((btn) => {
            btn.classList.toggle("is-active", btn.dataset.target === id);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
}

const PRODUCTS = [
  { id: 1, img: "fotos/foto1.jpeg", nome: "Vestido Longo", categoria: "Vestidos", tamanho: "P / M / G / GG", preco: "R$ 40,00" },
  { id: 2, img: "fotos/foto2.jpeg", nome: "Corta Vento", categoria: "Corta Vento", tamanho: "M / G / GG", preco: "R$ 40,00" },
  { id: 3, img: "fotos/foto3.jpeg", nome: "Jaqueta Térmica", categoria: "Jaqueta", tamanho: "M / G", preco: "R$ 60,00" },
  { id: 4, img: "fotos/foto4.jpeg", nome: "Jaqueta Térmica", categoria: "Jaqueta", tamanho: "P / M", preco: "R$ 60,00" },
  { id: 5, img: "fotos/foto5.jpeg", nome: "Vestido", categoria: "Vestido", tamanho: "Unico(36-42)", preco: "R$ 40,00" },
];

function initProducts() {
  const grid = document.getElementById("productGrid");

  grid.innerHTML = PRODUCTS.map(
    (p) => `
    <button type="button" class="product-card" data-id="${p.id}" aria-haspopup="dialog">
      <span class="product-card-img product-card-img--empty">
        <img src="${p.img}" alt="${p.nome}" loading="lazy"
             onerror="this.style.display='none'">
      </span>
      <span class="product-card-body">
        <h3>${p.nome}</h3>
        <span class="product-card-price">${p.preco}</span>
      </span>
    </button>`
  ).join("");

  grid.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => {
      const product = PRODUCTS.find((p) => p.id === Number(card.dataset.id));
      if (product) openModal(product, card);
    });
  });
}

const WHATSAPP_NUMBER = "55123456789";

let lastFocusedEl = null;
let lockedScrollY = 0;

function buildWhatsappLink(product) {
  const mensagem =
    `Olá! Vim pelo site da Grife Nacional e tenho interesse nesta peça:\n\n` +
    `Produto: ${product.nome}\n` +
    `Categoria: ${product.categoria}\n` +
    `Tamanho: ${product.tamanho}\n` +
    `Valor: ${product.preco}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
}

function initModal() {
  const modal = document.getElementById("productModal");
  const backdrop = document.getElementById("modalBackdrop");
  const closeBtn = document.getElementById("modalClose");

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });
}

function lockBodyScroll() {
  lockedScrollY = window.scrollY || window.pageYOffset || 0;
  document.body.style.position = "fixed";
  document.body.style.top = `-${lockedScrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
}

function unlockBodyScroll() {
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  window.scrollTo(0, lockedScrollY);
}

function openModal(product, triggerEl) {
  const modal = document.getElementById("productModal");
  document.getElementById("modalImg").src = product.img;
  document.getElementById("modalImg").alt = product.nome;
  document.getElementById("modalCategory").textContent = product.categoria;
  document.getElementById("modalProductName").textContent = product.nome;
  document.getElementById("modalSize").textContent = product.tamanho;
  document.getElementById("modalPrice").textContent = product.preco;

  const buyBtn = document.getElementById("modalBuyBtn");
  if (buyBtn) buyBtn.href = buildWhatsappLink(product);

  lastFocusedEl = triggerEl || document.activeElement;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  lockBodyScroll();

  const closeBtn = document.getElementById("modalClose");
  if (closeBtn) closeBtn.focus({ preventScroll: true });
}

function closeModal() {
  const modal = document.getElementById("productModal");
  if (!modal.classList.contains("is-open")) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  unlockBodyScroll();

  if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
    lastFocusedEl.focus({ preventScroll: true });
  }
}
