const GAS_URL = "https://script.google.com/macros/s/AKfycbw2zNzdkqy_9quJjwiJMqhIS0pT54ZsepvCUzhz2Muo0KSu_ngKwaEzkvNh568NUI2new/exec";

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
});

async function buildPayload() {
    const idCard = document.getElementById('idCard').value;
    const queryCode = document.getElementById('queryCode').value.trim();
    if (!/^\d{4}$/.test(queryCode)) {
        throw new Error('QUERY_CODE_INVALID');
    }

    const payload = {
        idCard,
        queryCode,
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
    document.getElementById('resQueryCode').innerText = payload.queryCode || '0000';
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
    btn.insertAdjacentHTML('afterend', '<p id="submitLoadingText" class="mt-4 text-center text-sm text-blue-600 font-bold">資料與附件上傳中，請稍候，請勿重複送出或關閉頁面。</p>');

    try {
        const { payload, detailListHtml } = await buildPayload();
        await fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(payload)
        });
        showSubmitSuccess(payload, detailListHtml);
    } catch (e) {
        if (e && e.message === 'QUERY_CODE_INVALID') {
            alert('請先輸入 4 碼數字查詢碼。');
        } else {
            alert('傳送失敗');
        }
        document.getElementById('submitLoadingText')?.remove();
        btn.disabled = false;
        btn.innerText = '確定送出';
    }
}
