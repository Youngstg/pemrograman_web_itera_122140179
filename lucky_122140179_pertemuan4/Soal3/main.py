import math_operations
from math_operations import persegi, segitiga, lingkaran, celcius_fahrenheit, celcius_reamur

print("                              === Geometri ===\n")

luas_persegi, keliling_persegi = math_operations.persegi(5)
print(f"Luas Persegi: {luas_persegi}, Keliling Persegi: {keliling_persegi}\n")

luas_segitiga, keliling_segitiga = math_operations.segitiga(5, 10)
print(f"Luas Segitiga: {luas_segitiga}, Keliling Segitiga: {keliling_segitiga}\n")

luas_lingkaran, keliling_lingkaran = math_operations.lingkaran(7)
print(f"Luas Lingkaran: {luas_lingkaran}, Keliling Lingkaran: {keliling_lingkaran}\n")

print("                              === Konversi Suhu ===\n")

f = math_operations.celcius_fahrenheit(25)
print(f"Fahrenheit: {f}\n")

r = math_operations.celcius_reamur(25)
print(f"Reamur: {r}\n")
print("                              === Konstanta ===\n")
pi = math_operations.PI
print(f"Pi: {pi}\n")

g = math_operations.G 
print(f"Gravitasi: {g}\n")

