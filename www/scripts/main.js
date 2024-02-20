function fetchOrder() {
  fetch(`/orderMesa`)
    .then(response => response.json())
    .then(order => {
        console.log(order);
    });
}

