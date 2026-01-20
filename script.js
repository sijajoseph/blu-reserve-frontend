// ============================================================================
// BLU RESERVE - SEAT BOOKING SYSTEM
// Frontend JavaScript Module
// ============================================================================

// ============================================================================
// CONFIGURATION & API ENDPOINTS
// ============================================================================

const API_CONFIG = {
    // ⚠️ IMPORTANT: Replace with your actual Django backend URL
    BASE_URL: 'http://localhost:8000',  // Change this to your Django server URL
    
    ENDPOINTS: {
        // GET: Fetch all seats with their status
        GET_SEATS: '/api/seats/',
        
        // POST: Book a seat
        // Body: { seat_id: "A3", employee_id: "EMP101" }
        BOOK_SEAT: '/api/book-seat/',
        
        // GET: Fetch manager tokens
        // URL: /api/manager-tokens/{manager_id}/
        MANAGER_TOKENS: '/api/manager-tokens/',
    },
    
    // 🔐 AUTHENTICATION HEADERS
    // Add JWT token or session authentication here when backend is ready
    getHeaders: () => {
        return {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`,  // JWT example
            // 'X-CSRFToken': getCookie('csrftoken'),  // Django CSRF token example
        };
    }
};

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const appState = {
    currentEmployee: null,
    currentManager: null,
    selectedSeat: null,
    seats: [],
    managerTokens: 0,
    isLoading: false
};

// Employee-Manager mapping (mock data - will come from backend in production)
const EMPLOYEE_MANAGER_MAP = {
    'EMP101': { managerId: 'MGR001', managerName: 'Manager A' },
    'EMP102': { managerId: 'MGR001', managerName: 'Manager A' },
    'EMP103': { managerId: 'MGR002', managerName: 'Manager B' },
    'EMP104': { managerId: 'MGR002', managerName: 'Manager B' },
    'EMP105': { managerId: 'MGR003', managerName: 'Manager C' },
};

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const elements = {
    employeeSelect: document.getElementById('employeeSelect'),
    seatGrid: document.getElementById('seatGrid'),
    tokenDisplay: document.getElementById('tokenDisplay'),
    managerName: document.getElementById('managerName'),
    tokenCount: document.getElementById('tokenCount'),
    confirmBtn: document.getElementById('confirmBtn'),
    resetBtn: document.getElementById('resetBtn'),
    notification: document.getElementById('notification'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    tooltip: document.getElementById('seatTooltip')
};

// ============================================================================
// MOCK SEAT DATA (for development without backend)
// In production, this will be fetched from: GET /api/seats/
// ============================================================================

const MOCK_SEATS = [
    // Row A
    { id: 'A1', row: 'A', number: 1, status: 'available', booked_by: null },
    { id: 'A2', row: 'A', number: 2, status: 'booked', booked_by: 'EMP102' },
    { id: 'A3', row: 'A', number: 3, status: 'available', booked_by: null },
    { id: 'A4', row: 'A', number: 4, status: 'available', booked_by: null },
    { id: 'A5', row: 'A', number: 5, status: 'booked', booked_by: 'EMP103' },
    
    // Row B
    { id: 'B1', row: 'B', number: 1, status: 'available', booked_by: null },
    { id: 'B2', row: 'B', number: 2, status: 'available', booked_by: null },
    { id: 'B3', row: 'B', number: 3, status: 'booked', booked_by: 'EMP104' },
    { id: 'B4', row: 'B', number: 4, status: 'available', booked_by: null },
    { id: 'B5', row: 'B', number: 5, status: 'available', booked_by: null },
    
    // Row C
    { id: 'C1', row: 'C', number: 1, status: 'available', booked_by: null },
    { id: 'C2', row: 'C', number: 2, status: 'booked', booked_by: 'EMP105' },
    { id: 'C3', row: 'C', number: 3, status: 'available', booked_by: null },
    { id: 'C4', row: 'C', number: 4, status: 'available', booked_by: null },
    { id: 'C5', row: 'C', number: 5, status: 'available', booked_by: null },
    
    // Row D
    { id: 'D1', row: 'D', number: 1, status: 'available', booked_by: null },
    { id: 'D2', row: 'D', number: 2, status: 'available', booked_by: null },
    { id: 'D3', row: 'D', number: 3, status: 'available', booked_by: null },
    { id: 'D4', row: 'D', number: 4, status: 'booked', booked_by: 'EMP101' },
    { id: 'D5', row: 'D', number: 5, status: 'available', booked_by: null },
];

// Mock manager tokens (will be fetched from backend in production)
const MOCK_MANAGER_TOKENS = {
    'MGR001': 5,
    'MGR002': 3,
    'MGR003': 0,
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Fetch all seats from backend
 * API: GET /api/seats/
 * Response: [{ id: "A1", row: "A", number: 1, status: "available", booked_by: null }, ...]
 */
async function fetchSeats() {
    try {
        showLoading(true);
        
        // 🔌 BACKEND INTEGRATION POINT
        // Uncomment below when backend is ready:
        /*
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_SEATS}`, {
            method: 'GET',
            headers: API_CONFIG.getHeaders()
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch seats');
        }
        
        const data = await response.json();
        appState.seats = data;
        */
        
        // 🧪 MOCK DATA (remove when backend is ready)
        await simulateAPIDelay(500);
        appState.seats = MOCK_SEATS;
        
        renderSeats();
        
    } catch (error) {
        console.error('Error fetching seats:', error);
        showNotification('Failed to load seats. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Fetch manager tokens from backend
 * API: GET /api/manager-tokens/{manager_id}/
 * Response: { manager_id: "MGR001", tokens: 5, manager_name: "Manager A" }
 */
async function fetchManagerTokens(managerId) {
    try {
        // 🔌 BACKEND INTEGRATION POINT
        // Uncomment below when backend is ready:
        /*
        const response = await fetch(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MANAGER_TOKENS}${managerId}/`,
            {
                method: 'GET',
                headers: API_CONFIG.getHeaders()
            }
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch manager tokens');
        }
        
        const data = await response.json();
        appState.managerTokens = data.tokens;
        elements.tokenCount.textContent = data.tokens;
        */
        
        // 🧪 MOCK DATA (remove when backend is ready)
        await simulateAPIDelay(300);
        appState.managerTokens = MOCK_MANAGER_TOKENS[managerId] || 0;
        elements.tokenCount.textContent = appState.managerTokens;
        
    } catch (error) {
        console.error('Error fetching manager tokens:', error);
        showNotification('Failed to load manager tokens.', 'error');
    }
}

/**
 * Book a seat
 * API: POST /api/book-seat/
 * Body: { seat_id: "A3", employee_id: "EMP101" }
 * Success Response: { success: true, message: "Seat booked successfully", seat: {...} }
 * Error Response: { success: false, message: "Insufficient tokens" }
 */
async function bookSeat(seatId, employeeId) {
    try {
        showLoading(true);
        
        const requestBody = {
            seat_id: seatId,
            employee_id: employeeId
        };
        
        // 🔌 BACKEND INTEGRATION POINT
        // Uncomment below when backend is ready:
        /*
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BOOK_SEAT}`, {
            method: 'POST',
            headers: API_CONFIG.getHeaders(),
            body: JSON.stringify(requestBody)
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Booking failed');
        }
        
        // Success - update local state
        const seatIndex = appState.seats.findIndex(s => s.id === seatId);
        if (seatIndex !== -1) {
            appState.seats[seatIndex].status = 'booked';
            appState.seats[seatIndex].booked_by = employeeId;
        }
        
        // Refresh manager tokens
        await fetchManagerTokens(appState.currentManager.managerId);
        
        showNotification(data.message, 'success');
        */
        
        // 🧪 MOCK IMPLEMENTATION (remove when backend is ready)
        await simulateAPIDelay(800);
        
        // Mock backend validation
        if (appState.managerTokens <= 0) {
            throw new Error('Insufficient tokens. Your manager has no tokens available.');
        }
        
        const seat = appState.seats.find(s => s.id === seatId);
        if (!seat) {
            throw new Error('Seat not found.');
        }
        
        if (seat.status === 'booked') {
            throw new Error('Seat is already booked.');
        }
        
        // Mock successful booking
        seat.status = 'booked';
        seat.booked_by = employeeId;
        
        // Deduct token (mock)
        MOCK_MANAGER_TOKENS[appState.currentManager.managerId]--;
        appState.managerTokens--;
        elements.tokenCount.textContent = appState.managerTokens;
        
        showNotification(`✅ Seat ${seatId} booked successfully!`, 'success');
        
        // Reset selection
        appState.selectedSeat = null;
        renderSeats();
        updateButtonStates();
        
    } catch (error) {
        console.error('Error booking seat:', error);
        showNotification(error.message || 'Booking failed. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// ============================================================================
// UI RENDERING FUNCTIONS
// ============================================================================

/**
 * Render all seats in the grid
 */
function renderSeats() {
    elements.seatGrid.innerHTML = '';
    
    if (!appState.currentEmployee) {
        elements.seatGrid.innerHTML = '<p style="text-align: center; padding: 2rem; color: #64748b;">Please select an employee to view seats.</p>';
        return;
    }
    
    appState.seats.forEach(seat => {
        const seatElement = createSeatElement(seat);
        elements.seatGrid.appendChild(seatElement);
    });
}

/**
 * Create a single seat element
 */
function createSeatElement(seat) {
    const seatDiv = document.createElement('div');
    seatDiv.className = 'seat';
    seatDiv.textContent = seat.id;
    seatDiv.dataset.seatId = seat.id;
    
    // Determine seat class based on status
    if (seat.booked_by === appState.currentEmployee) {
        seatDiv.classList.add('my-booking');
    } else if (seat.status === 'booked') {
        seatDiv.classList.add('booked');
    } else if (appState.selectedSeat === seat.id) {
        seatDiv.classList.add('selected');
    } else {
        seatDiv.classList.add('available');
    }
    
    // Add click event
    seatDiv.addEventListener('click', () => handleSeatClick(seat));
    
    // Add hover tooltip
    seatDiv.addEventListener('mouseenter', (e) => showTooltip(e, seat));
    seatDiv.addEventListener('mouseleave', hideTooltip);
    seatDiv.addEventListener('mousemove', moveTooltip);
    
    return seatDiv;
}

/**
 * Handle seat click
 */
function handleSeatClick(seat) {
    if (!appState.currentEmployee) {
        showNotification('Please select an employee first.', 'warning');
        return;
    }
    
    // Check if seat is already booked
    if (seat.status === 'booked' && seat.booked_by !== appState.currentEmployee) {
        showNotification(`Seat ${seat.id} is already booked.`, 'error');
        return;
    }
    
    // Check if seat is already booked by current employee
    if (seat.booked_by === appState.currentEmployee) {
        showNotification(`You have already booked seat ${seat.id}.`, 'info');
        return;
    }
    
    // Select seat
    appState.selectedSeat = seat.id;
    renderSeats();
    updateButtonStates();
    showNotification(`Seat ${seat.id} selected.`, 'info');
}

/**
 * Update button states based on selection
 */
function updateButtonStates() {
    const hasSelection = appState.selectedSeat !== null;
    elements.confirmBtn.disabled = !hasSelection;
    elements.resetBtn.disabled = !hasSelection;
}

// ============================================================================
// TOOLTIP FUNCTIONS
// ============================================================================

function showTooltip(event, seat) {
    let tooltipText = '';
    
    if (seat.booked_by === appState.currentEmployee) {
        tooltipText = `${seat.id} - Your Booking`;
    } else if (seat.status === 'booked') {
        tooltipText = `${seat.id} - Booked`;
    } else if (appState.selectedSeat === seat.id) {
        tooltipText = `${seat.id} - Selected`;
    } else {
        tooltipText = `${seat.id} - Available`;
    }
    
    elements.tooltip.textContent = tooltipText;
    elements.tooltip.style.display = 'block';
    moveTooltip(event);
}

function hideTooltip() {
    elements.tooltip.style.display = 'none';
}

function moveTooltip(event) {
    const x = event.clientX + 15;
    const y = event.clientY + 15;
    elements.tooltip.style.left = x + 'px';
    elements.tooltip.style.top = y + 'px';
}

// ============================================================================
// NOTIFICATION SYSTEM
// ============================================================================

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success', 'error', 'warning', 'info'
 */
function showNotification(message, type = 'info') {
    elements.notification.textContent = message;
    elements.notification.className = `notification ${type} show`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        elements.notification.classList.remove('show');
    }, 5000);
}

// ============================================================================
// LOADING INDICATOR
// ============================================================================

function showLoading(show) {
    appState.isLoading = show;
    elements.loadingIndicator.style.display = show ? 'block' : 'none';
    
    // Disable interactions during loading
    elements.confirmBtn.disabled = show || !appState.selectedSeat;
    elements.resetBtn.disabled = show || !appState.selectedSeat;
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Handle employee selection
 */
elements.employeeSelect.addEventListener('change', async (e) => {
    const employeeId = e.target.value;
    
    if (!employeeId) {
        appState.currentEmployee = null;
        appState.currentManager = null;
        elements.tokenDisplay.style.display = 'none';
        renderSeats();
        return;
    }
    
    appState.currentEmployee = employeeId;
    appState.currentManager = EMPLOYEE_MANAGER_MAP[employeeId];
    
    // Update manager info display
    elements.managerName.textContent = appState.currentManager.managerName;
    elements.tokenDisplay.style.display = 'flex';
    
    // Fetch data
    await fetchManagerTokens(appState.currentManager.managerId);
    await fetchSeats();
    
    // Reset selection
    appState.selectedSeat = null;
    updateButtonStates();
});

/**
 * Handle confirm booking
 */
elements.confirmBtn.addEventListener('click', async () => {
    if (!appState.selectedSeat) {
        showNotification('Please select a seat first.', 'warning');
        return;
    }
    
    if (!appState.currentEmployee) {
        showNotification('Please select an employee first.', 'warning');
        return;
    }
    
    // Confirm dialog
    const confirmMsg = `Confirm booking seat ${appState.selectedSeat}?\n\nThis will deduct 1 token from ${appState.currentManager.managerName}.`;
    if (!confirm(confirmMsg)) {
        return;
    }
    
    await bookSeat(appState.selectedSeat, appState.currentEmployee);
});

/**
 * Handle reset selection
 */
elements.resetBtn.addEventListener('click', () => {
    appState.selectedSeat = null;
    renderSeats();
    updateButtonStates();
    showNotification('Selection cleared.', 'info');
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Simulate API delay for mock data (remove in production)
 */
function simulateAPIDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get CSRF token from cookie (for Django)
 * Uncomment when using Django backend with CSRF protection
 */
/*
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
*/

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the application
 */
function init() {
    console.log('🚀 Blu Reserve System Initialized');
    console.log('📍 Current mode: MOCK DATA');
    console.log('🔌 To enable backend: Update API_CONFIG.BASE_URL and uncomment API calls');
    
    // Load seats if employee is pre-selected
    if (elements.employeeSelect.value) {
        elements.employeeSelect.dispatchEvent(new Event('change'));
    }
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// ============================================================================
// BACKEND INTEGRATION CHECKLIST
// ============================================================================

/*
📋 BACKEND INTEGRATION STEPS:

1. ✅ Update API_CONFIG.BASE_URL with your Django server URL
   Example: 'http://localhost:8000' or 'https://your-domain.com'

2. ✅ Uncomment API calls in:
   - fetchSeats() function
   - fetchManagerTokens() function
   - bookSeat() function

3. ✅ Remove or comment out MOCK_SEATS and MOCK_MANAGER_TOKENS

4. ✅ Add authentication headers in API_CONFIG.getHeaders():
   - For JWT: Add 'Authorization': `Bearer ${token}`
   - For Django sessions: Add CSRF token

5. ✅ Implement getCookie() function if using Django CSRF

6. ✅ Test each API endpoint:
   - GET /api/seats/ → Should return all seats
   - GET /api/manager-tokens/{id}/ → Should return manager tokens
   - POST /api/book-seat/ → Should book seat and validate tokens

7. ✅ Handle backend error responses properly

8. ✅ Add proper loading states and error handling

9. ✅ Test token deduction flow end-to-end

10. ✅ Verify seat status updates in real-time

Expected Backend Response Formats:

GET /api/seats/
[
  {
    "id": "A1",
    "row": "A",
    "number": 1,
    "status": "available",
    "booked_by": null
  },
  ...
]

GET /api/manager-tokens/MGR001/
{
  "manager_id": "MGR001",
  "manager_name": "Manager A",
  "tokens": 5
}

POST /api/book-seat/
Request: { "seat_id": "A3", "employee_id": "EMP101" }
Success: { "success": true, "message": "Seat booked successfully", "seat": {...} }
Error: { "success": false, "message": "Insufficient tokens" }

*/