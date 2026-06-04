/* ============================================
   CineStream — scrips.js
   Proyecto universitario
   matricula: 2403230435
   Hecho por: Juan Manuel Sanchez Castro
   ============================================ */

// ---- NAVBAR: cambio al hacer scroll ----
window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// ---- FILTRO POR CATEGORÍA ----
function filtrar(categoria, btn) {
    // Actualizar botón activo
    document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const tarjetas = document.querySelectorAll('.pelicula-card');
    let hayResultados = false;

    tarjetas.forEach(card => {
        if (categoria === 'todos' || card.dataset.categoria === categoria) {
            card.style.display = '';
            hayResultados = true;
        } else {
            card.style.display = 'none';
        }
    });

    document.getElementById('sinResultados').classList.toggle('d-none', hayResultados);
}

// ---- BUSCADOR ----
function buscar() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();

    if (query === '') {
        // Mostrar todas si búsqueda vacía
        document.querySelectorAll('.pelicula-card').forEach(c => c.style.display = '');
        document.getElementById('sinResultados').classList.add('d-none');
        return;
    }

    const tarjetas = document.querySelectorAll('.pelicula-card');
    let hayResultados = false;

    tarjetas.forEach(card => {
        const titulo = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const info = card.querySelector('small')?.textContent.toLowerCase() || '';
        if (titulo.includes(query) || info.includes(query)) {
            card.style.display = '';
            hayResultados = true;
        } else {
            card.style.display = 'none';
        }
    });

    document.getElementById('sinResultados').classList.toggle('d-none', hayResultados);

    // Scroll a sección películas
    document.getElementById('peliculas').scrollIntoView({ behavior: 'smooth' });
}

// Buscar al presionar Enter
document.getElementById('searchInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') buscar();
});

// ---- ABRIR MODAL DE PELÍCULA ----
let playerInterval = null;
let segundos = 0;

function abrirModal(titulo, anio, genero, duracion, rating, sinopsis) {
    document.getElementById('modalTitulo').textContent = titulo;
    document.getElementById('modalAnio').textContent = anio;
    document.getElementById('modalGenero').textContent = genero;
    document.getElementById('modalDuracion').textContent = duracion;
    document.getElementById('modalRating').textContent = rating;
    document.getElementById('modalSinopsis').textContent = sinopsis;

    // Imagen placeholder con el nombre
    const color = stringToColor(titulo);
    document.getElementById('modalImg').src =
        `https://via.placeholder.com/200x300/${color}/ffffff?text=${encodeURIComponent(titulo)}`;

    // Resetear reproductor
    resetPlayer();
    document.getElementById('playerArea').classList.add('d-none');

    // Botón reproducir
    document.getElementById('modalPlayBtn').onclick = () => reproducir(titulo);

    new bootstrap.Modal(document.getElementById('movieModal')).show();
}

// ---- REPRODUCTOR SIMULADO ----
function reproducir(titulo) {
    const playerArea = document.getElementById('playerArea');
    playerArea.classList.remove('d-none');
    playerArea.scrollIntoView({ behavior: 'smooth' });

    resetPlayer();

    const spinner = document.getElementById('loadingSpinner');
    const msg = document.getElementById('playerMsg');
    const progressBar = document.getElementById('progressBar');
    const timeDisplay = document.getElementById('timeDisplay');
    const pauseBtn = document.getElementById('pauseBtn');

    msg.textContent = `Cargando: ${titulo}...`;
    spinner.style.display = 'block';
    segundos = 0;

    setTimeout(() => {
        spinner.style.display = 'none';
        msg.textContent = `▶ Reproduciendo: ${titulo}`;

        let pausado = false;

        pauseBtn.onclick = () => {
            pausado = !pausado;
            pauseBtn.textContent = pausado ? '▶' : '⏸';
            msg.textContent = pausado ? `⏸ Pausado: ${titulo}` : `▶ Reproduciendo: ${titulo}`;
        };

        playerInterval = setInterval(() => {
            if (pausado) return;
            segundos++;
            const pct = Math.min((segundos / 300) * 100, 100);
            progressBar.style.width = pct + '%';
            const min = Math.floor(segundos / 60);
            const sec = segundos % 60;
            timeDisplay.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
            if (segundos >= 300) {
                clearInterval(playerInterval);
                msg.textContent = '✅ Reproducción de demostración finalizada';
            }
        }, 1000);

    }, 2000);
}

function resetPlayer() {
    if (playerInterval) clearInterval(playerInterval);
    playerInterval = null;
    segundos = 0;
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('timeDisplay').textContent = '0:00';
    document.getElementById('pauseBtn').textContent = '⏸';
    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('playerMsg').textContent = '';
}

// Limpiar al cerrar modal
document.getElementById('movieModal').addEventListener('hidden.bs.modal', resetPlayer);

// ---- LOGIN SIMULADO ----
function login() {
    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
    setTimeout(() => {
        alert('✅ Inicio de sesión exitoso (modo demo). ¡Bienvenido a CineStream!');
    }, 400);
}

// ---- HELPER: color por nombre ----
function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const r = (hash >> 16 & 0xFF).toString(16).padStart(2, '0');
    const g = (hash >> 8 & 0xFF).toString(16).padStart(2, '0');
    const b = (hash & 0xFF).toString(16).padStart(2, '0');
    return `${r}${g}${b}`;
}