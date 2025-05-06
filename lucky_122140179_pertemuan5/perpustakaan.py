from abc import ABC, abstractmethod

# Abstract class LibraryItem
class LibraryItem(ABC):
    def __init__(self, item_id, title):
        self._item_id = item_id
        self._title = title
        self._available = True

    @abstractmethod
    def display_info(self):
        pass

    def check_availability(self):
        return self._available

    def set_availability(self, status):
        self._available = status

    @property
    def title(self):
        return self._title

    @property
    def item_id(self):
        return self._item_id


# Subclass Book
class Book(LibraryItem):
    def __init__(self, item_id, title, author):
        super().__init__(item_id, title)
        self.__author = author

    @property
    def author(self):
        return self.__author

    def display_info(self):
        print(f"[Book] ID: {self.item_id}, Title: {self.title}, Author: {self.author}, Available: {self.check_availability()}")


# Subclass Magazine
class Magazine(LibraryItem):
    def __init__(self, item_id, title, issue_number):
        super().__init__(item_id, title)
        self.__issue_number = issue_number

    @property
    def issue_number(self):
        return self.__issue_number

    def display_info(self):
        print(f"[Magazine] ID: {self.item_id}, Title: {self.title}, Issue: {self.issue_number}, Available: {self.check_availability()}")


# Class Library
class Library:
    def __init__(self):
        self.__items = []

    def add_item(self, item):
        if isinstance(item, LibraryItem):
            self.__items.append(item)
            print("✅ Item berhasil ditambahkan ke perpustakaan.\n")
        else:
            print("❌ Item harus turunan dari LibraryItem.")

    def display_all_items(self):
        print("\n📚 Daftar Semua Koleksi:")
        if not self.__items:
            print("Perpustakaan kosong.")
        for item in self.__items:
            item.display_info()

    def search_by_title(self, title):
        print(f"\n🔍 Mencari berdasarkan judul: '{title}'")
        found = False
        for item in self.__items:
            if title.lower() in item.title.lower():
                item.display_info()
                found = True
        if not found:
            print("❌ Tidak ditemukan item dengan judul tersebut.")

    def search_by_id(self, item_id):
        print(f"\n🔍 Mencari berdasarkan ID: '{item_id}'")
        for item in self.__items:
            if item.item_id == item_id:
                item.display_info()
                return
        print("❌ Tidak ditemukan item dengan ID tersebut.")


# ========== PROGRAM UTAMA ==========
def main():
    lib = Library()

    while True:
        print("\n====== MENU PERPUSTAKAAN ======")
        print("1. Tambah Buku")
        print("2. Tambah Majalah")
        print("3. Tampilkan Semua Koleksi")
        print("4. Cari Berdasarkan Judul")
        print("5. Cari Berdasarkan ID")
        print("0. Keluar")
        choice = input("Pilih opsi (0-5): ")

        if choice == "1":
            item_id = input("Masukkan ID Buku: ")
            title = input("Masukkan Judul Buku: ")
            author = input("Masukkan Nama Penulis: ")
            book = Book(item_id, title, author)
            lib.add_item(book)

        elif choice == "2":
            item_id = input("Masukkan ID Majalah: ")
            title = input("Masukkan Judul Majalah: ")
            issue_number = input("Masukkan Nomor Edisi: ")
            magazine = Magazine(item_id, title, issue_number)
            lib.add_item(magazine)

        elif choice == "3":
            lib.display_all_items()

        elif choice == "4":
            title = input("Masukkan Judul yang Dicari: ")
            lib.search_by_title(title)

        elif choice == "5":
            item_id = input("Masukkan ID yang Dicari: ")
            lib.search_by_id(item_id)

        elif choice == "0":
            print("👋 Terima kasih! Program selesai.")
            break

        else:
            print("❌ Pilihan tidak valid. Silakan coba lagi.")


if __name__ == "__main__":
    main()
