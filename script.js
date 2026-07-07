// --- 1. CÁC HÀM BỔ TRỢ XỬ LÝ TOÁN HỌC (ĐÃ ĐƯỢC ĐƠN GIẢN HÓA CHO BẢN 1.5) ---

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function buildSum(terms) {
    let processed = [...terms];
    shuffle(processed);
    let res = processed.join(" ").trim();
    if (res.startsWith("+ ")) {
        res = res.substring(2);
    }
    return res;
}

// Hàm sinh ngẫu nhiên A và B phiên bản 1.5: Ép số mũ 'exp' luôn bằng 1
function generateAB() {
    const coeffs = [2, 3, 4, 5];
    const vars = ['x', 'y', 'a', 'b', 'z', 't'];
    
    const c1 = coeffs[Math.floor(Math.random() * coeffs.length)];
    const c2 = coeffs[Math.floor(Math.random() * coeffs.length)];
    const v1 = vars[Math.floor(Math.random() * 3)];       
    const v2 = vars[Math.floor(Math.random() * 3) + 3];   
    
    // ĐÃ SỬA: Ở bản 1.5, số mũ nội tại của biến luôn luôn là 1 (không lấy ngẫu nhiên từ 1-3 nữa)
    const e1 = 1;
    const e2 = 1;
    
    const style = Math.floor(Math.random() * 3);
    if (style === 0) {
        return { A: { coeff: c1, var: v1, exp: e1 }, B: { coeff: c2, var: v2, exp: e2 } };
    } else if (style === 1) {
        return { A: { coeff: c1, var: v1, exp: e1 }, B: { coeff: c2, var: '', exp: 0 } };
    } else {
        return { A: { coeff: c1, var: '', exp: 0 }, B: { coeff: c2, var: v2, exp: e2 } };
    }
}

function strTerm(t) {
    if (!t.var) return `${t.coeff}`;
    const vStr = t.exp === 1 ? t.var : `${t.var}<sup>${t.exp}</sup>`;
    if (t.coeff === 1) return vStr;
    return `${t.coeff}${vStr}`;
}

function strPower(t, p) {
    const c = Math.pow(t.coeff, p);
    if (!t.var) return `${c}`; 
    
    const newExp = t.exp * p;
    const vStr = newExp === 1 ? t.var : `${t.var}<sup>${newExp}</sup>`;
    
    if (c === 1) return vStr;
    return `${c}${vStr}`;
}

function strProduct(factor, t1, p1, t2, p2) {
    const c1 = Math.pow(t1.coeff, p1);
    const c2 = t2 ? Math.pow(t2.coeff, p2) : 1;
    const totalCoeff = factor * c1 * c2;

    let v1 = '';
    if (t1.var) {
        const e1 = t1.exp * p1;
        v1 = e1 === 1 ? t1.var : `${t1.var}<sup>${e1}</sup>`;
    }

    let v2 = '';
    if (t2 && t2.var) {
        const e2 = t2.exp * p2;
        v2 = e2 === 1 ? t2.var : `${t2.var}<sup>${e2}</sup>`;
    }

    let varStr = '';
    if (v1 && v2) varStr = `${v1}.${v2}`;
    else varStr = v1 || v2;

    if (!varStr) return `${totalCoeff}`;
    if (totalCoeff === 1) return varStr;
    return `${totalCoeff}.${varStr}`; 
}

// --- 2. CẤU TRÚC 7 HẰNG ĐẲNG THỨC ĐÁNG NHỚ ---

const identities = [
    (A, B) => {
        const lhs = `(${strTerm(A)} + ${strTerm(B)})<sup>2</sup>`;
        const getRhs = () => buildSum(['+ ' + strPower(A, 2), '+ ' + strProduct(2, A, 1, B, 1), '+ ' + strPower(B, 2)]);
        return {
            forward: () => ({ q: lhs, a: getRhs() }),
            backward: () => ({ q: getRhs(), a: lhs })
        };
    },
    (A, B) => {
        const lhs = `(${strTerm(A)} - ${strTerm(B)})<sup>2</sup>`;
        const getRhs = () => buildSum(['+ ' + strPower(A, 2), '- ' + strProduct(2, A, 1, B, 1), '+ ' + strPower(B, 2)]);
        return {
            forward: () => ({ q: lhs, a: getRhs() }),
            backward: () => ({ q: getRhs(), a: lhs })
        };
    },
    (A, B) => {
        const lhs = buildSum(['+ ' + strPower(A, 2), '- ' + strPower(B, 2)]);
        const getRhs = () => `(${strTerm(A)} - ${strTerm(B)}).(${strTerm(A)} + ${strTerm(B)})`;
        return {
            forward: () => ({ q: lhs, a: getRhs() }),
            backward: () => ({ q: getRhs(), a: lhs })
        };
    },
    (A, B) => {
        const lhs = `(${strTerm(A)} + ${strTerm(B)})<sup>3</sup>`;
        const getRhs = () => buildSum(['+ ' + strPower(A, 3), '+ ' + strProduct(3, A, 2, B, 1), '+ ' + strProduct(3, A, 1, B, 2), '+ ' + strPower(B, 3)]);
        return {
            forward: () => ({ q: lhs, a: getRhs() }),
            backward: () => ({ q: getRhs(), a: lhs })
        };
    },
    (A, B) => {
        const lhs = `(${strTerm(A)} - ${strTerm(B)})<sup>3</sup>`;
        const getRhs = () => buildSum(['+ ' + strPower(A, 3), '- ' + strProduct(3, A, 2, B, 1), '+ ' + strProduct(3, A, 1, B, 2), '- ' + strPower(B, 3)]);
        return {
            forward: () => ({ q: lhs, a: getRhs() }),
            backward: () => ({ q: getRhs(), a: lhs })
        };
    },
    (A, B) => {
        const lhs = buildSum(['+ ' + strPower(A, 3), '+ ' + strPower(B, 3)]);
        const getRhs = () => `(${strTerm(A)} + ${strTerm(B)}).(${buildSum(['+ ' + strPower(A, 2), '- ' + strProduct(1, A, 1, B, 1), '+ ' + strPower(B, 2)])})`;
        return {
            forward: () => ({ q: lhs, a: getRhs() }),
            backward: () => ({ q: getRhs(), a: lhs })
        };
    },
    (A, B) => {
        const lhs = buildSum(['+ ' + strPower(A, 3), '- ' + strPower(B, 3)]);
        const getRhs = () => `(${strTerm(A)} - ${strTerm(B)}).(${buildSum(['+ ' + strPower(A, 2), '+ ' + strProduct(1, A, 1, B, 1), '+ ' + strPower(B, 2)])})`;
        return {
            forward: () => ({ q: lhs, a: getRhs() }),
            backward: () => ({ q: getRhs(), a: lhs })
        };
    }
];

// --- 3. THUẬT TOÁN CHẤM TỰ LUẬN THÔNG MINH (CANONICALIZATION ENGINE) ---

function canonicalize(str) {
    let s = str.toLowerCase().replace(/\s+/g, "").replace(/\./g, "");
    s = s.replace(/<sup>Sub<\/sup>/g, "").replace(/<sup>(.*?)<\/sup>/g, "^$1");
    
    function sortPoly(polyStr) {
        let processed = polyStr.replace(/-/g, "+-");
        let terms = processed.split("+").map(t => t.trim()).filter(t => t.length > 0);
        terms.sort();
        return terms.join("+").replace(/\+-/g, "-");
    }
    
    if (s.includes("(")) {
        s = s.replace(/\(([^)]+)\)/g, function(match, g1) {
            return "(" + sortPoly(g1) + ")";
        });
        
        let blocks = s.match(/\([^)]+\)(?:\^[0-9]+)?/g);
        if (blocks) {
            blocks.sort();
            return blocks.join("");
        }
    } else {
        return sortPoly(s);
    }
    return s;
}

function compareAnswers(user, correct) {
    return canonicalize(user) === canonicalize(correct);
}

// --- 4. QUẢN LÝ TRẠNG THÁI UI & LOGIC TRÒ CHƠI ---

let correctQuestions = 0;
let totalQuestions = 0;
let currentAnswer = ""; 

function initQuestion() {
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('check-btn').style.display = 'inline-block';
    
    const userInput = document.getElementById('user-input');
    userInput.value = '';
    userInput.disabled = false;
    userInput.style.borderColor = 'var(--border)';
    
    document.getElementById('preview-box').innerHTML = 'Xem trước: <span id="preview-text"><i>Chưa nhập gì...</i></span>';

    const randomIdentityFn = identities[Math.floor(Math.random() * identities.length)];
    const { A, B } = generateAB();

    const instance = randomIdentityFn(A, B);
    const direction = Math.floor(Math.random() * 2); 
    const data = (direction === 0) ? instance.forward() : instance.backward();

    document.getElementById('question').innerHTML = data.q + " = ?";
    currentAnswer = data.a;
    
    userInput.focus();
}

function updatePreview() {
    const val = document.getElementById('user-input').value;
    const previewText = document.getElementById('preview-text');
    let html = val.replace(/\^([0-9a-zA-Z]+)/g, '<sup>$1</sup>');
    previewText.innerHTML = html || "<i>Chưa nhập gì...</i>";
}

function checkAnswer() {
    const userInput = document.getElementById('user-input');
    const userVal = userInput.value.trim();
    if (!userVal) return; 

    userInput.disabled = true;
    document.getElementById('check-btn').style.display = 'none';
    totalQuestions++;

    const isCorrect = compareAnswers(userVal, currentAnswer);
    const previewBox = document.getElementById('preview-box');

    if (isCorrect) {
        userInput.style.borderColor = "var(--success)";
        previewBox.innerHTML = `<span style="color: var(--success); font-weight: bold;">✓ Chính xác tuyệt đối!</span>`;
        correctQuestions++;
    } else {
        userInput.style.borderColor = "var(--danger)";
        let displayCorrect = currentAnswer.replace(/\./g, ""); 
        previewBox.innerHTML = `<span style="color: var(--danger); font-weight: bold;">✗ Chưa chính xác!</span><br><span style="color: #fff; font-size: 0.95rem;">Đáp án đúng chuẩn: ${displayCorrect}</span>`;
    }

    const percent = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;
    document.getElementById('stats').innerText = `Số câu đúng: ${correctQuestions}/${totalQuestions} (${percent}%)`;
    document.getElementById('next-btn').style.display = 'inline-block';
}

window.onload = () => {
    initQuestion();
    
    const userInput = document.getElementById('user-input');
    userInput.oninput = updatePreview;

    userInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
            if (document.getElementById('check-btn').style.display !== 'none') {
                checkAnswer();
            } else {
                initQuestion();
            }
        }
    };

    document.getElementById('check-btn').onclick = checkAnswer;
    document.getElementById('next-btn').onclick = initQuestion;

    document.querySelectorAll('.kbd-btn[data-char]').forEach(btn => {
        btn.onclick = () => {
            if (userInput.disabled) return;
            const char = btn.dataset.char;
            
            const start = userInput.selectionStart;
            const end = userInput.selectionEnd;
            const text = userInput.value;
            
            userInput.value = text.substring(0, start) + char + text.substring(end);
            userInput.focus();
            userInput.selectionStart = userInput.selectionEnd = start + char.length;
            
            updatePreview();
        };
    });

    document.getElementById('clear-btn').onclick = () => {
        if (userInput.disabled) return;
        userInput.value = "";
        userInput.focus();
        updatePreview();
    };
};