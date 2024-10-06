const socket = io();

socket.on("products", (data) => {
  productsRender(data);
});

const productsRender = (products) => {
  const productsContainer = document.getElementById("productsContainer");

  productsContainer.innerHTML = "";

  products.forEach((item) => {
    const card = document.createElement("div");

    card.innerHTML = `
    <p> ${item.id}</p>
    <p> ${item.title}</p>
    <p> ${item.description}</p>
    <p> ${item.price}</p>
    <p> ${item.img}</p>
    <p> ${item.code}</p>
    <p> ${item.stock}</p>
    <button class="delete-btn" data-id="${item.id}"> delete </button>
    <br></br>
    `;
    productsContainer.appendChild(card);
  });

  // delete button

  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = event.target.getAttribute("data-id");
      deleteProduct(productId);
    });
  });
};

const deleteProduct = (productId) => {
  socket.emit("deleteProduct", productId);
};

//form 


const form = document.getElementById("product-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const productTitle = document.getElementById("product-title").value;
  const productDescription = document.getElementById("product-description").value;
  const productPrice = document.getElementById("product-price").value;
  const productCode = document.getElementById("product-code").value;
  const productStock = document.getElementById("product-stock").value;

  const AddNewProducts = {
    title: productTitle,
    description: productDescription,
    price: productPrice,
    code: productCode,
    stock: productStock,
  };

  socket.emit("addProducts", AddNewProducts);
  form.reset();
});

socket.on("products", (data) => {
    productsRender(data); // Renderiza los productos en la interfaz
});



