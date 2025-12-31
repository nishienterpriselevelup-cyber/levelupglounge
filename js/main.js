document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Registration Form Handler
    const regForm = document.getElementById('regForm');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = regForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            // Check file
            const fileInput = document.getElementById('paymentScreenshot');
            const file = fileInput.files[0];

            if (!file) {
                alert("Please upload a payment screenshot.");
                return;
            }

            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                alert("File is too large. Max 2MB.");
                return;
            }

            // Check for duplicate team name
            const teamName = document.getElementById('teamName').value.trim();
            const existingData = JSON.parse(localStorage.getItem('tournament_registrations') || '[]');
            const nameExists = existingData.some(team => team.teamName.toLowerCase() === teamName.toLowerCase());

            if (nameExists) {
                alert("Team Name already taken! Please choose a different name.");
                return;
            }

            const reader = new FileReader();
            reader.onload = function (event) {
                const base64Image = event.target.result;
                processRegistration(base64Image);
            };
            reader.readAsDataURL(file);

            function processRegistration(elementImage) {
                // Gather Data
                const playerNames = Array.from(document.querySelectorAll('.player-name')).map(i => i.value);
                const playerRiotIds = Array.from(document.querySelectorAll('.player-riot-id')).map(i => i.value);
                const playerRanks = Array.from(document.querySelectorAll('.player-rank')).map(i => i.value);
                const playerPhones = Array.from(document.querySelectorAll('.player-phone')).map(i => i.value);

                // Combine them
                const teamRoster = playerNames.map((name, index) => ({
                    name: name,
                    riotId: playerRiotIds[index] || 'N/A',
                    rank: playerRanks[index] || 'N/A',
                    phone: playerPhones[index] || 'N/A'
                }));

                const formData = {
                    id: Date.now(),
                    teamName: document.getElementById('teamName').value,
                    captainEmail: document.getElementById('captainEmail').value,
                    roster: teamRoster,
                    discord: document.getElementById('discord').value,
                    paymentScreenshot: elementImage, // Store image
                    timestamp: new Date().toLocaleString()
                };

                // Save to LocalStorage
                const registrations = JSON.parse(localStorage.getItem('tournament_registrations') || '[]');
                registrations.unshift(formData);
                localStorage.setItem('tournament_registrations', JSON.stringify(registrations));

                btn.textContent = 'Processing...';
                btn.style.opacity = '0.7';

                setTimeout(() => {
                    alert('Registration Successful! See you at the event.');
                    regForm.reset();
                    btn.textContent = originalText;
                    btn.style.opacity = '1';
                }, 1000);
            }
        });
    }

    // Slideshow Logic
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    if (slides.length > 0) {
        let slideIndex = 1;
        let slideTimer;

        // Expose function to global scope for HTML onclick
        window.plusSlides = function (n) {
            showSlides(slideIndex += n);
            resetTimer();
        }

        window.currentSlide = function (n) {
            showSlides(slideIndex = n);
            resetTimer();
        }

        function showSlides(n) {
            let i;
            if (n === undefined) {
                slideIndex++;
            } else {
                slideIndex = n;
            }

            if (slideIndex > slides.length) { slideIndex = 1 }
            if (slideIndex < 1) { slideIndex = slides.length }

            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }

            for (i = 0; i < dots.length; i++) {
                dots[i].classList.remove("active-dot");
            }

            slides[slideIndex - 1].style.display = "block";
            if (dots.length > 0) {
                dots[slideIndex - 1].classList.add("active-dot");
            }
        }

        function resetTimer() {
            clearInterval(slideTimer);
            slideTimer = setInterval(function () { showSlides(); }, 4000);
        }

        // Initial setup
        showSlides(slideIndex);
        resetTimer();
    }
});
