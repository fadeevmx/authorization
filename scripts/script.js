//помещаем объект в переменную
const CLIENTS_LS_KEY = 'clients'

//создаем обработчик события
window.onload = function () {

    let agreementCheckbox = $("#agreement");
    agreementCheckbox.change(function () {
        if (this.checked) {
            console.log("Согласен");
        } else {
            console.log("Не согласен");
        }
    });

    const fullName = $('#full-name')
    const userName = $('#user-name')
    const email = $('#email')
    const password = $('#password')
    const repeatPassword = $('#confirm-password')
    const formAgree = $('.form-content-agree')
    const modal = $('#modal')
    const okButton = $('#okButton')
    const switchLink = $('#switchLink')
    const signUpButton = $('#sign-up')


    signUpButton.click(function () {
        let hasError = false

        let inputs = [fullName, userName, email, password, repeatPassword];
        for (let input of inputs) {
            input.css({'border-color': '#C6C6C4'});
        }
        formAgree.css('color', '#636363')

        for (let input of inputs) {
            if (!input.val()) {
                input.next().show();
                input.css({'border-color': 'red'});
                hasError = true;
            } else {
                input.next().hide();
                input.css({'border-color': '#C6C6C4'});
            }
        }
        if (fullName.val() && !/^[a-zA-Z ]+$/.test(fullName.val())) {
            fullName.next().text('Имя может содержать только буквы и пробел').show();
            fullName.css({'border-color': 'red'});
            hasError = true;
        }
        if (userName.val() && !/^[\w-]+$/.test(userName.val())) {
            userName.next().text('Никнейм может содержать только буквы, цифры, символ подчеркивания и тире').show();
            userName.css({'border-color': 'red'});
            hasError = true;
        }
        if (email.val() && !/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email.val())) {
            email.next().text('Некорректный E-mail').show();
            email.css({'border-color': 'red'});
            hasError = true;
        }
        if (password.val() && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%^&*()])[a-zA-Z\d@#$!%^&*()]{8,}/.test(password.val())) {
            password.next().text('Минимум 8 символов, включая одну заглавную букву, цифру и спецсимвол').show();
            password.css({'border-color': 'red'});
            hasError = true;
        }
        if (password.val() !== repeatPassword.val()) {
            repeatPassword.next().text('Пароли не совпадают').show();
            repeatPassword.css({'border-color': 'red'});
            hasError = true;
        }
        if (!agreementCheckbox.is(':checked')) {
            formAgree.css({'color': 'red'})
            hasError = true;
        }

        function showModal() {
            modal.show();
        }

        if (!hasError) {
            showModal();
        }

        $('.modal-content-close').click(function () {
            modal.hide()
            for (let input of inputs) {
                input.val('')
            }
            agreementCheckbox.prop('checked', false)
        })

        let users = {
            fullname: fullName.val(),
            username: userName.val(),
            email: email.val(),
            password: password.val()
        }

        const clients = JSON.parse(localStorage.getItem(CLIENTS_LS_KEY)) || [];

        // Добавить объект с данными пользователя в массив
        clients.push(users);

        // Сохранить обновленный массив в Local Storage
        localStorage.setItem(CLIENTS_LS_KEY, JSON.stringify(clients));
    })


    $(okButton).add(switchLink).click(function (e) {
        e.preventDefault();

        function hideModal() {
            modal.hide();
        }

        let fieldsToRemove = fullName.parent().add(email.parent().add(repeatPassword.parent().add(agreementCheckbox.parent())));
        userName.val('');
        password.val('');
        agreementCheckbox.prop('checked', false);
        $('h1').text('Log in to the system'); // изменяем текст заголовка
        fieldsToRemove.remove(); // удаляем блоки с полями Full Name, E-mail, Repeat Password, чекбоксом
        signUpButton.text('Sign In'); // изменяем текст кнопки
        switchLink.text('Registration'); // изменяем текст кнопки
        let inputs = [fullName, userName, email, password, repeatPassword];
        for (let input of inputs) {
            input.css({'border-color': '#C6C6C4'});
            $('.error-input').hide()
        }

        hideModal();

        switchLink.off('click').on('click', function (e) {
            e.preventDefault();
            location.reload();
        })

        signUpButton.off('click').on('click', function (e) {
            if (e.target.textContent === 'Sign In') {
                if (!userName.val()) {
                    $('.error-input').hide();
                    $('.error-input-user-name').show();
                } else {
                    $('.error-input').hide();
                    $('.error-input-user-name').hide();
                    userName.css({'border-color': '#C6C6C4'});
                }
                if (!password.val()) {
                    $('.error-input').hide();
                    $('.error-input-password').show();
                } else {
                    $('.error-input-password').hide();
                    password.css({'border-color': '#C6C6C4'});
                }

                if (userName.val() && password.val()) {
                    const clients = JSON.parse(localStorage.getItem(CLIENTS_LS_KEY)) || []; //добавляем пустой массив на случай, если нечего получать из localstorage
                    const user = clients.find(client => client.username === userName.val());

                    if (!user) {
                        $('.not-username').show();
                        userName.css({'border-color': 'red'});
                    } else {
                        $('.not-username').hide();
                        if (user.password !== password.val()) {
                            $('.not-password').show();
                            password.css({'border-color': 'red'})
                        } else {
                            $('.not-password').hide();
                            $('h1').text('Welcome ' + user.fullname + '!');
                            signUpButton.text('Exit');
                            signUpButton.off('click').on('click', function (e){
                                if(e.target.textContent === 'Exit'){
                                    location.reload();
                                }
                            })
                            $('.form-content-text').remove()
                            $('.username-label').remove()
                            $('.password-label').remove()
                            $('#switchLink').remove()
                        }
                    }
                }
            }
        })
    })
};