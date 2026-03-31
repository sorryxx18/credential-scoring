function initForm() {
    const container = document.getElementById('mainForm');
    container.innerHTML = '';

    CONFIG.forEach(cat => {
        let html = `
            <div class="glass-card overflow-hidden shadow-lg border-l-[12px] border-slate-200">
                <div class="bg-slate-50 px-6 py-4 border-b flex justify-between items-center font-bold">
                    <span class="text-xs uppercase tracking-widest text-slate-400 italic">${cat.title}</span>
                    <div class="flex items-center">
                        <span class="text-[10px] text-blue-500 uppercase font-black tracking-tighter">Picked Highest</span>
                        <span id="tip_${cat.id}" class="text-[10px] text-amber-600 font-bold ml-2"></span>
                    </div>
                </div>
                <div class="p-4 md:p-8 space-y-4">
                    <div class="no-cert-card p-5 rounded-2xl flex items-center justify-between cursor-pointer border-2 border-dashed border-slate-200" onclick="toggleNoCert('${cat.id}')" id="noCertBox_${cat.id}">
                        <div class="flex items-center gap-3">
                            <input type="checkbox" id="noCertCheck_${cat.id}" class="w-7 h-7 rounded-xl text-slate-600 focus:ring-0">
                            <span class="font-bold text-slate-700 text-sm italic">無相關證照 / 暫不填報</span>
                        </div>
                    </div>
        `;

        cat.items.forEach(item => {
            html += `
                <div class="item-row p-5 rounded-[2.5rem] bg-white flex flex-col md:flex-row md:items-center justify-between gap-6 cert-item-${cat.id}" data-cat="${cat.id}" data-score="${item.score}" data-name="${item.name}">
                    <div class="flex items-start gap-3">
                        <input type="radio" name="group_${cat.id}" onchange="handleCertSelect(this, '${cat.id}')" class="w-8 h-8 rounded-full text-blue-600 cert-check mt-1">
                        <div>
                            <h4 class="font-bold text-slate-800 text-lg">${item.name}</h4>
                            <p class="text-blue-500 font-black text-xs italic tracking-tighter">+ ${item.score.toFixed(2)} pts</p>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t pt-4 md:border-0 md:pt-0">
                        ${item.hasDate ? `
                        <div class="flex flex-col w-full sm:w-auto">
                            <span class="text-[10px] font-black text-slate-300 uppercase mb-1 tracking-widest italic">Validity</span>
                            <div class="flex items-center gap-2">
                                <input type="date" onchange="updateCalc()" class="cert-date border-2 border-slate-100 rounded-xl p-2 text-xs outline-none focus:border-blue-400 w-full sm:w-32">
                                <label class="text-[10px] font-bold text-slate-400 flex items-center gap-1 cursor-pointer whitespace-nowrap"><input type="checkbox" onchange="toggleIndefinite(this)"> 永久</label>
                            </div>
                        </div>` : `<div class="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200 inline-block uppercase italic">Permanent</div>`}
                        <div class="flex flex-col w-full sm:w-auto">
                            <span class="text-[10px] font-black text-slate-300 uppercase mb-1 font-bold italic tracking-widest underline decoration-blue-200">Evidence</span>
                            <input type="file" onchange="updateCalc()" class="cert-file text-[10px] text-slate-400 w-full">
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML += html + `</div></div>`;
    });

    updateCalc();
}

function updateCalc() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let total = 0;

    CONFIG.forEach(cat => {
        let catMax = 0, winner = null;
        const rows = document.querySelectorAll(`.cert-item-${cat.id}`);
        const isNoCert = document.getElementById(`noCertCheck_${cat.id}`).checked;
        document.getElementById(`noCertBox_${cat.id}`).classList.toggle('no-cert-active', isNoCert);

        rows.forEach(row => {
            const check = row.querySelector('.cert-check').checked;
            const dateIn = row.querySelector('.cert-date');
            const isPerm = row.querySelector('input[type="checkbox"]:not(.cert-check)')?.checked;
            row.classList.remove('highest-glow', 'opacity-30');

            if (isNoCert) {
                row.classList.add('opacity-30');
            } else if (check) {
                let valid = true;
                if (dateIn && !isPerm) {
                    if (!dateIn.value || new Date(dateIn.value) < today) valid = false;
                }
                if (valid) {
                    catMax = parseFloat(row.dataset.score);
                    winner = row;
                }
            }
        });

        if (winner) winner.classList.add('highest-glow');
        total += catMax;
    });

    document.getElementById('floatingScore').innerText = total.toFixed(2);
}

async function prepareConfirmation() {
    const bigVal = document.getElementById('bigBrigade').value;
    const name = document.getElementById('name').value;
    if (!name || !bigVal) return alert('個人基本資料與單位未填寫完整！');

    const list = document.getElementById('confirmList');
    list.innerHTML = '';
    let finalTotal = 0, stop = false;

    CONFIG.forEach(cat => {
        let best = { name: '無相關證照', score: 0 };
        if (!document.getElementById(`noCertCheck_${cat.id}`).checked) {
            document.querySelectorAll(`.cert-item-${cat.id}`).forEach(row => {
                if (row.querySelector('.cert-check').checked) {
                    const dateIn = row.querySelector('.cert-date');
                    const isPerm = row.querySelector('input[type="checkbox"]:not(.cert-check)')?.checked;
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    let isValid = true;

                    if (dateIn && !isPerm) {
                        if (!dateIn.value || new Date(dateIn.value) < today) isValid = false;
                    }
                    if (!isValid) return;

                    if (row.querySelector('.cert-file').files.length === 0) {
                        alert(`【${cat.title}】勾選了「${row.dataset.name}」，但未上傳檔案！`);
                        stop = true;
                        return;
                    }
                    best = { name: row.dataset.name, score: parseFloat(row.dataset.score) };
                }
            });
        }

        if (stop) return;
        list.innerHTML += `<div class="flex justify-between p-4 bg-slate-50 rounded-2xl mb-2 text-sm border border-slate-100"><span>${cat.title}: <b>${best.name}</b></span><span class="text-blue-600 font-black">+${best.score.toFixed(2)}</span></div>`;
        finalTotal += best.score;
    });

    if (stop) return;
    document.getElementById('modalTotal').innerText = finalTotal.toFixed(2);
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}
