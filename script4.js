/*
 * script.js - JavaScript untuk Undangan Pernikahan Internasional Interaktif
 * Dibuat oleh: Gemini AI
 * Tanggal: 27 Mei 2025
 * Tujuan: Menambahkan interaktivitas dinamis ke website.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Preloader/Intro Animasi ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            preloader.addEventListener('transitionend', () => {
                preloader.remove();
            }, { once: true }); // Pastikan event listener hanya berjalan sekali
        }, 2500); // Durasi animasi intro + jeda. Sesuaikan dengan durasi animasi CSS Anda.
    }

    // --- 2. Efek Scroll pada Header Navigasi ---
    const mainHeader = document.querySelector('.main-header');
    if (mainHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) { // Jika gulir lebih dari 80px dari atas
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        });
    }

    // --- 3. Scroll ke Bagian Saat CTA Button Diklik (untuk Hero Section) ---
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('our-story').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- 4. Aktifkan/Nonaktifkan Musik Latar Belakang ---
    const backgroundMusic = document.getElementById('background-music');
    const musicToggleButton = document.getElementById('music-toggle');
    if (backgroundMusic && musicToggleButton) {
        let isPlaying = false; // Status awal musik
        const playIcon = '<i class="fas fa-volume-up"></i>';
        const muteIcon = '<i class="fas fa-volume-mute"></i>';

        // Coba putar otomatis saat halaman dimuat
        backgroundMusic.play().then(() => {
            isPlaying = true;
            musicToggleButton.innerHTML = playIcon;
        }).catch(error => {
            console.log('Autoplay blocked. User interaction required to play music.', error);
            isPlaying = false;
            musicToggleButton.innerHTML = muteIcon; // Tampilkan ikon mute jika autoplay diblokir
        });

        musicToggleButton.addEventListener('click', () => {
            if (isPlaying) {
                backgroundMusic.pause();
                musicToggleButton.innerHTML = muteIcon;
            } else {
                backgroundMusic.play();
                musicToggleButton.innerHTML = playIcon;
            }
            isPlaying = !isPlaying;
        });
    }

    // --- 5. Countdown Timer ---
    const countdownElement = document.getElementById('countdown');
    // **PENTING:** Sesuaikan tanggal dan waktu pernikahan Anda di sini!
    // Format: 'YYYY-MM-DDT_HH:MM:SS' (misal: '2025-12-25T09:00:00')
    const weddingDate = new Date('2025-12-25T09:00:00').getTime();

    if (countdownElement) {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                countdownElement.innerHTML = "<p>Hari Bahagia Telah Tiba!</p>";
                clearInterval(countdownInterval);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownElement.innerHTML = `
                <div><span class="value">${days}</span><span class="label">Hari</span></div>
                <div><span class="value">${hours}</span><span class="label">Jam</span></div>
                <div><span class="value">${minutes}</span><span class="label">Menit</span></div>
                <div><span class="value">${seconds}</span><span class="label">Detik</span></div>
            `;
        };

        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);
    }

    // --- 6. Add to Calendar Buttons (Google Calendar) ---
    const addCalendarBtns = document.querySelectorAll('.add-to-calendar-btn');
    addCalendarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const eventType = btn.dataset.eventType; // 'ceremony' atau 'reception'
            let eventTitle = "Pernikahan [Nama Pria] & [Nama Wanita]";
            let eventLocation = "";
            let startTime, endTime;

            if (eventType === 'ceremony') {
                eventTitle += " - Akad/Pemberkatan";
                eventLocation = "Gereja Katedral Jakarta, Jl. Katedral No.7, Ps. Baru, Sawah Besar, Jakarta Pusat";
                startTime = new Date('2025-12-25T09:00:00'); // Ganti dengan waktu akad
                endTime = new Date('2025-12-25T11:00:00');   // Ganti dengan waktu selesai akad
            } else if (eventType === 'reception') {
                eventTitle += " - Resepsi";
                eventLocation = "The Ritz-Carlton Jakarta, Pacific Place, Jl. Jend. Sudirman No.52-53, Jakarta Selatan";
                startTime = new Date('2025-12-25T12:00:00'); // Ganti dengan waktu resepsi
                endTime = new Date('2025-12-25T15:00:00');   // Ganti dengan waktu selesai resepsi
            }

            const eventDescription = "Kami mengundang Anda untuk merayakan hari bahagia kami!";

            const formatDateTime = (date) => {
                return date.toISOString().replace(/-|:|\.\d{3}/g, '');
            };

            const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${formatDateTime(startTime)}/${formatDateTime(endTime)}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocation)}&sf=true&output=xml`;

            window.open(googleCalendarUrl, '_blank');
        });
    });

    // --- 7. RSVP Form Submission (Simulasi Tanpa Backend) ---
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpMessage = document.getElementById('rsvp-message');
    const guestsField = document.getElementById('guests-field');
    const attendanceSelect = document.getElementById('attendance');

    if (rsvpForm) {
        attendanceSelect.addEventListener('change', () => {
            if (attendanceSelect.value === 'yes') {
                guestsField.style.display = 'block';
            } else {
                guestsField.style.display = 'none';
            }
        });

        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const attendance = document.getElementById('attendance').value;
            const guests = attendance === 'yes' ? document.getElementById('guests').value : 0;
            const message = document.getElementById('message').value;

            rsvpMessage.classList.remove('success', 'error');
            rsvpMessage.classList.remove('show'); // Sembunyikan pesan lama saat submit baru

            // --- SIMULASI PENGIRIMAN DATA ---
            // Di sini Anda akan mengintegrasikan dengan backend Anda (misal: Fetch API ke /api/submit-rsvp)
            // Contoh: await fetch('/api/submit-rsvp', { method: 'POST', body: JSON.stringify({ name, ... }) });
            // Untuk demo ini, kita hanya mensimulasikan respons.
            try {
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulasi delay
                const success = Math.random() > 0.1; // 90% sukses, 10% gagal (untuk testing)

                if (success) {
                    rsvpMessage.textContent = 'Terima kasih! RSVP Anda telah kami terima. Sampai jumpa di hari bahagia kami!';
                    rsvpMessage.classList.add('success');
                    rsvpForm.reset();
                    guestsField.style.display = 'none';
                } else {
                    rsvpMessage.textContent = 'Terjadi kesalahan saat mengirim RSVP. Mohon coba lagi.';
                    rsvpMessage.classList.add('error');
                }
            } catch (error) {
                console.error('Error submitting RSVP:', error);
                rsvpMessage.textContent = 'Terjadi kesalahan jaringan. Mohon coba lagi nanti.';
                rsvpMessage.classList.add('error');
            }
            rsvpMessage.classList.add('show'); // Tampilkan pesan
        });
    }

    // --- 8. Guestbook Submission (Simulasi Tanpa Backend) ---
    const guestbookForm = document.getElementById('guestbook-form');
    const guestMessagesContainer = document.querySelector('.guest-messages');
    const guestNameInput = document.getElementById('guest-name');
    const guestMessageInput = document.getElementById('guest-message');

    if (guestbookForm && guestMessagesContainer) {
        const addGuestMessageToDOM = (name, message) => {
            const newItem = document.createElement('div');
            newItem.classList.add('guest-message-item');
            newItem.setAttribute('data-aos', 'fade-up'); // Tambahkan AOS untuk pesan baru
            newItem.innerHTML = `
                <p class="guest-name">${name}</p>
                <p class="guest-text">"${message}"</p>
            `;
            // Sisipkan di awal (setelah H3) agar pesan terbaru di atas
            const h3Element = guestMessagesContainer.querySelector('h3');
            if (h3Element) {
                guestMessagesContainer.insertBefore(newItem, h3Element.nextSibling);
            } else {
                guestMessagesContainer.appendChild(newItem);
            }
            AOS.refresh(); // Beri tahu AOS ada elemen baru
        };

        guestbookForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = guestNameInput.value.trim();
            const message = guestMessageInput.value.trim();

            if (!name || !message) {
                alert('Nama dan ucapan tidak boleh kosong!');
                return;
            }

            try {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi delay
                const success = Math.random() > 0.1; // 90% sukses

                if (success) {
                    addGuestMessageToDOM(name, message);
                    guestNameInput.value = '';
                    guestMessageInput.value = '';
                } else {
                    alert('Gagal mengirim ucapan. Mohon coba lagi.');
                }
            } catch (error) {
                console.error('Error submitting guestbook:', error);
                alert('Terjadi kesalahan jaringan. Mohon coba lagi nanti.');
            }
        });
    }

    // --- 9. FAQ Accordion ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionContent = header.nextElementSibling;

            // Tutup semua item lain kecuali yang diklik
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header && otherHeader.classList.contains('active')) {
                    otherHeader.classList.remove('active');
                    otherHeader.nextElementSibling.classList.remove('active');
                    otherHeader.nextElementSibling.style.maxHeight = '0';
                }
            });

            // Toggle item yang diklik
            header.classList.toggle('active');
            accordionContent.classList.toggle('active');

            if (accordionContent.classList.contains('active')) {
                accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
            } else {
                accordionContent.style.maxHeight = '0';
            }
        });
    });

    // --- 10. Navigasi Aktif Otomatis (Saat Gulir) ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -49% 0px', // Aktif saat bagian tengah section terlihat
        threshold: 0 // Tidak perlu threshold, rootMargin lebih efektif
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === currentSectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- 11. Hamburger Menu untuk Mobile ---
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinksList = document.querySelector('.nav-links'); // Pastikan ini adalah UL

    if (hamburgerMenu && navLinksList) {
        hamburgerMenu.addEventListener('click', () => {
            navLinksList.classList.toggle('active');
            // Ganti ikon hamburger
            hamburgerMenu.querySelector('i').classList.toggle('fa-bars');
            hamburgerMenu.querySelector('i').classList.toggle('fa-times');
        });

        // Tutup menu saat link diklik (untuk single-page scroll)
        navLinksList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksList.classList.contains('active')) {
                    navLinksList.classList.remove('active');
                    hamburgerMenu.querySelector('i').classList.add('fa-bars');
                    hamburgerMenu.querySelector('i').classList.remove('fa-times');
                }
            });
        });
    }

    // --- 12. Inisialisasi AOS (Animate On Scroll) Library ---
    AOS.init({
        duration: 1000, // Durasi animasi dalam ms
        once: true,    // Animasi hanya sekali saat scroll ke bawah
        offset: 120,   // Jarak pemicu dari bawah viewport
        mirror: false, // Apakah animasi harus berulang saat scroll ke atas/bawah
        anchorPlacement: 'top-bottom', // Kapan animasi dimulai
    });

    // --- 13. Inisialisasi Lightbox ---
    // Lightbox otomatis bekerja dengan atribut data-lightbox="gallery-name" di HTML
    // Pastikan jQuery dan lightbox.min.js sudah diload sebelum script.js
    lightbox.option({
      'resizeDuration': 200,
      'wrapAround': true
    });

    // --- 14. Language Switcher (Simulasi) ---
    const langIdButton = document.getElementById('lang-id');
    const langEnButton = document.getElementById('lang-en');

    if (langIdButton && langEnButton) {
        langIdButton.addEventListener('click', () => {
            alert('Mengganti bahasa ke Indonesia (Fitur ini membutuhkan implementasi backend atau JavaScript yang lebih kompleks untuk mengganti semua teks).');
            langIdButton.classList.add('active');
            langEnButton.classList.remove('active');
            // Logika untuk mengubah semua teks di sini
        });

        langEnButton.addEventListener('click', () => {
            alert('Switching language to English (This feature requires a more complex backend or JavaScript implementation to change all text).');
            langEnButton.classList.add('active');
            langIdButton.classList.remove('active');
            // Logika untuk mengubah semua teks di sini
        });
    }
});