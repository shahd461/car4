/* myFunctions.js - الدوال والتحقق من صحة المدخلات والتفاعل */

// 1. إظهار/إخفاء التفاصيل باستخدام JQuery
$(document).ready(function() {
    $(".toggle-details").change(function() {
        var carId = $(this).attr("data-car-id");
        if ($(this).is(":checked")) {
            $("#details-" + carId).show();
        } else {
            $("#details-" + carId).hide();
        }
    });

    // إظهار نموذج الحجز عند الضغط على زر "متابعة"
    $("#btn-continue").click(function() {
        var selectedCars = $(".select-car:checked");
        if (selectedCars.length === 0) {
            alert("يرجى اختيار سيارة واحدة على الأقل للمتابعة.");
        } else {
            $("#rental-form-section").show();
            $('html, body').animate({
                scrollTop: $("#rental-form-section").offset().top
            }, 500);
        }
    });
});

// 2. التحقق من النماذج وحساب التكلفة والخصم
function validateAndCalculate() {
    var fullName = document.getElementById("fullName").value.trim();
    var nationalId = document.getElementById("nationalId").value.trim();
    var startDateStr = document.getElementById("startDate").value;
    var endDateStr = document.getElementById("endDate").value;
    var mobile = document.getElementById("mobile").value.trim();
    var email = document.getElementById("email").value.trim();

    // التحقق من الاسم الكامل (أحرف هجائية عربية وفراغات فقط)
    var arabicRegex = /^[\u0600-\u06FF\s]+$/;
    if (fullName !== "" && !arabicRegex.test(fullName)) {
        alert("الاسم الكامل يجب أن يحتوي على أحرف هجائية عربية فقط.");
        return false;
    }

    // التحقق من الرقم الوطني (11 خانة إلزامي، أول خانتين بين 01 و 14)
    var nationalIdRegex = /^(0[1-9]|1[0-4])\d{9}$/;
    if (!nationalIdRegex.test(nationalId)) {
        alert("الرقم الوطني إلزامي ويجب أن يتكون من 11 خانة، مع العلم أن أول خانتين ترمزان للمحافظة (01 إلى 14).");
        return false;
    }

    // التحقق من تاريخ البداية والنهاية (إلزامي والتسلسل الزمني)
    if (!startDateStr || !endDateStr) {
        alert("تاريخ بداية وتاريخ نهاية التأجير إلزاميان.");
        return false;
    }

    var startDate = new Date(startDateStr);
    var endDate = new Date(endDateStr);

    if (endDate <= startDate) {
        alert("تاريخ نهاية التأجير يجب أن يكون لاحقاً لتاريخ البداية.");
        return false;
    }

    // التحقق من رقم الموبايل (مطابقة Syriatel أو MTN)
    if (mobile !== "") {
        var mobileRegex = /^09(3[0-9]|8[0-9]|9[0-9]|4[0-9]|5[0-9]|6[0-9])\d{6}$/;
        if (!mobileRegex.test(mobile)) {
            alert("رقم الموبايل غير صحيح. يجب أن يطابق شبكتي Syriatel أو MTN (مثال: 0991234567).");
            return false;
        }
    }

    // التحقق من البريد الإلكتروني (إن وجد)
    if (email !== "") {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("صيغة البريد الإلكتروني غير صحيحة.");
            return false;
        }
    }

    // حساب عدد الأيام والمبالغ المالية
    var timeDiff = endDate.getTime() - startDate.getTime();
    var daysCount = Math.ceil(timeDiff / (1000 * 3600 * 24));

    var totalAmount = 0;
    var selectedCarsSummary = "";

    $(".select-car:checked").each(function() {
        var carModel = $(this).attr("data-model");
        var carPrice = parseFloat($(this).attr("data-price"));
        var carTotal = carPrice * daysCount;
        totalAmount += carTotal;
        selectedCarsSummary += "- " + carModel + " (السعر اليومي: " + carPrice + " ل.س)\n";
    });

    var discount = 0;
    if (daysCount > 10) {
        discount = totalAmount * 0.05; // خصم 5% في حال تجاوزت المدة 10 أيام
    }

    var finalAmount = totalAmount - discount;

    // عرض النتيجة في نافذة alert
    var resultMsg = "=== ملخص طلب الحجز ===\n\n";
    resultMsg += "السيارات المختارة:\n" + selectedCarsSummary + "\n";
    resultMsg += "عدد أيام التأجير لكل سيارة: " + daysCount + " يوم/أيام\n";
    resultMsg += "المبلغ الإجمالي قبل الخصم: " + totalAmount.toLocaleString() + " ل.س\n";
    if (discount > 0) {
        resultMsg += "قيمة الخصم (10% لتجاوز 7 أيام): " + discount.toLocaleString() + " ل.س\n";
    } else {
        resultMsg += "الخصم: 0 ل.س (الخصم يطبق عند إقامة أكثر من 7 أيام)\n";
    }
    resultMsg += "المبلغ النهائي الواجب دفعه: " + finalAmount.toLocaleString() + " ل.س\n\n";
    resultMsg += "شكراً لاستخدامكم موقعنا!";

    alert(resultMsg);
    return false; // لمنع إعادة تحميل الصفحة
}