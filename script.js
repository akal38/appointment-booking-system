// بيانات التطبيق
const App = {
    // تهيئة التطبيق
    init: function() {
        this.setMinDate();
        this.bindEvents();
    },
    
    // تعيين الحد الأدنى للتاريخ (اليوم) لمنع اختيار تواريخ سابقة
    setMinDate: function() {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1;
        let dd = today.getDate();
        
        if (mm < 10) mm = '0' + mm;
        if (dd < 10) dd = '0' + dd;
        
        const minDate = `${yyyy}-${mm}-${dd}`;
        document.getElementById('date').setAttribute('min', minDate);
    },
    
    // ربط الأحداث
    bindEvents: function() {
        // حدث إرسال نموذج الحجز
        document.getElementById('booking-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBooking();
        });
        
        // إغلاق نافذة التنبيه
        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('alert-modal').style.display = 'none';
        });
        
        // إغلاق النافذة عند النقر خارجها
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('alert-modal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    },
    
    // معالجة عملية الحجز
    handleBooking: function() {
        // جمع بيانات النموذج
        const booking = {
            id: Date.now(), // استخدام الطابع الزمني كمعرف فريد
            fullname: document.getElementById('fullname').value,
            phone: document.getElementById('phone').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            service: document.getElementById('service').value
        };
        
        // التحقق من صحة البيانات
        if (!this.validateBooking(booking)) {
            return;
        }
        
        // حفظ الحجز
        this.saveBooking(booking);
        
        // إظهار رسالة النجاح
        this.showAlert('تم الحجز بنجاح! شكراً لاختيارك خدماتنا.');
        
        // إعادة تعيين النموذج
        document.getElementById('booking-form').reset();
    },
    
    // التحقق من صحة بيانات الحجز
    validateBooking: function(booking) {
        if (!booking.fullname.trim()) {
            this.showAlert('يرجى إدخال الاسم الكامل');
            return false;
        }
        
        if (!booking.phone.trim() || booking.phone.length < 10) {
            this.showAlert('يرجى إدخال رقم هاتف صحيح');
            return false;
        }
        
        if (!booking.date) {
            this.showAlert('يرجى اختيار التاريخ');
            return false;
        }
        
        if (!booking.time) {
            this.showAlert('يرجى اختيار الوقت');
            return false;
        }
        
        if (!booking.service) {
            this.showAlert('يرجى اختيار الخدمة');
            return false;
        }
        
        return true;
    },
    
    // حفظ الحجز في localStorage
    saveBooking: function(booking) {
        // جلب الحجوزات الحالية من localStorage
        let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        
        // إضافة الحجز الجديد
        bookings.push(booking);
        
        // حفظ الحجوزات المحدثة
        localStorage.setItem('bookings', JSON.stringify(bookings));
    },
    
    // إظهار رسالة تنبيه
    showAlert: function(message) {
        document.getElementById('alert-message').textContent = message;
        document.getElementById('alert-modal').style.display = 'block';
    }
};

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});