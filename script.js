 // Variables globales
    let currentUser = null;
    let tasks = [];
    let notes = [];
    let timerInterval = null;
    let timerMinutes = 25;
    let timerSeconds = 0;
    let isTimerRunning = false;
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    // Inicialización
    document.addEventListener('DOMContentLoaded', function() {
      checkAuth();
      if (currentUser) {
        initializeApp();
      }
    });

    // Verificar autenticación
    function checkAuth() {
      const userData = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
      if (!userData) {
        showLoginModal();
        return;
      }
      currentUser = userData;
      document.getElementById('userEmail').textContent = currentUser.email;
      document.getElementById('userAvatar').textContent = currentUser.email.charAt(0).toUpperCase();
    }

    // Modal de login simple
    function showLoginModal() {
      const loginHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;">
          <div style="background: white; padding: 2rem; border-radius: 20px; min-width: 300px;">
            <h2 style="text-align: center; margin-bottom: 1.5rem; color: #333;">🔐 Iniciar Sesión</h2>
            <input type="email" id="loginEmail" placeholder="Email" style="width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 2px solid #e9ecef; border-radius: 10px;">
            <input type="password" id="loginPassword" placeholder="Contraseña" style="width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 2px solid #e9ecef; border-radius: 10px;">
            <button onclick="handleLogin()" style="width: 100%; padding: 0.75rem; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; margin-bottom: 1rem;">Entrar</button>
            <p style="text-align: center; margin: 0; color: #666;">¿Nuevo? <a href="#" onclick="toggleRegister()" style="color: #667eea;">Crear cuenta</a></p>
            <div id="registerFields" style="display: none; margin-top: 1rem;">
              <button onclick="handleRegister()" style="width: 100%; padding: 0.75rem; background: #2ed573; color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer;">Crear Cuenta</button>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', loginHTML);
    }

    function toggleRegister() {
      const fields = document.getElementById('registerFields');
      fields.style.display = fields.style.display === 'none' ? 'block' : 'none';
    }

    function handleLogin() {
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();
      
      if (!email || !password) {
        alert('Completa todos los campos');
        return;
      }

      // Simulación de login - en producción usarías un backend real
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        currentUser = user;
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        document.querySelector('.app').previousElementSibling.remove();
        initializeApp();
      } else {
        alert('Credenciales incorrectas');
      }
    }

    function handleRegister() {
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();
      
      if (!email || !password) {
        alert('Completa todos los campos');
        return;
      }

      let users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some(u => u.email === email)) {
        alert('Este email ya está registrado');
        return;
      }

      const newUser = { email, password };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      currentUser = newUser;
      sessionStorage.setItem('currentUser', JSON.stringify(newUser));
      document.querySelector('.app').previousElementSibling.remove();
      initializeApp();
    }

    // Inicializar aplicación
    function initializeApp() {
      loadUserData();
      setupNavigation();
      updateClock();
      loadWeather();
      updateStats();
      renderCalendar();
      
      setInterval(updateClock, 1000);
      setInterval(updateStats, 30000);
    }

    // Cargar datos del usuario
    function loadUserData() {
      const userKey = currentUser.email;
      tasks = JSON.parse(localStorage.getItem(`tasks_${userKey}`) || '[]');
      notes = JSON.parse(localStorage.getItem(`notes_${userKey}`) || '[]');
      
      renderTasks();
      renderNotes();
    }

    // Navegación
    function setupNavigation() {
      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          const section = link.dataset.section;
          showSection(section);
          
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        });
      });
    }

    function showSection(sectionName) {
      document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
      });
      document.getElementById(`${sectionName}-section`).classList.remove('hidden');
    }

    // Sidebar móvil
    function toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('mobile-visible');
    }

    // Reloj
    function updateClock() {
      const now = new Date();
      const time = now.toLocaleTimeString('es-ES');
      const date = now.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      document.getElementById('currentTime').textContent = time;
      document.getElementById('currentDate').textContent = date;
    }

    // Clima (simulado)
    function loadWeather() {
      // Simulación de clima - en producción usarías una API real
      const temps = [18, 22, 25, 28, 20, 16, 24];
      const conditions = ['Soleado', 'Parcialmente nublado', 'Nublado', 'Lluvia ligera', 'Despejado'];
      
      const temp = temps[Math.floor(Math.random() * temps.length)];
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      
      document.getElementById('weatherTemp').textContent = `${temp}°C`;
      document.getElementById('weatherDesc').textContent = condition;
    }

    // Actualizar estadísticas
    function updateStats() {
      const completedTasks = tasks.filter(t => t.completed).length;
      const pendingTasks = tasks.filter(t => !t.completed).length;
      const totalTasks = tasks.length;
      const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      
      document.getElementById('taskCount').textContent = totalTasks;
      document.getElementById('noteCount').textContent = notes.length;
      document.getElementById('completedTasks').textContent = completedTasks;
      document.getElementById('pendingTasks').textContent = pendingTasks;
      document.getElementById('totalNotes').textContent = notes.length;
      document.getElementById('taskProgress').style.width = `${progress}%`;
      
      // Estadísticas de Pomodoro
      const pomodoroStats = JSON.parse(localStorage.getItem(`pomodoro_${currentUser.email}`) || '{"today": 0, "week": 0, "month": 0}');
      document.getElementById('pomodoroSessions').textContent = pomodoroStats.today;
      document.getElementById('todaySessions').textContent = pomodoroStats.today;
      document.getElementById('weekSessions').textContent = pomodoroStats.week;
      document.getElementById('monthSessions').textContent = pomodoroStats.month;
    }

    // Gestión de tareas
    function addTask() {
      const input = document.getElementById('taskInput');
      const priority = document.getElementById('taskPriority').value;
      const date = document.getElementById('taskDate').value;
      const text = input.value.trim();
      
      if (!text) return;
      
      const task = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: priority,
        date: date || null,
        createdAt: new Date().toISOString()
      };
      
      tasks.push(task);
      saveTasks();
      renderTasks();
      updateStats();
      
      input.value = '';
      document.getElementById('taskDate').value = '';
    }

    function saveTasks() {
      localStorage.setItem(`tasks_${currentUser.email}`, JSON.stringify(tasks));
    }

    function renderTasks() {
      const list = document.getElementById('taskList');
      const empty = document.getElementById('tasksEmpty');
      
      if (tasks.length === 0) {
        list.innerHTML = '';
        empty.style.display = 'block';
        return;
      }
      
      empty.style.display = 'none';
      
      // Ordenar tareas: pendientes primero, luego por prioridad
      const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
      
      list.innerHTML = sortedTasks.map(task => `
        <li class="item ${task.completed ? 'completed' : ''}">
          <div class="item-content" onclick="toggleTask(${task.id})">
            <div>
              <span class="task-priority priority-${task.priority}">${getPriorityText(task.priority)}</span>
              ${task.text}
            </div>
            ${task.date ? `<div class="task-date">📅 ${formatDate(task.date)}</div>` : ''}
          </div>
          <div class="item-actions">
            <button class="btn btn-danger btn-small" onclick="deleteTask(${task.id})">
              🗑️ Eliminar
            </button>
          </div>
        </li>
      `).join('');
    }

    function getPriorityText(priority) {
      const texts = { high: 'Alta', medium: 'Media', low: 'Baja' };
      return texts[priority];
    }

    function formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-ES');
    }

    function toggleTask(id) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
      }
    }

    function deleteTask(id) {
      if (confirm('¿Estás seguro de eliminar esta tarea?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
        updateStats();
      }
    }

    // Gestión de notas
    function addNote() {
      const titleInput = document.getElementById('noteTitle');
      const contentInput = document.getElementById('noteInput');
      const title = titleInput.value.trim();
      const content = contentInput.value.trim();
      
      if (!content) return;
      
      const note = {
        id: Date.now(),
        title: title || 'Sin título',
        content: content,
        createdAt: new Date().toISOString()
      };
      
      notes.push(note);
      saveNotes();
      renderNotes();
      updateStats();
      
      titleInput.value = '';
      contentInput.value = '';
    }

    function saveNotes() {
      localStorage.setItem(`notes_${currentUser.email}`, JSON.stringify(notes));
    }

    function renderNotes() {
      const container = document.getElementById('noteList');
      const empty = document.getElementById('notesEmpty');
      
      if (notes.length === 0) {
        container.innerHTML = '';
        empty.style.display = 'block';
        return;
      }
      
      empty.style.display = 'none';
      
      // Ordenar notas por fecha (más recientes primero)
      const sortedNotes = [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      container.innerHTML = sortedNotes.map(note => `
        <div class="quick-note">
          <div class="note-date">${formatDateTime(note.createdAt)}</div>
          <h4 style="margin-bottom: 0.5rem; color: #333;">${note.title}</h4>
          <div class="note-content">${note.content}</div>
          <div style="margin-top: 1rem; text-align: right;">
            <button class="btn btn-danger btn-small" onclick="deleteNote(${note.id})">
              🗑️ Eliminar
            </button>
          </div>
        </div>
      `).join('');
    }

    function formatDateTime(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleString('es-ES');
    }

    function deleteNote(id) {
      if (confirm('¿Estás seguro de eliminar esta nota?')) {
        notes = notes.filter(n => n.id !== id);
        saveNotes();
        renderNotes();
        updateStats();
      }
    }

    // Timer Pomodoro
    function startTimer() {
      if (isTimerRunning) return;
      
      isTimerRunning = true;
      timerInterval = setInterval(() => {
        if (timerSeconds === 0) {
          if (timerMinutes === 0) {
            // Timer terminado
            clearInterval(timerInterval);
            isTimerRunning = false;
            alert('¡Tiempo terminado! 🎉');
            updatePomodoroStats();
            return;
          }
          timerMinutes--;
          timerSeconds = 59;
        } else {
          timerSeconds--;
        }
        updateTimerDisplay();
      }, 1000);
    }

    function pauseTimer() {
      clearInterval(timerInterval);
      isTimerRunning = false;
    }

    function resetTimer() {
      clearInterval(timerInterval);
      isTimerRunning = false;
      timerMinutes = 25;
      timerSeconds = 0;
      updateTimerDisplay();
    }

    function setTimer(minutes) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      timerMinutes = minutes;
      timerSeconds = 0;
      updateTimerDisplay();
    }

    function updateTimerDisplay() {
      const display = document.getElementById('timerDisplay');
      const mins = timerMinutes.toString().padStart(2, '0');
      const secs = timerSeconds.toString().padStart(2, '0');
      display.textContent = `${mins}:${secs}`;
    }

    function updatePomodoroStats() {
      const stats = JSON.parse(localStorage.getItem(`pomodoro_${currentUser.email}`) || '{"today": 0, "week": 0, "month": 0}');
      stats.today++;
      stats.week++;
      stats.month++;
      localStorage.setItem(`pomodoro_${currentUser.email}`, JSON.stringify(stats));
      updateStats();
    }

    // Calendario
    function renderCalendar() {
      const calendar = document.getElementById('calendar');
      const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      
      document.getElementById('calendarMonth').textContent = `${monthNames[currentMonth]} ${currentYear}`;
      
      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const today = new Date();
      
      let calendarHTML = '';
      
      // Días de la semana
      const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      dayNames.forEach(day => {
        calendarHTML += `<div style="font-weight: bold; text-align: center; padding: 0.5rem;">${day}</div>`;
      });
      
      // Espacios vacíos para el primer día
      for (let i = 0; i < firstDay; i++) {
        calendarHTML += '<div class="calendar-day"></div>';
      }
      
      // Días del mes
      for (let day = 1; day <= daysInMonth; day++) {
        const isToday = today.getDate() === day && 
                       today.getMonth() === currentMonth && 
                       today.getFullYear() === currentYear;
        
        calendarHTML += `<div class="calendar-day ${isToday ? 'today' : ''}">${day}</div>`;
      }
      
      calendar.innerHTML = calendarHTML;
    }

    function prevMonth() {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar();
    }

    function nextMonth() {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar();
    }

    // Logout
    function logout() {
      if (confirm('¿Estás seguro de cerrar sesión?')) {
        sessionStorage.removeItem('currentUser');
        location.reload();
      }
    }

    // Eventos del teclado
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.id === 'taskInput') {
          addTask();
        } else if (activeElement.id === 'noteInput') {
          addNote();
        }
      }
    });


 
