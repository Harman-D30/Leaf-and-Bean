// Product information
const products = [
    {
        id: 1,
        name: "Darjeeling First Flush",
        category: "Black",
        caffeine: "Medium",
        taste: "Floral",
        price: 299,
        image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600",
        description: "A light tea with a floral taste."
    },
    {
        id: 2,
        name: "Japanese Green Tea",
        category: "Green",
        caffeine: "Medium",
        taste: "Fresh",
        price: 249,
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600",
        description: "Fresh and simple green tea."
    },
    {
        id: 3,
        name: "White Peony Tea",
        category: "White",
        caffeine: "Low",
        taste: "Floral",
        price: 349,
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600",
        description: "A mild tea with a delicate flavour."
    },
    {
        id: 4,
        name: "Classic Oolong",
        category: "Oolong",
        caffeine: "Medium",
        taste: "Fresh",
        price: 329,
        image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600",
        description: "A balanced tea with a smooth taste."
    },
    {
        id: 5,
        name: "Chamomile Herbal Tea",
        category: "Herbal",
        caffeine: "None",
        taste: "Sweet",
        price: 199,
        image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600",
        description: "A caffeine-free herbal drink."
    },
    {
        id: 6,
        name: "Ceremonial Matcha",
        category: "Matcha",
        caffeine: "High",
        taste: "Fresh",
        price: 399,
        image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600",
        description: "Japanese matcha with a rich flavour."
    },
    {
        id: 7,
        name: "Classic Black Tea",
        category: "Black",
        caffeine: "High",
        taste: "Strong",
        price: 229,
        image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600",
        description: "A strong tea for your morning."
    },
    {
        id: 8,
        name: "Arabica Coffee Beans",
        category: "Coffee",
        caffeine: "High",
        taste: "Strong",
        price: 449,
        image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600",
        description: "Coffee beans with a rich aroma."
    },
    {
        id: 9,
        name: "Decaf Herbal Blend",
        category: "Herbal",
        caffeine: "None",
        taste: "Sweet",
        price: 219,
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600",
        description: "A relaxing caffeine-free blend."
    }
];

// Get HTML elements
const $ = (id) => document.getElementById(id);

// Load saved information from browser storage
let cart = JSON.parse(localStorage.getItem("leafBeanCart")) || [];
let favorites = JSON.parse(localStorage.getItem("leafBeanFavorites")) || [];
let showOnlyFavorites = false;

// Save cart and favorites
function saveData() {
    localStorage.setItem("leafBeanCart", JSON.stringify(cart));
    localStorage.setItem("leafBeanFavorites", JSON.stringify(favorites));
}

// Show notification
function showToast(message) {
    const toast = $("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

// Display products
function displayProducts() {
    const search = $("productSearch").value.toLowerCase();
    const category = $("categoryFilter").value;
    const caffeine = $("caffeineFilter").value;

    let filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            product.description.toLowerCase().includes(search);

        const matchesCategory =
            category === "all" || product.category === category;

        const matchesCaffeine =
            caffeine === "all" || product.caffeine === caffeine;

        const matchesFavorite =
            !showOnlyFavorites || favorites.includes(product.id);

        return matchesSearch && matchesCategory &&
            matchesCaffeine && matchesFavorite;
    });

    $("teaGrid").innerHTML = "";

    if (filteredProducts.length === 0) {
        $("productMessage").textContent = "No products found.";
        return;
    }

    $("productMessage").textContent = "";

    filteredProducts.forEach(product => {
        const isFavorite = favorites.includes(product.id);

        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>

                <div class="product-meta">
                    <span>${product.category}</span>
                    <span>${product.caffeine} caffeine</span>
                </div>

                <div class="product-meta">
                    <span class="product-price">₹${product.price}</span>
                </div>

                <div class="product-buttons">
                    <button class="add-cart-btn" data-id="${product.id}">
                        Add to Cart
                    </button>
                    <button class="favorite-btn ${isFavorite ? "active" : ""}"
                        data-id="${product.id}" title="Add to favorites">
                        ${isFavorite ? "♥" : "♡"}
                    </button>
                </div>
            </div>
        `;

        $("teaGrid").appendChild(card);
    });
}

// Search and filters
$("productSearch").addEventListener("input", displayProducts);
$("categoryFilter").addEventListener("change", displayProducts);
$("caffeineFilter").addEventListener("change", displayProducts);

// Add products to cart and manage favorites
$("teaGrid").addEventListener("click", function(event) {
    const cartButton = event.target.closest(".add-cart-btn");
    const favoriteButton = event.target.closest(".favorite-btn");

    if (cartButton) {
        const id = Number(cartButton.dataset.id);
        addToCart(id);
    }

    if (favoriteButton) {
        const id = Number(favoriteButton.dataset.id);
        toggleFavorite(id);
    }
});

// Add product to cart
function addToCart(id) {
    const product = products.find(item => item.id === id);

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveData();
    updateCart();
    showToast("Product added to cart!");
}

// Add or remove favorite
function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(item => item !== id);
        showToast("Removed from favorites");
    } else {
        favorites.push(id);
        showToast("Added to favorites");
    }

    saveData();
    updateFavorites();
    displayProducts();
}

// Update cart information
function updateCart() {
    $("cartCount").textContent = cart.reduce(
        (total, item) => total + item.quantity, 0
    );

    const cartItems = $("cartItems");
    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    }

    cart.forEach(item => {
        total += item.price * item.quantity;

        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>₹${item.price} each</p>

                <div class="quantity-controls">
                    <button class="quantity-btn" data-id="${item.id}" data-change="-1">−</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-id="${item.id}" data-change="1">+</button>
                    <button class="remove-btn" data-id="${item.id}">Remove</button>
                </div>
            </div>
            <strong>₹${item.price * item.quantity}</strong>
        `;

        cartItems.appendChild(div);
    });

    $("cartTotal").textContent = "₹" + total;
    $("checkoutTotal").textContent = "₹" + total;
}

// Cart quantity and remove buttons
$("cartItems").addEventListener("click", function(event) {
    const quantityButton = event.target.closest(".quantity-btn");
    const removeButton = event.target.closest(".remove-btn");

    if (quantityButton) {
        const id = Number(quantityButton.dataset.id);
        const change = Number(quantityButton.dataset.change);

        const item = cart.find(product => product.id === id);

        if (item) {
            item.quantity += change;

            if (item.quantity <= 0) {
                cart = cart.filter(product => product.id !== id);
            }
        }

        saveData();
        updateCart();
    }

    if (removeButton) {
        const id = Number(removeButton.dataset.id);

        cart = cart.filter(item => item.id !== id);

        saveData();
        updateCart();
        showToast("Item removed");
    }
});

// Update favorites panel
function updateFavorites() {
    $("favoriteCount").textContent = favorites.length;
    $("favoriteItems").innerHTML = "";

    const favoriteProducts = products.filter(product =>
        favorites.includes(product.id)
    );

    if (favoriteProducts.length === 0) {
        $("favoriteItems").innerHTML = "<p>No favorite products yet.</p>";
    }

    favoriteProducts.forEach(product => {
        const div = document.createElement("div");
        div.className = "favorite-item";

        div.innerHTML = `
            <div>
                <h4>${product.name}</h4>
                <p>₹${product.price}</p>
            </div>
            <button class="remove-btn" data-id="${product.id}">Remove</button>
        `;

        $("favoriteItems").appendChild(div);
    });
}

// Remove favorite from panel
$("favoriteItems").addEventListener("click", function(event) {
    const button = event.target.closest(".remove-btn");

    if (button) {
        const id = Number(button.dataset.id);
        toggleFavorite(id);
    }
});

// Open and close cart
$("cartBtn").addEventListener("click", () => {
    $("cartDrawer").classList.add("open");
    $("cartOverlay").classList.add("show");
});

function closeCart() {
    $("cartDrawer").classList.remove("open");
    $("cartOverlay").classList.remove("show");
}

$("closeCart").addEventListener("click", closeCart);
$("cartOverlay").addEventListener("click", closeCart);

// Open and close favorites
$("favoritesBtn").addEventListener("click", () => {
    showOnlyFavorites = false;
    updateFavorites();

    $("favoritesPanel").classList.add("open");
    $("favoriteOverlay").classList.add("show");
});

function closeFavorites() {
    $("favoritesPanel").classList.remove("open");
    $("favoriteOverlay").classList.remove("show");
}

$("closeFavorites").addEventListener("click", closeFavorites);
$("favoriteOverlay").addEventListener("click", closeFavorites);

// Show only favorite products when requested
$("favoritesBtn").addEventListener("dblclick", () => {
    showOnlyFavorites = true;
    closeFavorites();
    $("categoryFilter").value = "all";
    $("caffeineFilter").value = "all";
    $("productSearch").value = "";
    displayProducts();
});

// Checkout
$("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
    }

    $("checkoutModal").classList.add("show");
    $("checkoutTotal").textContent = $("cartTotal").textContent;
});

$("closeCheckout").addEventListener("click", () => {
    $("checkoutModal").classList.remove("show");
});

$("checkoutModal").addEventListener("click", event => {
    if (event.target === $("checkoutModal")) {
        $("checkoutModal").classList.remove("show");
    }
});

// Demo order form
$("checkoutForm").addEventListener("submit", function(event) {
    event.preventDefault();

    if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
    }

    const customerName = $("customerName").value.trim();

    $("checkoutSuccess").textContent =
        "Thank you, " + customerName +
        "! Your demo order has been placed successfully.";

    cart = [];

    saveData();
    updateCart();

    $("checkoutForm").reset();

    showToast("Demo order placed!");
});

// Brewing guide information
const brewingData = {
    green: {
        temperature: "80°C",
        amount: "2 grams",
        time: 120
    },
    black: {
        temperature: "95°C",
        amount: "2 grams",
        time: 240
    },
    white: {
        temperature: "85°C",
        amount: "2 grams",
        time: 180
    },
    oolong: {
        temperature: "90°C",
        amount: "2 grams",
        time: 180
    },
    herbal: {
        temperature: "100°C",
        amount: "2 grams",
        time: 300
    },
    matcha: {
        temperature: "80°C",
        amount: "2 grams",
        time: 60
    },
    coffee: {
        temperature: "93°C",
        amount: "15 grams",
        time: 240
    }
};

let timerInterval = null;
let remainingTime = 120;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return String(minutes).padStart(2, "0") + ":" +
        String(remainingSeconds).padStart(2, "0");
}

// Change brewing information
function updateBrewingGuide() {
    const selected = $("brewTea").value;
    const data = brewingData[selected];

    remainingTime = data.time;

    $("brewTemp").textContent = data.temperature;
    $("brewAmount").textContent = data.amount;
    $("brewTime").textContent =
        Math.floor(data.time / 60) + " minutes" +
        (data.time % 60 ? " " + data.time % 60 + " seconds" : "");

    $("timerDisplay").textContent = formatTime(remainingTime);
    $("timerMessage").textContent = "";

    clearInterval(timerInterval);
    timerInterval = null;
    $("startTimer").textContent = "Start Timer";
}

$("brewTea").addEventListener("change", updateBrewingGuide);

// Start timer
$("startTimer").addEventListener("click", function() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        $("startTimer").textContent = "Resume Timer";
        return;
    }

    if (remainingTime <= 0) {
        updateBrewingGuide();
    }

    $("startTimer").textContent = "Pause Timer";

    timerInterval = setInterval(() => {
        remainingTime--;

        $("timerDisplay").textContent = formatTime(remainingTime);

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;

            $("startTimer").textContent = "Start Again";
            $("timerMessage").textContent = "Your drink is ready!";
            showToast("Brewing time is complete!");
        }
    }, 1000);
});

// Reset timer
$("resetTimer").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;

    updateBrewingGuide();
});

// Sampler builder
let selectedSampler = [];

function displaySamplerOptions() {
    $("samplerOptions").innerHTML = "";

    products.forEach(product => {
        const div = document.createElement("div");
        div.className = "sampler-option";

        div.innerHTML = `
            <input type="checkbox" id="sampler${product.id}"
                value="${product.id}">
            <label for="sampler${product.id}">
                ${product.name} - ₹${product.price}
            </label>
        `;

        $("samplerOptions").appendChild(div);
    });
}

// Update sampler selection
$("samplerOptions").addEventListener("change", function(event) {
    const checkbox = event.target;

    if (checkbox.type !== "checkbox") return;

    const id = Number(checkbox.value);

    if (checkbox.checked) {
        if (selectedSampler.length >= 3) {
            checkbox.checked = false;
            showToast("You can select only 3 products.");
            return;
        }

        selectedSampler.push(id);
    } else {
        selectedSampler = selectedSampler.filter(item => item !== id);
    }

    updateSampler();
});

function updateSampler() {
    const total = selectedSampler.reduce((sum, id) => {
        const product = products.find(item => item.id === id);
        return sum + product.price;
    }, 0);

    $("samplerCount").textContent = selectedSampler.length + " / 3";
    $("samplerTotal").textContent = "₹" + total;
}

// Add sampler to cart
$("addSampler").addEventListener("click", function() {
    if (selectedSampler.length !== 3) {
        $("samplerMessage").textContent =
            "Please select exactly 3 products.";
        return;
    }

    const selectedProducts = products.filter(product =>
        selectedSampler.includes(product.id)
    );

    const samplerPrice = selectedProducts.reduce(
        (sum, product) => sum + product.price, 0
    );

    const samplerName = "Custom Sampler: " +
        selectedProducts.map(product => product.name).join(", ");

    cart.push({
        id: Date.now(),
        name: samplerName,
        price: samplerPrice,
        quantity: 1
    });

    saveData();
    updateCart();

    selectedSampler = [];

    document.querySelectorAll("#samplerOptions input").forEach(input => {
        input.checked = false;
    });

    updateSampler();

    $("samplerMessage").textContent =
        "Your sampler has been added to the cart!";

    showToast("Sampler added to cart!");
});

// Tea recommendation quiz
$("teaQuiz").addEventListener("submit", function(event) {
    event.preventDefault();

    const caffeine = $("quizCaffeine").value;
    const taste = $("quizTaste").value;

    let recommendation = "";

    if (caffeine === "None") {
        recommendation = "Chamomile Herbal Tea";
    } else if (caffeine === "High" && taste === "Strong") {
        recommendation = "Classic Black Tea or Arabica Coffee Beans";
    } else if (caffeine === "High") {
        recommendation = "Ceremonial Matcha";
    } else if (caffeine === "Low" && taste === "Floral") {
        recommendation = "White Peony Tea";
    } else if (caffeine === "Low") {
        recommendation = "White Peony Tea";
    } else if (taste === "Fresh") {
        recommendation = "Japanese Green Tea";
    } else if (taste === "Strong") {
        recommendation = "Classic Oolong";
    } else {
        recommendation = "Darjeeling First Flush";
    }

    $("quizResult").textContent =
        "Based on your choices, we recommend: " + recommendation;
});

// Dark and light mode
$("themeBtn").addEventListener("click", function() {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    localStorage.setItem("leafBeanTheme", isDark ? "dark" : "light");

    $("themeBtn").textContent = isDark ? "☀" : "☾";
});


// Load saved reviews
let reviews = JSON.parse(localStorage.getItem("leafBeanReviews")) || [];

// Display reviews
function displayReviews() {
    const reviewList = $("reviewList");

    reviewList.innerHTML = "";

    if (reviews.length === 0) {
        const message = document.createElement("p");
        message.className = "no-reviews";
        message.textContent = "No reviews yet. Be the first to write one!";

        reviewList.appendChild(message);
        return;
    }

    reviews.forEach(review => {
        const card = document.createElement("div");
        card.className = "review-card";

        const stars = document.createElement("p");
        stars.className = "stars";
        stars.textContent =
            "★".repeat(review.rating) +
            "☆".repeat(5 - review.rating);

        const comment = document.createElement("p");
        comment.textContent = review.text;

        const name = document.createElement("h4");
        name.textContent = review.name;

        card.appendChild(stars);
        card.appendChild(comment);
        card.appendChild(name);

        reviewList.appendChild(card);
    });
}

// Submit a new review
$("reviewForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = $("reviewName").value.trim();
    const rating = Number($("reviewRating").value);
    const reviewText = $("reviewText").value.trim();

    if (!name || !rating || !reviewText) {
        showToast("Please complete all fields.");
        return;
    }

    const newReview = {
        name: name,
        rating: rating,
        text: reviewText
    };

    reviews.unshift(newReview);

    localStorage.setItem(
        "leafBeanReviews",
        JSON.stringify(reviews)
    );

    displayReviews();

    $("reviewForm").reset();

    showToast("Your review has been submitted!");
});

// Display saved reviews when website opens
displayReviews();


// Load saved theme
if (localStorage.getItem("leafBeanTheme") === "dark") {
    document.body.classList.add("dark");
    $("themeBtn").textContent = "☀";
}

// Mobile menu
$("menuBtn").addEventListener("click", () => {
    $("navLinks").classList.toggle("show");
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        $("navLinks").classList.remove("show");
    });
});

// Initial setup
displayProducts();
updateCart();
updateFavorites();
displaySamplerOptions();
updateSampler();
updateBrewingGuide();
