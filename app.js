// Sistema de datos en memoria (reemplaza localStorage)
let appData = {
    userData: {
        pausasHoy: 0,
        tiempoTotalHoy: 0,
        tiempoTotalGeneral: 0,
        pausasCompletadas: 0,
        racha: 0,
        ultimoDia: new Date().toDateString(),
        tiposFavoritos: {
            'pausas-visuales': 0,
            'ejercicios-musculares': 0,
            'estiramientos': 0
        }
    },
    configuracion: {
        frecuenciaRecordatorios: 60,
        duracionPausas: 10,
        tema: 'auto',
        soundEnabled: true,
        volume: 0.5
    },
    historialEjercicios: []
};

// Datos de ejercicios con emojis
const ejerciciosData = {
    "pausas_visuales": [
        {
            "nombre": "Regla 20-20-20",
            "descripcion": "Cada 20 minutos, mira algo a 6 metros de distancia por 20 segundos",
            "duracion": 20,
            "emoji": "👁️",
            "instrucciones": [
                "Levanta la vista de la pantalla",
                "Busca un objeto lejano (al menos 6 metros)",
                "Enfoca la vista en ese objeto",
                "Mantén la mirada fija por 20 segundos",
                "Parpadea varias veces al finalizar"
            ]
        },
        {
            "nombre": "Ejercicios Oculares",
            "descripcion": "Movimientos para relajar los músculos oculares",
            "duracion": 60,
            "emoji": "👁️‍🗨️",
            "instrucciones": [
                "Mueve los ojos de izquierda a derecha 10 veces",
                "Mueve los ojos de arriba hacia abajo 10 veces", 
                "Realiza círculos con los ojos, 5 hacia cada lado",
                "Parpadea rápidamente 10 veces",
                "Cierra los ojos suavemente por 5 segundos"
            ]
        },
        {
            "nombre": "Palmeo Ocular",
            "descripcion": "Técnica para relajar completamente los ojos",
            "duracion": 30,
            "emoji": "🤲",
            "instrucciones": [
                "Frota las palmas de las manos para generar calor",
                "Coloca las palmas sobre los ojos cerrados",
                "No ejerzas presión sobre los ojos",
                "Respira profundamente",
                "Mantén por 30 segundos en oscuridad total"
            ]
        }
    ],
    "ejercicios_musculares": [
        {
            "nombre": "Flexiones de Cuello",
            "descripcion": "Fortalece y relaja los músculos cervicales",
            "duracion": 45,
            "emoji": "🦴",
            "instrucciones": [
                "Siéntate derecho en tu silla",
                "Inclina la cabeza hacia adelante suavemente",
                "Mantén por 10 segundos",
                "Inclina hacia atrás (sin forzar)",
                "Repite 5 veces cada movimiento"
            ]
        },
        {
            "nombre": "Rotación de Hombros",
            "descripcion": "Activa la circulación en hombros y brazos",
            "duracion": 30,
            "emoji": "💪",
            "instrucciones": [
                "Sube los hombros hacia las orejas",
                "Realiza círculos hacia adelante 10 veces",
                "Realiza círculos hacia atrás 10 veces",
                "Relaja los hombros completamente",
                "Respira profundo al terminar"
            ]
        },
        {
            "nombre": "Flexiones de Muñeca",
            "descripcion": "Fortalece músculos de antebrazos y muñecas",
            "duracion": 40,
            "emoji": "✋",
            "instrucciones": [
                "Extiende los brazos hacia adelante",
                "Flexiona las muñecas hacia arriba",
                "Mantén 5 segundos y relaja",
                "Flexiona hacia abajo y mantén",
                "Repite 8 veces cada dirección"
            ]
        }
    ],
    "estiramientos": [
        {
            "nombre": "Estiramiento de Muñecas",
            "descripcion": "Previene túnel carpiano y fatiga",
            "duracion": 20,
            "emoji": "🤝",
            "instrucciones": [
                "Extiende el brazo hacia adelante",
                "Con la otra mano, flexiona la muñeca hacia abajo",
                "Mantén 10 segundos",
                "Flexiona hacia arriba y mantén 10 segundos",
                "Repite con la otra mano"
            ]
        },
        {
            "nombre": "Estiramiento Lateral",
            "descripcion": "Relaja los músculos laterales del tronco",
            "duracion": 30,
            "emoji": "🧘‍♂️",
            "instrucciones": [
                "Siéntate derecho con los pies en el suelo",
                "Levanta un brazo por encima de la cabeza",
                "Inclínate suavemente hacia el lado opuesto",
                "Mantén 15 segundos",
                "Repite hacia el otro lado"
            ]
        },
        {
            "nombre": "Estiramiento de Cuello",
            "descripcion": "Alivia la tensión cervical y de hombros",
            "duracion": 35,
            "emoji": "🤷‍♂️",
            "instrucciones": [
                "Inclina la cabeza hacia un hombro",
                "Usa la mano del mismo lado para presionar suavemente",
                "Mantén 15 segundos",
                "Cambia al otro lado",
                "Repite el ciclo 2 veces más"
            ]
        }
    ]
};

// Mensajes para compartir con emojis
const shareMessages = {
    general: "💪 ¡Acabo de completar {pausas} pausas activas hoy! ⏰ Total: {tiempo} minutos de bienestar 🧘‍♂️ Mi cuerpo y mente se sienten genial ✨ 🎯 #PausasActivas #BienestarLaboral #SaludDigital 💚",
    visual: "👁️ ¡Cuidé mis ojos con pausas visuales! ✨ Completé {ejercicios} ejercicios en {tiempo} minutos 🎯 Mis ojos se sienten descansados 💚 #SaludVisual #PausasActivas 🔥",
    muscular: "💪 ¡Fortalecí mis músculos con ejercicios activos! 🏃‍♀️ {ejercicios} rutinas en {tiempo} minutos ⏰ Mi cuerpo está activado y listo 🌟 #EjercicioActivo #BienestarLaboral 💯",
    estiramiento: "🧘‍♂️ ¡Relajé mi cuerpo con estiramientos! ✨ {ejercicios} posturas en {tiempo} minutos 🙌 Me siento flexible y relajado 💚 #Estiramiento #Bienestar #Flexibilidad 🌟"
};

// Sistema de audio usando Web Audio API
class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.tickSound = null;
        this.enabled = appData.configuracion.soundEnabled;
        this.volume = appData.configuracion.volume;
        this.init();
    }

    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API no soportada:', error);
        }
    }

    async ensureAudioContext() {
        if (!this.audioContext || !this.enabled) return false;
        
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        return true;
    }

    async playStartSound() {
        if (!await this.ensureAudioContext()) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(660, this.audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator.type = 'sine';
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.3);
        } catch (error) {
            console.warn('Error playing start sound:', error);
        }
    }

    async playEndSound() {
        if (!await this.ensureAudioContext()) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(660, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(330, this.audioContext.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.15, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            oscillator.type = 'sine';
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.5);
        } catch (error) {
            console.warn('Error playing end sound:', error);
        }
    }

    async playTickSound() {
        if (!await this.ensureAudioContext()) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.type = 'square';
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.1);
        } catch (error) {
            console.warn('Error playing tick sound:', error);
        }
    }

    async playTockSound() {
        if (!await this.ensureAudioContext()) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.type = 'square';
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.1);
        } catch (error) {
            console.warn('Error playing tock sound:', error);
        }
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        appData.configuracion.soundEnabled = enabled;
    }

    setVolume(volume) {
        this.volume = volume;
        appData.configuracion.volume = volume;
    }
}

// SVG Illustrations
const svgIllustrations = {
    'pausas_visuales': {
        'Regla 20-20-20': `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="30" fill="none" stroke="var(--color-primary)" stroke-width="3"/>
                <circle cx="100" cy="100" r="10" fill="var(--color-primary)"/>
                <path d="M 60 100 Q 100 60 140 100 Q 100 140 60 100" fill="none" stroke="var(--color-teal-500)" stroke-width="2" stroke-dasharray="5,5">
                    <animateTransform attributeName="transform" type="rotate" values="0 100 100;360 100 100" dur="3s" repeatCount="indefinite"/>
                </path>
                <text x="100" y="170" text-anchor="middle" fill="var(--color-text)" font-size="14" font-family="var(--font-family-base)">6 metros</text>
            </svg>
        `,
        'Ejercicios Oculares': `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="100" cy="100" rx="50" ry="35" fill="none" stroke="var(--color-primary)" stroke-width="3"/>
                <circle cx="100" cy="100" r="15" fill="var(--color-primary)"/>
                <circle cx="100" cy="100" r="8" fill="var(--color-surface)"/>
                <path d="M 50 100 L 150 100 M 100 65 L 100 135 M 75 75 L 125 125 M 75 125 L 125 75" stroke="var(--color-teal-500)" stroke-width="2" stroke-dasharray="3,3" opacity="0.7">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
                </path>
            </svg>
        `,
        'Palmeo Ocular': `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path d="M 70 80 Q 85 60 100 80 Q 115 60 130 80 Q 130 120 100 130 Q 70 120 70 80" fill="var(--color-bg-2)" stroke="var(--color-primary)" stroke-width="2"/>
                <path d="M 40 100 Q 60 80 80 100 Q 80 130 60 140 Q 40 130 40 100" fill="var(--color-teal-300)" opacity="0.8"/>
                <path d="M 120 100 Q 140 80 160 100 Q 160 130 140 140 Q 120 130 120 100" fill="var(--color-teal-300)" opacity="0.8"/>
                <text x="100" y="170" text-anchor="middle" fill="var(--color-text)" font-size="12" font-family="var(--font-family-base)">Palmas cálidas</text>
            </svg>
        `
    },
    'ejercicios_musculares': {
        'Flexiones de Cuello': `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="70" r="25" fill="var(--color-bg-2)" stroke="var(--color-primary)" stroke-width="3"/>
                <rect x="85" y="95" width="30" height="60" rx="15" fill="var(--color-bg-3)" stroke="var(--color-primary)" stroke-width="2"/>
                <path d="M 100 50 Q 90 35 100 25 M 100 50 Q 110 35 100 25" stroke="var(--color-orange-500)" stroke-width="3" fill="none">
                    <animateTransform attributeName="transform" type="rotate" values="0 100 70;-15 100 70;0 100 70;15 100 70;0 100 70" dur="3s" repeatCount="indefinite"/>
                </path>
                <text x="100" y="180" text-anchor="middle" fill="var(--color-text)" font-size="12" font-family="var(--font-family-base)">Flexión suave</text>
            </svg>
        `,
        'Rotación de Hombros': `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="60" r="20" fill="var(--color-bg-2)" stroke="var(--color-primary)" stroke-width="2"/>
                <rect x="85" y="80" width="30" height="50" rx="15" fill="var(--color-bg-3)" stroke="var(--color-primary)" stroke-width="2"/>
                <circle cx="70" cy="90" r="15" fill="var(--color-orange-400)" opacity="0.8"/>
                <circle cx="130" cy="90" r="15" fill="var(--color-orange-400)" opacity="0.8"/>
                <path d="M 70 75 Q 85 60 70 45 Q 55 60 70 75" fill="none" stroke="var(--color-orange-500)" stroke-width="3">
                    <animateTransform attributeName="transform" type="rotate" values="0 70 75;360 70 75" dur="2s" repeatCount="indefinite"/>
                </path>
                <path d="M 130 75 Q 115 60 130 45 Q 145 60 130 75" fill="none" stroke="var(--color-orange-500)" stroke-width="3">
                    <animateTransform attributeName="transform" type="rotate" values="0 130 75;-360 130 75" dur="2s" repeatCount="indefinite"/>
                </path>
            </svg>
        `,
        'Flexiones de Muñeca': `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <rect x="60" y="120" width="80" height="15" rx="7" fill="var(--color-bg-3)" stroke="var(--color-primary)" stroke-width="2"/>
                <rect x="140" y="115" width="20" height="25" rx="10" fill="var(--color-orange-400)" stroke="var(--color-primary)" stroke-width="2"/>
                <rect x="160" y="110" width="30" height="8" rx="4" fill="var(--color-bg-2)" stroke="var(--color-primary)" stroke-width="2"/>
                <path d="M 170 105 Q 180 90 170 80 M 170 105 Q 160 90 170 80" stroke="var(--color-orange-500)" stroke-width="3" fill="none">
                    <animateTransform attributeName="transform" type="rotate" values="0 170 105;20 170 105;0 170 105;-20 170 105;0 170 105" dur="2s" repeatCount="indefinite"/>
                </path>
                <text x="100" y="170" text-anchor="middle" fill="var(--color-text)" font-size="12" font-family="var(--font-family-base)">Flexión activa</text>
            </svg>
        `
    },
    'estiramientos': {
        'Estiramiento de Muñecas': `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <rect x="50" y="110" width="100" height="12" rx="6" fill="var(--color-bg-3)" stroke="var(--color-success)" stroke-width="2"/>
                <rect x="150" y="105" width="25" height="22" rx="11" fill="var(--color-teal-300)" stroke="var(--color-success)" stroke-width="2"/>
                <rect x="175" y="100" width="20" height="8" rx="4" fill="var(--color-bg-2)" stroke="var(--color-success)" stroke-width="2"/>
                <path d="M 185 95 Q 195 80 185 70" stroke="var(--color-teal-500)" stroke-width="3" fill="none" stroke-dasharray="5,5">
                    <animate attributeName="stroke-dashoffset" values="0;10;0" dur="1.5s" repeatCount="indefinite"/>
                </path>
                <circle cx="40" cy="116" r="18" fill="var(--color-teal-300)" opacity="0.6"/>
                <text x="100" y="170" text-anchor="middle" fill="var(--color-text)" font-size="12" font-family="var(--font-family-base)">Estiramiento suave</text>
            </svg>
        `,
        'Estiramiento Lateral': `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="50" r="20" fill="var(--color-bg-2)" stroke="var(--color-success)" stroke-width="2"/>
                <rect x="85" y="70" width="30" height="60" rx="15" fill="var(--color-bg-3)" stroke="var(--color-success)" stroke-width="2"/>
                <path d="M 85 85 Q 60 70 50 85" stroke="var(--color-teal-500)" stroke-width="4" fill="none"/>
                <rect x="75" y="130" width="50" height="15" rx="7" fill="var(--color-bg-4)" stroke="var(--color-success)" stroke-width="2"/>
                <path d="M 100 40 Q 120 30 130 50" stroke="var(--color-teal-500)" stroke-width="3" fill="none" stroke-dasharray="3,3">
                    <animateTransform attributeName="transform" type="rotate" values="0 100 50;15 100 50;0 100 50;-15 100 50;0 100 50" dur="3s" repeatCount="indefinite"/>
                </path>
                <text x="100" y="170" text-anchor="middle" fill="var(--color-text)" font-size="12" font-family="var(--font-family-base)">Inclinación lateral</text>
            </svg>
        `,
        'Estiramiento de Cuello': `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="60" r="25" fill="var(--color-bg-2)" stroke="var(--color-success)" stroke-width="3"/>
                <rect x="85" y="85" width="30" height="60" rx="15" fill="var(--color-bg-3)" stroke="var(--color-success)" stroke-width="2"/>
                <circle cx="130" cy="90" r="15" fill="var(--color-teal-300)" opacity="0.8"/>
                <path d="M 125 85 Q 130 70 120 60" stroke="var(--color-teal-500)" stroke-width="3" fill="none"/>
                <path d="M 100 40 Q 115 35 125 50" stroke="var(--color-success)" stroke-width="3" fill="none" stroke-dasharray="4,4">
                    <animateTransform attributeName="transform" type="rotate" values="0 100 60;20 100 60;0 100 60" dur="2s" repeatCount="indefinite"/>
                </path>
                <text x="100" y="170" text-anchor="middle" fill="var(--color-text)" font-size="12" font-family="var(--font-family-base)">Presión suave</text>
            </svg>
        `
    }
};

// Sistema de navegación (fijo - sin sudoku)
class AppNavigation {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.setupMenuListeners();
        this.setupMobileMenu();
    }

    setupMenuListeners() {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                console.log('Menu clicked:', section); // Debug
                this.navigateTo(section);
            });
        });
    }

    setupMobileMenu() {
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const sidebar = document.getElementById('sidebar');
        const mobileOverlay = document.getElementById('mobileOverlay');

        hamburgerBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            mobileOverlay.classList.toggle('hidden');
        });

        mobileOverlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            mobileOverlay.classList.add('hidden');
        });
    }

    navigateTo(section) {
        console.log('Navigating to:', section);
        
        // Ocultar todas las secciones
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });

        // Mostrar la sección seleccionada
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.classList.add('active');
            console.log('Section found and activated:', section);
        } else {
            console.error('Section not found:', section);
            return;
        }

        // Actualizar menú activo
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        const menuItem = document.querySelector(`[data-section="${section}"]`);
        if (menuItem) {
            menuItem.classList.add('active');
            console.log('Menu item activated:', section);
        }

        // Cerrar menú móvil
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('mobileOverlay').classList.add('hidden');

        this.currentSection = section;

        // Cargar contenido específico de la sección
        this.loadSectionContent(section);
    }

    loadSectionContent(section) {
        console.log('Loading content for:', section);
        switch(section) {
            case 'dashboard':
                dashboard.render();
                break;
            case 'pausas-visuales':
                exerciseManager.renderExercises('pausas_visuales', 'pausasVisualesGrid');
                break;
            case 'ejercicios-musculares':
                exerciseManager.renderExercises('ejercicios_musculares', 'ejerciciosMuscularesGrid');
                break;
            case 'estiramientos':
                exerciseManager.renderExercises('estiramientos', 'estiramientosGrid');
                break;
            case 'estadisticas':
                statsManager.render();
                break;
            case 'configuracion':
                configManager.render();
                break;
            default:
                console.error('Unknown section:', section);
        }
    }
}

// Gestor de ejercicios (mejorado con audio y SVG)
class ExerciseManager {
    constructor() {
        this.currentExercise = null;
        this.timer = null;
        this.timeRemaining = 0;
        this.currentStep = 0;
        this.tickTockTimer = null;
        this.tickTock = true;
        this.setupModal();
    }

    setupModal() {
        const modal = document.getElementById('exerciseModal');
        const closeBtn = document.getElementById('modalClose');
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const stopBtn = document.getElementById('stopBtn');

        closeBtn.addEventListener('click', () => this.closeModal());
        startBtn.addEventListener('click', () => this.startExercise());
        pauseBtn.addEventListener('click', () => this.pauseExercise());
        stopBtn.addEventListener('click', () => this.stopExercise());

        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });

        // Setup share modal
        const shareModal = document.getElementById('shareModal');
        const shareCloseBtn = document.getElementById('shareModalClose');
        const copyBtn = document.getElementById('copyMessageBtn');

        shareCloseBtn.addEventListener('click', () => shareModal.classList.add('hidden'));
        shareModal.addEventListener('click', (e) => {
            if (e.target === shareModal) shareModal.classList.add('hidden');
        });

        copyBtn.addEventListener('click', () => this.copyShareMessage());
    }

    renderExercises(categoria, containerId) {
        const container = document.getElementById(containerId);
        const exercises = ejerciciosData[categoria];
        
        if (!container || !exercises) {
            console.error('Container or exercises not found:', containerId, categoria);
            return;
        }

        container.innerHTML = exercises.map(exercise => `
            <div class="card exercise-card ${categoria.replace('_', '-')}" 
                 data-exercise="${exercise.nombre}" data-categoria="${categoria}">
                <div class="card__body">
                    <div class="exercise-visual-preview">
                        ${svgIllustrations[categoria][exercise.nombre] || '<div style="width: 80px; height: 80px; background: var(--color-bg-2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px;">' + exercise.emoji + '</div>'}
                    </div>
                    <div class="exercise-header">
                        <span class="exercise-icon">${exercise.emoji}</span>
                        <div style="flex: 1;">
                            <h3>${exercise.nombre}</h3>
                        </div>
                        <span class="exercise-duration">${exercise.duracion}s</span>
                    </div>
                    <p>${exercise.descripcion}</p>
                </div>
            </div>
        `).join('');

        // Agregar event listeners a las tarjetas
        container.querySelectorAll('.exercise-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const exerciseName = card.dataset.exercise;
                const categoria = card.dataset.categoria;
                console.log('Exercise clicked:', exerciseName, categoria); // Debug
                this.openExercise(categoria, exerciseName);
            });
        });
    }

    openExercise(categoria, nombre) {
        console.log('Opening exercise:', categoria, nombre);
        const exercise = ejerciciosData[categoria].find(ex => ex.nombre === nombre);
        if (!exercise) {
            console.error('Exercise not found:', categoria, nombre);
            return;
        }

        this.currentExercise = { ...exercise, categoria };
        this.timeRemaining = exercise.duracion;
        this.currentStep = 0;

        document.getElementById('modalTitle').textContent = exercise.nombre + ' ' + exercise.emoji;
        this.renderVisual();
        this.renderInstructions();
        this.updateTimerDisplay();
        this.resetModal();
        document.getElementById('exerciseModal').classList.remove('hidden');
    }

    renderVisual() {
        const container = document.getElementById('exerciseVisual');
        const categoria = this.currentExercise.categoria;
        const nombre = this.currentExercise.nombre;
        
        container.innerHTML = svgIllustrations[categoria][nombre] || 
            `<div style="width: 150px; height: 150px; background: var(--color-bg-2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 48px;">${this.currentExercise.emoji}</div>`;
    }

    renderInstructions() {
        const container = document.getElementById('exerciseInstructions');
        const instructions = this.currentExercise.instrucciones;

        container.innerHTML = instructions.map((instruction, index) => `
            <div class="instruction-step ${index === 0 ? 'active' : ''}">
                <div class="step-number">${index + 1}</div>
                <div>${instruction}</div>
            </div>
        `).join('');
    }

    resetModal() {
        // Resetear botones
        document.getElementById('startBtn').classList.remove('hidden');
        document.getElementById('pauseBtn').classList.add('hidden');
        const timerCircle = document.querySelector('.timer-circle');
        timerCircle.classList.remove('running', 'warning');
        timerCircle.style.borderColor = '';
        document.getElementById('timerWarning').classList.add('hidden');
        
        // Resetear primer paso
        this.currentStep = 0;
        this.updateActiveStep(0);
    }

    async startExercise() {
        if (this.timer) return;

        // Reproducir sonido de inicio
        await audioSystem.playStartSound();

        document.getElementById('startBtn').classList.add('hidden');
        document.getElementById('pauseBtn').classList.remove('hidden');
        document.querySelector('.timer-circle').classList.add('running');

        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();

            // Tic-tac en últimos 5 segundos
            if (this.timeRemaining <= 5 && this.timeRemaining > 0) {
                if (!document.querySelector('.timer-circle').classList.contains('warning')) {
                    document.querySelector('.timer-circle').classList.add('warning');
                    document.getElementById('timerWarning').classList.remove('hidden');
                }
                
                if (this.tickTock) {
                    audioSystem.playTickSound();
                } else {
                    audioSystem.playTockSound();
                }
                this.tickTock = !this.tickTock;
            }

            // Cambiar paso cada cierto tiempo
            const stepDuration = Math.floor(this.currentExercise.duracion / this.currentExercise.instrucciones.length);
            const newStep = Math.floor((this.currentExercise.duracion - this.timeRemaining) / stepDuration);
            
            if (newStep !== this.currentStep && newStep < this.currentExercise.instrucciones.length) {
                this.updateActiveStep(newStep);
                this.currentStep = newStep;
            }

            if (this.timeRemaining <= 0) {
                this.completeExercise();
            }
        }, 1000);
    }

    pauseExercise() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            document.getElementById('startBtn').classList.remove('hidden');
            document.getElementById('pauseBtn').classList.add('hidden');
            document.querySelector('.timer-circle').classList.remove('running');
        }
    }

    stopExercise() {
        this.pauseExercise();
        this.closeModal();
    }

    async completeExercise() {
        this.pauseExercise();
        
        // Reproducir sonido de finalización
        await audioSystem.playEndSound();
        
        // Actualizar estadísticas
        appData.userData.pausasHoy++;
        appData.userData.pausasCompletadas++;
        appData.userData.tiempoTotalHoy += this.currentExercise.duracion / 60;
        appData.userData.tiempoTotalGeneral += this.currentExercise.duracion / 60;
        appData.userData.tiposFavoritos[this.currentExercise.categoria.replace('_', '-')]++;

        // Agregar al historial
        appData.historialEjercicios.push({
            nombre: this.currentExercise.nombre,
            categoria: this.currentExercise.categoria,
            duracion: this.currentExercise.duracion,
            fecha: new Date().toISOString()
        });

        // Mostrar mensaje de completado
        document.getElementById('timerDisplay').textContent = '¡Completado! 🎉';
        document.querySelector('.timer-circle').style.borderColor = 'var(--color-success)';
        document.getElementById('timerWarning').classList.add('hidden');

        setTimeout(() => {
            this.closeModal();
            this.showCompletionMessage();
        }, 2000);
    }

    showCompletionMessage() {
        // Crear y mostrar mensaje de éxito
        const message = document.createElement('div');
        message.className = 'completion-message';
        message.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: var(--color-success); color: var(--color-btn-primary-text); padding: 20px; 
                        border-radius: 8px; z-index: 3000; text-align: center; box-shadow: var(--shadow-lg);">
                <h3>¡Excelente trabajo! 🎉</h3>
                <p>Has completado: ${this.currentExercise.nombre} ${this.currentExercise.emoji}</p>
                <p>💪 ¡Sigue así! ✨</p>
            </div>
        `;
        document.body.appendChild(message);

        setTimeout(() => {
            if (document.body.contains(message)) {
                document.body.removeChild(message);
            }
        }, 3000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        document.getElementById('timerDisplay').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateActiveStep(stepIndex) {
        document.querySelectorAll('.instruction-step').forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
    }

    closeModal() {
        this.pauseExercise();
        document.getElementById('exerciseModal').classList.add('hidden');
        this.resetModal();
    }

    copyShareMessage() {
        const textarea = document.getElementById('shareMessage');
        textarea.select();
        document.execCommand('copy');
        
        const btn = document.getElementById('copyMessageBtn');
        const originalText = btn.textContent;
        btn.textContent = '✅ ¡Copiado!';
        
        setTimeout(() => {
            btn.textContent = originalText;
            document.getElementById('shareModal').classList.add('hidden');
        }, 1500);
    }
}

// Dashboard (mejorado con emojis)
class Dashboard {
    render() {
        this.updateStats();
        this.renderRecommendations();
        this.setupQuickAction();
    }

    updateStats() {
        const today = new Date().toDateString();
        
        // Reset si es un nuevo día
        if (appData.userData.ultimoDia !== today) {
            if (appData.userData.pausasHoy > 0) {
                appData.userData.racha++;
            } else {
                appData.userData.racha = 0;
            }
            appData.userData.pausasHoy = 0;
            appData.userData.tiempoTotalHoy = 0;
            appData.userData.ultimoDia = today;
        }

        document.getElementById('pausasHoy').textContent = appData.userData.pausasHoy;
        document.getElementById('tiempoTotalHoy').textContent = `${Math.round(appData.userData.tiempoTotalHoy)}m`;
        document.getElementById('racha').textContent = appData.userData.racha;
    }

    renderRecommendations() {
        const container = document.getElementById('recommendationsList');
        const recommendations = [
            "💡 Realiza la regla 20-20-20 cada hora para cuidar tu vista 👁️",
            "🤸 Estira las muñecas cada 30 minutos si usas mucho el teclado ⌨️",
            "💪 Los ejercicios de cuello previenen dolores cervicales 🦴",
            "🧘‍♂️ Los estiramientos laterales mejoran tu postura ✨"
        ];

        container.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item">${rec}</div>
        `).join('');
    }

    setupQuickAction() {
        const btn = document.getElementById('pausaRapidaBtn');
        // Remover listeners previos
        btn.replaceWith(btn.cloneNode(true));
        
        document.getElementById('pausaRapidaBtn').addEventListener('click', () => {
            const categorias = Object.keys(ejerciciosData);
            const randomCategoria = categorias[Math.floor(Math.random() * categorias.length)];
            const exercises = ejerciciosData[randomCategoria];
            const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
            
            exerciseManager.openExercise(randomCategoria, randomExercise.nombre);
        });
    }
}

// Gestor de estadísticas (mejorado con más redes sociales y emojis)
class StatsManager {
    render() {
        this.updateGeneralStats();
        this.setupShareButtons();
    }

    updateGeneralStats() {
        document.getElementById('tiempoTotalGeneral').textContent = 
            `${Math.round(appData.userData.tiempoTotalGeneral)} minutos`;
        document.getElementById('pausasCompletadas').textContent = appData.userData.pausasCompletadas;
        
        const tipoFavorito = this.getMostUsedType();
        document.getElementById('tipoFavorito').textContent = tipoFavorito;
    }

    getMostUsedType() {
        const tipos = appData.userData.tiposFavoritos;
        let maxTipo = 'Ninguno';
        let maxCount = 0;

        for (const [tipo, count] of Object.entries(tipos)) {
            if (count > maxCount) {
                maxCount = count;
                maxTipo = tipo.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
            }
        }

        return maxTipo;
    }

    setupShareButtons() {
        document.getElementById('shareWhatsApp').addEventListener('click', () => this.shareViaWhatsApp());
        document.getElementById('shareFacebook').addEventListener('click', () => this.shareViaFacebook());
        document.getElementById('shareTwitter').addEventListener('click', () => this.shareViaTwitter());
        document.getElementById('shareLinkedIn').addEventListener('click', () => this.shareViaLinkedIn());
        document.getElementById('shareTelegram').addEventListener('click', () => this.shareViaTelegram());
        document.getElementById('sharePinterest').addEventListener('click', () => this.shareViaPinterest());
        document.getElementById('shareInstagram').addEventListener('click', () => this.shareViaInstagram());
        document.getElementById('shareTikTok').addEventListener('click', () => this.shareViaTikTok());
    }

    getShareMessage() {
        const pausas = appData.userData.pausasCompletadas;
        const tiempo = Math.round(appData.userData.tiempoTotalGeneral);
        
        return shareMessages.general
            .replace('{pausas}', pausas)
            .replace('{tiempo}', tiempo);
    }

    shareViaWhatsApp() {
        const message = encodeURIComponent(this.getShareMessage());
        window.open(`https://wa.me/?text=${message}`, '_blank');
    }

    shareViaFacebook() {
        const message = encodeURIComponent(this.getShareMessage());
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${message}`, '_blank');
    }

    shareViaTwitter() {
        const message = encodeURIComponent(this.getShareMessage());
        window.open(`https://twitter.com/intent/tweet?text=${message}`, '_blank');
    }

    shareViaLinkedIn() {
        const message = encodeURIComponent(this.getShareMessage());
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${message}`, '_blank');
    }

    shareViaTelegram() {
        const message = encodeURIComponent(this.getShareMessage());
        window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${message}`, '_blank');
    }

    shareViaPinterest() {
        const message = encodeURIComponent(this.getShareMessage());
        window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&description=${message}`, '_blank');
    }

    shareViaInstagram() {
        this.showCopyModal(this.getShareMessage() + '\n\n📱 Copia este mensaje y compártelo en Instagram Stories o en tu feed!');
    }

    shareViaTikTok() {
        this.showCopyModal(this.getShareMessage() + '\n\n🎵 Copia este mensaje y úsalo en tu video de TikTok sobre bienestar!');
    }

    showCopyModal(message) {
        document.getElementById('shareMessage').value = message;
        document.getElementById('shareModal').classList.remove('hidden');
    }
}

// Gestor de configuración (mejorado con controles de audio)
class ConfigManager {
    render() {
        this.loadCurrentConfig();
        this.setupConfigListeners();
    }

    loadCurrentConfig() {
        document.getElementById('frecuenciaRecordatorios').value = appData.configuracion.frecuenciaRecordatorios;
        document.getElementById('duracionPausas').value = appData.configuracion.duracionPausas;
        document.getElementById('tema').value = appData.configuracion.tema;
        document.getElementById('soundEnabled').checked = appData.configuracion.soundEnabled;
        document.getElementById('volumeControl').value = appData.configuracion.volume;
    }

    setupConfigListeners() {
        document.getElementById('frecuenciaRecordatorios').addEventListener('change', (e) => {
            appData.configuracion.frecuenciaRecordatorios = parseInt(e.target.value);
        });

        document.getElementById('duracionPausas').addEventListener('change', (e) => {
            appData.configuracion.duracionPausas = parseInt(e.target.value);
        });

        document.getElementById('tema').addEventListener('change', (e) => {
            appData.configuracion.tema = e.target.value;
            this.applyTheme(e.target.value);
        });

        document.getElementById('soundEnabled').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            appData.configuracion.soundEnabled = enabled;
            audioSystem.setEnabled(enabled);
        });

        document.getElementById('volumeControl').addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value);
            appData.configuracion.volume = volume;
            audioSystem.setVolume(volume);
        });
    }

    applyTheme(theme) {
        if (theme === 'auto') {
            document.documentElement.removeAttribute('data-color-scheme');
        } else {
            document.documentElement.setAttribute('data-color-scheme', theme);
        }
    }
}

// Variables globales para las instancias
let navigation, exerciseManager, dashboard, statsManager, configManager, audioSystem;

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    console.log('App starting...');
    
    // Crear instancias
    audioSystem = new AudioSystem();
    navigation = new AppNavigation();
    exerciseManager = new ExerciseManager();
    dashboard = new Dashboard();
    statsManager = new StatsManager();
    configManager = new ConfigManager();

    // Configurar tema inicial
    configManager.applyTheme(appData.configuracion.tema);
    
    // Inicializar con dashboard
    console.log('Initializing with dashboard');
    navigation.navigateTo('dashboard');
});