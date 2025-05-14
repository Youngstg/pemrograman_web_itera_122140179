1 Hasil POSTMAN CRUD
![alt text](image-1.png)
![alt text](image.png)
![alt text](image-2.png)
![alt text](image-3.png)

# LANGKAH INSTALASI DAN JALANKAN APLIKASI

A. Persiapan
1. Install Python dan PostgreSQL
    Python 3.10 atau lebih baru

    PostgreSQL (saya 17))

2. Buat folder proyek
    mkdir manajemen_matakuliah
    cd manajemen_matakuliah

B. Buat Virtual Environment dan Install Paket
3. Buat dan aktifkan virtual environment
    python -m venv venv
    venv\Scripts\activate  # Windows

4. Install dependensi
    pip install pyramid sqlalchemy psycopg2-binary alembic pyramid_tm waitress pyramid_debugtoolbar

C. Setup Struktur Proyek
Pastikan struktur folder kamu seperti ini:

    manajemen_matakuliah/
    ├── development.ini
    ├── setup.py
    ├── manajemen_matakuliah/
    │   ├── __init__.py
    │   ├── models/
    │   │   ├── __init__.py
    │   │   ├── meta.py
    │   │   └── matakuliah.py
    │   ├── views/
    │   │   └── matakuliah.py
    │   ├── scripts/
    │   │   └── initialize_db.py
    │   └── alembic/
    │       └── versions/

D. Konfigurasi PostgreSQL
5. Buat database dan user
Login ke psql: psql -U postgres

    CREATE DATABASE matakuliah_db;
    CREATE USER matakuliah_user WITH ENCRYPTED PASSWORD 'matakuliah_pass';
    GRANT ALL PRIVILEGES ON DATABASE matakuliah_db TO matakuliah_user;

E. Konfigurasi development.ini
Edit bagian ini: sqlalchemy.url = postgresql://matakuliah_user:matakuliah_pass@localhost:5432/matakuliah_db

F. Migrasi Database dengan Alembic
6. Inisialisasi alembic
    alembic init manajemen_matakuliah/alembic

7. Buat dan jalankan migrasi
    alembic -c development.ini revision --autogenerate -m "create matakuliah table"
    alembic -c development.ini upgrade head

G. Inisialisasi Data Dummy
9. Jalankan Script
    python -m manajemen_matakuliah.scripts.initialize_db development.ini

H Jalankan Server
    pserve development.ini --reload

I. Uji dengan Postman atau curl
GET
    curl.exe -X GET http://localhost:6543/api/matakuliah

POST
    {
  "kode_mk": "IF301",
  "nama_mk": "Kecerdasan Buatan",
  "sks": 3,
  "semester": 6
}

PUT
    {
  "nama_mk": "Pemrograman Lanjut",
  "sks": 4
}

DELETE
    curl.exe -X DELETE http://localhost:6543/api/matakuliah/1
