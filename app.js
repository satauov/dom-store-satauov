import { Store } from './Store.js';

// Инициализация хранилища с тестовыми данными
const store = new Store([
  { name: 'Ноутбук', price: 450000, qty: 1 },
  { name: 'Мышка', price: 15000, qty: 2 }
]);

// Элементы DOM
const form = document.getElementById('add-form');
const listContainer = document.getElementById('store-list');
const totalDisplay = document.getElementById('total-price');

// Функция отрисовки (рендера) интерфейса
function render() {
  listContainer.innerHTML = '';
  
  store.items.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.price} ₸</td>
      <td>
        <input type="number" class="qty-input" data-action="update" data-index="${index}" value="${item.qty}" min="0">
      </td>
      <td>
        <button class="btn btn-delete" data-action="delete" data-index="${index}">Удалить</button>
      </td>
    `;
    listContainer.appendChild(tr);
  });

  // Живой пересчет total без перезагрузки
  totalDisplay.textContent = store.total.toLocaleString();
}

// Валидация формы в DOM (без alert)
function validateInput(name, price, qty) {
  let isValid = true;
  
  const nameErr = document.getElementById('name-error');
  const priceErr = document.getElementById('price-error');
  const qtyErr = document.getElementById('qty-error');
  
  nameErr.textContent = '';
  priceErr.textContent = '';
  qtyErr.textContent = '';

  if (!name.trim()) {
    nameErr.textContent = 'Имя не может быть пустым';
    isValid = false;
  }
  if (price <= 0 || isNaN(price)) {
    priceErr.textContent = 'Цена должна быть больше 0';
    isValid = false;
  }
  if (qty < 0 || isNaN(qty) || qty === '') {
    qtyErr.textContent = 'Количество должно быть числом (>= 0)';
    isValid = false;
  }

  return isValid;
}

// Обработка добавления товара (Событие Submit)
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const nameInput = document.getElementById('item-name');
  const priceInput = document.getElementById('item-price');
  const qtyInput = document.getElementById('item-qty');
  
  const name = nameInput.value;
  const price = Number(priceInput.value);
  const qty = Number(qtyInput.value);

  if (validateInput(name, priceInput.value, qtyInput.value)) {
    store.add({ name, price, qty });
    form.reset();
    render();
  }
});

// ДЕЛЕГИРОВАНИЕ СОБЫТИЙ: Один слушатель на список для update и remove
listContainer.addEventListener('click', (e) => {
  // Обработка удаления
  if (e.target.dataset.action === 'delete') {
    const index = Number(e.target.dataset.index);
    store.remove(index);
    render();
  }
});

listContainer.addEventListener('input', (e) => {
  // Обработка обновления количества (update)
  if (e.target.dataset.action === 'update') {
    const index = Number(e.target.dataset.index);
    const newQty = Number(e.target.value);
    
    if (newQty >= 0) {
      store.updateQty(index, newQty);
      // Обновляем только total, чтобы не сбивать фокус ввода
      totalDisplay.textContent = store.total.toLocaleString();
    }
  }
});

// Первичная отрисовка
render();
