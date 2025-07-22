document.addEventListener('DOMContentLoaded', () => {
    // Theme switcher
    const themeSwitcher = document.createElement('select');
    themeSwitcher.innerHTML = `
        <option value="light-theme">Light Theme</option>
        <option value="dark-theme">Dark Theme</option>
        <option value="cyber-theme">Cyber Theme</option>
    `;
    document.body.insertBefore(themeSwitcher, document.body.firstChild);

    themeSwitcher.addEventListener('change', () => {
        document.body.className = themeSwitcher.value;
    });

    // Set default theme
    document.body.className = 'light-theme';

    // Navigation
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('main section');

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);

            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });
        });
    });

    // Show the first section by default
    sections.forEach((section, index) => {
        if (index !== 0) {
            section.classList.add('hidden');
        }
    });

    // Caesar Cipher
    const caesarInput = document.getElementById('caesar-input');
    const caesarKey = document.getElementById('caesar-key');
    const caesarKeyValue = document.getElementById('caesar-key-value');
    const caesarOutput = document.getElementById('caesar-output');

    function caesarCipher(str, key) {
        return str.replace(/[a-zA-Z]/g, (char) => {
            const base = char < 'a' ? 65 : 97;
            return String.fromCharCode(((char.charCodeAt(0) - base + key) % 26) + base);
        });
    }

    function updateCaesarCipher() {
        const key = parseInt(caesarKey.value, 10);
        caesarKeyValue.textContent = key;
        caesarOutput.value = caesarCipher(caesarInput.value, key);
    }

    caesarInput.addEventListener('input', updateCaesarCipher);
    caesarKey.addEventListener('input', updateCaesarCipher);

    // Vigenère Cipher
    const vigenereInput = document.getElementById('vigenere-input');
    const vigenereKey = document.getElementById('vigenere-key');
    const vigenereOutput = document.getElementById('vigenere-output');

    function vigenereCipher(str, key) {
        let keyIndex = 0;
        return str.replace(/[a-zA-Z]/g, (char) => {
            const keyChar = key.toUpperCase().charCodeAt(keyIndex % key.length) - 65;
            const base = char < 'a' ? 65 : 97;
            keyIndex++;
            return String.fromCharCode(((char.charCodeAt(0) - base + keyChar) % 26) + base);
        });
    }

    function updateVigenereCipher() {
        const key = vigenereKey.value;
        if (key) {
            vigenereOutput.value = vigenereCipher(vigenereInput.value, key);
        }
    }

    vigenereInput.addEventListener('input', updateVigenereCipher);
    vigenereKey.addEventListener('input', updateVigenereCipher);

    // Hashing
    const hashingInput = document.getElementById('hashing-input');
    const hashingAlgorithm = document.getElementById('hashing-algorithm');
    const hashingOutput = document.getElementById('hashing-output');
    const avalancheEffect = document.getElementById('avalanche-effect');

    let previousHash = '';

    async function updateHashing() {
        const algorithm = hashingAlgorithm.value;
        const inputText = hashingInput.value;
        let hash = '';

        if (algorithm === 'sha-256') {
            const encoder = new TextEncoder();
            const data = encoder.encode(inputText);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } else if (algorithm === 'md5') {
            hash = md5(inputText);
        }

        hashingOutput.value = hash;

        if (previousHash) {
            let diffHtml = '';
            for (let i = 0; i < hash.length; i++) {
                if (hash[i] !== previousHash[i]) {
                    diffHtml += `<span style="color: red;">${hash[i]}</span>`;
                } else {
                    diffHtml += `<span>${hash[i]}</span>`;
                }
            }
            avalancheEffect.innerHTML = diffHtml;
        } else {
            avalancheEffect.innerHTML = hash;
        }
        previousHash = hash;
    }

    hashingInput.addEventListener('input', updateHashing);
    hashingAlgorithm.addEventListener('change', updateHashing);

    // AES Encryption
    const aesInput = document.getElementById('aes-input');
    const aesGenerateKeyBtn = document.getElementById('aes-generate-key');
    const aesKeyOutput = document.getElementById('aes-key');
    const aesIvOutput = document.getElementById('aes-iv');
    const aesOutput = document.getElementById('aes-output');

    let aesKey;

    async function generateAesKey() {
        aesKey = await crypto.subtle.generateKey(
            { name: 'AES-CBC', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );
        const keyData = await crypto.subtle.exportKey('jwk', aesKey);
        aesKeyOutput.value = keyData.k;
    }

    async function aesEncrypt() {
        if (!aesKey) {
            await generateAesKey();
        }

        const iv = crypto.getRandomValues(new Uint8Array(16));
        aesIvOutput.value = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');

        const encoder = new TextEncoder();
        const data = encoder.encode(aesInput.value);

        const ciphertext = await crypto.subtle.encrypt(
            { name: 'AES-CBC', iv },
            aesKey,
            data
        );

        aesOutput.value = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
    }

    aesGenerateKeyBtn.addEventListener('click', async () => {
        await generateAesKey();
        await aesEncrypt();
    });
    aesInput.addEventListener('input', aesEncrypt);

    // Generate initial key
    generateAesKey();

    // Brute Force
    const bruteForceInput = document.getElementById('brute-force-input');
    const bruteForceStartBtn = document.getElementById('brute-force-start');
    const bruteForceProgress = document.getElementById('brute-force-progress');
    const bruteForceOutput = document.getElementById('brute-force-output');
    const bruteForceKey = document.getElementById('brute-force-key');

    // A simple dictionary of common English words
    const dictionary = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I'];

    function caesarDecrypt(str, key) {
        return str.replace(/[a-zA-Z]/g, (char) => {
            const base = char < 'a' ? 65 : 97;
            let code = char.charCodeAt(0) - base;
            code = (code - key + 26) % 26;
            return String.fromCharCode(code + base);
        });
    }

    function isEnglish(text) {
        const words = text.toLowerCase().split(/\s+/);
        const commonWords = words.filter(word => dictionary.includes(word));
        return commonWords.length / words.length > 0.5;
    }

    async function startBruteForce() {
        const ciphertext = bruteForceInput.value;
        for (let key = 1; key <= 25; key++) {
            bruteForceProgress.value = key;
            const plaintext = caesarDecrypt(ciphertext, key);
            if (isEnglish(plaintext)) {
                bruteForceOutput.value = plaintext;
                bruteForceKey.value = key;
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 50)); // Animate progress
        }
        bruteForceOutput.value = 'No solution found.';
        bruteForceKey.value = '';
    }

    bruteForceStartBtn.addEventListener('click', startBruteForce);

    // Ripple effect for buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius = diameter / 2;

            ripple.style.width = ripple.style.height = `${diameter}px`;
            ripple.style.left = `${e.clientX - rect.left - radius}px`;
            ripple.style.top = `${e.clientY - rect.top - radius}px`;
            ripple.classList.add('ripple');

            const existingRipple = this.getElementsByClassName('ripple')[0];
            if (existingRipple) {
                existingRipple.remove();
            }

            this.appendChild(ripple);
        });
    });
});
