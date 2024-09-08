// script.js

const addButton = document.getElementById('add-btn');
const viewButton = document.getElementById('view-btn');
const backButton = document.getElementById('back-btn');
const itemInput = document.getElementById('item');
const dateInput = document.getElementById('date');
const valueInput = document.getElementById('value');
const statusInput = document.getElementById('status');
const listaNaoEfetuadas = document.getElementById('lista-nao-efetuadas');
const listaEfetuadas = document.getElementById('lista-efetuadas');
const listaFuturas = document.getElementById('lista-futuras');

function loadCompras() {
    const compras = JSON.parse(localStorage.getItem('compras')) || [];
    listaNaoEfetuadas.innerHTML = '';
    listaEfetuadas.innerHTML = '';
    listaFuturas.innerHTML = '';

    compras.forEach(comprar => {
        addCompraToList(comprar);
    });
}

function addCompraToList(comprar) {
    const li = document.createElement('li');
    li.innerHTML = `${comprar.item} - ${new Date(comprar.date).toLocaleDateString()} - R$ ${comprar.value.toFixed(2)} - 
                    <select onchange="updateStatus(event, '${comprar.item}', '${comprar.date}')">
                        <option value="Não Efetuada" ${comprar.status === "Não Efetuada" ? 'selected' : ''}>Não Efetuada</option>
                        <option value="Efetuada" ${comprar.status === "Efetuada" ? 'selected' : ''}>Efetuada</option>
                        <option value="Futura" ${comprar.status === "Futura" ? 'selected' : ''}>Futura</option>
                    </select>`;
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Apagar';
    deleteButton.className = 'delete';
    deleteButton.onclick = () => {
        if (confirm('Você tem certeza que deseja apagar esta compra?')) {
            removeCompraFromStorage(comprar);
            loadCompras();
        }
    };

    li.appendChild(deleteButton);

    if (comprar.status === "Não Efetuada") {
        listaNaoEfetuadas.appendChild(li);
    } else if (comprar.status === "Efetuada") {
        listaEfetuadas.appendChild(li);
    } else if (comprar.status === "Futura") {
        listaFuturas.appendChild(li);
    }
}

function updateStatus(event, item, date) {
    const newStatus = event.target.value;
    let compras = JSON.parse(localStorage.getItem('compras')) || [];
    compras = compras.map(comprar => {
        if (comprar.item === item && comprar.date === date) {
            comprar.status = newStatus;
        }
        return comprar;
    });
    localStorage.setItem('compras', JSON.stringify(compras));
    loadCompras();
}

function removeCompraFromStorage(comprar) {
    let compras = JSON.parse(localStorage.getItem('compras')) || [];
    compras = compras.filter(c => c.item !== comprar.item || c.date !== comprar.date);
    localStorage.setItem('compras', JSON.stringify(compras));
}

addButton.addEventListener('click', () => {
    const itemValue = itemInput.value.trim();
    const dateValue = dateInput.value;
    const valueValue = parseFloat(valueInput.value);
    const statusValue = statusInput.value;

    if (itemValue && dateValue && !isNaN(valueValue)) {
        const comprar = { item: itemValue, date: dateValue, value: valueValue, status: statusValue };
        saveCompra(comprar);
        loadCompras();

        // Limpar campos
        itemInput.value = '';
        dateInput.value = '';
        valueInput.value = '';
        statusInput.value = 'Não Efetuada';
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
});

function saveCompra(comprar) {
    const compras = JSON.parse(localStorage.getItem('compras')) || [];
    compras.push(comprar);
    localStorage.setItem('compras', JSON.stringify(compras));
}

viewButton.addEventListener('click', () => {
    document.getElementById('app').style.display = 'none';
    document.getElementById('compras').style.display = 'block';
    loadCompras();
});

backButton.addEventListener('click', () => {
    document.getElementById('compras').style.display = 'none';
    document.getElementById('app').style.display = 'block';
});

// Carregar o aplicativo inicialmente
document.getElementById('app').style.display = 'block';