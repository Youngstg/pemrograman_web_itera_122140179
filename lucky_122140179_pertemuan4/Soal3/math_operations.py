def persegi(sisi):
    luas = sisi * sisi
    keliling = 4 * sisi
    return luas, keliling

def segitiga(alas, tinggi):
    luas = 0.5 * alas * tinggi
    keliling = alas + tinggi + (alas**2 + tinggi**2)**0.5
    return luas, keliling

def lingkaran(jari_jari):
    pi = 3.14
    luas = pi * jari_jari * jari_jari
    keliling = 2 * pi * jari_jari
    return luas, keliling

def celcius_fahrenheit(celcius):
    fahrenheit = (celcius * 9/5) + 32
    return fahrenheit

def celcius_reamur(celcius):
    reamur = celcius * 4/5
    return reamur

PI = 3.14159

G = 9.8