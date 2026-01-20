// State management
const state = {
    phoneNumber: '',
    isInCall: false,
    callStartTime: null,
    callTimer: null,
    isMuted: false,
    isSpeakerOn: false,
    incallDigits: '',
    dtmfContext: null,
    dtmfOscillator: null,
    currentScreen: 'dialer', // 'dialer', 'history', 'contacts'
    // Pause state
    isPaused: false,
    currentPause: null, // { id, name }
    pauseStartTime: null,
    pauseTimer: null,
    // Qualification state
    requiresQualification: true, // Set to true/false based on call type
    selectedResult: 'success', // 'success' or 'failure'
    selectedQualification: null // { id, name }
};

// Call History Data (simulando API)
const callHistoryAPI = {
    // Simula uma chamada de API que retorna o histórico de ligações
    async getCallHistory() {
        // Simulando delay de API
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return [
            {
                id: 1,
                number: '(051) 98158-6810',
                clientName: 'MARIA SILVA',
                companyName: 'TECH SOLUTIONS LTDA',
                type: 'incoming',
                time: '11:02',
                missed: true
            },
            {
                id: 2,
                number: '(048) 92003-9355',
                clientName: 'JOÃO SANTOS',
                companyName: 'CONSTRUTORA ABC',
                type: 'incoming',
                time: '11:02',
                missed: true
            },
            {
                id: 3,
                number: '(48) 99203-3200',
                clientName: 'CHARLES COSAC',
                companyName: 'MINERAL DO BRASIL LTDA',
                type: 'outgoing',
                time: '11:01',
                missed: false
            },
            {
                id: 4,
                number: '(048) 98432-9328',
                clientName: 'ANA COSTA',
                companyName: 'DISTRIBUIDORA NORTE',
                type: 'incoming',
                time: '10:58',
                missed: true
            },
            {
                id: 5,
                number: '(048) 3029-1699',
                clientName: 'PEDRO OLIVEIRA',
                companyName: 'ATACADO SUL ME',
                type: 'incoming',
                time: '10:45',
                missed: true
            },
            {
                id: 6,
                number: '(048) 99986-7860',
                clientName: 'FERNANDA LIMA',
                companyName: 'LOGÍSTICA EXPRESS',
                type: 'incoming',
                time: '10:20',
                missed: true
            },
            {
                id: 7,
                number: '(048) 99659-1380',
                clientName: 'ROBERTO ALVES',
                companyName: 'METALÚRGICA ALFA',
                type: 'incoming',
                time: '10:14',
                missed: true
            },
            {
                id: 8,
                number: '(048) 98407-8230',
                clientName: 'CARLA MENDES',
                companyName: 'FARMÁCIA CENTRAL',
                type: 'incoming',
                time: '10:02',
                missed: true
            },
            {
                id: 9,
                number: '(051) 98158-6810',
                clientName: 'MARIA SILVA',
                companyName: 'TECH SOLUTIONS LTDA',
                type: 'incoming',
                time: '09:26',
                missed: true
            },
            {
                id: 10,
                number: '(048) 99623-4424',
                clientName: 'LUCAS FERREIRA',
                companyName: 'AUTO PEÇAS IRMÃOS',
                type: 'incoming',
                time: '09:15',
                missed: true
            },
            {
                id: 11,
                number: '(048) 99887-1234',
                clientName: 'PATRÍCIA ROCHA',
                companyName: 'ADVOCACIA ROCHA',
                type: 'outgoing',
                time: '09:10',
                missed: false
            },
            {
                id: 12,
                number: '(048) 3222-5678',
                clientName: 'MARCOS SOUZA',
                companyName: 'RESTAURANTE BOM SABOR',
                type: 'incoming',
                time: '08:45',
                missed: true
            }
        ];
    },
    
    // Retorna a contagem de chamadas perdidas
    async getMissedCallsCount() {
        const history = await this.getCallHistory();
        return history.filter(call => call.missed).length;
    }
};

// Pause Reasons Data (simulando API)
const pauseReasonsAPI = {
    // Simula uma chamada de API que retorna os motivos de pausa
    async getPauseReasons() {
        // Simulando delay de API
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return [
            { id: 4, name: 'Banheiro', icon: 'fa-person-walking' },
            { id: 5, name: 'Reunião', icon: 'fa-users' },
            { id: 6, name: 'Treinamento', icon: 'fa-graduation-cap' },
            { id: 9, name: 'Agenda Pipe', icon: 'fa-calendar' },
            { id: 10, name: 'Almoço', icon: 'fa-utensils' },
            { id: 11, name: 'Ligando Pipe', icon: 'fa-phone' }
        ];
    },
    
    // Simula enviar o status de pausa para a API
    async setPauseStatus(pauseId) {
        await new Promise(resolve => setTimeout(resolve, 200));
        return { success: true, pauseId };
    },
    
    // Simula voltar a ficar online
    async setOnlineStatus() {
        await new Promise(resolve => setTimeout(resolve, 200));
        return { success: true };
    }
};

// Client Data API (simulando API futura)
const clientDataAPI = {
    // Simula buscar dados do cliente pelo número de telefone
    async getClientByPhone(phoneNumber) {
        // Simulando delay de API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Dados de exemplo - em produção viriam da API real
        // Retorna null se não encontrar cliente
        const mockClients = {
            '(48) 99203-3200': {
                name: 'CHARLES COSAC',
                company: 'MINERAL DO BRASIL LTDA',
                totalDebt: 142972.17,
                recoveredAmount: 51335.68
            },
            '4899203-3200': {
                name: 'CHARLES COSAC',
                company: 'MINERAL DO BRASIL LTDA',
                totalDebt: 142972.17,
                recoveredAmount: 51335.68
            },
            '48992033200': {
                name: 'CHARLES COSAC',
                company: 'MINERAL DO BRASIL LTDA',
                totalDebt: 142972.17,
                recoveredAmount: 51335.68
            }
        };
        
        // Tenta encontrar por diferentes formatos do número
        const cleanNumber = phoneNumber.replace(/\D/g, '');
        
        // Busca direta ou por número limpo
        if (mockClients[phoneNumber]) {
            return mockClients[phoneNumber];
        }
        
        // Busca por número sem formatação
        for (const key in mockClients) {
            if (key.replace(/\D/g, '') === cleanNumber) {
                return mockClients[key];
            }
        }
        
        return null; // Cliente não encontrado
    },
    
    // Formata valor para moeda brasileira
    formatCurrency(value) {
        return value.toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
        });
    }
};

// Call Qualification API (simulando API futura)
const qualificationAPI = {
    // Retorna as qualificações de Sucesso
    async getSuccessQualifications() {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return [
            { id: 1, name: 'AGENDADO RELACIONADO(pipe)' },
            { id: 2, name: 'AGENDADO SÓCIO (pipe)' },
            { id: 3, name: 'DESLIGOU NA CARA (não identificou se faz parte da empresa)' },
            { id: 4, name: 'EM ATENDIMENTO' },
            { id: 5, name: 'Insatisfeito com a villela (ja foi cliente)' },
            { id: 6, name: 'JÁ NEGOCIOU A DÍVIDA' },
            { id: 7, name: 'JA TEM ASSESSORIA' },
            { id: 8, name: 'NÃO LIGAR MAIS (BLACK LIST)' },
            { id: 9, name: 'RELACIONADO (prosp. pipe)' },
            { id: 10, name: 'RELACIONADO (sem interesse)' },
            { id: 11, name: 'SÓCIO (prosp. pipe)' },
            { id: 12, name: 'SOCIO (sem interesse)' }
        ];
    },
    
    // Retorna as qualificações de Falha
    async getFailureQualifications() {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return [
            { id: 101, name: 'Chamada caiu/ desligou' },
            { id: 102, name: 'DESLIGOU NA CARA (não identificou se faz parte da empresa)' },
            { id: 103, name: 'EM ATENDIMENTO' },
            { id: 104, name: 'EX SÓCIO' },
            { id: 105, name: 'INCORRETO' },
            { id: 106, name: 'Ja é cliente' },
            { id: 107, name: 'Muda/Caixa postal' },
            { id: 108, name: 'SEM INTERESSE' },
            { id: 109, name: 'Tempo excedido' },
            { id: 110, name: 'VALOR MUITO BAIXO' }
        ];
    },
    
    // Envia a qualificação selecionada para a API
    async submitQualification(callData) {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        console.log('Qualificação enviada:', callData);
        return { success: true, callData };
    }
};

// DOM Elements
const elements = {
    phoneNumber: document.getElementById('phoneNumber'),
    callButton: document.getElementById('callButton'),
    deleteButton: document.getElementById('deleteButton'),
    addContact: document.getElementById('addContact'),
    dialerScreen: document.getElementById('dialerScreen'),
    callScreen: document.getElementById('callScreen'),
    incallKeypadScreen: document.getElementById('incallKeypadScreen'),
    callHistoryScreen: document.getElementById('callHistoryScreen'),
    callHistoryList: document.getElementById('callHistoryList'),
    callNumber: document.getElementById('callNumber'),
    callStatus: document.getElementById('callStatus'),
    endCallButton: document.getElementById('endCallButton'),
    endCallButton2: document.getElementById('endCallButton2'),
    speakerBtn: document.getElementById('speakerBtn'),
    muteBtn: document.getElementById('muteBtn'),
    keypadBtn: document.getElementById('keypadBtn'),
    hideKeypadBtn: document.getElementById('hideKeypadBtn'),
    incallPhoneNumber: document.getElementById('incallPhoneNumber'),
    bottomNav: document.getElementById('bottomNav'),
    navCalls: document.getElementById('navCalls'),
    navKeypad: document.getElementById('navKeypad'),
    callsBadge: document.getElementById('callsBadge'),
    // Status/Pause elements
    statusBadge: document.getElementById('statusBadge'),
    pauseBtn: document.getElementById('pauseBtn'),
    pauseModal: document.getElementById('pauseModal'),
    pauseOptions: document.getElementById('pauseOptions'),
    closePauseModal: document.getElementById('closePauseModal'),
    cancelPauseBtn: document.getElementById('cancelPauseBtn'),
    // Qualification elements
    qualificationModal: document.getElementById('qualificationModal'),
    qualificationList: document.getElementById('qualificationList'),
    resultSuccess: document.getElementById('resultSuccess'),
    resultFailure: document.getElementById('resultFailure'),
    confirmQualificationBtn: document.getElementById('confirmQualificationBtn')
};

// DTMF Tones frequencies
const dtmfFrequencies = {
    '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
    '4': [770, 1209], '5':  [770, 1336], '6': [770, 1477],
    '7': [852, 1209], '8':  [852, 1336], '9': [852, 1477],
    '*': [941, 1209], '0': [941, 1336], '#':  [941, 1477]
};

// Initialize audio context for DTMF tones
function initAudioContext() {
    if (!state.dtmfContext) {
        state.dtmfContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Play DTMF tone
function playDTMF(digit) {
    initAudioContext();
    
    const frequencies = dtmfFrequencies[digit];
    if (!frequencies) return;
    
    const duration = 0.15;
    const oscillator1 = state.dtmfContext.createOscillator();
    const oscillator2 = state.dtmfContext.createOscillator();
    const gainNode = state.dtmfContext.createGain();
    
    oscillator1.frequency. value = frequencies[0];
    oscillator2.frequency.value = frequencies[1];
    
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(state.dtmfContext.destination);
    
    gainNode.gain.value = 0.1;
    
    oscillator1.start();
    oscillator2.start();
    
    setTimeout(() => {
        oscillator1.stop();
        oscillator2.stop();
    }, duration * 1000);
}

// Format phone number for display
function formatPhoneNumber(number) {
    const cleaned = number.replace(/\D/g, '');
    
    if (cleaned.length <= 2) {
        return `(${cleaned}`;
    } else if (cleaned.length <= 7) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    } else if (cleaned.length <= 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    }
}

// Update phone number display
function updatePhoneNumberDisplay() {
    if (state.phoneNumber) {
        elements.phoneNumber.value = formatPhoneNumber(state.phoneNumber);
        elements.deleteButton.style.visibility = 'visible';
        elements.addContact.style.display = 'block';
    } else {
        elements.phoneNumber.value = '';
        elements.deleteButton.style.visibility = 'hidden';
        elements.addContact.style.display = 'none';
    }
    
    // Adjust font size based on number length
    const length = state.phoneNumber.length;
    if (length > 14) {
        elements.phoneNumber.style.fontSize = '24px';
    } else if (length > 11) {
        elements.phoneNumber.style.fontSize = '30px';
    } else {
        elements.phoneNumber.style.fontSize = '';
    }
}

// Sync input changes with state (for paste and manual typing)
function syncPhoneFromInput() {
    // Remove all non-digits from the input value
    const rawValue = elements.phoneNumber.value.replace(/\D/g, '');
    // Limit to 15 digits
    state.phoneNumber = rawValue.slice(0, 15);
    // Update display with formatted number
    updatePhoneNumberDisplay();
}

// Handle key press
function handleKeyPress(value) {
    playDTMF(value);
    
    if (state.isInCall) {
        state.incallDigits += value;
        elements.incallPhoneNumber.textContent = state.incallDigits;
    } else {
        if (state.phoneNumber.length < 15) {
            state.phoneNumber += value;
            updatePhoneNumberDisplay();
        }
    }
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

// Handle delete
function handleDelete() {
    if (state.phoneNumber. length > 0) {
        state.phoneNumber = state.phoneNumber.slice(0, -1);
        updatePhoneNumberDisplay();
    }
}

// Start call
function startCall() {
    if (state.phoneNumber.length < 8) return;
    
    state.isInCall = true;
    state.incallDigits = '';
    
    elements.callNumber.textContent = formatPhoneNumber(state.phoneNumber);
    elements.callStatus.textContent = 'Ligando...';
    elements.callStatus.classList.add('calling-animation');
    
    // Hide client card initially
    hideClientCard();
    
    // Switch screens
    elements.dialerScreen. classList.remove('active');
    elements.callScreen. classList.add('active');
    elements.bottomNav.classList.add('hidden');
    
    // Fetch client data from API
    fetchClientData(state.phoneNumber);
    
    // Simulate call connecting after 2 seconds
    setTimeout(() => {
        if (state.isInCall) {
            state.callStartTime = Date.now();
            elements.callStatus.classList.remove('calling-animation');
            startCallTimer();
        }
    }, 2000);
}

// Fetch client data from API
async function fetchClientData(phoneNumber) {
    try {
        const clientData = await clientDataAPI.getClientByPhone(phoneNumber);
        
        if (clientData && state.isInCall) {
            showClientCard(clientData);
        }
    } catch (error) {
        console.error('Erro ao buscar dados do cliente:', error);
    }
}

// Show client data card
function showClientCard(clientData) {
    const clientCard = document.getElementById('clientCard');
    const clientName = document.getElementById('clientName');
    const clientCompany = document.getElementById('clientCompany');
    const clientDebt = document.getElementById('clientDebt');
    const clientRecovered = document.getElementById('clientRecovered');
    
    if (clientCard && clientData) {
        clientName.textContent = clientData.name;
        clientCompany.textContent = clientData.company;
        clientDebt.textContent = clientDataAPI.formatCurrency(clientData.totalDebt);
        clientRecovered.textContent = clientDataAPI.formatCurrency(clientData.recoveredAmount || 0);
        
        clientCard.style.display = 'block';
        // Animate entrance
        clientCard.style.opacity = '0';
        clientCard.style.transform = 'translateY(10px)';
        
        requestAnimationFrame(() => {
            clientCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            clientCard.style.opacity = '1';
            clientCard.style.transform = 'translateY(0)';
        });
    }
}

// Hide client data card
function hideClientCard() {
    const clientCard = document.getElementById('clientCard');
    if (clientCard) {
        clientCard.style.display = 'none';
    }
}

// Open WhatsApp with current call number
function openWhatsApp() {
    const phoneNumber = state.phoneNumber.replace(/\D/g, '');
    if (phoneNumber) {
        // Add Brazil country code if not present
        const fullNumber = phoneNumber.startsWith('55') ? phoneNumber : '55' + phoneNumber;
        const whatsappUrl = `https://wa.me/${fullNumber}`;
        window.open(whatsappUrl, '_blank');
    }
}

// Start call timer
function startCallTimer() {
    state.callTimer = setInterval(() => {
        if (state.callStartTime) {
            const elapsed = Math.floor((Date.now() - state.callStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            elements.callStatus.textContent = `${minutes}:${seconds}`;
        }
    }, 1000);
}

// End call
function endCall() {
    const wasConnected = state.callStartTime !== null; // Call was actually connected
    
    state.isInCall = false;
    state.callStartTime = null;
    state.isMuted = false;
    state.isSpeakerOn = false;
    state.incallDigits = '';
    
    if (state.callTimer) {
        clearInterval(state.callTimer);
        state.callTimer = null;
    }
    
    // Reset button states
    elements.speakerBtn.classList.remove('active');
    elements.muteBtn.classList.remove('active');
    
    // Hide client card
    hideClientCard();
    
    // Switch screens
    elements. callScreen.classList.remove('active');
    elements.incallKeypadScreen.classList.remove('active');
    elements.dialerScreen.classList.add('active');
    elements.bottomNav. classList.remove('hidden');
    
    // Clear number
    state.phoneNumber = '';
    updatePhoneNumberDisplay();
    
    // Show qualification modal if call was connected and requires qualification
    if (wasConnected && state.requiresQualification) {
        setTimeout(() => {
            openQualificationModal();
        }, 300);
    }
}

// Toggle speaker
function toggleSpeaker() {
    state.isSpeakerOn = !state.isSpeakerOn;
    elements.speakerBtn.classList. toggle('active', state.isSpeakerOn);
}

// Toggle mute
function toggleMute() {
    state.isMuted = !state.isMuted;
    elements.muteBtn.classList.toggle('active', state.isMuted);
}

// Show in-call keypad
function showIncallKeypad() {
    elements.callScreen.classList.remove('active');
    elements.incallKeypadScreen.classList.add('active');
    elements.incallPhoneNumber.textContent = state. incallDigits;
}

// Hide in-call keypad
function hideIncallKeypad() {
    elements.incallKeypadScreen.classList.remove('active');
    elements.callScreen.classList.add('active');
}

// Update current time (disabled - status bar removed)
function updateTime() {
    // Status bar removed - function kept for compatibility
}

// Long press for +
let longPressTimer = null;

function handleLongPress(key) {
    const value = key.dataset.value;
    if (value === '0') {
        // Cancel the normal keypress
        state.phoneNumber = state.phoneNumber.slice(0, -1);
        state.phoneNumber += '+';
        updatePhoneNumberDisplay();
    }
}

// Event Listeners
document.querySelectorAll('.key:not(.incall-key)').forEach(key => {
    key.addEventListener('click', () => handleKeyPress(key.dataset.value));
    
    key.addEventListener('touchstart', () => {
        longPressTimer = setTimeout(() => handleLongPress(key), 500);
    });
    
    key.addEventListener('touchend', () => {
        clearTimeout(longPressTimer);
    });
    
    key.addEventListener('mousedown', () => {
        longPressTimer = setTimeout(() => handleLongPress(key), 500);
    });
    
    key.addEventListener('mouseup', () => {
        clearTimeout(longPressTimer);
    });
});

document.querySelectorAll('.incall-key').forEach(key => {
    key.addEventListener('click', () => handleKeyPress(key.dataset.value));
});

elements.deleteButton.addEventListener('click', handleDelete);

// Long press to delete all
let deleteTimer = null;
elements.deleteButton.addEventListener('touchstart', () => {
    deleteTimer = setTimeout(() => {
        state.phoneNumber = '';
        updatePhoneNumberDisplay();
    }, 800);
});

elements.deleteButton.addEventListener('touchend', () => {
    clearTimeout(deleteTimer);
});

elements.deleteButton.addEventListener('mousedown', () => {
    deleteTimer = setTimeout(() => {
        state.phoneNumber = '';
        updatePhoneNumberDisplay();
    }, 800);
});

elements.deleteButton.addEventListener('mouseup', () => {
    clearTimeout(deleteTimer);
});

elements.callButton.addEventListener('click', startCall);
elements.endCallButton.addEventListener('click', endCall);
elements.endCallButton2.addEventListener('click', endCall);
elements.speakerBtn.addEventListener('click', toggleSpeaker);
elements.muteBtn.addEventListener('click', toggleMute);
elements.keypadBtn.addEventListener('click', showIncallKeypad);
elements.hideKeypadBtn.addEventListener('click', hideIncallKeypad);
document.getElementById('whatsappBtn').addEventListener('click', openWhatsApp);

// Phone input sync - handles paste and manual edits
elements.phoneNumber.addEventListener('input', syncPhoneFromInput);

// Keyboard support
document.addEventListener('keydown', (e) => {
    // Skip if phone input is focused (let input handle it naturally)
    if (document.activeElement === elements.phoneNumber) {
        if (e.key === 'Enter' && state.phoneNumber.length >= 8) {
            e.preventDefault();
            startCall();
        }
        return;
    }
    
    if (state.isInCall && elements.incallKeypadScreen.classList.contains('active')) {
        if (/^[0-9*#]$/.test(e.key)) {
            handleKeyPress(e.key);
        }
    } else if (!state.isInCall) {
        if (/^[0-9*#]$/.test(e.key)) {
            handleKeyPress(e.key);
        } else if (e.key === 'Backspace') {
            handleDelete();
        } else if (e.key === 'Enter' && state.phoneNumber.length >= 8) {
            startCall();
        }
    }
    
    if (e.key === 'Escape' && state.isInCall) {
        endCall();
    }
});

// Initialize
updateTime();
setInterval(updateTime, 1000);

// Navigation functions
function switchToScreen(screenName) {
    // Remove active from all screens
    elements.dialerScreen.classList.remove('active');
    elements.callHistoryScreen.classList.remove('active');
    
    // Remove active from all nav items
    elements.navCalls.classList.remove('active');
    elements.navKeypad.classList.remove('active');
    
    // Activate selected screen and nav
    switch(screenName) {
        case 'history':
            elements.callHistoryScreen.classList.add('active');
            elements.navCalls.classList.add('active');
            state.currentScreen = 'history';
            loadCallHistory();
            break;
        case 'dialer':
        default:
            elements.dialerScreen.classList.add('active');
            elements.navKeypad.classList.add('active');
            state.currentScreen = 'dialer';
            break;
    }
}

// Render call history
function renderCallHistory(calls) {
    elements.callHistoryList.innerHTML = calls.map(call => `
        <div class="call-item" data-number="${call.number}" data-id="${call.id}">
            <div class="call-details">
                <span class="call-client-name ${call.missed ? 'missed' : ''}">${call.clientName}</span>
                <span class="call-company-name">${call.companyName}</span>
                <span class="call-phone-number">${call.number}</span>
            </div>
            <div class="call-actions-group">
                <span class="call-time">${call.time}</span>
                <button class="call-action-btn whatsapp-history-btn" data-number="${call.number}">
                    <i class="fab fa-whatsapp"></i>
                </button>
                <button class="call-action-btn phone-btn" data-number="${call.number}">
                    <i class="fas fa-phone"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Add click listeners to phone buttons
    document.querySelectorAll('.call-action-btn.phone-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const number = btn.dataset.number;
            callFromHistory(number);
        });
    });
    
    // Add click listeners to WhatsApp buttons
    document.querySelectorAll('.whatsapp-history-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const number = btn.dataset.number.replace(/\D/g, '');
            const fullNumber = number.startsWith('55') ? number : '55' + number;
            window.open(`https://wa.me/${fullNumber}`, '_blank');
        });
    });
    
    // Add click listeners to call items
    document.querySelectorAll('.call-item').forEach(item => {
        item.addEventListener('click', () => {
            const number = item.dataset.number;
            callFromHistory(number);
        });
    });
}

// Load call history from API
async function loadCallHistory() {
    try {
        const calls = await callHistoryAPI.getCallHistory();
        renderCallHistory(calls);
        
        // Update badge
        const missedCount = await callHistoryAPI.getMissedCallsCount();
        if (missedCount > 0) {
            elements.callsBadge.textContent = missedCount;
            elements.callsBadge.style.display = 'block';
        } else {
            elements.callsBadge.style.display = 'none';
        }
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
    }
}

// Call from history
function callFromHistory(number) {
    // Clean number for dialing
    const cleanNumber = number.replace(/\D/g, '');
    state.phoneNumber = cleanNumber;
    
    // Switch to dialer and start call
    switchToScreen('dialer');
    updatePhoneNumberDisplay();
    
    // Small delay then start call
    setTimeout(() => {
        startCall();
    }, 300);
}

// Navigation event listeners
elements.navCalls.addEventListener('click', () => switchToScreen('history'));
elements.navKeypad.addEventListener('click', () => switchToScreen('dialer'));

// ============================================
// PAUSE/STATUS SYSTEM
// ============================================

// Open pause modal
async function openPauseModal() {
    try {
        const reasons = await pauseReasonsAPI.getPauseReasons();
        renderPauseOptions(reasons);
        elements.pauseModal.classList.add('active');
    } catch (error) {
        console.error('Erro ao carregar motivos de pausa:', error);
    }
}

// Close pause modal
function closePauseModal() {
    elements.pauseModal.classList.remove('active');
}

// Render pause options
function renderPauseOptions(reasons) {
    elements.pauseOptions.innerHTML = reasons.map(reason => `
        <div class="pause-option" data-id="${reason.id}" data-name="${reason.name}">
            <div class="pause-option-icon">
                <i class="fas ${reason.icon}"></i>
            </div>
            <div class="pause-option-info">
                <div class="pause-option-name">${reason.name}</div>
                <div class="pause-option-id">ID: ${reason.id}</div>
            </div>
        </div>
    `).join('');
    
    // Add click listeners to options
    document.querySelectorAll('.pause-option').forEach(option => {
        option.addEventListener('click', () => {
            selectPauseReason(
                parseInt(option.dataset.id),
                option.dataset.name
            );
        });
    });
}

// Select pause reason
async function selectPauseReason(id, name) {
    try {
        // Visual feedback
        document.querySelectorAll('.pause-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        document.querySelector(`.pause-option[data-id="${id}"]`).classList.add('selected');
        
        // Call API
        await pauseReasonsAPI.setPauseStatus(id);
        
        // Update state
        state.isPaused = true;
        state.currentPause = { id, name };
        state.pauseStartTime = Date.now();
        
        // Start pause timer
        startPauseTimer();
        
        // Update UI
        updateStatusUI();
        
        // Close modal after short delay
        setTimeout(() => {
            closePauseModal();
        }, 300);
        
    } catch (error) {
        console.error('Erro ao definir pausa:', error);
    }
}

// Resume (go back online)
async function resumeOnline() {
    try {
        await pauseReasonsAPI.setOnlineStatus();
        
        // Stop pause timer
        stopPauseTimer();
        
        // Update state
        state.isPaused = false;
        state.currentPause = null;
        state.pauseStartTime = null;
        
        // Update UI
        updateStatusUI();
        
    } catch (error) {
        console.error('Erro ao voltar online:', error);
    }
}

// Start pause timer
function startPauseTimer() {
    state.pauseTimer = setInterval(() => {
        if (state.pauseStartTime) {
            const elapsed = Math.floor((Date.now() - state.pauseStartTime) / 1000);
            const hours = Math.floor(elapsed / 3600);
            const minutes = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            
            const timerElement = document.getElementById('pauseTimer');
            if (timerElement) {
                if (hours > 0) {
                    timerElement.textContent = `${hours}:${minutes}:${seconds}`;
                } else {
                    timerElement.textContent = `${minutes}:${seconds}`;
                }
            }
        }
    }, 1000);
}

// Stop pause timer
function stopPauseTimer() {
    if (state.pauseTimer) {
        clearInterval(state.pauseTimer);
        state.pauseTimer = null;
    }
}

// Update status UI
function updateStatusUI() {
    const statusBadge = elements.statusBadge;
    const statusActions = document.querySelector('.status-actions');
    
    if (state.isPaused) {
        // Show paused state with pause name and timer
        const pauseName = state.currentPause ? state.currentPause.name : 'Em Pausa';
        statusBadge.classList.remove('available');
        statusBadge.classList.add('paused');
        statusBadge.innerHTML = `
            <span class="status-dot"></span>
            <div class="status-info">
                <span class="status-text">${pauseName}</span>
                <span class="pause-timer" id="pauseTimer">00:00</span>
            </div>
        `;
        
        // Change button to resume
        statusActions.innerHTML = `
            <button class="resume-btn" id="resumeBtn">
                <i class="fas fa-play"></i>
                <span>Voltar</span>
            </button>
        `;
        
        // Add listener to new button
        document.getElementById('resumeBtn').addEventListener('click', resumeOnline);
        
    } else {
        // Show available state
        statusBadge.classList.remove('paused');
        statusBadge.classList.add('available');
        statusBadge.innerHTML = `
            <span class="status-dot"></span>
            <span class="status-text">Disponível</span>
        `;
        
        // Change button to pause
        statusActions.innerHTML = `
            <button class="pause-btn" id="pauseBtn">
                <i class="fas fa-pause"></i>
                <span>Pausa</span>
            </button>
        `;
        
        // Add listener to new button
        document.getElementById('pauseBtn').addEventListener('click', openPauseModal);
    }
}

// Pause event listeners
elements.pauseBtn.addEventListener('click', openPauseModal);
elements.closePauseModal.addEventListener('click', closePauseModal);
elements.cancelPauseBtn.addEventListener('click', closePauseModal);

// Close modal when clicking overlay
elements.pauseModal.addEventListener('click', (e) => {
    if (e.target === elements.pauseModal) {
        closePauseModal();
    }
});

// ==========================================
// CALL QUALIFICATION FUNCTIONS
// ==========================================

// Open qualification modal
async function openQualificationModal() {
    state.selectedResult = 'success';
    state.selectedQualification = null;
    
    // Reset UI
    elements.resultSuccess.classList.add('active');
    elements.resultFailure.classList.remove('active');
    elements.confirmQualificationBtn.disabled = true;
    
    // Load qualifications
    await loadQualifications('success');
    
    // Show modal
    elements.qualificationModal.classList.add('active');
}

// Close qualification modal
function closeQualificationModal() {
    const sheet = elements.qualificationModal.querySelector('.qualification-sheet');
    sheet.style.animation = 'sheetSlideDown 0.3s ease forwards';
    
    setTimeout(() => {
        elements.qualificationModal.classList.remove('active');
        sheet.style.animation = '';
        state.selectedQualification = null;
    }, 280);
}

// Add slide down animation
const slideDownKeyframes = `
@keyframes sheetSlideDown {
    from { transform: translateY(0); }
    to { transform: translateY(100%); }
}
`;
const slideDownStyle = document.createElement('style');
slideDownStyle.textContent = slideDownKeyframes;
document.head.appendChild(slideDownStyle);

// Load qualifications based on result type
async function loadQualifications(type) {
    const list = elements.qualificationList;
    list.innerHTML = '<div class="qualification-item" style="color: #8e8e93; justify-content: center;">Carregando...</div>';
    
    try {
        let qualifications;
        if (type === 'success') {
            qualifications = await qualificationAPI.getSuccessQualifications();
        } else {
            qualifications = await qualificationAPI.getFailureQualifications();
        }
        
        list.innerHTML = '';
        
        qualifications.forEach(qual => {
            const item = document.createElement('button');
            item.className = 'qualification-item';
            item.textContent = qual.name;
            item.dataset.id = qual.id;
            
            item.addEventListener('click', () => selectQualification(qual, item));
            
            list.appendChild(item);
        });
        
    } catch (error) {
        console.error('Erro ao carregar qualificações:', error);
        list.innerHTML = '<div class="qualification-item" style="color: #ff3b30; justify-content: center;">Erro ao carregar</div>';
    }
}

// Select result type (success/failure)
function selectResult(type) {
    state.selectedResult = type;
    state.selectedQualification = null;
    elements.confirmQualificationBtn.disabled = true;
    
    if (type === 'success') {
        elements.resultSuccess.classList.add('active');
        elements.resultFailure.classList.remove('active');
    } else {
        elements.resultSuccess.classList.remove('active');
        elements.resultFailure.classList.add('active');
    }
    
    loadQualifications(type);
}

// Select a qualification item
function selectQualification(qualification, element) {
    state.selectedQualification = qualification;
    
    // Update UI
    document.querySelectorAll('.qualification-item').forEach(item => {
        item.classList.remove('selected');
    });
    element.classList.add('selected');
    
    // Enable confirm button
    elements.confirmQualificationBtn.disabled = false;
}

// Confirm and submit qualification
async function confirmQualification() {
    if (!state.selectedQualification) return;
    
    const callData = {
        result: state.selectedResult,
        qualification: state.selectedQualification,
        timestamp: new Date().toISOString()
    };
    
    try {
        elements.confirmQualificationBtn.textContent = 'Enviando...';
        elements.confirmQualificationBtn.disabled = true;
        
        await qualificationAPI.submitQualification(callData);
        
        closeQualificationModal();
        
        // Reset state
        state.selectedResult = 'success';
        state.selectedQualification = null;
        elements.confirmQualificationBtn.textContent = 'Confirmar';
        
        console.log('Qualificação confirmada:', callData);
        
    } catch (error) {
        console.error('Erro ao enviar qualificação:', error);
        elements.confirmQualificationBtn.textContent = 'Confirmar';
        elements.confirmQualificationBtn.disabled = false;
    }
}

// Qualification event listeners
elements.resultSuccess.addEventListener('click', () => selectResult('success'));
elements.resultFailure.addEventListener('click', () => selectResult('failure'));
elements.confirmQualificationBtn.addEventListener('click', confirmQualification);

// Close modal when clicking overlay (qualification is mandatory)
elements.qualificationModal.addEventListener('click', (e) => {
    if (e.target === elements.qualificationModal) {
        // Subtle shake feedback
        const sheet = elements.qualificationModal.querySelector('.qualification-sheet');
        sheet.style.animation = 'none';
        sheet.offsetHeight; // Trigger reflow
        sheet.style.animation = 'sheetShake 0.4s ease';
    }
});

// Shake animation for mandatory modal
const shakeKeyframes = `
@keyframes sheetShake {
    0%, 100% { transform: translateY(0); }
    25% { transform: translateY(4px); }
    50% { transform: translateY(-2px); }
    75% { transform: translateY(2px); }
}
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = shakeKeyframes;
document.head.appendChild(styleSheet);

// Initialize badge count on load
(async function initBadge() {
    try {
        const missedCount = await callHistoryAPI.getMissedCallsCount();
        if (missedCount > 0) {
            elements.callsBadge.textContent = missedCount;
            elements.callsBadge.style.display = 'block';
        } else {
            elements.callsBadge.style.display = 'none';
        }
    } catch (error) {
        console.error('Erro ao carregar contagem:', error);
    }
})();