Deskripsi
Dashboard Mahasiswa adalah aplikasi berbasis web yang dirancang untuk membantu mahasiswa mengorganisir semua aspek kehidupan akademik dan organisasi dalam satu platform terpadu. Aplikasi ini menyediakan panel informasi untuk jadwal kuliah, daftar tugas, kegiatan organisasi, dan manajemen keuangan.

Fitur Utama
1. Jadwal Kuliah
Pengelompokan jadwal berdasarkan hari (Senin-Jumat)
Pencatatan detail mata kuliah, waktu, dan lokasi
Fitur jadwal berulang mingguan dengan tanggal berakhir
Prioritas tampilan untuk jadwal berulang
Validasi untuk mencegah duplikasi jadwal

2. Daftar Tugas
Pengelolaan tugas dengan deadline
Penentuan prioritas tugas (Rendah/Sedang/Tinggi)
Penanda status tugas dengan checkbox
Pengurutan otomatis berdasarkan deadline dan prioritas

3. Kegiatan Organisasi
Pencatatan kegiatan organisasi dengan tanggal
Penambahan deskripsi kegiatan
Pengorganisasian berdasarkan tanggal

4. Manajemen Keuangan
Pencatatan pendapatan dan pengeluaran
Visualisasi grafik keuangan 7 hari terakhir
Perhitungan saldo, total pendapatan, dan total pengeluaran
Pengelompokan transaksi berdasarkan jenis

Teknologi yang Digunakan

HTML5
CSS3
JavaScript ES6+
Chart.js untuk visualisasi data
localStorage untuk penyimpanan data lokal

Fitur ES6+ yang Diimplementasikan

1. let dan const: Penggunaan variabel dengan ruang lingkup blok dan konstanta

const scheduleManager = new ScheduleManager();
let totalIncome = 0;


2. Arrow Functions: Sintaks yang lebih singkat untuk fungsi

const updateDateTime = () => { ... }
document.querySelectorAll('.edit-schedule').forEach(button => { ... })


3. Template Literals: String yang memungkinkan ekspresi tersemat

`<div class="schedule-title">${schedule.title}</div>`
`Berulang hingga ${new Date(schedule.repeatUntil).toLocaleDateString('id-ID')}`


4. Destructuring Assignment: Pembongkaran nilai dari array atau properti objek

const { title, day, time, location } = scheduleData;


5. Spread Operator: Untuk menyalin elemen array atau properti objek

const sortedSchedules = [...schedules].sort(...);
data[index] = { ...data[index], ...updatedItem };


6. Classes: Implementasi OOP dengan class dan inheritance

class StorageManager { ... }
class ScheduleManager extends StorageManager { ... }


7. Enhanced Object Literals: Definisi objek yang lebih ringkas

const scheduleData = { title, day, time, location, isRepeating, repeatUntil };


8. Default Parameters: Nilai default untuk parameter fungsi

renderChart(container = 'financeChart') { ... }


9. Promises dan Async/Await: Penanganan operasi asinkron

const loadingPromise = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const loadDashboardData = async () => { ... }


10. Optional Chaining: Akses properti objek nested tanpa error

if (scheduleCountElement?.textContent) scheduleCountElement.textContent = scheduleCount;

![image](https://github.com/user-attachments/assets/a5c517e3-9647-4381-aef2-dad69cb9ec2b)
![image](https://github.com/user-attachments/assets/6f469e83-896b-400c-99c1-dcf983a86927)

