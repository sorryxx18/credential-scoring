function validateBasicFields() {
    const bigVal = document.getElementById('bigBrigade').value;
    const name = document.getElementById('name').value;
    const queryCode = document.getElementById('queryCode').value;
    const queryCodeConfirm = document.getElementById('queryCodeConfirm').value;

    if (!name || !bigVal) {
        return {
            ok: false,
            message: '個人基本資料與單位未填寫完整！'
        };
    }

    if (!/^\d{4}$/.test(queryCode)) {
        return {
            ok: false,
            message: '查詢碼需為 4 位數字！'
        };
    }

    if (queryCode !== queryCodeConfirm) {
        return {
            ok: false,
            message: '兩次輸入的查詢碼不一致！'
        };
    }

    return { ok: true };
}

function validateSelectedCertificates(result) {
    for (const cat of result.categories) {
        if (!cat.isNoCert && cat.row) {
            if (cat.row.querySelector('.cert-file').files.length === 0) {
                return {
                    ok: false,
                    message: `【${cat.title}】勾選了「${cat.name}」，但未上傳檔案！`
                };
            }
        }
    }

    return { ok: true };
}

function validateBeforeSubmit(result) {
    const basic = validateBasicFields();
    if (!basic.ok) return basic;

    return validateSelectedCertificates(result);
}
