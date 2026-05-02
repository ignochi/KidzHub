"use strict";

{
    const themeToggleButton = document.querySelector("[data-theme-toggle]");

    initializeTheme();
    syncWithSystemTheme();

    themeToggleButton.addEventListener("click", () => {
        toggleTheme();
    });

    function getTheme() {
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme) {
            return savedTheme; // always respect user choice first
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }

    function setTheme(theme) {
        const htmlElement = document.documentElement;

        localStorage.setItem("theme", theme);
        htmlElement.dataset.theme = theme;
    }

    function initializeTheme() {
        setTheme(getTheme());
    }

    function toggleTheme() {
        setTheme(getTheme() === "light" ? "dark" : "light");
    }

    function syncWithSystemTheme() {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        mediaQuery.addEventListener("change", (e) => {
            const savedTheme = localStorage.getItem("theme");

            // Only sync if user hasn't explicitly chosen
            if (!savedTheme) {
                setTheme(e.matches ? "dark" : "light");
            }
        });
    }
}

{
    const modal = document.querySelector("[data-mobile-menu]");
    const modalToggleButton = document.querySelector("[data-modal-toggle]");

    modalToggleButton.addEventListener("click", () => {
        modal.classList.contains("hidden") ? openModal() : closeModal();
    })

    function openModal() {
        modal.classList.remove("hidden");
        modal.setAttribute("aria-hidden", "false");
        modal.setAttribute("tabindex", "0");
        modalToggleButton.setAttribute("aria-expanded", "true");

        // Lock scroll
        document.body.style.overflow = "hidden";

        getFocusableElements().length ? getFocusableElements()[0].focus() : modal.focus();
        document.addEventListener("keydown", handleKeydown);
    }

    function closeModal() {
        modal.classList.add("hidden");
        modal.setAttribute("aria-hidden", "true");
        modal.setAttribute("tabindex", "-1");
        modalToggleButton.setAttribute("aria-expanded", "false");

        // Restore scroll
        document.body.style.overflow = "";

        modalToggleButton.focus();
        document.removeEventListener("keydown", handleKeydown);
    }

    function getFocusableElements() {
        const modalFocusableElements = modal.querySelectorAll(
            "a, button, input, textarea, select, [tabindex]:not([tabindex='-1'])"
        );
        const logo = document.querySelector("[data-logo]");
        const themeToggleButton = document.querySelector("[data-theme-toggle]");

        return [...modalFocusableElements, logo, themeToggleButton, modalToggleButton].filter(Boolean);
    }

    function forward(event) {
        const focusable = getFocusableElements();

        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const currentIndex = Array.from(focusable).indexOf(document.activeElement);
        let nextIndex = currentIndex + 1;

        if (nextIndex >= focusable.length) {
            nextIndex = 0;
        }
        event.preventDefault();
        focusable[nextIndex].focus();
    }

    function backwards(event) {
        const focusable = getFocusableElements();

        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const currentIndex = Array.from(focusable).indexOf(document.activeElement);
        let previousIndex = currentIndex - 1;

        if (previousIndex < 0) {
            previousIndex = focusable.length - 1;
        }

        event.preventDefault();
        focusable[previousIndex].focus();
    }

    function handleKeydown(e) {
        if (e.key === "Escape") {
            closeModal();
            return;
        }

        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
            forward(e);
        }

        if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
            backwards(e);
        }

        if (e.key === "Tab") {
            if (e.shiftKey) {
                e.preventDefault();
                backwards(e);
            } else {
                e.preventDefault();
                forward(e);
            }
        }

        if (e.code === "Space") {
            e.preventDefault();
            document.activeElement.click();
        }
    }
}

{
    const navlinks = document.querySelectorAll("[data-nav-link-main]");
    const poolBall = document.querySelector("[data-nav-ball]");
    const poolBallShadow = document.querySelector("[data-nav-ball-shadow]");
    const poolBallInitialPosition = poolBall.getBoundingClientRect().left;
    const poolBallWidth = poolBall.getBoundingClientRect().width;

    navlinks.forEach((link) => {
        link.addEventListener("mouseenter", (e) => {
            setTransform(poolBall, getTranslateX(link), true);
            setTransform(poolBallShadow, getTranslateX(link));
        })

        link.addEventListener("mouseleave", (e) => {
            setTransform(poolBall, 0, true);
            setTransform(poolBallShadow, 0);
        })
    })

    function getTranslateX(link) {
        const rect = link.getBoundingClientRect();
        let translateX = (rect.left - poolBallInitialPosition) + (rect.width / 2) - (poolBallWidth / 2);

        return translateX;
    }

    function getRotate(totalDistance) {
        let diameter = poolBallWidth / 2;
        const pi = Math.PI;
        let circumference = pi * diameter;

        // the distance covered in one full rotation is equal to the circumference of the ball
        const numberOfRotations = totalDistance / circumference;

        // express numberOfRotations in degrees
        const rotationDegrees = numberOfRotations * 360;

        return rotationDegrees;
    }

    function setTransform(ball, distance, shouldRotate = false) {
        if (shouldRotate) {
            ball.style.transform = `translateX(${distance}px) rotate(${getRotate(distance)}deg)`;
        } else {
            ball.style.transform = `translateX(${distance}px)`;
        }
    }
}

{
    wrapCharacterWithSpan();
    handleWobbleAnimation();

    function wrapCharacterWithSpan() {
        const headline = document.querySelector("[data-headline]");
        const text = headline.textContent;

        headline.innerHTML = text.trim().split("").map(char => {
            return char === " " ? " " : `<span>${char}</span>`;
        }).join("");
    }

    function addWobbleAnimation(character) {
        let timeout;

        if (!character) return;

        character.addEventListener("pointerenter", () => {
            character.classList.add("relative", "animate-wobble");
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                character.classList.remove("animate-wobble");
            }, 1400);
        });
    }

    function handleWobbleAnimation() {
        const text = document.querySelectorAll("[data-headline] > span");

        text.forEach((character) => {
            addWobbleAnimation(character);
        });
    }
}