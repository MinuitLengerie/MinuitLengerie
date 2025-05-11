console.log('Script.js cargado, carrusel manual configurado');

document.addEventListener('DOMContentLoaded', () => {
    // 🍔 Menú hamburguesa
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('open');
    });

    const navLinks = document.querySelectorAll('.nav-menu ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('open');
        });
    });

    // 🎯 Animaciones al hacer scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.product-item, .testimonial-item, .carousel-item');
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.9) {
                element.classList.add('animate');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // 🛍️ Carrito
    let cart = [];
    const cartIcon = document.querySelector('.cart-icon');
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartDropdown = document.querySelector('.cart-dropdown');
    const finalizePurchaseBtn = document.querySelector('.finalize-purchase');
    const cartNotification = document.getElementById('cartNotification');

    // Mostrar/Ocultar carrito al hacer clic
    cartIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        cartDropdown.classList.toggle('show');
    });

    // Cerrar el carrito al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!cartIcon.contains(e.target) && !cartDropdown.contains(e.target)) {
            cartDropdown.classList.remove('show');
        }
    });

    // Evitar que los clics dentro del dropdown lo cierren
    cartDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Agregar al carrito (incluye los botones del carrusel) y mostrar notificación
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const product = e.target.getAttribute('data-product');
            const talle = e.target.getAttribute('data-talle') || 'Sin talle';
            const price = parseInt(e.target.getAttribute('data-price'));
            const image = e.target.getAttribute('data-image');
            const item = { product, talle, price, image };

            cart.push(item);
            updateCart();

            // Mostrar notificación
            cartNotification.textContent = "Agregado al carrito de compras";
            cartNotification.classList.add('show');
            setTimeout(() => {
                cartNotification.classList.remove('show');
            }, 2000); // Ocultar después de 2 segundos
        });
    });

    // Actualizar carrito
    const updateCart = () => {
        cartCount.textContent = cart.length;
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${item.image}" alt="${item.product}" class="cart-item-image">
                <span class="cart-item-description">${item.product} - Talle: ${item.talle} - $${item.price}</span>
                <button class="remove-item" data-index="${index}">×</button>
            `;
            cartItems.appendChild(li);
            total += item.price;
        });

        cartTotal.textContent = `Total: $${total}`;
        cartIcon.classList.toggle('has-items', cart.length > 0);

        // Agregar eventos para eliminar ítems después de renderizar
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCart();
            });
        });
    };

    // Finalizar compra
    finalizePurchaseBtn.addEventListener('click', () => {
        if (cart.length === 0) return;

        const message = cart.map(item => `${item.product} (Talle: ${item.talle}, $${item.price})`).join('\n');
        const whatsappMessage = encodeURIComponent(`¡Hola Minuit 💋! Quiero comprar los siguientes productos:\n${message}`);
        window.open(`https://wa.me/3816941888?text=${whatsappMessage}`, '_blank');
        cart = [];
        updateCart();
        cartDropdown.classList.remove('show');
    });

    // 🛍️ Carrusel manual
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const itemCount = items.length;
    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    // Media query para saber si es móvil
    const isMobile = () => window.innerWidth <= 768;

    // Calcula el ancho real de cada item como porcentaje del contenedor
    const getItemWidthPercent = () => {
        const item = items[0];
        const trackWidth = track.offsetWidth;
        return (item.offsetWidth / trackWidth) * 100;
    };

    // Actualiza la posición del carrusel
    const updateCarouselPosition = () => {
        const itemWidthPercent = getItemWidthPercent();
        const translateX = -currentIndex * itemWidthPercent;
        track.style.transition = 'transform 0.5s ease';
        track.style.transform = `translateX(${translateX}%)`;
    };

    // Mover al siguiente item
    const moveToNext = () => {
        currentIndex++;
        if (currentIndex >= itemCount) {
            currentIndex = 0;
            track.style.transition = 'none';
            track.style.transform = `translateX(0%)`;
            setTimeout(() => {
                track.style.transition = 'transform 0.5s ease';
            }, 50);
        }
        updateCarouselPosition();
    };

    // Mover al item anterior
    const moveToPrev = () => {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = itemCount - 1;
            track.style.transition = 'none';
            track.style.transform = `translateX(${-currentIndex * getItemWidthPercent()}%)`;
            setTimeout(() => {
                track.style.transition = 'transform 0.5s ease';
            }, 50);
        }
        updateCarouselPosition();
    };

    // Eventos de clic para las flechas
    nextBtn.addEventListener('click', moveToNext);
    prevBtn.addEventListener('click', moveToPrev);

    // Desplazamiento táctil para mobile
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    track.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', () => {
        const deltaX = touchEndX - touchStartX;
        if (deltaX > 50) {
            moveToPrev();
        } else if (deltaX < -50) {
            moveToNext();
        }
    });

    // Ajustar posición inicial
    updateCarouselPosition();

    // Escuchar cambios de tamaño para recalcular
    window.addEventListener('resize', () => {
        updateCarouselPosition();
    });
});