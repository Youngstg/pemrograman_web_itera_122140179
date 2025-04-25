# Data awal mahasiswa (list of dictionary)
mahasiswa = [
    {"nama": "Andi", "nim": "122140179", "nilai_uts": 75, "nilai_uas": 85, "nilai_tugas": 80},
    {"nama": "Budi", "nim": "122140178", "nilai_uts": 60, "nilai_uas": 65, "nilai_tugas": 70},
    {"nama": "Citra", "nim": "122140177", "nilai_uts": 90, "nilai_uas": 88, "nilai_tugas": 95},
    {"nama": "Dewi", "nim": "122140176", "nilai_uts": 55, "nilai_uas": 50, "nilai_tugas": 60},
    {"nama": "Eko", "nim": "122140175", "nilai_uts": 40, "nilai_uas": 45, "nilai_tugas": 35}
]

# Hitung nilai nilai_akhir dan grade
for mhs in mahasiswa:
    nilai_akhir = 0.3 * mhs["nilai_uts"] + 0.4 * mhs["nilai_uas"] + 0.3 * mhs["nilai_tugas"]
    mhs["nilai_akhir"] = round(nilai_akhir, 2)
    if nilai_akhir >= 80:
        mhs["grade"] = "A"
    elif nilai_akhir >= 70:
        mhs["grade"] = "B"
    elif nilai_akhir >= 60:
        mhs["grade"] = "C"
    elif nilai_akhir >= 50:
        mhs["grade"] = "D"
    else:
        mhs["grade"] = "E"

# Tampilkan tabel data
print("{:<10} {:<10} {:<10} {:<10} {:<10} {:<12} {:<6}".format(
    "Nama", "NIM", "UTS", "UAS", "Tugas", "Nilai Akhir", "Grade"))
print("-" * 70)

for mhs in mahasiswa:
    print("{:<10} {:<10} {:<10} {:<10} {:<10} {:<12} {:<6}".format(
        mhs["nama"], mhs["nim"], mhs["nilai_uts"], mhs["nilai_uas"],
        mhs["nilai_tugas"], mhs["nilai_akhir"], mhs["grade"]
    ))

# Cari nilai tertinggi dan terendah
tertinggi = max(mahasiswa, key=lambda x: x["nilai_akhir"])
terendah = min(mahasiswa, key=lambda x: x["nilai_akhir"])

print("\nMahasiswa dengan nilai tertinggi:")
print(f"{tertinggi['nama']} ({tertinggi['nim']}) - Nilai Akhir: {tertinggi['nilai_akhir']} - Grade: {tertinggi['grade']}")

print("\nMahasiswa dengan nilai terendah:")
print(f"{terendah['nama']} ({terendah['nim']}) - Nilai Akhir: {terendah['nilai_akhir']} - Grade: {terendah['grade']}")
