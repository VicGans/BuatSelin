document.addEventListener('DOMContentLoaded', function() {
    // Data yang perlu diganti
    const LOVER_NAME = "[Nama Pacarmu]"; // GANTI NAMA PACARMU DI SINI
    const YOUR_NAME = "[Namamu]"; // GANTI NAMAMU DI SINI
    const ANNIVERSARY_DATE = "2024-08-15"; // GANTI TANGGAL ANNIVERSARY (format: YYYY-MM-DD)
    
    // Element references
    const pages = document.querySelectorAll('.page');
    const startBtn = document.getElementById('start-btn');
    const next1Btn = document.getElementById('next1-btn');
    const next2Btn = document.getElementById('next2-btn');
    const finalBtn = document.getElementById('final-btn');
    const openEnvelopeBtn = document.getElementById('open-envelope');
    const resetBtn = document.getElementById('reset-btn');
    const musicToggle = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    const loverNameElements = document.querySelectorAll('#lover-name, #lover-name-final');
    const yourNameElement = document.querySelector('.your-name');
    
    // Set nama
    loverNameElements.forEach(el => el.textContent = LOVER_NAME);
    yourNameElement.textContent = YOUR_NAME;
    
    // Inisialisasi game
    let game1Completed = false;
    let game2Completed = false;
    let game3Completed = false;
    
    // 1. Navigasi Halaman
    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
        
        // Scroll ke atas
        window.scrollTo(0, 0);
        
        // Jika halaman final, mulai countdown
        if (pageId === 'final') {
            startCountdown();
        }
    }
    
    // Event listeners untuk navigasi
    startBtn.addEventListener('click', () => {
        initPuzzleGame();
        showPage('game1');
    });
    
    next1Btn.addEventListener('click', () => showPage('game2'));
    next2Btn.addEventListener('click', () => showPage('game3'));
    
    finalBtn.addEventListener('click', () => {
        // Tampilkan konfetti
        createConfetti();
        showPage('final');
    });
    
    openEnvelopeBtn.addEventListener('click', () => {
        const envelope = document.querySelector('.envelope');
        const letter = document.querySelector('.letter');
        const extraGifts = document.getElementById('extra-gifts');
        
        // Buka amplop
        envelope.style.transform = 'scale(1.1)';
        letter.classList.add('open');
        
        // Sembunyikan tombol buka amplop
        openEnvelopeBtn.classList.add('hidden');
        
        // Tampilkan hadiah tambahan setelah jeda
        setTimeout(() => {
            extraGifts.classList.remove('hidden');
            createConfetti();
        }, 1000);
    });
    
    resetBtn.addEventListener('click', () => {
        if (confirm("Mulai petualangan dari awal lagi?")) {
            // Reset semua game
            game1Completed = false;
            game2Completed = false;
            game3Completed = false;
            
            // Reset UI game
            document.getElementById('game1-message').classList.add('hidden');
            document.getElementById('game2-message').classList.add('hidden');
            document.getElementById('game3-message').classList.add('hidden');
            
            // Kembali ke halaman awal
            showPage('home');
        }
    });
    
    // 2. Game 1: Puzzle
    function initPuzzleGame() {
        const puzzleContainer = document.getElementById('puzzle-container');
        puzzleContainer.innerHTML = '';
        
        // Buat potongan puzzle (4x3 = 12 potong)
        const rows = 3;
        const cols = 4;
        const pieceWidth = 100;
        const pieceHeight = 100;
        
        // Potongan acak
        let pieces = [];
        for (let i = 0; i < rows * cols; i++) {
            pieces.push(i);
        }
        
        // Acak urutan potongan
        pieces = pieces.sort(() => Math.random() - 0.5);
        
        // Buat elemen potongan
        pieces.forEach((pieceIndex, i) => {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.draggable = true;
            piece.dataset.index = pieceIndex;
            
            // Posisi background untuk gambar puzzle
            const row = Math.floor(pieceIndex / cols);
            const col = pieceIndex % cols;
            piece.style.backgroundPosition = `-${col * pieceWidth}px -${row * pieceHeight}px`;
            
            // Untuk demo, background warna
            const hue = (pieceIndex * 30) % 360;
            piece.style.backgroundColor = `hsl(${hue}, 70%, 80%)`;
            piece.innerHTML = `<div style="display:flex;justify-content:center;align-items:center;height:100%;font-size:24px;">${pieceIndex + 1}</div>`;
            
            // Drag & drop
            piece.addEventListener('dragstart', dragStart);
            piece.addEventListener('dragover', dragOver);
            piece.addEventListener('drop', drop);
            
            puzzleContainer.appendChild(piece);
        });
        
        // Cek apakah puzzle sudah selesai
        const checkBtn = document.createElement('button');
        checkBtn.className = 'btn-small';
        checkBtn.innerHTML = '<i class="fas fa-check"></i> Cek Jawaban';
        checkBtn.addEventListener('click', checkPuzzle);
        puzzleContainer.parentNode.insertBefore(checkBtn, puzzleContainer.nextSibling);
        
        // Tombol bantuan
        document.getElementById('hint1-btn').addEventListener('click', () => {
            alert("Tips: Coba susun angka berurutan dari 1 sampai 12!");
        });
    }
    
    let draggedPiece = null;
    
    function dragStart(e) {
        draggedPiece = this;
        setTimeout(() => this.style.opacity = '0.5', 0);
    }
    
    function dragOver(e) {
        e.preventDefault();
    }
    
// LANJUTAN DARI script.js yang terpotong tadi...

function drop(e) {
    e.preventDefault();
    if (draggedPiece && draggedPiece !== this) {
        // Tukar posisi
        const tempBackground = this.style.backgroundColor;
        const tempContent = this.innerHTML;
        const tempIndex = this.dataset.index;
        
        this.style.backgroundColor = draggedPiece.style.backgroundColor;
        this.innerHTML = draggedPiece.innerHTML;
        this.dataset.index = draggedPiece.dataset.index;
        
        draggedPiece.style.backgroundColor = tempBackground;
        draggedPiece.innerHTML = tempContent;
        draggedPiece.dataset.index = tempIndex;
    }
    if (draggedPiece) draggedPiece.style.opacity = '1';
}

function checkPuzzle() {
    const pieces = document.querySelectorAll('.puzzle-piece');
    let correct = true;
    
    pieces.forEach((piece, i) => {
        if (parseInt(piece.dataset.index) !== i) {
            correct = false;
        }
    });
    
    if (correct) {
        document.getElementById('game1-message').classList.remove('hidden');
        game1Completed = true;
        createConfetti();
    } else {
        alert('Belum tepat! Coba lagi ya sayang ❤️');
    }
}

// 3. Game 2: Tebak Kata
const letterOptions = document.querySelectorAll('.letter-option');
const emptyBoxes = document.querySelectorAll('.letter-box.empty');

// Data posisi huruf yang benar untuk setiap kotak kosong
const correctLetters = {
    2: 'N', // Kotak ke-3 (index 2)
    4: 'A'  // Kotak ke-5 (index 4)
};

let clickedLetters = {};

letterOptions.forEach(option => {
    option.addEventListener('click', function() {
        const letter = this.dataset.letter;
        
        // Cari kotak kosong pertama
        let emptyBox = null;
        emptyBoxes.forEach(box => {
            if (!box.textContent || box.textContent === '?') {
                emptyBox = box;
                return;
            }
        });
        
        if (emptyBox) {
            const boxIndex = Array.from(document.querySelectorAll('.letter-box')).indexOf(emptyBox);
            emptyBox.textContent = letter;
            emptyBox.style.backgroundColor = '#ffd6e0';
            emptyBox.style.color = '#ff4081';
            clickedLetters[boxIndex] = letter;
            
            // Nonaktifkan tombol huruf yang sudah dipilih
            this.disabled = true;
            this.style.opacity = '0.5';
            this.style.cursor = 'not-allowed';
            
            // Cek apakah semua kotak terisi
            const allFilled = Array.from(emptyBoxes).every(box => 
                box.textContent && box.textContent !== '?'
            );
            
            if (allFilled) {
                // Cek jawaban
                let correct = true;
                for (const [index, correctLetter] of Object.entries(correctLetters)) {
                    if (clickedLetters[index] !== correctLetter) {
                        correct = false;
                        break;
                    }
                }
                
                if (correct) {
                    document.getElementById('game2-message').classList.remove('hidden');
                    game2Completed = true;
                    createConfetti();
                } else {
                    // Reset jika salah
                    setTimeout(() => {
                        alert('Hurufnya belum tepat sayang! Coba lagi ❤️');
                        emptyBoxes.forEach(box => {
                            box.textContent = '?';
                            box.style.backgroundColor = '#ffe6ee';
                            box.style.color = '#999';
                        });
                        letterOptions.forEach(opt => {
                            opt.disabled = false;
                            opt.style.opacity = '1';
                            opt.style.cursor = 'pointer';
                        });
                        clickedLetters = {};
                    }, 500);
                }
            }
        }
    });
});

// 4. Game 3: Kuis
const quizOptions = document.querySelectorAll('.quiz-option');
let correctAnswers = 0;
const totalQuestions = 3;

quizOptions.forEach(option => {
    option.addEventListener('click', function() {
        // Nonaktifkan semua opsi di pertanyaan ini
        const parentOptions = this.parentNode.querySelectorAll('.quiz-option');
        parentOptions.forEach(opt => {
            opt.style.pointerEvents = 'none';
        });
        
        const isCorrect = this.dataset.correct === 'true';
        
        if (isCorrect) {
            this.classList.add('correct');
            correctAnswers++;
        } else {
            this.classList.add('wrong');
            // Tampilkan jawaban yang benar
            parentOptions.forEach(opt => {
                if (opt.dataset.correct === 'true') {
                    opt.classList.add('correct');
                }
            });
        }
        
        // Cek jika semua pertanyaan terjawab
        const allAnswered = document.querySelectorAll('.quiz-option[style*="pointer-events: none"]').length === quizOptions.length;
        
        if (allAnswered) {
            if (correctAnswers === totalQuestions) {
                document.getElementById('game3-message').classList.remove('hidden');
                game3Completed = true;
                createConfetti();
            } else {
                setTimeout(() => {
                    alert(`Kamu benar ${correctAnswers} dari ${totalQuestions}. Coba lagi ya sayang! ❤️`);
                    // Reset kuis
                    quizOptions.forEach(opt => {
                        opt.classList.remove('correct', 'wrong');
                        opt.style.pointerEvents = 'auto';
                    });
                    correctAnswers = 0;
                }, 1000);
            }
        }
    });
});

// 5. Konfetti
function createConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confettiCount = 150;
    const confetti = [];
    
    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 10 + 5,
            d: Math.random() * 5 + 2,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            tilt: Math.random() * 10 - 10,
            tiltAngleIncrement: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }
    
    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach(c => {
            ctx.beginPath();
            ctx.moveTo(c.x, c.y);
            ctx.lineTo(c.x + c.r * Math.cos(c.tiltAngle), c.y + c.r * Math.sin(c.tiltAngle));
            ctx.lineWidth = c.r;
            ctx.strokeStyle = c.color;
            ctx.stroke();
            
            // Update posisi
            c.y += c.d;
            c.x += Math.sin(c.y * 0.01) * 2;
            c.tiltAngle += c.tiltAngleIncrement;
            
            // Jika konfetti jatuh di bawah, reset ke atas
            if (c.y > canvas.height) {
                c.y = -c.r;
                c.x = Math.random() * canvas.width;
            }
        });
        
        requestAnimationFrame(drawConfetti);
    }
    
    // Hentikan konfetti setelah 5 detik
    drawConfetti();
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 5000);
}

// 6. Countdown Anniversary
function startCountdown() {
    const anniversary = new Date(ANNIVERSARY_DATE).getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = anniversary - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        } else {
            // Jika sudah lewat tanggal anniversary
            document.querySelector('.countdown').innerHTML = 
                '<h3><i class="fas fa-heart"></i> Selamat Anniversary Sayang! ❤️</h3>' +
                '<p>Terima kasih sudah menjadi bagian terindah dalam hidupku.</p>';
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// 7. Musik Background
musicToggle.addEventListener('click', () => {
    const musicIcon = musicToggle.querySelector('.fa-music');
    const muteIcon = musicToggle.querySelector('.fa-volume-mute');
    
    if (bgMusic.paused) {
        bgMusic.play();
        musicIcon.classList.remove('hidden');
        muteIcon.classList.add('hidden');
    } else {
        bgMusic.pause();
        musicIcon.classList.add('hidden');
        muteIcon.classList.remove('hidden');
    }
});

// Auto play musik dengan interaksi user
document.addEventListener('click', function initMusic() {
    if (bgMusic.paused) {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(e => console.log("Autoplay diblokir browser"));
    }
    document.removeEventListener('click', initMusic);
}, { once: true });

// 8. Modal untuk Kupon dan Galeri
const couponBtn = document.getElementById('coupon-btn');
const galleryBtn = document.getElementById('gallery-btn');
const couponModal = document.getElementById('coupon-modal');
const galleryModal = document.getElementById('gallery-modal');
const closeModals = document.querySelectorAll('.close-modal');

couponBtn.addEventListener('click', () => {
    couponModal.classList.remove('hidden');
});

galleryBtn.addEventListener('click', () => {
    // Tambahkan foto-foto di sini (ganti dengan foto kalian)
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = `
        <div class="gallery-item" style="background:linear-gradient(135deg,#ffafbd,#ffc3a0);">Foto Pertama Kita</div>
        <div class="gallery-item" style="background:linear-gradient(135deg,#a1c4fd,#c2e9fb);">Liburan Bersama</div>
        <div class="gallery-item" style="background:linear-gradient(135deg,#ffecd2,#fcb69f);">Momen Spesial</div>
        <div class="gallery-item" style="background:linear-gradient(135deg,#d4fc79,#96e6a1);">Canda Tawa Kita</div>
    `;
    galleryModal.classList.remove('hidden');
});

closeModals.forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        couponModal.classList.add('hidden');
        galleryModal.classList.add('hidden');
    });
});

// Tutup modal jika klik di luar
window.addEventListener('click', (e) => {
    if (e.target === couponModal) couponModal.classList.add('hidden');
    if (e.target === galleryModal) galleryModal.classList.add('hidden');
});

// 9. Responsive canvas konfetti
window.addEventListener('resize', () => {
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// 10. Inisialisasi halaman pertama
showPage('home');
createConfetti(); // Sedikit konfetti di awal
});

// 11. Animasi ketik untuk surat (opsional)
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Untuk menggunakan efek ketik di surat:
// typeWriter(document.querySelector('.letter-text'), "Teks surat disini...");

console.log("Website Valentine siap! 💖");