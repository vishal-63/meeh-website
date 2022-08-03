// dom elements
const orderSummarySubtotal = document.querySelector(
  ".order-summary .order-total .sub-total span"
);
const orderSummaryCouponDiscount = document.querySelector(
  ".order-summary .order-total .coupon-discount span"
);
const orderSummaryGrandtotal = document.querySelector(
  ".order-summary .order-total .grand-total span"
);
const shippingNameDiv = document.querySelector(".shipping-summary .name");
const shippingAddressDiv = document.querySelector(".shipping-summary .address");

// Handle shipping address selection
let selectedAddress;
const addressCheckboxes = [
  ...document.querySelectorAll("input[type='checkbox'].material-control-input"),
];
const shippingNextBtn = document.querySelector("button.shipping-section.next");

if (selectedAddress === undefined) shippingNextBtn.disabled = true;

function selectAddress(index) {
  if (addressCheckboxes[index].checked === true) {
    selectedAddress = addresses[index];
    console.log(selectedAddress);
    addressCheckboxes.map((checkbox, i) => {
      if (i !== index) {
        checkbox.disabled = true;
      }
    });
    shippingNextBtn.disabled = false;
  } else {
    selectedAddress = {};
    shippingNextBtn.disabled = true;
    addressCheckboxes.map((checkbox) => (checkbox.disabled = false));
  }
}

// Show address input fields when clicked on add new address
function showAddressFields() {
  const form = document.querySelector("form.shipping-form");
  form.classList.toggle("d-none");
  if (!form.classList.contains("d-none")) {
    shippingNextBtn.disabled = true;
  }
  document
    .querySelector("div.card-columns.addresses")
    .classList.toggle("d-none");
}

// initialized from the create-order response
let order;
let key;
let userDetails;

// save order in database and create razorpay order
async function createOrder() {
  const res = await fetch("/checkout/create-order", {
    method: "POST",
    body: JSON.stringify({ cart: clientCart, address: selectedAddress }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (res.ok) {
    order = data.result;
    key = data.key;
    userDetails = data.userDetails;
    orderSummarySubtotal.textContent = "Rs. " + order.notes.sub_total;
    orderSummaryCouponDiscount.textContent =
      "Rs. " + order.notes.coupon_discount;
    orderSummaryGrandtotal.textContent = "Rs. " + order.amount / 100;
    shippingNameDiv.textContent = order.notes.shipping_name;
    shippingAddressDiv.textContent = order.notes.shipping_address;
    intializeRazorpay();
  }
}

var razorpayObject;

function intializeRazorpay() {
  const amount = order.amount;
  const currency = order.currency;
  const order_id = order.id;

  var options = {
    key: key,
    amount: amount,
    currency: currency,
    name: "Meehh.com",
    image: "http://localhost:5000/public/assets/images/logo.png",
    order_id: order_id,
    handler: async function (response) {
      console.log(response);
      const data = {
        order_id: response.razorpay_order_id,
        payment_id: response.razorpay_payment_id,
      };
      const res = await fetch("/checkout/verify-order", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          "x-razorpay-signature": response.razorpay_signature,
        },
      });
      console.log(await res.json());
    },
    prefill: {
      contact: userDetails?.phone_no,
      name: userDetails?.name,
      email: userDetails?.email,
    },
    notes: {
      shipping_address: userDetails.shipping_address,
    },
    modal: {
      confirm_close: true,
    },
    remember_customer: true,
    send_sms_hash: true,
  };
  razorpayObject = new Razorpay(options);
  console.log(razorpayObject);

  razorpayObject.on("payment.failed", function (response) {
    console.log(response);
    alert("This step of Payment Failed");
  });

  document.getElementById("checkout").onclick = function (e) {
    razorpayObject.open();
    e.preventDefault();
  };
}
