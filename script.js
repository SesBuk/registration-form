/* =========================================================
   বাংলাদেশের সকল জেলার তালিকা (৬৪ জেলা)
   ========================================================= */
const districts = [
  "বাগেরহাট", "বান্দরবান", "বরগুনা", "বরিশাল", "ভোলা", "বগুড়া", "ব্রাহ্মণবাড়িয়া",
  "চাঁদপুর", "চাঁপাইনবাবগঞ্জ", "চট্টগ্রাম", "চুয়াডাঙ্গা", "কুমিল্লা", "কক্সবাজার",
  "ঢাকা", "দিনাজপুর", "ফরিদপুর", "ফেনী", "গাইবান্ধা", "গাজীপুর", "গোপালগঞ্জ",
  "হবিগঞ্জ", "জামালপুর", "যশোর", "ঝালকাঠি", "ঝিনাইদহ", "খাগড়াছড়ি", "খুলনা",
  "কিশোরগঞ্জ", "কুড়িগ্রাম", "কুষ্টিয়া", "লক্ষ্মীপুর", "লালমনিরহাট", "মাদারীপুর",
  "মাগুরা", "মানিকগঞ্জ", "মেহেরপুর", "মৌলভীবাজার", "মুন্সিগঞ্জ", "ময়মনসিংহ",
  "নওগাঁ", "নড়াইল", "নারায়ণগঞ্জ", "নরসিংদী", "নাটোর", "নেত্রকোণা", "নিলফামারী",
  "নোয়াখালী", "পাবনা", "পঞ্চগড়", "পটুয়াখালী", "পিরোজপুর", "রাজবাড়ী", "রাজশাহী",
  "রাঙ্গামাটি", "রংপুর", "সাতক্ষীরা", "শরীয়তপুর", "শেরপুর", "সিরাজগঞ্জ", "সুনামগঞ্জ",
  "সিলেট", "টাঙ্গাইল", "ঠাকুরগাঁও"
].sort((a, b) => a.localeCompare(b, "bn"));

/* =========================================================
   ডেমো পেমেন্ট নম্বর
   ========================================================= */
const paymentNumbers = {
  bkashNumber: "01842151907",
  nagadNumber: "01722144619",
  rocketNumber: "01633932773"
};

/* =========================================================
   টেলিগ্রাম কনফিগারেশন
   ⚠️ এখানে আপনার নিজের Bot Token এবং Chat ID বসান।
   কীভাবে পাবেন তার গাইড নিচে কমেন্টে দেওয়া আছে।

   ধাপ ১ (Bot Token): Telegram-এ @BotFather কে মেসেজ দিন →
   /newbot কমান্ড দিন → নাম দিন → যে Token পাবেন সেটা এখানে বসান।
   যেমন দেখতে হবে: "123456789:AAExampleTokenStringHere"

   ধাপ ২ (Chat ID): আপনার তৈরি বটকে টেলিগ্রামে একটা মেসেজ পাঠান (যেমন "hi") →
   ব্রাউজারে যান: https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates →
   সেখানে "chat":{"id": ...} এর ভেতরের নম্বরটাই আপনার CHAT_ID।
   ========================================================= */
const TELEGRAM_CONFIG = {
  BOT_TOKEN: "8847494455:AAE056LzE6VTinxkhdUcSb6rNf7QnLFap7c",   // <-- এখানে Bot Token বসান
  CHAT_ID: "8873816422"        // <-- এখানে Chat ID বসান
};

// ফর্ম থেকে সংগ্রহ করা তথ্য এখানে সাময়িকভাবে রাখা হবে
let submittedFormData = {};

document.addEventListener("DOMContentLoaded", () => {
  populateDistricts();
  setPaymentNumbers();
  setupFormValidation();
  setupCopyButtons();
  setupConfirmButton();
  setupNavbarScrollEffect();
});

/* জেলার ড্রপডাউন পূরণ */
function populateDistricts() {
  const select = document.getElementById("district");
  districts.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });
}

/* ডেমো পেমেন্ট নম্বর বসানো */
function setPaymentNumbers() {
  Object.entries(paymentNumbers).forEach(([id, number]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = number;
  });
}

/* =========================================================
   ফর্ম ভ্যালিডেশন ও সাবমিশন
   ========================================================= */
function setupFormValidation() {
  const form = document.getElementById("registrationForm");
  const mobileInput = document.getElementById("mobile");

  // শুধুমাত্র সংখ্যা প্রবেশ করানো (মোবাইল নম্বর)
  mobileInput.addEventListener("input", () => {
    mobileInput.value = mobileInput.value.replace(/[^0-9]/g, "").slice(0, 11);
  });

  const ageInput = document.getElementById("age");
  ageInput.addEventListener("input", () => {
    ageInput.value = ageInput.value.replace(/[^0-9]/g, "");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isMobileValid = /^01[3-9][0-9]{8}$/.test(mobileInput.value.trim());
    mobileInput.setCustomValidity(isMobileValid ? "" : "invalid");

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      const firstInvalid = form.querySelector(":invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    form.classList.add("was-validated");

    // ফর্মের তথ্য সংরক্ষণ করা (পরে টেলিগ্রামে পাঠানোর জন্য)
    submittedFormData = {
      name: document.getElementById("fullName").value.trim(),
      age: document.getElementById("age").value.trim(),
      district: document.getElementById("district").value,
      mobile: mobileInput.value.trim(),
      workArea: document.getElementById("workArea").value.trim()
    };

    revealPaymentSection();
  });
}

/* ফর্ম সঠিক হলে পেমেন্ট সেকশন দেখানো */
function revealPaymentSection() {
  showLoading(true);

  setTimeout(() => {
    showLoading(false);
    const paymentSection = document.getElementById("payment-section");
    paymentSection.classList.remove("d-none");
    paymentSection.scrollIntoView({ behavior: "smooth", block: "start" });

    // রেজিস্ট্রেশন বাটন disable করে দেওয়া যাতে দুইবার সাবমিট না হয়
    const submitBtn = document.querySelector(".btn-submit");
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> তথ্য যাচাই সম্পন্ন';
  }, 900);
}

/* =========================================================
   কপি টু ক্লিপবোর্ড
   ========================================================= */
function setupCopyButtons() {
  const buttons = document.querySelectorAll(".copy-btn");
  const labels = {
    bkashNumber: "বিকাশ নম্বর সফলভাবে কপি হয়েছে।",
    nagadNumber: "নগদ নম্বর সফলভাবে কপি হয়েছে।",
    rocketNumber: "রকেট নম্বর সফলভাবে কপি হয়েছে।"
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const targetId = btn.getAttribute("data-copy-target");
      const number = paymentNumbers[targetId];

      try {
        await navigator.clipboard.writeText(number);
      } catch (err) {
        // fallback for older browsers
        const tempInput = document.createElement("textarea");
        tempInput.value = number;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }

      showToast(labels[targetId] || "কপি হয়েছে।");
    });
  });
}

/* টোস্ট নোটিফিকেশন দেখানো */
function showToast(message) {
  const toastEl = document.getElementById("copyToast");
  document.getElementById("toastMessage").textContent = message;
  const toast = new bootstrap.Toast(toastEl, { delay: 2500 });
  toast.show();
}

/* =========================================================
   পেমেন্ট নিশ্চিতকরণ + টেলিগ্রামে তথ্য পাঠানো
   ========================================================= */
function setupConfirmButton() {
  const confirmBtn = document.getElementById("confirmPaymentBtn");

  confirmBtn.addEventListener("click", async () => {
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> জমা হচ্ছে...';

    showLoading(true, "আপনার তথ্য জমা করা হচ্ছে...");

    const result = await sendToTelegram(submittedFormData);

    showLoading(false);

    if (result.success) {
      showSuccessModal(true);
      confirmBtn.innerHTML = '<i class="fa-solid fa-check"></i> জমা সম্পন্ন হয়েছে';
    } else {
      // পাঠানো ব্যর্থ হলে ব্যবহারকারীকে সঠিক তথ্য জানানো — মিথ্যা সফলতা দেখানো হবে না
      showSuccessModal(false);
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> আবার চেষ্টা করুন';
    }
  });
}

/* টেলিগ্রাম বটের মাধ্যমে ফর্মের তথ্য পাঠানো */
async function sendToTelegram(data) {
  const { BOT_TOKEN, CHAT_ID } = TELEGRAM_CONFIG;

  // Token/Chat ID বসানো না থাকলে চেষ্টা না করে সরাসরি ব্যর্থ হিসেবে ধরা
  if (!BOT_TOKEN || BOT_TOKEN === "YOUR_BOT_TOKEN_HERE" || !CHAT_ID || CHAT_ID === "YOUR_CHAT_ID_HERE") {
    console.warn("Telegram BOT_TOKEN / CHAT_ID এখনো বসানো হয়নি।");
    return { success: false };
  }

  const message =
    `🆕 *নতুন রেজিস্ট্রেশন*\n\n` +
    `👤 নাম: ${data.name}\n` +
    `🎂 বয়স: ${data.age}\n` +
    `📍 জেলা: ${data.district}\n` +
    `📞 মোবাইল: ${data.mobile}\n` +
    `💼 কাজের এরিয়া: ${data.workArea}\n\n` +
    `✅ ব্যবহারকারী পেমেন্ট সম্পন্নের কথা জানিয়েছেন।`;

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "Markdown"
      })
    });

    const result = await response.json();
    return { success: Boolean(result.ok) };
  } catch (err) {
    console.error("Telegram পাঠাতে সমস্যা হয়েছে:", err);
    return { success: false };
  }
}

/* সফলতা/ব্যর্থতা অনুযায়ী মডাল দেখানো */
function showSuccessModal(isSuccess) {
  const modalTitle = document.getElementById("successModalTitle");
  const modalBody = document.getElementById("successModalBody");
  const modalIcon = document.querySelector(".success-icon i");

  if (isSuccess) {
    modalIcon.className = "fa-solid fa-check";
    document.querySelector(".success-icon").classList.remove("icon-warning");
    modalTitle.textContent = "আবেদন জমা হয়েছে";
    modalBody.innerHTML =
      "আপনার আবেদন ও পেমেন্ট তথ্য সফলভাবে জমা নেওয়া হয়েছে।<br>" +
      "আমাদের টিম আপনার পেমেন্ট যাচাই করার পর আপনার দেওয়া মোবাইল নম্বরে যোগাযোগ করবে।<br>" +
      "<span class='fw-semibold'>ধন্যবাদ।</span>";
  } else {
    modalIcon.className = "fa-solid fa-triangle-exclamation";
    document.querySelector(".success-icon").classList.add("icon-warning");
    modalTitle.textContent = "তথ্য পাঠাতে সমস্যা হয়েছে";
    modalBody.innerHTML =
      "দুঃখিত, আপনার তথ্য এখন স্বয়ংক্রিয়ভাবে পাঠানো যায়নি।<br>" +
      "অনুগ্রহ করে সহায়তা বিভাগে দেওয়া নম্বরে সরাসরি যোগাযোগ করে পেমেন্টের প্রমাণ (Screenshot) পাঠান।";
  }

  const successModal = new bootstrap.Modal(document.getElementById("successModal"));
  successModal.show();
}

/* স্ক্রল করলে হেডারে হালকা shadow যোগ করা */
function setupNavbarScrollEffect() {
  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
  });
}

/* =========================================================
   লোডিং ওভারলে দেখানো/লুকানো
   ========================================================= */
function showLoading(show, text) {
  const overlay = document.getElementById("loadingOverlay");
  if (text) overlay.querySelector("p").textContent = text;
  overlay.classList.toggle("d-none", !show);
}
