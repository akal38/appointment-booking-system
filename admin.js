// بيانات لوحة التحكم
const Admin = {
    // بيانات الاعتماد الافتراضية
    defaultCredentials: {
        username: 'admin',
        password: 'password123'
    },
    
    // تهيئة لوحة التحكم
    init: function() {
        // محاولة تحميل بيانات الاعتماد من localStorage
        this.loadCredentials();
        
        // ربط الأحداث
        this.bindEvents();
        
        // إذا كان المستخدم مسجلاً بالفعل، إظهار لوحة التحكم
        if (localStorage.getItem('adminLoggedIn') === 'true') {
            this.showDashboard();
        }
    },
    
    // تحميل بيانات الاعتماد من localStorage أو استخدام الافتراضية
    loadCredentials: function() {
        const savedPassword = localStorage.getItem('adminPassword');
        if (savedPassword) {
            this.defaultCredentials.password = savedPassword;
        }
    },
    
    // ربط الأحداث
    bindEvents: function() {
        // حدث تسجيل الدخول
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        // حدث تسجيل الخروج
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.handleLogout();
        });
        
        // حدث تغيير كلمة المرور
        document.getElementById('change-password-btn').addEventListener('click', () => {
            this.showPasswordModal();
        });
        
        // حدث مسح جميع الحجوزات
        document.getElementById('clear-all-btn').addEventListener('click', () => {
            this.clearAllBookings();
        });
        
        // حدث إرسال نموذج تغيير كلمة المرور
        document.getElementById('password-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePasswordChange();
        });
        
        // أحداث إغلاق النوافذ
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                modal.style.display = 'none';
            });
        });
        
        // إغلاق النوافذ عند النقر خارجها
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    },
    
    // معالجة تسجيل الدخول
    handleLogin: function() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === this.defaultCredentials.username && password === this.defaultCredentials.password) {
            // تسجيل الدخول ناجح
            localStorage.setItem('adminLoggedIn', 'true');
            this.showDashboard();
        } else {
            // فشل تسجيل الدخول
            document.getElementById('login-error').textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
        }
    },
    
    // معالجة تسجيل الخروج
    handleLogout: function() {
        localStorage.removeItem('adminLoggedIn');
        this.hideDashboard();
    },
    
    // إظهار لوحة التحكم
    showDashboard: function() {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        this.loadBookings();
    },
    
    // إخفاء لوحة التحكم
    hideDashboard: function() {
        document.getElementById('login-page').classList.remove('hidden');
        document.getElementById('dashboard').classList.add('hidden');
    },
    
    // تحميل الحجوزات وعرضها
    loadBookings: function() {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const bookingsBody = document.getElementById('bookings-body');
        
        // مسح المحتوى الحالي
        bookingsBody.innerHTML = '';
        
        if (bookings.length === 0) {
            bookingsBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">لا توجد حجوزات</td></tr>';
            return;
        }
        
        // عرض الحجوزات
        bookings.forEach(booking => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${booking.fullname}</td>
                <td>${booking.phone}</td>
                <td>${booking.date}</td>
                <td>${booking.time}</td>
                <td>${booking.service}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${booking.id}">تعديل</button>
                    <button class="action-btn delete-btn" data-id="${booking.id}">حذف</button>
                </td>
            `;
            
            bookingsBody.appendChild(row);
        });
        
        // ربط أحداث أزرار التعديل والحذف
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                this.editBooking(parseInt(id));
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                this.deleteBooking(parseInt(id));
            });
        });
    },
    
    // حذف حجز
    deleteBooking: function(id) {
        if (!confirm('هل أنت متأكد من أنك تريد حذف هذا الحجز؟')) {
            return;
        }
        
        let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        bookings = bookings.filter(booking => booking.id !== id);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        this.loadBookings(); // إعادة تحميل الجدول
    },
    
    // تعديل حجز
    editBooking: function(id) {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const booking = bookings.find(b => b.id === id);
        
        if (!booking) {
            alert('الحجز غير موجود');
            return;
        }
        
        // تعبئة نموذج التعديل ببيانات الحجز
        document.getElementById('edit-id').value = booking.id;
        document.getElementById('edit-fullname').value = booking.fullname;
        document.getElementById('edit-phone').value = booking.phone;
        document.getElementById('edit-date').value = booking.date;
        document.getElementById('edit-time').value = booking.time;
        document.getElementById('edit-service').value = booking.service;
        
        // إظهار نافذة التعديل
        document.getElementById('edit-modal').style.display = 'block';
        
        // ربط حدث إرسال نموذج التعديل (إذا لم يكن مربوطاً بالفعل)
        const editForm = document.getElementById('edit-form');
        const submitHandler = (e) => {
            e.preventDefault();
            this.handleEditSubmit();
            editForm.removeEventListener('submit', submitHandler);
        };
        
        editForm.addEventListener('submit', submitHandler);
    },
    
    // معالجة تعديل الحجز
    handleEditSubmit: function() {
        const id = parseInt(document.getElementById('edit-id').value);
        const updatedBooking = {
            id: id,
            fullname: document.getElementById('edit-fullname').value,
            phone: document.getElementById('edit-phone').value,
            date: document.getElementById('edit-date').value,
            time: document.getElementById('edit-time').value,
            service: document.getElementById('edit-service').value
        };
        
        let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const index = bookings.findIndex(booking => booking.id === id);
        
        if (index !== -1) {
            bookings[index] = updatedBooking;
            localStorage.setItem('bookings', JSON.stringify(bookings));
            
            // إغلاق نافذة التعديل وإعادة تحميل البيانات
            document.getElementById('edit-modal').style.display = 'none';
            this.loadBookings();
        }
    },
    
    // مسح جميع الحجوزات
    clearAllBookings: function() {
        if (!confirm('هل أنت متأكد من أنك تريد مسح جميع الحجوزات؟ لا يمكن التراجع عن هذا الإجراء.')) {
            return;
        }
        
        localStorage.removeItem('bookings');
        this.loadBookings();
    },
    
    // إظهار نافذة تغيير كلمة المرور
    showPasswordModal: function() {
        document.getElementById('password-modal').style.display = 'block';
    },
    
    // معالجة تغيير كلمة المرور
    handlePasswordChange: function() {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // التحقق من كلمة المرور الحالية
        if (currentPassword !== this.defaultCredentials.password) {
            alert('كلمة المرور الحالية غير صحيحة');
            return;
        }
        
        // التحقق من تطابق كلمتي المرور الجديدتين
        if (newPassword !== confirmPassword) {
            alert('كلمتا المرور غير متطابقتين');
            return;
        }
        
        // حفظ كلمة المرور الجديدة
        this.defaultCredentials.password = newPassword;
        localStorage.setItem('adminPassword', newPassword);
        
        // إغلاق النافذة وإعادة تعيين النموذج
        document.getElementById('password-modal').style.display = 'none';
        document.getElementById('password-form').reset();
        
        alert('تم تغيير كلمة المرور بنجاح');
    }
};

// تهيئة لوحة التحكم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    Admin.init();
});