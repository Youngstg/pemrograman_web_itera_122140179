/**
 * Fungsi untuk memvalidasi input form
 * @param {string} nama - Nama pengguna
 * @param {string} email - Alamat email pengguna
 * @param {string} password - Password pengguna
 * @returns {Object} - Hasil validasi beserta pesan error (jika ada)
 */
function validateForm(nama, email, password) {
    const errors = {};
    let isValid = true;
    
    // Validasi nama (minimal 3 karakter)
    if (!nama || nama.length <= 3) {
      errors.nama = "Nama harus lebih dari 3 karakter";
      isValid = false;
    }
    
    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = "Format email tidak valid";
      isValid = false;
    }
    
    // Validasi password (minimal 8 karakter)
    if (password.length < 8) {
      errors.password = "Password harus minimal 8 karakter";
      isValid = false;
    }
    
    return {
      isValid,
      errors
    };
  }
  
  // Contoh penggunaan:
  function handleSubmit(event) {
    event.preventDefault();
    
    const nama = document.getElementById('nama').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const validationResult = validateForm(nama, email, password);
    
    // Reset pesan validasi sukses
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
      successMessage.style.display = 'none';
    }
    
    if (validationResult.isValid) {
      // Proses form jika semua input valid
      console.log("Form valid, melanjutkan proses...");
      // submitForm(); // Panggil fungsi untuk mengirim data ke server
      
      // Tampilkan pesan sukses
      if (successMessage) {
        successMessage.style.display = 'block';
      }
    } else {
      // Tampilkan pesan error
      displayErrors(validationResult.errors);
    }
  }
  
  /**
   * Fungsi untuk menampilkan pesan error pada form
   * @param {Object} errors - Object berisi pesan error
   */
  function displayErrors(errors) {
    // Reset semua pesan error sebelumnya
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
      element.textContent = '';
    });
    
    // Sembunyikan pesan sukses jika ada error
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
      successMessage.style.display = 'none';
    }
    
    // Tampilkan pesan error baru
    for (const field in errors) {
      const errorElement = document.getElementById(`${field}-error`);
      if (errorElement) {
        errorElement.textContent = errors[field];
      }
    }
  }