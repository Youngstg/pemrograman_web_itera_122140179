// Class untuk mengelola data dengan localStorage
class StorageManager {
    constructor(storageKey) {
        this.storageKey = storageKey;
    }
    
    // Mengambil data dari localStorage
    getData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }
    
    // Menyimpan data ke localStorage
    saveData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
    
    // Menambah item baru
    addItem(item) {
        const data = this.getData();
        item.id = Date.now().toString();
        data.push(item);
        this.saveData(data);
        return item;
    }
    
    // Mengedit item yang sudah ada
    updateItem(id, updatedItem) {
        const data = this.getData();
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updatedItem };
            this.saveData(data);
            return data[index];
        }
        return null;
    }
    
    // Menghapus item
    deleteItem(id) {
        const data = this.getData();
        const filteredData = data.filter(item => item.id !== id);
        this.saveData(filteredData);
    }
}

// Class untuk mengelola jadwal kuliah dengan pengulangan
class ScheduleManager extends StorageManager {
    constructor() {
        super('schedules');
    }
    
    // Override addItem untuk mencegah duplikasi
    addItem(item) {
        const data = this.getData();
        
        // Cek duplikasi - jadwal pada hari dan waktu yang sama
        const potentialDuplicate = data.find(schedule => 
            schedule.day === item.day && 
            schedule.time === item.time && 
            schedule.title === item.title
        );
        
        if (potentialDuplicate) {
            alert("Jadwal ini sudah ada!");
            return null;
        }
        
        item.id = Date.now().toString();
        data.push(item);
        this.saveData(data);
        return item;
    }
    
    renderSchedules() {
        const schedules = this.getData();
        
        // Reset semua container hari
        const days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat'];
        days.forEach(day => {
            const container = document.getElementById(`schedule-${day}`);
            container.innerHTML = '';
        });
        
        // Kelompokkan jadwal berdasarkan hari
        const schedulesByDay = {
            'Senin': [],
            'Selasa': [],
            'Rabu': [],
            'Kamis': [],
            'Jumat': []
        };
        
        // Prioritaskan jadwal berulang
        const sortedSchedules = [...schedules].sort((a, b) => {
            if (a.isRepeating && !b.isRepeating) return -1;
            if (!a.isRepeating && b.isRepeating) return 1;
            return 0;
        });
        
        sortedSchedules.forEach(schedule => {
            if (schedulesByDay[schedule.day]) {
                schedulesByDay[schedule.day].push(schedule);
            }
        });
        
        // Urutkan jadwal berdasarkan waktu
        for (const day in schedulesByDay) {
            schedulesByDay[day].sort((a, b) => {
                const timeA = a.time.split('-')[0].trim();
                const timeB = b.time.split('-')[0].trim();
                return timeA.localeCompare(timeB);
            });
        }
        
        // Render jadwal untuk setiap hari
        for (const day in schedulesByDay) {
            const dayLower = day.toLowerCase();
            const container = document.getElementById(`schedule-${dayLower}`);
            const schedulesList = schedulesByDay[day];
            
            if (schedulesList.length === 0) {
                const emptyState = document.createElement('div');
                emptyState.classList.add('empty-state');
                emptyState.textContent = 'Tidak ada jadwal';
                container.appendChild(emptyState);
                continue;
            }
            
            schedulesList.forEach(schedule => {
                const scheduleItem = document.createElement('div');
                scheduleItem.classList.add('schedule-item');
                
                // Tambahkan indikator jika ini jadwal berulang
                let repeatInfo = '';
                if (schedule.isRepeating) {
                    repeatInfo = `<div class="repeat-info"><i class="fas fa-sync-alt"></i> Berulang hingga ${new Date(schedule.repeatUntil).toLocaleDateString('id-ID')}</div>`;
                }
                
                scheduleItem.innerHTML = `
                    <div class="schedule-info">
                        <div class="schedule-title">${schedule.title}</div>
                        <div class="schedule-time">${schedule.time}</div>
                        <div class="schedule-location">Lokasi: ${schedule.location}</div>
                        ${repeatInfo}
                    </div>
                    <div class="action-buttons">
                        <button class="edit-schedule small" data-id="${schedule.id}">Edit</button>
                        <button class="delete-schedule small" data-id="${schedule.id}">Hapus</button>
                    </div>
                `;
                container.appendChild(scheduleItem);
            });
        }
        
        // Tambahkan event listener untuk tombol edit dan delete
        document.querySelectorAll('.edit-schedule').forEach(button => {
            button.addEventListener('click', (e) => this.editSchedule(e.target.dataset.id));
        });
        
        document.querySelectorAll('.delete-schedule').forEach(button => {
            button.addEventListener('click', (e) => this.deleteSchedule(e.target.dataset.id));
        });
    }
    
    editSchedule(id) {
        const schedules = this.getData();
        const schedule = schedules.find(s => s.id === id);
        
        if (schedule) {
            document.getElementById('schedule-title').value = schedule.title;
            document.getElementById('schedule-day').value = schedule.day;
            document.getElementById('schedule-time').value = schedule.time;
            document.getElementById('schedule-location').value = schedule.location;
            
            // Atur status pengulangan
            const repeatCheckbox = document.getElementById('schedule-repeat');
            repeatCheckbox.checked = schedule.isRepeating || false;
            
            const repeatUntilContainer = document.getElementById('repeat-until-container');
            if (schedule.isRepeating) {
                repeatUntilContainer.classList.remove('hidden');
                document.getElementById('repeat-until').value = schedule.repeatUntil || '';
            } else {
                repeatUntilContainer.classList.add('hidden');
            }
            
            document.getElementById('schedule-form').classList.remove('hidden');
            
            // Ubah tombol simpan untuk menangani update
            const saveButton = document.getElementById('save-schedule-btn');
            saveButton.dataset.id = id;
            saveButton.dataset.mode = 'edit';
        }
    }
    
    deleteSchedule(id) {
        if (confirm('Yakin ingin menghapus jadwal ini?')) {
            this.deleteItem(id);
            this.renderSchedules();
            updateDashboardCounters();
        }
    }
}

// Class untuk mengelola tugas dengan checkbox
class TaskManager extends StorageManager {
    constructor() {
        super('tasks');
    }
    
    renderTasks() {
        const tasks = this.getData();
        const tasksList = document.getElementById('tasks-list');
        tasksList.innerHTML = '';
        
        // Urutkan tugas berdasarkan deadline dan prioritas
        tasks.sort((a, b) => {
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;
            
            const dateA = new Date(a.deadline);
            const dateB = new Date(b.deadline);
            
            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;
            
            const priorityValues = { high: 0, medium: 1, low: 2 };
            return priorityValues[a.priority] - priorityValues[b.priority];
        });
        
        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            if (task.completed) {
                taskItem.classList.add('completed');
            }
            
            // Tentukan warna berdasarkan prioritas
            let priorityColor = '';
            switch(task.priority) {
                case 'high':
                    priorityColor = '#f44336';
                    break;
                case 'medium':
                    priorityColor = '#ff9800';
                    break;
                case 'low':
                    priorityColor = '#4caf50';
                    break;
            }
            
            taskItem.style.borderLeftColor = priorityColor;
            
            taskItem.innerHTML = `
                <div class="task-checkbox-wrapper">
                    <input type="checkbox" class="task-checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                    <div class="task-content">
                        <div class="task-title"><strong>${task.title}</strong></div>
                        <div class="task-deadline">Deadline: ${new Date(task.deadline).toLocaleDateString('id-ID')}</div>
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="edit-task small" data-id="${task.id}">Edit</button>
                    <button class="delete-task small" data-id="${task.id}">Hapus</button>
                </div>
            `;
            tasksList.appendChild(taskItem);
        });
        
        // Event listeners untuk checkbox, edit, dan delete
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.updateItem(e.target.dataset.id, { completed: e.target.checked });
                this.renderTasks();
            });
        });
        
        document.querySelectorAll('.edit-task').forEach(button => {
            button.addEventListener('click', (e) => this.editTask(e.target.dataset.id));
        });
        
        document.querySelectorAll('.delete-task').forEach(button => {
            button.addEventListener('click', (e) => this.deleteTask(e.target.dataset.id));
        });
    }
    
    editTask(id) {
        const tasks = this.getData();
        const task = tasks.find(t => t.id === id);
        
        if (task) {
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-deadline').value = task.deadline;
            document.getElementById('task-priority').value = task.priority;
            
            document.getElementById('task-form').classList.remove('hidden');
            
            // Ubah tombol simpan untuk menangani update
            const saveButton = document.getElementById('save-task-btn');
            saveButton.dataset.id = id;
            saveButton.dataset.mode = 'edit';
        }
    }
    
    deleteTask(id) {
        if (confirm('Yakin ingin menghapus tugas ini?')) {
            this.deleteItem(id);
            this.renderTasks();
            updateDashboardCounters();
        }
    }
}

// Class untuk mengelola kegiatan organisasi
class OrgManager extends StorageManager {
    constructor() {
        super('organizations');
    }
    
    renderOrgs() {
        const orgs = this.getData();
        const orgList = document.getElementById('org-list');
        orgList.innerHTML = '';
        
        // Urutkan berdasarkan tanggal
        orgs.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        orgs.forEach(org => {
            const orgItem = document.createElement('div');
            orgItem.classList.add('note-item');
            orgItem.innerHTML = `
                <div class="org-info">
                    <div class="org-title"><strong>${org.title}</strong></div>
                    <div class="org-date">Tanggal: ${new Date(org.date).toLocaleDateString('id-ID')}</div>
                    <div class="org-description">${org.description}</div>
                </div>
                <div class="action-buttons">
                    <button class="edit-org small" data-id="${org.id}">Edit</button>
                    <button class="delete-org small" data-id="${org.id}">Hapus</button>
                </div>
            `;
            orgList.appendChild(orgItem);
        });
        
        // Event listeners untuk edit dan delete
        document.querySelectorAll('.edit-org').forEach(button => {
            button.addEventListener('click', (e) => this.editOrg(e.target.dataset.id));
        });
        
        document.querySelectorAll('.delete-org').forEach(button => {
            button.addEventListener('click', (e) => this.deleteOrg(e.target.dataset.id));
        });
    }
    
    editOrg(id) {
        const orgs = this.getData();
        const org = orgs.find(o => o.id === id);
        
        if (org) {
            document.getElementById('org-title').value = org.title;
            document.getElementById('org-date').value = org.date;
            document.getElementById('org-description').value = org.description;
            
            document.getElementById('org-form').classList.remove('hidden');
            
            // Ubah tombol simpan untuk menangani update
            const saveButton = document.getElementById('save-org-btn');
            saveButton.dataset.id = id;
            saveButton.dataset.mode = 'edit';
        }
    }
    
    deleteOrg(id) {
        if (confirm('Yakin ingin menghapus kegiatan ini?')) {
            this.deleteItem(id);
            this.renderOrgs();
            updateDashboardCounters();
        }
    }
}

// Class untuk mengelola keuangan dengan grafik
class FinanceManager extends StorageManager {
    constructor() {
        super('finances');
        this.chart = null;
    }
    
    renderFinances() {
        const finances = this.getData();
        const financeList = document.getElementById('finance-list');
        financeList.innerHTML = '';
        
        // Urutkan berdasarkan tanggal terbaru
        finances.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        finances.forEach(finance => {
            const financeItem = document.createElement('div');
            financeItem.classList.add('finance-item');
            financeItem.classList.add(finance.type === 'income' ? 'finance-income' : 'finance-expense');
            
            financeItem.innerHTML = `
                <div class="finance-info">
                    <div class="finance-description"><strong>${finance.description}</strong></div>
                    <div class="finance-amount">${finance.type === 'income' ? 'Pendapatan' : 'Pengeluaran'}: Rp ${finance.amount.toLocaleString('id-ID')}</div>
                    <div class="finance-date">Tanggal: ${new Date(finance.date).toLocaleDateString('id-ID')}</div>
                </div>
                <div class="action-buttons">
                    <button class="edit-finance small" data-id="${finance.id}">Edit</button>
                    <button class="delete-finance small" data-id="${finance.id}">Hapus</button>
                </div>
            `;
            financeList.appendChild(financeItem);
        });
        
        // Hitung dan tampilkan ringkasan keuangan
        this.calculateSummary();
        
        // Render grafik keuangan
        this.renderChart();
        
        // Event listeners untuk edit dan delete
        document.querySelectorAll('.edit-finance').forEach(button => {
            button.addEventListener('click', (e) => this.editFinance(e.target.dataset.id));
        });
        
        document.querySelectorAll('.delete-finance').forEach(button => {
            button.addEventListener('click', (e) => this.deleteFinance(e.target.dataset.id));
        });
    }
    
    calculateSummary() {
        const finances = this.getData();
        let totalIncome = 0;
        let totalExpense = 0;
        
        finances.forEach(finance => {
            if (finance.type === 'income') {
                totalIncome += finance.amount;
            } else {
                totalExpense += finance.amount;
            }
        });
        
        const balance = totalIncome - totalExpense;
        
        document.getElementById('finance-balance').textContent = `Rp ${balance.toLocaleString('id-ID')}`;
        document.getElementById('finance-total-income').textContent = `Rp ${totalIncome.toLocaleString('id-ID')}`;
        document.getElementById('finance-total-expense').textContent = `Rp ${totalExpense.toLocaleString('id-ID')}`;
        
        // Update juga di stats card
        const balanceElement = document.getElementById('finance-balance-stats');
        if (balanceElement) {
            balanceElement.textContent = `Rp ${balance.toLocaleString('id-ID')}`;
        }
    }
    
    renderChart() {
        const finances = this.getData();
        
        // Kelompokkan transaksi berdasarkan tanggal
        const dataByDate = {};
        const today = new Date();
        
        // Inisialisasi data untuk 7 hari terakhir
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            dataByDate[dateString] = { income: 0, expense: 0 };
        }
        
        // Isi data transaksi
        finances.forEach(finance => {
            const dateString = finance.date.split('T')[0];
            if (dataByDate[dateString]) {
                if (finance.type === 'income') {
                    dataByDate[dateString].income += finance.amount;
                } else {
                    dataByDate[dateString].expense += finance.amount;
                }
            }
        });
        
        // Siapkan data untuk chart
        const labels = Object.keys(dataByDate).map(date => {
            const d = new Date(date);
            return d.toLocaleDateString('id-ID', { weekday: 'short' });
        });
        
        const incomeData = Object.values(dataByDate).map(d => d.income);
        const expenseData = Object.values(dataByDate).map(d => d.expense);
        const balanceData = Object.values(dataByDate).map(d => d.income - d.expense);
        
        // Render chart
        const ctx = document.getElementById('financeChart');
        if (!ctx) return; // Cek apakah elemen canvas ada
        
        if (this.chart) {
            this.chart.destroy();
        }
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Saldo',
                        data: balanceData,
                        borderColor: '#0a2463',
                        backgroundColor: 'rgba(10, 36, 99, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Pendapatan',
                        data: incomeData,
                        borderColor: '#4caf50',
                        backgroundColor: 'rgba(76, 175, 80, 0)',
                        borderDash: [5, 5],
                        tension: 0.4
                    },
                    {
                        label: 'Pengeluaran',
                        data: expenseData,
                        borderColor: '#f44336',
                        backgroundColor: 'rgba(244, 67, 54, 0)',
                        borderDash: [5, 5],
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': Rp ' + context.raw.toLocaleString('id-ID');
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'Rp ' + value.toLocaleString('id-ID');
                            }
                        }
                    }
                }
            }
        });
    }
    
    editFinance(id) {
        const finances = this.getData();
        const finance = finances.find(f => f.id === id);
        
        if (finance) {
            document.getElementById('finance-description').value = finance.description;
            document.getElementById('finance-amount').value = finance.amount;
            document.getElementById('finance-type').value = finance.type;
            document.getElementById('finance-date').value = finance.date;
            
            document.getElementById('finance-form').classList.remove('hidden');
            
            // Ubah tombol simpan untuk menangani update
            const saveButton = document.getElementById('save-finance-btn');
            saveButton.dataset.id = id;
            saveButton.dataset.mode = 'edit';
        }
    }
    
    deleteFinance(id) {
        if (confirm('Yakin ingin menghapus transaksi ini?')) {
            this.deleteItem(id);
            this.renderFinances();
            updateDashboardCounters();
        }
    }
}

// Inisialisasi managers
const scheduleManager = new ScheduleManager();
const taskManager = new TaskManager();
const orgManager = new OrgManager();
const financeManager = new FinanceManager();

// Fungsi untuk menampilkan waktu saat ini
const updateDateTime = () => {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    document.getElementById('datetime').textContent = now.toLocaleDateString('id-ID', options);
};

// Fungsi untuk memperbarui counter di cards
const updateDashboardCounters = () => {
    const scheduleCount = scheduleManager.getData().length;
    const taskCount = taskManager.getData().length;
    const orgCount = orgManager.getData().length;
    
    // Update stats cards
    const scheduleCountElement = document.getElementById('schedule-count');
    const taskCountElement = document.getElementById('task-count');
    const orgCountElement = document.getElementById('org-count');
    
    if (scheduleCountElement) scheduleCountElement.textContent = scheduleCount;
    if (taskCountElement) taskCountElement.textContent = taskCount;
    if (orgCountElement) orgCountElement.textContent = orgCount;
};

// Fungsi asinkron untuk simulasi loading data
const loadDashboardData = async () => {
    // Simulasi loading dengan Promise
    const loadingPromise = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    try {
        // Loading data jadwal
        await loadingPromise(300);
        scheduleManager.renderSchedules();
        
        // Loading data tugas
        await loadingPromise(200);
        taskManager.renderTasks();
        
        // Loading data organisasi
        await loadingPromise(200);
        orgManager.renderOrgs();
        
        // Loading data keuangan
        await loadingPromise(300);
        financeManager.renderFinances();
        
        // Update counters
        updateDashboardCounters();
        
        console.log('Semua data berhasil dimuat');
    } catch (error) {
        console.error('Terjadi kesalahan saat memuat data:', error);
    }
};

// Event listeners setelah DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    // Update waktu
    updateDateTime();
    // Jalankan update waktu setiap menit
    setInterval(updateDateTime, 60000);
    
    // Load data dashboard secara asinkron
    loadDashboardData().then(() => {
        console.log('Dashboard siap digunakan!');
    });
    
    // Event listener untuk checkbox pengulangan jadwal
    const repeatCheckbox = document.getElementById('schedule-repeat');
    const repeatUntilContainer = document.getElementById('repeat-until-container');
    
    if (repeatCheckbox && repeatUntilContainer) {
        repeatCheckbox.addEventListener('change', function() {
            if (this.checked) {
                repeatUntilContainer.classList.remove('hidden');
            } else {
                repeatUntilContainer.classList.add('hidden');
            }
        });
    }
    
    // Event listeners untuk form jadwal kuliah
    const addScheduleBtn = document.getElementById('add-schedule-btn');
    if (addScheduleBtn) {
        addScheduleBtn.addEventListener('click', () => {
            // Reset form
            document.getElementById('schedule-title').value = '';
            document.getElementById('schedule-day').value = '';
            document.getElementById('schedule-time').value = '';
            document.getElementById('schedule-location').value = '';
            
            // Reset pengulangan
            document.getElementById('schedule-repeat').checked = false;
            document.getElementById('repeat-until-container').classList.add('hidden');
            
            // Tampilkan form
            document.getElementById('schedule-form').classList.remove('hidden');
            
            // Reset mode tombol save
            const saveButton = document.getElementById('save-schedule-btn');
            saveButton.removeAttribute('data-id');
            saveButton.removeAttribute('data-mode');
        });
    }
    
    const cancelScheduleBtn = document.getElementById('cancel-schedule-btn');
    if (cancelScheduleBtn) {
        cancelScheduleBtn.addEventListener('click', () => {
            document.getElementById('schedule-form').classList.add('hidden');
        });
    }
    
    const saveScheduleBtn = document.getElementById('save-schedule-btn');
    if (saveScheduleBtn) {
        saveScheduleBtn.addEventListener('click', () => {
            const title = document.getElementById('schedule-title').value;
            const day = document.getElementById('schedule-day').value;
            const time = document.getElementById('schedule-time').value;
            const location = document.getElementById('schedule-location').value;
            const isRepeating = document.getElementById('schedule-repeat').checked;
            const repeatUntil = isRepeating ? document.getElementById('repeat-until').value : null;
            
            if (!title || !day || !time) {
                alert('Mohon isi semua field yang diperlukan');
                return;
            }
            
            const scheduleData = { 
                title, 
                day, 
                time, 
                location, 
                isRepeating, 
                repeatUntil 
            };
            
            if (saveScheduleBtn.dataset.mode === 'edit') {
                // Update jadwal yang ada
                scheduleManager.updateItem(saveScheduleBtn.dataset.id, scheduleData);
            } else {
                // Tambah jadwal baru
                scheduleManager.addItem(scheduleData);
            }
            
            document.getElementById('schedule-form').classList.add('hidden');
            scheduleManager.renderSchedules();
            updateDashboardCounters();
        });
    }
    
    // Event listeners untuk form tugas
    const addTaskBtn = document.getElementById('add-task-btn');
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            // Reset form
            document.getElementById('task-title').value = '';
            document.getElementById('task-deadline').value = '';
            document.getElementById('task-priority').value = 'medium';
            
            // Tampilkan form
            document.getElementById('task-form').classList.remove('hidden');
            
            // Reset mode tombol save
            const saveButton = document.getElementById('save-task-btn');
            saveButton.removeAttribute('data-id');
            saveButton.removeAttribute('data-mode');
        });
    }
    
    const cancelTaskBtn = document.getElementById('cancel-task-btn');
    if (cancelTaskBtn) {
        cancelTaskBtn.addEventListener('click', () => {
            document.getElementById('task-form').classList.add('hidden');
        });
    }
    
    const saveTaskBtn = document.getElementById('save-task-btn');
    if (saveTaskBtn) {
        saveTaskBtn.addEventListener('click', () => {
            const title = document.getElementById('task-title').value;
            const deadline = document.getElementById('task-deadline').value;
            const priority = document.getElementById('task-priority').value;
            
            if (!title || !deadline) {
                alert('Mohon isi semua field yang diperlukan');
                return;
            }
            
            if (saveTaskBtn.dataset.mode === 'edit') {
                // Update tugas yang ada
                taskManager.updateItem(saveTaskBtn.dataset.id, { title, deadline, priority });
            } else {
                // Tambah tugas baru
                taskManager.addItem({ title, deadline, priority, completed: false });
            }
            
            document.getElementById('task-form').classList.add('hidden');
            taskManager.renderTasks();
            updateDashboardCounters();
        });
    }
    
    // Event listeners untuk form organisasi
    const addOrgBtn = document.getElementById('add-org-btn');
    if (addOrgBtn) {
        addOrgBtn.addEventListener('click', () => {
            // Reset form
            document.getElementById('org-title').value = '';
            document.getElementById('org-date').value = '';
            document.getElementById('org-description').value = '';
            
            // Tampilkan form
            document.getElementById('org-form').classList.remove('hidden');
            
            // Reset mode tombol save
            const saveButton = document.getElementById('save-org-btn');
            saveButton.removeAttribute('data-id');
            saveButton.removeAttribute('data-mode');
        });
    }
    
    const cancelOrgBtn = document.getElementById('cancel-org-btn');
    if (cancelOrgBtn) {
        cancelOrgBtn.addEventListener('click', () => {
            document.getElementById('org-form').classList.add('hidden');
        });
    }
    
    const saveOrgBtn = document.getElementById('save-org-btn');
    if (saveOrgBtn) {
        saveOrgBtn.addEventListener('click', () => {
            const title = document.getElementById('org-title').value;
            const date = document.getElementById('org-date').value;
            const description = document.getElementById('org-description').value;
            
            if (!title || !date) {
                alert('Mohon isi judul dan tanggal');
                return;
            }
            
            if (saveOrgBtn.dataset.mode === 'edit') {
                // Update kegiatan yang ada
                orgManager.updateItem(saveOrgBtn.dataset.id, { title, date, description });
            } else {
                // Tambah kegiatan baru
                orgManager.addItem({ title, date, description });
            }
            
            document.getElementById('org-form').classList.add('hidden');
            orgManager.renderOrgs();
            updateDashboardCounters();
        });
    }
    
    // Event listeners untuk form keuangan
    const addFinanceBtn = document.getElementById('add-finance-btn');
    if (addFinanceBtn) {
        addFinanceBtn.addEventListener('click', () => {
            // Reset form
            document.getElementById('finance-description').value = '';
            document.getElementById('finance-amount').value = '';
            document.getElementById('finance-type').value = 'income';
            document.getElementById('finance-date').value = new Date().toISOString().split('T')[0];
            
            // Tampilkan form
            document.getElementById('finance-form').classList.remove('hidden');
            
            // Reset mode tombol save
            const saveButton = document.getElementById('save-finance-btn');
            saveButton.removeAttribute('data-id');
            saveButton.removeAttribute('data-mode');
        });
    }
    
    const cancelFinanceBtn = document.getElementById('cancel-finance-btn');
    if (cancelFinanceBtn) {
        cancelFinanceBtn.addEventListener('click', () => {
            document.getElementById('finance-form').classList.add('hidden');
        });
    }
    
    const saveFinanceBtn = document.getElementById('save-finance-btn');
    if (saveFinanceBtn) {
        saveFinanceBtn.addEventListener('click', () => {
            const description = document.getElementById('finance-description').value;
            const amountStr = document.getElementById('finance-amount').value;
            const amount = parseFloat(amountStr);
            const type = document.getElementById('finance-type').value;
            const date = document.getElementById('finance-date').value;
            
            if (!description || !amountStr || isNaN(amount) || amount <= 0 || !date) {
                alert('Mohon isi semua field dengan benar');
                return;
            }
            
            if (saveFinanceBtn.dataset.mode === 'edit') {
                // Update transaksi yang ada
                financeManager.updateItem(saveFinanceBtn.dataset.id, { description, amount, type, date });
            } else {
                // Tambah transaksi baru
                financeManager.addItem({ description, amount, type, date });
            }
            
            document.getElementById('finance-form').classList.add('hidden');
            financeManager.renderFinances();
            updateDashboardCounters();
        });
    }
});