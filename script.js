document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // AUTOPRIME - GENEL AYARLAR
    // =====================================================

    // Gerçek işletmede yalnızca bu numarayı değiştireceğiz.
    // + işareti, boşluk veya 0 kullanma.
    // Örnek: 0532 123 45 67 -> 905321234567
    const whatsappNumber = "905555555555";


    // =====================================================
    // YUMUŞAK SAYFA GEÇİŞLERİ
    // =====================================================

    const internalLinks =
        document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId =
                link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    // =====================================================
    // HİZMET KARTINDAN RANDEVU FORMUNA
    // OTOMATİK HİZMET SEÇİMİ
    // =====================================================

    const serviceSelect =
        document.getElementById("service");

    const serviceCards =
        document.querySelectorAll(".service-card");

    serviceCards.forEach(function (card) {

        const serviceTitle =
            card.querySelector("h3");

        const appointmentButton =
            card.querySelector('a[href="#randevu"]');

        if (!serviceTitle || !appointmentButton) {
            return;
        }

        appointmentButton.addEventListener(
            "click",
            function () {

                const selectedService =
                    serviceTitle.textContent.trim();

                if (serviceSelect) {

                    serviceSelect.value =
                        selectedService;

                }

            }
        );

    });


    // =====================================================
    // TARİH AYARI
    // GEÇMİŞ TARİH SEÇİLMESİN
    // =====================================================

    const dateInput =
        document.getElementById("date");

    if (dateInput) {

        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(today.getMonth() + 1)
                .padStart(2, "0");

        const day =
            String(today.getDate())
                .padStart(2, "0");

        const minimumDate =
            `${year}-${month}-${day}`;

        dateInput.min =
            minimumDate;

    }


    // =====================================================
    // TARİHİ TÜRKÇE FORMATA ÇEVİR
    // 2026-08-20 -> 20.08.2026
    // =====================================================

    function formatDate(dateValue) {

        if (!dateValue) {
            return "";
        }

        const parts =
            dateValue.split("-");

        if (parts.length !== 3) {
            return dateValue;
        }

        return `${parts[2]}.${parts[1]}.${parts[0]}`;

    }


    // =====================================================
    // TELEFON NUMARASI TEMEL KONTROL
    // =====================================================

    function isValidPhone(phone) {

        const cleanPhone =
            phone.replace(/\D/g, "");

        return cleanPhone.length >= 10 &&
               cleanPhone.length <= 11;

    }


    // =====================================================
    // FORM ALANLARI
    // =====================================================

    const appointmentForm =
        document.getElementById("appointmentForm");

    const nameInput =
        document.getElementById("name");

    const phoneInput =
        document.getElementById("phone");

    const carInput =
        document.getElementById("car");

    const timeSelect =
        document.getElementById("time");

    const noteInput =
        document.getElementById("note");


    // =====================================================
    // RANDEVU FORMU
    // =====================================================

    if (appointmentForm) {

        appointmentForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                // -------------------------
                // DEĞERLERİ AL
                // -------------------------

                const name =
                    nameInput
                        ? nameInput.value.trim()
                        : "";

                const phone =
                    phoneInput
                        ? phoneInput.value.trim()
                        : "";

                const car =
                    carInput
                        ? carInput.value.trim()
                        : "";

                const service =
                    serviceSelect
                        ? serviceSelect.value
                        : "";

                const date =
                    dateInput
                        ? dateInput.value
                        : "";

                const time =
                    timeSelect
                        ? timeSelect.value
                        : "";

                const note =
                    noteInput
                        ? noteInput.value.trim()
                        : "";


                // -------------------------
                // BOŞ ALAN KONTROLÜ
                // -------------------------

                if (
                    !name ||
                    !phone ||
                    !car ||
                    !service ||
                    !date ||
                    !time
                ) {

                    alert(
                        "Lütfen zorunlu alanların tamamını doldurun."
                    );

                    return;

                }


                // -------------------------
                // TELEFON KONTROLÜ
                // -------------------------

                if (!isValidPhone(phone)) {

                    alert(
                        "Lütfen geçerli bir telefon numarası girin."
                    );

                    if (phoneInput) {
                        phoneInput.focus();
                    }

                    return;

                }


                // -------------------------
                // TARİH KONTROLÜ
                // -------------------------

                const selectedDate =
                    new Date(date + "T00:00:00");

                const today =
                    new Date();

                today.setHours(0, 0, 0, 0);


                if (selectedDate < today) {

                    alert(
                        "Geçmiş bir tarih için randevu oluşturamazsınız."
                    );

                    return;

                }


                // -------------------------
                // TARİHİ FORMATLA
                // -------------------------

                const formattedDate =
                    formatDate(date);


                // -------------------------
                // WHATSAPP MESAJI
                // -------------------------

                const message =
`Merhaba AutoPrime,

Servis randevusu oluşturmak istiyorum.

👤 Ad Soyad: ${name}
📞 Telefon: ${phone}
🚗 Araç: ${car}
🔧 Hizmet: ${service}
📅 Tarih: ${formattedDate}
🕒 Saat: ${time}
📝 Not: ${note || "Belirtilmedi"}

Randevu uygunluk durumunu teyit edebilir misiniz?`;


                // -------------------------
                // WHATSAPP LİNKİ
                // -------------------------

                const whatsappURL =
                    "https://wa.me/" +
                    whatsappNumber +
                    "?text=" +
                    encodeURIComponent(message);


                // -------------------------
                // WHATSAPP'I AÇ
                // -------------------------

                window.open(
                    whatsappURL,
                    "_blank"
                );

            }
        );

    }


    // =====================================================
    // SAYFADAKİ DİĞER WHATSAPP BUTONLARINI
    // AYNI NUMARAYA BAĞLA
    // =====================================================

    const whatsappLinks =
        document.querySelectorAll(
            '.floating-whatsapp, .contact-whatsapp'
        );

    whatsappLinks.forEach(function (link) {

        link.href =
            "https://wa.me/" +
            whatsappNumber;

    });


    // =====================================================
    // TELEFON LINKLERİNİ AYNI NUMARAYA BAĞLA
    // =====================================================

    const phoneLinks =
        document.querySelectorAll(
            'a[href^="tel:"]'
        );

    phoneLinks.forEach(function (link) {

        link.href =
            "tel:+905555555555";

    });

});// =====================================================
// MOBİL HAMBURGER MENÜ
// =====================================================

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const mainNav =
    document.getElementById("mainNav");

if (mobileMenuButton && mainNav) {

    mobileMenuButton.addEventListener("click", function () {

        mainNav.classList.toggle("mobile-open");

        if (mainNav.classList.contains("mobile-open")) {
            mobileMenuButton.textContent = "✕";
        } else {
            mobileMenuButton.textContent = "☰";
        }

    });


    const mobileMenuLinks =
        mainNav.querySelectorAll("a");

    mobileMenuLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            mainNav.classList.remove("mobile-open");

            mobileMenuButton.textContent = "☰";

        });

    });

}