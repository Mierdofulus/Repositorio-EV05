document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const sections = document.querySelectorAll('main section');
    const navItems = document.querySelectorAll('.nav-links a');
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');

    // Datos de ejemplo
    const menuItems = [
        { id: 1, name: 'Café Americano', price: 6500 },
        { id: 2, name: 'Cappuccino', price: 9800 },
        { id: 3, name: 'Latte', price: 9000 },
        { id: 4, name: 'Espresso', price: 4500 },
    ];

    const mesas = [
        { id: 1, number: 1, status: 'libre', order: [] },
        { id: 2, number: 2, status: 'ocupada', order: [{ id: 1, quantity: 2 }, { id: 3, quantity: 1 }] },
        { id: 3, number: 3, status: 'libre', order: [] },
        { id: 4, number: 4, status: 'ocupada', order: [{ id: 2, quantity: 1 }, { id: 4, quantity: 2 }] },
    ];

    let pedidos = [];
    let ventas = {};

    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('show');
    });

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            sections.forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(targetId).classList.add('active');
            navLinks.classList.remove('show');
        });
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    function showModal(title, content) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = content;
        modal.style.display = 'block';
    }

    function renderMenu() {
        const menuContainer = document.getElementById('menu-items');
        menuContainer.innerHTML = '';
        menuItems.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('menu-item');
            div.textContent = `${item.name} - $${item.price.toFixed(2)}`;
            div.addEventListener('click', () => showItemDetails(item));
            menuContainer.appendChild(div);
        });
    }

    function showItemDetails(item) {
        const content = `
            <p>Nombre: ${item.name}</p>
            <p>Precio: $${item.price.toFixed(2)}</p>
            <button onclick="addToOrder(${item.id})">Añadir al pedido</button>
        `;
        showModal(`Detalles del ítem: ${item.name}`, content);
    }

    function renderMesas() {
        const mesasContainer = document.getElementById('mesas-container');
        mesasContainer.innerHTML = '';
        mesas.forEach(mesa => {
            const div = document.createElement('div');
            div.classList.add('mesa', mesa.status);
            div.textContent = `Mesa ${mesa.number}`;
            div.addEventListener('click', () => showMesaDetails(mesa));
            mesasContainer.appendChild(div);
        });
    }

    function showMesaDetails(mesa) {
        let orderContent = '<h3>Pedido actual:</h3>';
        if (mesa.order.length === 0) {
            orderContent += '<p>No hay ítems en el pedido.</p>';
        } else {
            orderContent += '<ul>';
            mesa.order.forEach(item => {
                const menuItem = menuItems.find(mi => mi.id === item.id);
                orderContent += `<li>${menuItem.name} x${item.quantity}</li>`;
            });
            orderContent += '</ul>';
        }
        const content = `
            <p>Estado: ${mesa.status}</p>
            ${orderContent}
            <button onclick="toggleMesaStatus(${mesa.id})">Cambiar estado</button>
            <button onclick="clearMesaOrder(${mesa.id})">Limpiar pedido</button>
        `;
        showModal(`Mesa ${mesa.number}`, content);
    }

    function toggleMesaStatus(mesaId) {
        const mesa = mesas.find(m => m.id === mesaId);
        mesa.status = mesa.status === 'libre' ? 'ocupada' : 'libre';
        renderMesas();
        showMesaDetails(mesa);
    }

    function clearMesaOrder(mesaId) {
        const mesa = mesas.find(m => m.id === mesaId);
        mesa.order = [];
        renderMesas();
        showMesaDetails(mesa);
    }

    function addToOrder(itemId) {
        // Aquí deberías implementar la lógica para añadir el ítem al pedido de la mesa seleccionada
        alert('Ítem añadido al pedido');
        modal.style.display = 'none';
    }

    function renderPedidos() {
        const pedidosLista = document.getElementById('pedidos-lista');
        pedidosLista.innerHTML = '<h3>Pedidos activos:</h3>';
        mesas.forEach(mesa => {
            if (mesa.order.length > 0) {
                const pedidoDiv = document.createElement('div');
                pedidoDiv.innerHTML = `<h4>Mesa ${mesa.number}</h4>`;
                const ul = document.createElement('ul');
                mesa.order.forEach(item => {
                    const menuItem = menuItems.find(mi => mi.id === item.id);
                    const li = document.createElement('li');
                    li.textContent = `${menuItem.name} x${item.quantity}`;
                    ul.appendChild(li);
                });
                pedidoDiv.appendChild(ul);
                pedidosLista.appendChild(pedidoDiv);
            }
        });
    }

    function renderInventario() {
        // Aquí deberías implementar la lógica para mostrar el inventario
    }

    function renderReporte() {
        const ventasTabla = document.getElementById('ventas-tabla').getElementsByTagName('tbody')[0];
        ventasTabla.innerHTML = '';
        for (const [itemId, quantity] of Object.entries(ventas)) {
            const menuItem = menuItems.find(mi => mi.id === parseInt(itemId));
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${menuItem.name}</td>
                <td>${quantity}</td>
                <td>$${(menuItem.price * quantity).toFixed(2)}</td>
            `;
            ventasTabla.appendChild(tr);
        }
    }

    // Inicialización
    renderMenu();
    renderMesas();
    renderPedidos();
    renderInventario();
    renderReporte();
});