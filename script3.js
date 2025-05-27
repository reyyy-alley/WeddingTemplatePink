document.addEventListener('DOMContentLoaded', () => {
    const introPage = document.getElementById('intro-page');
    const openInvitationBtn = document.getElementById('open-invitation-btn');
    const backgroundMusic = document.getElementById('background-music');
    const toggleMusicBtn = document.getElementById('toggle-music-btn');
    const guestNameDisplay = document.getElementById('guest-name-display');
    const countdownElement = document.getElementById('countdown');
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpAttendance = document.getElementById('rsvp-attendance');
    const guestCountGroup = document.getElementById('guest-count-group');
    const rsvpMessage = document.getElementById('rsvp-message');
    const guestbookForm = document.getElementById('guestbook-form');
    const guestbookEntries = document.getElementById('guestbook-entries');
    const navbarLinks = document.querySelectorAll('#navbar ul li a');

    // --- 1. Halaman Pembuka & Musik ---
    openInvitationBtn.addEventListener('click', () => {
        introPage.classList.add('hidden');
        if (backgroundMusic) {
            backgroundMusic.play().catch(e => console.log("Autoplay prevented:", e));
            toggleMusicBtn.classList.add('playing');
        }
    });

    if (toggleMusicBtn) {
        toggleMusicBtn.addEventListener('click', () => {
            if (backgroundMusic.paused) {
                backgroundMusic.play();
                toggleMusicBtn.classList.add('playing');
            } else {
                backgroundMusic.pause();
                toggleMusicBtn.classList.remove('playing');
            }
        });
    }

    // --- 2. Ambil Nama Tamu dari URL (Contoh: ?to=Nama%20Tamu) ---
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    if (guestName) {
        guestNameDisplay.textContent = decodeURIComponent(guestName).replace(/\+/g, ' ');
    } else {
        guestNameDisplay.textContent = 'Tamu Undangan'; // Default jika tidak ada nama
    }

    // --- 3. Countdown Timer ---
    const weddingDate = new Date('[Tanggal Pernikahan Anda, misal: 2025-07-20T10:00:00]').getTime(); // Ganti dengan tanggal & waktu acara

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (countdownElement) {
            document.getElementById("days").textContent = days < 10 ? '0' + days : days;
            document.getElementById("hours").textContent = hours < 10 ? '0' + hours : hours;
            document.getElementById("minutes").textContent = minutes < 10 ? '0' + minutes : minutes;
            document.getElementById("seconds").textContent = seconds < 10 ? '0' + seconds : seconds;

            if (distance < 0) {
                clearInterval(countdownInterval);
                countdownElement.innerHTML = "<div class='countdown-finished'>Acara telah dimulai!</div>";
            }
        }
    }
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Run immediately to avoid delay

    // --- 4. Smooth Scrolling untuk Navigasi ---
    navbarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            window.scrollTo({
                top: targetSection.offsetTop - document.getElementById('navbar').offsetHeight, // Adjust for fixed navbar
                behavior: 'smooth'
            });

            // Remove active class from all links
            navbarLinks.forEach(navLink => navLink.classList.remove('active'));
            // Add active class to the clicked link
            this.classList.add('active');
        });
    });

    // Add active class to navbar link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - document.getElementById('navbar').offsetHeight;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navbarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });


    // --- 5. RSVP Form Logic (Pengiriman ke Google Sheets/Email via Formspree/Netlify Forms) ---
    rsvpAttendance.addEventListener('change', function() {
        if (this.value === 'yes') {
            guestCountGroup.style.display = 'block';
        } else {
            guestCountGroup.style.display = 'none';
        }
    });

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(rsvpForm);
            const data = Object.fromEntries(formData.entries());

            // Contoh: Kirim ke Formspree (ganti URL dengan endpoint Formspree Anda)
            // https://formspree.io/f/your-form-id
            try {
                const response = await fetch('https://formspree.io/f/your-form-id', { // GANTI INI!
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    rsvpMessage.textContent = 'Terima kasih! Konfirmasi kehadiran Anda telah terkirim.';
                    rsvpMessage.style.backgroundColor = '#e6ffe6';
                    rsvpMessage.style.color = 'green';
                    rsvpMessage.style.display = 'block';
                    rsvpForm.reset();
                    guestCountGroup.style.display = 'none';
                } else {
                    const errorData = await response.json();
                    rsvpMessage.textContent = `Terjadi kesalahan: ${errorData.errors ? errorData.errors.map(err => err.message).join(', ') : 'Silakan coba lagi.'}`;
                    rsvpMessage.style.backgroundColor = '#ffe6e6';
                    rsvpMessage.style.color = 'red';
                    rsvpMessage.style.display = 'block';
                }
            } catch (error) {
                console.error('Error submitting RSVP:', error);
                rsvpMessage.textContent = 'Terjadi kesalahan jaringan. Silakan coba lagi.';
                rsvpMessage.style.backgroundColor = '#ffe6e6';
                rsvpMessage.style.color = 'red';
                rsvpMessage.style.display = 'block';
            }
        });
    }

    // --- 6. Guestbook Logic (Simpan sementara di localStorage atau kirim ke server) ---
    // Untuk live, Anda butuh backend (PHP/Node.js/Python) untuk menyimpan dan menampilkan pesan.
    // Contoh ini menggunakan localStorage (hanya untuk demo, tidak permanen)
    function loadGuestbookEntries() {
        const entries = JSON.parse(localStorage.getItem('guestbookEntries')) || [];
        guestbookEntries.innerHTML = '<h3>Pesan dari Tamu Kami:</h3>'; // Clear existing
        if (entries.length === 0) {
            guestbookEntries.innerHTML += '<p>Belum ada pesan. Jadilah yang pertama!</p>';
        } else {
            entries.forEach(entry => {
                const div = document.createElement('div');
                div.classList.add('guestbook-entry');
                div.innerHTML = `
                    <p class="entry-name">${entry.name}</p>
                    <p class="entry-message">${entry.message}</p>
                `;
                guestbookEntries.appendChild(div);
            });
        }
    }

    if (guestbookForm) {
        guestbookForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('guestbook-name').value;
            const message = document.getElementById('guestbook-message').value;

            if (name && message) {
                let entries = JSON.parse(localStorage.getItem('guestbookEntries')) || [];
                entries.push({ name, message, timestamp: new Date().toISOString() });
                localStorage.setItem('guestbookEntries', JSON.stringify(entries));
                loadGuestbookEntries();
                guestbookForm.reset();
            }
        });
        loadGuestbookEntries(); // Load entries on page load
    }

    // --- 7. Add to Calendar Functionality ---
    const addToCalendarBtns = document.querySelectorAll('.add-to-calendar-btn');
    addToCalendarBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const eventType = this.dataset.eventType;
            let title, location, description, startTime, endTime;

            if (eventType === 'akad') {
                title = 'Akad Nikah / Pemberkatan [Nama Mempelai Pria] & [Nama Mempelai Wanita]';
                location = '[Nama Tempat Akad/Pemberkatan], [Alamat Lengkap Akad/Pemberkatan]'; // GANTI INI!
                description = 'Mohon doa restu untuk pernikahan kami.';
                startTime = new Date('[Tanggal Akad, misal: 2025-07-20T09:00:00]').toISOString().replace(/-|:|\.\d{3}/g, ''); // GANTI INI!
                endTime = new Date('[Tanggal Akad, misal: 2025-07-20T10:00:00]').toISOString().replace(/-|:|\.\d{3}/g, ''); // GANTI INI!
            } else if (eventType === 'resepsi') {
                title = 'Resepsi Pernikahan [Nama Mempelai Pria] & [Nama Mempelai Wanita]';
                location = '[Nama Tempat Resepsi], [Alamat Lengkap Resepsi]'; // GANTI INI!
                description = 'Mari rayakan cinta kami!';
                startTime = new Date('[Tanggal Resepsi, misal: 2025-07-20T11:00:00]').toISOString().replace(/-|:|\.\d{3}/g, ''); // GANTI INI!
                endTime = new Date('[Tanggal Resepsi, misal: 2025-07-20T14:00:00]').toISOString().replace(/-|:|\.\d{3}/g, ''); // GANTI INI!
            }

            const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
            // Untuk Outlook/Apple Calendar, bisa menggunakan library atau format ICS
            // Simplifikasi untuk contoh: hanya Google Calendar
            window.open(googleCalendarUrl, '_blank');
            alert('Acara berhasil ditambahkan ke kalender Google Anda (jika sudah login).');
        });
    });

    // Optional: AOS (Animate On Scroll) initialization if you use it
    // AOS.init({
    //     duration: 1000,
    //     once: true,
    // });
});