function validateBasicFields() {
    const bigVal = document.getElementById('bigBrigade').value;
    const name = document.getElementById('name').value;

    if (!name || !bigVal) {
        return {
            ok: false,
            message: '個人基本資料與單位未填寫完整！'
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
