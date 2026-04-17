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

function getRequiredCertificateStatus(today = new Date()) {
    return REQUIRED_GROUPS.map(group => {
        const options = group.options.map(option => {
            const row = document.querySelector(`.item-row[data-cat="${option.categoryId}"][data-name="${option.name}"]`);
            const checked = !!row?.querySelector('.cert-check')?.checked;
            const fileInput = row?.querySelector('.cert-file');
            const hasFile = !!fileInput && fileInput.files.length > 0;
            const valid = !!row && checked && hasFile && isCertificateValid(row, today);

            return {
                ...option,
                row,
                checked,
                hasFile,
                valid
            };
        });

        const matched = options.find(option => option.valid) || options.find(option => option.checked) || options[0];

        return {
            key: group.key,
            label: group.label,
            valid: options.some(option => option.valid),
            matched,
            options
        };
    });
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

    const requiredCertificates = getRequiredCertificateStatus(compareDay);
    const missingRequired = requiredCertificates.filter(item => !item.valid).map(item => item.label);

    return {
        total,
        categories,
        requiredCertificates,
        eligibility: {
            eligible: missingRequired.length === 0,
            missingRequired
        }
    };
}
