const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
// Change the icons inside the button based on previous settings
const isDarkModeOn = localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
if (isDarkModeOn) {
    themeToggleLightIcon.classList.remove('hidden');
} else {
    themeToggleDarkIcon.classList.remove('hidden');
}

// Utteranc.es comment box
const setUtterancesTheme = (themeName) => {
    const utterancesFrame = document.querySelector("iframe");
    if (!utterancesFrame) return;
    utterancesFrame.contentWindow.postMessage({
        type: "set-theme",
        theme: themeName,
    }, "https://utteranc.es/");
}

addEventListener('message', event => {
    if (event.origin !== 'https://utteranc.es') {
        return;
    }
    setUtterancesTheme(isDarkModeOn ? 'github-dark' : 'github-light');
});

const applyDarkTheme = () => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    setUtterancesTheme("github-dark");
}

const applyLightTheme = () => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    setUtterancesTheme("github-light");
}

const themeToggleBtn = document.getElementById('theme-toggle');

themeToggleBtn.addEventListener('click', function () {
    // toggle icons inside button
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

    // if set via local storage previously
    if (localStorage.getItem('theme')) {
        if (localStorage.getItem('theme') === 'light') {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    } else {
        if (document.documentElement.classList.contains('dark')) {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }
});