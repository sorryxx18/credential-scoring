function normalizeDate(value) {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
}

function isCertificateValid(row, today = new Date()) {
    const dateIn = row.querySelector('.cert-date');
    const isPerm = row.querySelector('input[type="checkbox"]:not(.cert-check)')?.checked;

    if (!dateIn || isPerm) return true;
    if (!dateIn.value) return false;

    const compareDay = new Date(today);
    compareDay.setHours(0, 0, 0, 0);
    return normalizeDate(dateIn.value) >= compareDay;
}

function getCategoryScore(catId, today = new Date()) {
    const rows = document.querySelectorAll(`.cert-item-${catId}`);
    const isNoCert = document.getElementById(`noCertCheck_${catId}`).checked;
    let best = { name: '無相關證照', score: 0, row: null, isNoCert };

    if (isNoCert) return best;

    rows.forEach(row => {
        const checked = row.querySelector('.cert-check').checked;
        if (!checked) return;
        if (!isCertificateValid(row, today)) return;

        const score = parseFloat(row.dataset.score);
        if (score >= best.score) {
            best = {
                name: row.dataset.name,
                score,
                row,
                isNoCert: false
            };
        }
    });

    return best;
}

function calculateFormScore(today = new Date()) {
    const compareDay = new Date(today);
    compareDay.setHours(0, 0, 0, 0);

    let total = 0;
    const categories = CONFIG.map(cat => {
        const best = getCategoryScore(cat.id, compareDay);
        total += best.score;
        return {
            id: cat.id,
            title: cat.title,
            ...best
        };
    });

    return { total, categories };
}
