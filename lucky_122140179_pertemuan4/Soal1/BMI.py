Bbadan = 60
Tbadan = 1.7

# Jika menggunakan input dari user
# Bbadan = input("Berat badan (kg): ")
# Tbadan = input("Tinggi badan (m): ")


BMI = Bbadan / (Tbadan ** 2)
print("BMI:", BMI)

if BMI < 18.5:
    print("Berat badan kurang")
elif 18.5 <= BMI < 25 :
    print("Berat badan normal")
elif 25 <= BMI < 30 :
    print("Berat badan berlebih")
elif BMI >= 30:
    print("Obesitas")