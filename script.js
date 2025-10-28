// Lingua: IT di default; EN se browser non IT
const isIT = (navigator.language || "").toLowerCase().startsWith("it");

// i18n
const i18n = {
  it: {
    title: "🎯 LuckyExperience – Premi immediati per il tuo soggiorno",
    subtitle: "Sei nostro ospite? Gira la ruota e scopri il tuo premio garantito da utilizzare durante il soggiorno.",
    spinCta: "🎡 Gira la Ruota",
    youWon: "Hai vinto:",
    voucherTitle: "🎟️ Il tuo Voucher",
    voucherNote: "Mostra questo voucher in reception per riscattare il premio.",
    reviewTitle: "Ti è piaciuto il soggiorno?",
    reviewText: "Racconta la tua esperienza sul portale da cui hai prenotato, su Google o TripAdvisor. Grazie!",
    legalLine1: "LuckyExperience è un servizio indipendente proposto in collaborazione con strutture partner.",
    legalLine2: "Ogni partecipante ottiene sempre un premio garantito; non è gioco d’azzardo (D.P.R. 430/2001).",
    openVoucher: "🔗 Apri il voucher"
  },
  en: {
    title: "🎯 LuckyExperience – Instant perks during your stay",
    subtitle: "Already staying with us? Spin the wheel and get a guaranteed perk to enjoy during your stay.",
    spinCta: "🎡 Spin the Wheel",
    youWon: "You won:",
    voucherTitle: "🎟️ Your Voucher",
    voucherNote: "Show this voucher at reception to redeem your perk.",
    reviewTitle: "Enjoyed your stay?",
    reviewText: "Share your experience on your booking portal, Google or TripAdvisor. Thank you!",
    legalLine1: "LuckyExperience is an independent service offered in collaboration with partner properties.",
    legalLine2: "Every participant gets a guaranteed perk; this is not gambling (D.P.R. 430/2001).",
    openVoucher: "🔗 Open voucher"
  }
};

function setTexts() {
  const dict = isIT ? i18n.it : i18n.en;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  const openVoucher = document.getElementById("openVoucher");
  if (openVoucher) openVoucher.textContent = dict.openVoucher;
}
setTexts();

// Premi con pesi richiesti
// Più frequenti: Aperitivo, Sconto 20%
// Meno: Prosecco Big + Stuzzicheria, Bottiglia di Vino
// Ancora meno: Late +1h, Colazione Bar Paolo
const prizes = [
  {
    id: "aperitivo",
    weight: 35,
    it: { title:"Aperitivo di benvenuto", desc:"Un brindisi di benvenuto per iniziare al meglio il tuo soggiorno." },
    en: { title:"Welcome Aperitif", desc:"A welcome toast to kickstart your stay." },
    icon: "🍹"
  },
  {
    id: "sconto20",
    weight: 30,
    it: { title:"Sconto 20% prenotazione futura", desc:"Valido su sosta o pernottamento per il tuo prossimo ritorno." },
    en: { title:"20% Off on a future booking", desc:"Valid on parking or overnight for your next visit." },
    icon: "🎫"
  },
  {
    id: "proseccoBig",
    weight: 12,
    it: { title:"Bottiglia Prosecco Big + Stuzzicheria", desc:"Un momento speciale in camera con selezione di stuzzicherie." },
    en: { title:"Large Prosecco Bottle + Snacks", desc:"A special in-room moment with a selection of snacks." },
    icon: "🥂"
  },
  {
    id: "vino",
    weight: 10,
    it: { title:"Bottiglia di Vino (rosso/bianco)", desc:"Una bottiglia di vino a scelta (rosso o bianco)." },
    en: { title:"Bottle of Wine (red/white)", desc:"One bottle of wine of your choice (red or white)." },
    icon: "🍷"
  },
  {
    id: "late1h",
    weight: 7,
    it: { title:"Late check-out +1h", desc:"Parti con calma: un’ora extra, salvo disponibilità." },
    en: { title:"Late check-out +1h", desc:"Leave with no rush: one extra hour, subject to availability." },
    icon: "🕒"
  },
  {
    id: "colazionePaolo",
    weight: 6,
    it: { title:"Colazione al Bar Paolo", desc:"Colazione omaggio presso il Bar Paolo convenzionato." },
    en: { title:"Breakfast at Bar Paolo", desc:"Complimentary breakfast at our partner Bar Paolo." },
    icon: "☕"
  }
];

// Selezione pesata
function weightedPick(items) {
  const total = items.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * total;
  for (const p of items) {
    if (r < p.weight) return p;
    r -= p.weight;
  }
  return items[items.length - 1];
}

// Codice voucher
function makeCode(len = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "LX-";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

// Build URL voucher + QR
function buildVoucher(prizeId, code) {
  const base = `${location.origin}${location.pathname.replace(/index\.html?$/i, "")}`;
  const voucherUrl = `${base}voucher.html?prize=${encodeURIComponent(prizeId)}&code=${encodeURIComponent(code)}&lang=${isIT ? "it" : "en"}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(voucherUrl)}`;
  return { voucherUrl, qrUrl };
}

const spinBtn = document.getElementById("spinBtn");
const resultBox = document.getElementById("result");
const prizeTitle = document.getElementById("prizeTitle");
const prizeDesc = document.getElementById("prizeDesc");
const voucherCode = document.getElementById("voucherCode");
const voucherQR = document.getElementById("voucherQR");
const openVoucher = document.getElementById("openVoucher");

spinBtn.addEventListener("click", () => {
  // Se usi animazione ruota grafica, lancia l’animazione e poi chiama handleWin()
  handleWin();
});

function handleWin() {
  const prize = weightedPick(prizes);
  const dict = isIT ? prize.it : prize.en;

  prizeTitle.textContent = `${prize.icon} ${dict.title}`;
  prizeDesc.textContent = dict.desc;

  const code = makeCode();
  voucherCode.textContent = code;

  const { voucherUrl, qrUrl } = buildVoucher(prize.id, code);
  voucherQR.src = qrUrl;
  openVoucher.href = voucherUrl;

  resultBox.classList.remove("hidden");
  resultBox.scrollIntoView({ behavior: "smooth" });
}
