
const form = document.getElementById("checkout-form");
const message = document.getElementById("form-message");

// Получаем элементы формы
const firstname = document.getElementById("firstname");
const lastname = document.getElementById("lastname");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const city = document.getElementById("city");
const postcode = document.getElementById("postcode");
const address = document.getElementById("address");
const deliveryDate = document.getElementById("delivery-date");
const deliveryTime = document.getElementById("delivery-time");
const comment = document.getElementById("comment");
const promo = document.getElementById("promo");
const agreement = document.getElementById("agreement");

// Устанавливаем минимальную дату доставки — сегодня
const today = new Date();
const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

deliveryDate.min = localToday;


// Функция отображения ошибки
function showError(input, text) {
    input.classList.add("invalid");

    const error = document.createElement("span");
    error.className = "error-message";
    error.textContent = text;

    const field = input.closest(".field");

    if (field) {
        field.appendChild(error);
    }
}


// Удаление предыдущих ошибок
function clearErrors() {
    document.querySelectorAll(".invalid").forEach(element => {
        element.classList.remove("invalid");
    });

    document.querySelectorAll(".error-message").forEach(element => {
        element.remove();
    });

    message.innerHTML = "";
}


// Проверка имени и фамилии
function checkName(input, fieldName) {
    const value = input.value.trim();

    if (value === "") {
        showError(input, `Введите ${fieldName}.`);
        return false;
    }

    const namePattern = /^[А-Яа-яЁёA-Za-z\s-]{2,40}$/;

    if (!namePattern.test(value)) {
        showError(input, `${fieldName} должно содержать от 2 до 40 букв.`);
        return false;
    }

    return true;
}


// Проверка телефона
function checkPhone() {
    const value = phone.value.trim();
    const digits = value.replace(/\D/g, "");

    if (value === "") {
        showError(phone, "Введите номер телефона.");
        return false;
    }

    if (!/^[+\d\s()-]+$/.test(value) ||
        digits.length < 10 ||
        digits.length > 15) {
        showError(phone, "Введите корректный номер телефона.");
        return false;
    }

    return true;
}


// Проверка электронной почты
function checkEmail() {
    const value = email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (value === "") {
        showError(email, "Введите электронную почту.");
        return false;
    }

    if (!emailPattern.test(value)) {
        showError(email, "Введите корректный адрес электронной почты.");
        return false;
    }

    return true;
}


// Проверка города
function checkCity() {
    if (city.value === "") {
        showError(city, "Выберите город.");
        return false;
    }

    return true;
}


// Проверка почтового индекса
function checkPostcode() {
    const value = postcode.value.trim();

    if (value === "") {
        showError(postcode, "Введите почтовый индекс.");
        return false;
    }

    if (!/^\d{6}$/.test(value)) {
        showError(postcode, "Индекс должен состоять ровно из 6 цифр.");
        return false;
    }

    return true;
}


// Проверка адреса
function checkAddress() {
    const value = address.value.trim();

    if (value === "") {
        showError(address, "Введите адрес доставки.");
        return false;
    }

    if (value.length < 5 || value.length > 150) {
        showError(address, "Адрес должен содержать от 5 до 150 символов.");
        return false;
    }

    return true;
}


// Проверка даты доставки
function checkDate() {
    const value = deliveryDate.value;

    if (value === "") {
        showError(deliveryDate, "Выберите дату доставки.");
        return false;
    }

    if (value < localToday) {
        showError(deliveryDate, "Дата доставки не может быть в прошлом.");
        return false;
    }

    return true;
}


// Проверка способа оплаты
function checkPayment() {
    const payment = document.querySelector(
        'input[name="payment"]:checked'
    );

    if (!payment) {
        const error = document.createElement("span");
        error.className = "error-message";
        error.textContent = "Выберите способ оплаты.";

        document.querySelector(".payment-options").appendChild(error);

        return false;
    }

    return true;
}


// Проверка согласия
function checkAgreement() {
    if (!agreement.checked) {
        const error = document.createElement("span");
        error.className = "error-message";
        error.textContent = "Необходимо подтвердить согласие.";

        document.querySelector(".agreement").appendChild(error);

        return false;
    }

    return true;
}


// Получение выбранного способа оплаты
function getPayment() {
    const payment = document.querySelector(
        'input[name="payment"]:checked'
    );

    return payment ? payment.value : "";
}


// Отправка формы
form.addEventListener("submit", function(event) {
    event.preventDefault();

    clearErrors();

    // Проверяем все обязательные поля
    const valid =
        checkName(firstname, "имя") &
        checkName(lastname, "фамилию") &
        checkPhone() &
        checkEmail() &
        checkCity() &
        checkPostcode() &
        checkAddress() &
        checkDate() &
        checkPayment() &
        checkAgreement();

    if (!valid) {
        message.textContent = "";
        return;
    }

    // Собираем данные заказа
    const data = {
        firstname: firstname.value.trim(),
        lastname: lastname.value.trim(),
        phone: phone.value.trim(),
        email: email.value.trim(),
        city: city.value,
        postcode: postcode.value.trim(),
        address: address.value.trim(),
        deliveryDate: deliveryDate.value,
        deliveryTime: deliveryTime.value || "Не выбрано",
        payment: getPayment(),
        comment: comment.value.trim() || "Нет комментария",
        promo: promo.value.trim() || "Не использован",
        quantityTshirt: document.querySelector(
            '[name="quantity-tshirt"]'
        ).value,
        quantityJeans: document.querySelector(
            '[name="quantity-jeans"]'
        ).value
    };

    // Создаём блок успешного результата
    const result = document.createElement("div");
    result.className = "form-result";

    const heading = document.createElement("h2");
    heading.textContent = "Заказ успешно оформлен!";

    result.appendChild(heading);

    // Выводим данные безопасным способом через textContent
    const rows = [
        ["Имя:", data.firstname],
        ["Фамилия:", data.lastname],
        ["Телефон:", data.phone],
        ["Email:", data.email],
        ["Город:", data.city],
        ["Почтовый индекс:", data.postcode],
        ["Адрес:", data.address],
        ["Дата доставки:", data.deliveryDate],
        ["Время доставки:", data.deliveryTime],
        ["Способ оплаты:", data.payment],
        ["Комментарий:", data.comment],
        ["Промокод:", data.promo],
        ["Количество футболок:", data.quantityTshirt],
        ["Количество джинсов:", data.quantityJeans]
    ];

    rows.forEach(([label, value]) => {
        const paragraph = document.createElement("p");
        const strong = document.createElement("strong");

        strong.textContent = label + " ";
        paragraph.appendChild(strong);
        paragraph.appendChild(document.createTextNode(value));

        result.appendChild(paragraph);
    });

    // Показываем результат
    message.appendChild(result);

    // Очищаем поля формы после успешной отправки
    form.reset();

    // Возвращаем минимальную дату после очистки
    deliveryDate.min = localToday;

    // Прокручиваем страницу к результату
    result.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});
