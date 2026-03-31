const GAS_URL = "https://script.google.com/macros/s/AKfycbzKgXWDsdeWdoexQAqRez0SgcuH_J_TQml3l6PpwvyyNYaKLx5AX1hmVoShgs_geJT0Xw/exec";

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
});

async function buildPayload() {
    const payload = {
        idCard: document.getElementById('idCard').value,
        name: document.getElementById('name').value,
        bigBrigade: document.getElementById('bigBrigade').value,
        hqDept: document.getElementById('hqDept').value,
        medBrigade: document.getElementById('medBrigade').value,
        smallUnit: document.getElementById('smallUnit').value,
        certificates: [],
        totalScore: document.getElementById('modalTotal').innerText
    };

    const selected = document.querySelectorAll('.cert-check:checked');
    const detailListHtml = [];

    for (const check of selected) {
        const row = check.closest('.item-row');
        const file = row.querySelector('.cert-file').files[0];
        const dateIn = row.querySelector('.cert-date');
        const isPerm = row.querySelector('input[type="checkbox"]:not(.cert-check)')?.checked;

        payload.certificates.push({
            category: row.dataset.cat,
            itemName: row.dataset.name,
            score: row.dataset.score,
            expiry: isPerm ? '無期限' : (dateIn ? dateIn.value : '永久'),
            fileBase64: await toBase64(file),
            fileName: file.name
        });

        detailListHtml.push(`<p>• ${row.dataset.name} (+${row.dataset.score})</p>`);
    }

    return { payload, detailListHtml };
}

function showSubmitSuccess(payload, detailListHtml) {
    document.getElementById('resName').innerText = payload.name;
    document.getElementById('resScore').innerText = payload.totalScore;
    document.getElementById('resDetails').innerHTML = detailListHtml.join('');
    document.getElementById('modal').classList.add('hidden');
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('floatingBoard').classList.add('hidden');
    document.getElementById('successPage').classList.remove('hidden');
    window.scrollTo(0, 0);
}

async function submitToGas() {
    const btn = document.getElementById('finalSubmitBtn');
    btn.disabled = true;
    btn.innerText = '傳送中...';

    try {
        const { payload, detailListHtml } = await buildPayload();
        await fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(payload)
        });
        showSubmitSuccess(payload, detailListHtml);
    } catch (e) {
        alert('傳送失敗');
        btn.disabled = false;
        btn.innerText = '確定送出';
    }
}
