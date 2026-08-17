document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // AUTOPRIME AYARLARI
    // =====================================================

    // Gerçek müşteride değiştirilecek ana numara.
    // +, boşluk ve başta 0 kullanma.
    const whatsappNumber = "905555555555";

    const businessPhone = "+905555555555";


    // =====================================================
    // ELEMENTLER
    // =====================================================

    const mainNav = document.getElementById("mainNav");
    const mobileMenuButton = document.getElementById("mobileMenuButton");

    const appointmentForm = document.getElementById("appointmentForm");

    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");

    const carInput = document.getElementById("car");
    const plateInput = document.getElementById("plate");
    const kmInput = document.getElementById("km");

    const serviceSelect = document.getElementById("service");

    const dateInput = document.getElementById("date");
    const timeSelect = document.getElementById("time");

    const noteInput = document.getElementById("note");

    const formStatus = document.getElementById("formStatus");


    // =====================================================
    // MOBİL MENÜ
    // =====================================================

    if (mobileMenuButton && mainNav) {

        mobileMenuButton.addEventListener("click", function () {

            const isOpen =
                mainNav.classList.toggle("mobile-open");

            mobileMenuButton.textContent =
                isOpen ? "✕" : "☰";

            mobileMenuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            mobileMenuButton.setAttribute(
                "aria-label",
                isOpen ? "Menüyü kapat" : "Menüyü aç"
            );

        });


        mainNav.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                mainNav.classList.remove("mobile-open");

                mobileMenuButton.textContent = "☰";

                mobileMenuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                mobileMenuButton.setAttribute(
                    "aria-label",
                    "Menüyü aç"
                );

            });

        });


        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {

                mainNav.classList.remove("mobile-open");

                mobileMenuButton.textContent = "☰";

                mobileMenuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        });

    }


    // =====================================================
    // YUMUŞAK SAYFA GEÇİŞİ
    // =====================================================

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(function (link) {

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

                history.replaceState(
                    null,
                    "",
                    targetId
                );

            });

        });


    // =====================================================
    // HİZMET KARTI -> FORMDA OTOMATİK SEÇİM
    // =====================================================

    document
        .querySelectorAll(".service-card")
        .forEach(function (card) {

            const serviceTitle =
                card.querySelector("h3");

            const button =
                card.querySelector('a[href="#randevu"]');

            if (!serviceTitle || !button) {
                return;
            }

            button.addEventListener("click", function () {

                if (serviceSelect) {

                    serviceSelect.value =
                        serviceTitle.textContent.trim();

                }

            });

        });


    // =====================================================
    // BUGÜNDEN ÖNCEKİ TARİHLERİ KAPAT
    // =====================================================

    function getLocalDateString(date) {

        const year = date.getFullYear();

        const month =
            String(date.getMonth() + 1)
                .padStart(2, "0");

        const day =
            String(date.getDate())
                .padStart(2, "0");

        return `${year}-${month}-${day}`;

    }


    if (dateInput) {

        dateInput.min =
            getLocalDateString(new Date());

    }


    // =====================================================
    // TARİH FORMATLAMA
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
    // TELEFON KONTROLÜ
    // =====================================================

    function getCleanPhone(phone) {

        return phone.replace(/\D/g, "");

    }


    function isValidPhone(phone) {

        let cleanPhone =
            getCleanPhone(phone);

        if (
            cleanPhone.length === 12 &&
            cleanPhone.startsWith("90")
        ) {
            cleanPhone = cleanPhone.slice(2);
        }

        return (
            cleanPhone.length === 10 ||
            (
                cleanPhone.length === 11 &&
                cleanPhone.startsWith("0")
            )
        );

    }


    // =====================================================
    // PLAKA DÜZENLEME
    // =====================================================

    if (plateInput) {

        plateInput.addEventListener("input", function () {

            plateInput.value =
                plateInput.value
                    .toLocaleUpperCase("tr-TR")
                    .replace(/[^0-9A-ZÇĞİÖŞÜ ]/g, "")
                    .slice(0, 12);

        });

    }


    // =====================================================
    // FORM MESAJI
    // =====================================================

    function showFormStatus(message, type) {

        if (!formStatus) {
            return;
        }

        formStatus.textContent = message;

        formStatus.classList.remove(
            "success",
            "error"
        );

        if (type) {
            formStatus.classList.add(type);
        }

    }


    // =====================================================
    // RANDEVU FORMU
    // =====================================================

    if (appointmentForm) {

        appointmentForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                showFormStatus("", "");


                const name =
                    nameInput?.value.trim() || "";

                const phone =
                    phoneInput?.value.trim() || "";

                const car =
                    carInput?.value.trim() || "";

                const plate =
                    plateInput?.value.trim() || "";

                const km =
                    kmInput?.value.trim() || "";

                const service =
                    serviceSelect?.value || "";

                const date =
                    dateInput?.value || "";

                const time =
                    timeSelect?.value || "";

                const note =
                    noteInput?.value.trim() || "";


                // -----------------------------------------
                // ZORUNLU ALANLAR
                // -----------------------------------------

                if (
                    !name ||
                    !phone ||
                    !car ||
                    !service ||
                    !date ||
                    !time
                ) {

                    showFormStatus(
                        "Lütfen yıldızlı alanların tamamını doldurun.",
                        "error"
                    );

                    return;

                }


                // -----------------------------------------
                // TELEFON
                // -----------------------------------------

                if (!isValidPhone(phone)) {

                    showFormStatus(
                        "Lütfen geçerli bir telefon numarası girin.",
                        "error"
                    );

                    phoneInput?.focus();

                    return;

                }


                // -----------------------------------------
                // TARİH
                // -----------------------------------------

                const selectedDate =
                    new Date(date + "T12:00:00");

                const today =
                    new Date();

                today.setHours(0, 0, 0, 0);


                if (
                    Number.isNaN(
                        selectedDate.getTime()
                    )
                ) {

                    showFormStatus(
                        "Lütfen geçerli bir tarih seçin.",
                        "error"
                    );

                    return;

                }


                if (selectedDate < today) {

                    showFormStatus(
                        "Geçmiş tarih için randevu oluşturamazsınız.",
                        "error"
                    );

                    return;

                }


                // -----------------------------------------
                // PAZAR GÜNÜ KAPALI
                // -----------------------------------------

                if (selectedDate.getDay() === 0) {

                    showFormStatus(
                        "Servisimiz Pazar günleri kapalıdır. Lütfen başka bir tarih seçin.",
                        "error"
                    );

                    dateInput?.focus();

                    return;

                }


                // -----------------------------------------
                // KM KONTROLÜ
                // -----------------------------------------

                if (
                    km &&
                    Number(km) < 0
                ) {

                    showFormStatus(
                        "Kilometre bilgisi geçerli değil.",
                        "error"
                    );

                    return;

                }


                const formattedDate =
                    formatDate(date);


                // -----------------------------------------
                // WHATSAPP MESAJI
                // -----------------------------------------

                const message =
`Merhaba AutoPrime,

Servis randevu talebi oluşturmak istiyorum.

👤 Ad Soyad: ${name}
📞 Telefon: ${phone}
🚗 Araç: ${car}
🔢 Plaka: ${plate || "Belirtilmedi"}
🛣️ Kilometre: ${km ? km + " km" : "Belirtilmedi"}

🔧 Hizmet: ${service}
📅 Tarih: ${formattedDate}
🕒 Saat: ${time}

📝 Not:
${note || "Belirtilmedi"}

Randevu uygunluk durumunu teyit edebilir misiniz?`;


                const whatsappURL =
                    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


                showFormStatus(
                    "WhatsApp açılıyor. Talebinizi gönderdikten sonra servis onayını bekleyin.",
                    "success"
                );


                // Popup engelleyicilere karşı kullanıcı
                // submit işlemi içinde açılıyor.
                const newWindow =
                    window.open(
                        whatsappURL,
                        "_blank",
                        "noopener,noreferrer"
                    );


                // Bazı mobil tarayıcılarda yeni pencere
                // engellenirse aynı sekmede aç.
                if (!newWindow) {

                    window.location.href =
                        whatsappURL;

                }

            }
        );

    }


    // =====================================================
    // WHATSAPP BUTONLARI
    // =====================================================

    document
        .querySelectorAll(
            ".floating-whatsapp, .contact-whatsapp"
        )
        .forEach(function (link) {

            link.href =
                `https://wa.me/${whatsappNumber}`;

        });


    // =====================================================
    // TELEFON BUTONLARI
    // =====================================================

    document
        .querySelectorAll('a[href^="tel:"]')
        .forEach(function (link) {

            link.href =
                `tel:${businessPhone}`;

        });


    // =====================================================
    // FOOTER YILI
    // =====================================================

    const currentYear =
        document.getElementById("currentYear");

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }

});