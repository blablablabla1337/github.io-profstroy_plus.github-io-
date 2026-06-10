function initMap() {
    var miassCoordinates = [55.081623694489295, 60.0942629];

    var myMap = new ymaps.Map('yandex-map', {
        center: miassCoordinates,
        zoom: 16,
        controls: ['zoomControl', 'fullscreenControl']
    }, {
        searchControlProvider: 'yandex#search'
    });

    var myPlacemark = new ymaps.Placemark(miassCoordinates, {
        hintContent: 'Мы здесь: Готвальда, 28, Миасс',
        balloonContent: 'Наш офис. Профстрой+'
    }, {
        preset: 'islands#icon',
        iconColor: '#FFA929'
    });

    myMap.geoObjects.add(myPlacemark);
}

if (typeof ymaps !== 'undefined') {
    ymaps.ready(initMap);
} else {
    window.addEventListener('load', function () {
        if (typeof ymaps !== 'undefined') {
            ymaps.ready(initMap);
        }
    });
}

const modal = document.getElementById("myModal");
const btn = document.querySelector(".hero-section .button");
const span = document.querySelector(".modal-close");

btn.onclick = function (event) {
    event.preventDefault();
    modal.style.display = "block";
}

span.onclick = function () {
    modal.style.display = "none";
}


window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


const alertModal = document.getElementById("customAlertModal");
const alertMessageElement = document.getElementById("alertMessage");
const alertCloseButton = document.getElementById("alertClose");

// Обработчик закрытия окна по клику
alertCloseButton.onclick = function() {
    alertModal.style.display = "none";
}

// Обработчик закрытия при клике вне окна
window.onclick = function(event) {
    if (event.target == alertModal) {
        alertModal.style.display = "none";
    }
}

const form = document.querySelector(".modal-form");
form.onsubmit = function (event) {
    event.preventDefault();

    const formData = {
        name: document.querySelector('.modal-form input[type="text"]').value,
        phone: document.querySelector('.modal-form input[type="tel"]').value,
        service: document.querySelector('.service-select').value,
        message: document.querySelector('.modal-form textarea').value
    };

    console.log('Данные формы:', formData);

    // Показываем кастомное модальное окно с сообщением
    alertMessageElement.textContent = `Мы свяжемся с вами в ближайшее время по номеру ${formData.phone}`;
    alertModal.style.display = "flex";

    // Можно скрывать исходное окно, если оно есть, или оставить так
    // Например, если вы хотите скрывать форму после отправки:
    // document.querySelector('.your-form-container').style.display = 'none';

    // Сброс формы
    form.reset();
}


function formatPhoneInput(e) {
    let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
    e.target.value = '+7' + (x[2] ? ' (' + x[2] : '') + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
}

const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(input => {
    input.addEventListener('input', formatPhoneInput);
});


function initPhoneFormatting() {
    const newPhoneInputs = document.querySelectorAll('input[type="tel"]');
    newPhoneInputs.forEach(input => {
        input.removeEventListener('input', formatPhoneInput);
        input.addEventListener('input', formatPhoneInput);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const serviceButtons = document.querySelectorAll('.service-card__button[data-service]');
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(initPhoneFormatting, 100);
        });
    });
    
});


document.addEventListener('DOMContentLoaded', function () {

    const serviceButtons = document.querySelectorAll('.service-card__button[data-service]');

    serviceButtons.forEach(button => {
        button.addEventListener('click', function () {
            const serviceId = this.getAttribute('data-service');
            const modal = document.getElementById(`${serviceId}-modal`);

            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
            
        });
    });


    const closeButtons = document.querySelectorAll('.service-modal .modal-close');

    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modal = this.closest('.service-modal');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });


    window.addEventListener('click', function (e) {
        document.querySelectorAll('.service-modal').forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });


    const serviceForms = document.querySelectorAll('.service-request-form');

    serviceForms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const service = this.getAttribute('data-service');


            const calculatedPrice = calculateServicePrice(service, formData);


            showCalculationResult(service, calculatedPrice, formData);
        });
    });


    const priceInputs = document.querySelectorAll('.service-request-form input, .service-request-form select');

    priceInputs.forEach(input => {
        input.addEventListener('change', function () {
            const form = this.closest('.service-request-form');
            if (form) {
                updatePricePreview(form);
            }
        });
    });
});


function calculateServicePrice(service, formData) {
    let basePrice = 0;
    let additionalCost = 0;


    const basePrices = {
        'balcony-renovation': 18900,
        'balcony-glazing': 12500,
        'apartment-renovation': 4500,
        'balcony-insulation': 9700,
        'facade-renovation': 1800,
        'stretch-ceilings': 550
    };

    basePrice = basePrices[service] || 0;


    switch (service) {
        case 'balcony-renovation':
            const area = parseFloat(formData.get('area')) || 2.5;
            const glazingType = formData.get('glazing_type');
            const material = formData.get('material');

            if (area > 2.5) {
                additionalCost += (area - 2.5) * 5000;
            }

            if (glazingType === 'warm') {
                additionalCost += 15000;
            } else if (glazingType === 'cold') {
                additionalCost += 8000;
            }


            const materialPrices = {
                'pvc': 0,
                'wood': 5000,
                'drywall': 3000,
                'mdf': 7000
            };
            additionalCost += materialPrices[material] || 0;


            if (formData.get('warm_floor')) additionalCost += 5000;
            if (formData.get('additional_lighting')) additionalCost += 2000;
            if (formData.get('shelves')) additionalCost += 3000;
            break;

        case 'apartment-renovation':
            const apartmentArea = parseFloat(formData.get('area')) || 50;
            basePrice = basePrice * apartmentArea;

            break;


    }

    return Math.round(basePrice + additionalCost);
}


document.addEventListener('DOMContentLoaded', function() {

    const navLinks = document.querySelectorAll('.header a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {

                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    const dropdownServiceLinks = document.querySelectorAll('.dropdown-menu a[data-service]');

    dropdownServiceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const serviceId = this.getAttribute('data-service');
            const modal = document.getElementById(`${serviceId}-modal`);
            
            if (modal) {
                document.querySelectorAll('.service-modal').forEach(m => {
                    m.style.display = 'none';
                });

                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                
                const servicesSection = document.getElementById('services');
                if (servicesSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = servicesSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

});

function updatePricePreview(form) {
    const service = form.getAttribute('data-service');
    const formData = new FormData(form);
    const calculatedPrice = calculateServicePrice(service, formData);



    console.log('Предварительная стоимость:', calculatedPrice);
}


function showCalculationResult(service, price, formData) {

    const resultModal = document.createElement('div');
    resultModal.className = 'service-modal';
    resultModal.style.display = 'block';

    const serviceNames = {
        'balcony-renovation': 'Отделка балкона',
        'balcony-glazing': 'Остекление балкона',
        'apartment-renovation': 'Ремонт квартиры',
        'balcony-insulation': 'Утепление балкона',
        'facade-renovation': 'Отделка фасада',
        'stretch-ceilings': 'Натяжные потолки'
    };

    resultModal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <div class="service-modal-header">
                <h2>Расчет стоимости</h2>
                <div class="service-modal-price">
                    <span class="price-amount">${price.toLocaleString()} ₽</span>
                    <span class="price-note">${serviceNames[service]}</span>
                </div>
            </div>
            <div class="service-modal-body">
                <p>Это предварительный расчет. Для получения точной стоимости наш специалист свяжется с вами для уточнения деталей.</p>
                
                <form class="contact-form">
                    <input type="hidden" name="service" value="${service}">
                    <input type="hidden" name="calculated_price" value="${price}">
                    
                    <div class="form-row">
                        <div class="form-group">
                            <input type="text" name="name" placeholder="Ваше имя" value="${formData.get('name') || ''}" required>
                        </div>
                        <div class="form-group">
                            <input type="tel" name="phone" placeholder="Ваш телефон" value="${formData.get('phone') || ''}" required>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="submit-button">Получить точный расчет</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(resultModal);
    document.body.style.overflow = 'hidden';


    resultModal.querySelector('.modal-close').addEventListener('click', function () {
        resultModal.remove();
        document.body.style.overflow = 'auto';
    });


    resultModal.querySelector('.contact-form').addEventListener('submit', function (e) {
        e.preventDefault();

        alert('Спасибо! Мы свяжемся с вами в течение 15 минут для уточнения деталей.');
        resultModal.remove();
        document.body.style.overflow = 'auto';


        document.querySelectorAll('.service-modal').forEach(modal => {
            modal.style.display = 'none';
        });
    });

    resultModal.addEventListener('click', function (e) {
        if (e.target === resultModal) {
            resultModal.remove();
            document.body.style.overflow = 'auto';
        }
    });
} 

const dropdownServiceLinks = document.querySelectorAll('.dropdown-menu a[data-service]');

dropdownServiceLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const serviceId = this.getAttribute('data-service');
        const modal = document.getElementById(`${serviceId}-modal`);
        
        if (modal) {

            document.querySelectorAll('.service-modal').forEach(m => {
                m.style.display = 'none';
            });

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            document.getElementById('services').scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Функция для модальных окон проектов
document.addEventListener('DOMContentLoaded', function() {
    // Открытие модальных окон при клике на карточки проектов
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            document.getElementById(`project-modal${index + 1}`).style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    // Закрытие модальных окон
    document.querySelectorAll('.project-modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-close');
            document.getElementById(modalId).style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });

    // Закрытие при клике вне модального окна
    window.addEventListener('click', (e) => {
        document.querySelectorAll('.project-modal').forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.project-modal').forEach(modal => {
                modal.style.display = 'none';
            });
            document.body.style.overflow = 'auto';
        }
    });
});


/* ====== Регистрация через Supabase ====== */

(function() {
  // Удобные ссылки на элементы
  const registerModal = document.getElementById('registerModal');
  const registerForm = document.getElementById('registerForm');
  const registerClose = document.querySelector('.register-modal-close');

  // Функция для форматирования номера телефона
  function initPhoneFormatting() {
    const phoneInput = document.getElementById('reg_phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        let formatted = '';
        if (value.length > 0) formatted = '+7';
        if (value.length > 1) formatted += ' (' + value.slice(1, 4);
        if (value.length > 4) formatted += ') ' + value.slice(4, 7);
        if (value.length > 7) formatted += '-' + value.slice(7, 9);
        if (value.length > 9) formatted += '-' + value.slice(9, 11);
        e.target.value = formatted;
      });
    }
  }

  // Кнопка открытия регистрации
  document.querySelectorAll('.open-register, #openRegisterBtn').forEach(el => {
    el && el.addEventListener('click', function(e) {
      e && e.preventDefault();
      if (registerModal) {
        registerModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        initPhoneFormatting();
      }
    });
  });

  // Закрытие крестиком
  registerClose && registerClose.addEventListener('click', function() {
    registerModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });

  // Закрытие по клику вне окна
  window.addEventListener('click', function(e) {
    if (e.target === registerModal) {
      registerModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  // Валидация телефона
  function sanitizeDigits(str) {
    return (str || '').replace(/\D/g, '');
  }

  // ✅ НОВАЯ ФУНКЦИЯ РЕГИСТРАЦИИ ЧЕРЕЗ SUPABASE
  async function registerUser(payload) {
    const { name, phone } = payload;
    const digits = sanitizeDigits(phone);
    
    // Создаём email из телефона (Supabase требует email)
    const email = `${digits}@user.com`;
    const password = digits.slice(-6); // Пароль = последние 6 цифр телефона
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: name,
            phone: phone
          }
        }
      });
      
      if (error) {
        console.error('Ошибка Supabase:', error);
        // Если пользователь уже существует, пробуем войти
        if (error.message.includes('already registered')) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
          });
          if (!signInError && signInData.user) {
            // Сохраняем в БД, если ещё нет
            const { data: existingUser } = await supabase
              .from('users')
              .select('id')
              .eq('email', email)
              .single();
            
            if (!existingUser) {
              await supabase.from('users').insert([{
                id: signInData.user.id,
                email: email,
                is_admin: false
              }]);
            }
            
            return { source: 'supabase', data: { user: signInData.user, name: name, phone: phone, email: email } };
          }
        }
        return null;
      }
      
      if (data.user) {
        // Сохраняем в таблицу users
        await supabase.from('users').insert([{
          id: data.user.id,
          email: email,
          is_admin: false
        }]);
        
        return { source: 'supabase', data: { user: data.user, name: name, phone: phone, email: email } };
      }
      
      return null;
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      return null;
    }
  }

  // Обновление UI пользователя
  function updateUserUI(user) {
    let userBlock = document.getElementById('userBlock');
    if (!userBlock) {
      const headerContainer = document.querySelector('.header .header-container') || document.querySelector('.header');
      if (headerContainer) {
        userBlock = document.createElement('div');
        userBlock.id = 'userBlock';
        userBlock.style.marginLeft = '20px';
        userBlock.style.display = 'flex';
        userBlock.style.alignItems = 'center';
        headerContainer.appendChild(userBlock);
      }
    }

    if (userBlock) {
      userBlock.innerHTML = `
        <span style="display: inline-flex; align-items: center; margin-right: 12px;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#FFA929" style="vertical-align: middle; margin-right: 4px;">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12ZM12 14C15.3137 14 18 16.6863 18 20V21C18 21.5523 17.5523 22 17 22H7C6.44772 22 6 21.5523 6 21V20C6 16.6863 8.68629 14 12 14Z"/>
          </svg>
          ${escapeHtml(user.name)}
        </span>
        <button id="logoutBtn" style="padding:6px 10px;border-radius:6px;border:1px solid #ddd;background:#ba4646; color:white;cursor:pointer;">Выйти</button>
      `;
      const logoutBtn = document.getElementById('logoutBtn');
      logoutBtn && logoutBtn.addEventListener('click', async function() {
        await supabase.auth.signOut();
        localStorage.removeItem('profstroy_user');
        if (userBlock) userBlock.remove();
        renderAuthButton();
        location.reload(); // Обновляем страницу для сброса состояния
      });
    }
  }

  // Защита от XSS
  function escapeHtml(text) {
    return text ? text.replace(/[&<>"'`=\/]/g, function(s) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;'})[s];
    }) : '';
  }

  // Проверка и отображение кнопки входа / регистрации
  function renderAuthButton() {
    // Проверяем сессию Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Уже авторизован через Supabase
        const openBtn = document.getElementById('openRegisterBtn');
        if (openBtn) openBtn.remove();
        
        // Проверяем, есть ли запись в localStorage для UI
        const raw = localStorage.getItem('profstroy_user');
        if (!raw) {
          // Восстанавливаем UI из Supabase
          const userName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Пользователь';
          const userPhone = session.user.user_metadata?.phone || '';
          const userData = { name: userName, phone: userPhone, email: session.user.email };
          localStorage.setItem('profstroy_user', JSON.stringify(userData));
          updateUserUI(userData);
        }
      } else {
        // Нет сессии
        const openBtn = document.getElementById('openRegisterBtn');
        const userBlock = document.getElementById('userBlock');
        
        if (userBlock) userBlock.remove();
        
        if (!openBtn && !document.getElementById('userBlock')) {
          const headerContainer = document.querySelector('.header .header-container') || document.querySelector('.header');
          if (headerContainer) {
            const btn = document.createElement('button');
            btn.id = 'openRegisterBtn';
            btn.className = 'button-auth';
            btn.style.marginLeft = '12px';
            btn.textContent = 'Войти / Регистрация';
            headerContainer.appendChild(btn);
            btn.addEventListener('click', function() {
              registerModal.style.display = 'flex';
              document.body.style.overflow = 'hidden';
              initPhoneFormatting();
            });
          }
        }
      }
    });
  }

  // Обработка формы регистрации
  registerForm && registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = (document.getElementById('reg_name').value || '').trim();
    const phoneRaw = (document.getElementById('reg_phone').value || '').trim();
    const digits = sanitizeDigits(phoneRaw);

    if (!name) {
      alert('Пожалуйста, укажите имя.');
      return;
    }
    if (digits.length < 11) {
      alert('Введите корректный телефон (пример: +7 (999) 123-45-67).');
      return;
    }

    const payload = { name: name, phone: phoneRaw };

    const submitBtn = registerForm.querySelector('button[type="submit"]');
    const prevText = submitBtn ? submitBtn.textContent : null;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Регистрация...';
    }

    const result = await registerUser(payload);

    if (result) {
      const userData = {
        name: result.data.name,
        phone: result.data.phone,
        email: result.data.email,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('profstroy_user', JSON.stringify(userData));
      updateUserUI(userData);
      
      alert(`Регистрация успешна! Ваш пароль: ${result.data.email.split('@')[0].slice(-6)} (сохраните его для входа)`);
      
      registerModal.style.display = 'none';
      document.body.style.overflow = 'auto';
      renderAuthButton();
    } else {
      alert('Не удалось зарегистрироваться. Возможно, этот телефон уже использован.');
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = prevText || 'Зарегистрироваться';
    }
  });

  // Проверка сессии при загрузке
  document.addEventListener('DOMContentLoaded', function() {
    renderAuthButton();
  });

})();


/* ====== Регистрация с хешированием пароля ====== */

(function() {
  const registerModal = document.getElementById('registerModal');
  const registerForm = document.getElementById('registerForm');
  const registerClose = document.querySelector('.register-modal-close');

  // ===== НОВЫЕ ФУНКЦИИ =====
  function registerUserWithHash(name, phone, password) {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.phone === phone)) {
      alert('Этот номер уже зарегистрирован');
      return false;
    }
    
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    const newUser = {
      id: Date.now(),
      name: name,
      phone: phone,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    localStorage.setItem('currentUser', JSON.stringify({
      id: newUser.id,
      name: newUser.name,
      phone: newUser.phone,
      role: newUser.role
    }));
    
    return true;
  }

  function loginUserWithHash(phone, password) {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.phone === phone);
    
    if (!user) {
      alert('Пользователь не найден');
      return false;
    }
    
    if (!bcrypt.compareSync(password, user.password)) {
      alert('Неверный пароль');
      return false;
    }
    
    localStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role
    }));
    
    return true;
  }

  // Создание админа
  window.createAdmin = function() {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.role === 'admin')) {
      console.log('Админ уже существует');
      return;
    }
    users.push({
      id: Date.now(),
      name: 'Администратор',
      phone: '+7 (999) 999-99-99',
      password: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Админ создан! Телефон: +7 (999) 999-99-99, Пароль: admin123');
  };

  // Открытие модалки регистрации
  function openRegisterModal() {
    if (registerModal) {
      registerModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  // Кнопка "Войти / Регистрация" открывает модалку
  document.querySelectorAll('.open-register, #openRegisterBtn').forEach(el => {
    el && el.addEventListener('click', function(e) {
      e && e.preventDefault();
      openRegisterModal();
    });
  });

  // Закрытие модалки
  registerClose && registerClose.addEventListener('click', function() {
    registerModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });

  window.addEventListener('click', function(e) {
    if (e.target === registerModal) {
      registerModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  // Обработка формы регистрации
  registerForm && registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('reg_name')?.value.trim();
    const phone = document.getElementById('reg_phone')?.value.trim();
    const password = document.getElementById('reg_password')?.value;
    
    if (!name) {
      alert('Введите имя');
      return;
    }
    
    const digits = phone ? phone.replace(/\D/g, '') : '';
    if (digits.length < 11) {
      alert('Введите корректный телефон (11 цифр)');
      return;
    }
    
    if (!password || password.length < 4) {
      alert('Введите пароль (минимум 4 символа)');
      return;
    }
    
    if (registerUserWithHash(name, phone, password)) {
      alert('Регистрация успешна!');
      registerModal.style.display = 'none';
      document.body.style.overflow = 'auto';
      updateUIAfterLogin();
    }
  });

  // Обновление UI после входа
  function updateUIAfterLogin() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    let userBlock = document.getElementById('userBlock');
    if (!userBlock) {
      const headerContainer = document.querySelector('.header .header-container');
      if (headerContainer) {
        userBlock = document.createElement('div');
        userBlock.id = 'userBlock';
        userBlock.style.marginLeft = '20px';
        headerContainer.appendChild(userBlock);
      }
    }
    
    if (userBlock) {
      userBlock.innerHTML = `
        <span style="margin-right:10px;">👤 ${currentUser.name} ${currentUser.role === 'admin' ? '(Админ)' : ''}</span>
        <button id="logoutBtn" style="padding:5px 10px;background:#ba4646;color:white;border:none;border-radius:5px;cursor:pointer;">Выйти</button>
      `;
      document.getElementById('logoutBtn')?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        location.reload();
      });
    }
    
    // Скрываем кнопку входа
    const openBtn = document.getElementById('openRegisterBtn');
    if (openBtn) openBtn.style.display = 'none';
  }
  
  // Показываем кнопку входа, если нет пользователя
  function renderAuthButton() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      updateUIAfterLogin();
      return;
    }
    
    // Если кнопки нет — создаем
    if (!document.getElementById('openRegisterBtn')) {
      const headerContainer = document.querySelector('.header .header-container');
      if (headerContainer) {
        const btn = document.createElement('button');
        btn.id = 'openRegisterBtn';
        btn.className = 'button-auth';
        btn.textContent = 'Войти / Регистрация';
        btn.style.marginLeft = '12px';
        btn.onclick = openRegisterModal;
        headerContainer.appendChild(btn);
      }
    }
  }
  
  // Запускаем при загрузке
  renderAuthButton();
})();

// ===== Универсальное гамбургер меню для всех страниц =====
document.addEventListener('DOMContentLoaded', function() {
  // Инициализация мобильного меню
  const burgerToggle = document.getElementById('burger-toggle');
  const menuOverlay = document.querySelector('.menu-overlay');
  
  // Определяем текущую страницу для подсветки активного пункта
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Подсвечиваем активный пункт меню
  setTimeout(() => {
    const menuLinks = document.querySelectorAll('.mobile-nav-menu a[href]');
    menuLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || 
          (currentPage === 'index.html' && href.includes('index.html')) ||
          (currentPage.includes('projects') && href.includes('projects')) ||
          (currentPage.includes('about') && href.includes('about')) ||
          (currentPage.includes('contacts') && href.includes('contacts'))) {
        link.classList.add('active');
      }
    });
  }, 100);
  
  // Закрытие меню при клике на оверлей
  if (menuOverlay) {
    menuOverlay.addEventListener('click', function() {
      burgerToggle.checked = false;
      document.body.style.overflow = 'auto';
    });
  }
  
  // Закрытие меню при клике на ссылку
  const mobileLinks = document.querySelectorAll('.mobile-nav-menu a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Для ссылок с data-service (услуги)
      if (this.hasAttribute('data-service')) {
        e.preventDefault();
        const serviceId = this.getAttribute('data-service');
        const modal = document.getElementById(`${serviceId}-modal`);
        
        if (modal) {
          // Закрываем меню
          burgerToggle.checked = false;
          document.body.style.overflow = 'auto';
          
          // Открываем модальное окно услуги
          setTimeout(() => {
            document.querySelectorAll('.service-modal').forEach(m => {
              m.style.display = 'none';
            });
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
          }, 300);
          
          // Прокручиваем к услугам
          const servicesSection = document.getElementById('services');
          if (servicesSection) {
            setTimeout(() => {
              servicesSection.scrollIntoView({
                behavior: 'smooth'
              });
            }, 350);
          }
        }
      } 
      // Для якорных ссылок на текущей странице
      else if (this.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Закрываем меню
          burgerToggle.checked = false;
          document.body.style.overflow = 'auto';
          
          // Прокручиваем к секции
          setTimeout(() => {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }, 300);
        }
      } 
      // Для внешних ссылок (другие страницы)
      else if (!this.getAttribute('href').startsWith('#')) {
        // Даем время на закрытие меню перед переходом
        e.preventDefault();
        burgerToggle.checked = false;
        document.body.style.overflow = 'auto';
        
        const href = this.getAttribute('href');
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      }
    });
  });
  
  // Обработка dropdown в мобильном меню
  const mobileDropdowns = document.querySelectorAll('.mobile-nav-menu .dropdown-toggle');
  mobileDropdowns.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        const dropdown = this.parentElement;
        const isActive = dropdown.classList.contains('active');
        
        // Закрываем все остальные dropdown
        document.querySelectorAll('.mobile-nav-menu .dropdown').forEach(d => {
          if (d !== dropdown) {
            d.classList.remove('active');
          }
        });
        
        // Переключаем текущий dropdown
        dropdown.classList.toggle('active', !isActive);
      }
    });
  });
  
  // Закрытие dropdown при клике вне их
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.mobile-nav-menu .dropdown') && window.innerWidth <= 768) {
      document.querySelectorAll('.mobile-nav-menu .dropdown').forEach(d => {
        d.classList.remove('active');
      });
    }
  });
  
  // Закрытие меню при нажатии ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && burgerToggle && burgerToggle.checked) {
      burgerToggle.checked = false;
      document.body.style.overflow = 'auto';
    }
  });
  
  // Закрытие меню при изменении размера окна на десктоп
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && burgerToggle && burgerToggle.checked) {
      burgerToggle.checked = false;
      document.body.style.overflow = 'auto';
    }
  });
  
  // Управление overflow body при открытии/закрытии меню
  if (burgerToggle) {
    burgerToggle.addEventListener('change', function() {
      if (this.checked) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    });
  }
});

