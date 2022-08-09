const axios = require("axios");

let token;

async function get_access_token() {
  const data = {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  };
  const config = {
    method: "POST",
    url: "https://apiv2.shiprocket.in/v1/external/auth/login",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  const token = await axios(config)
    .then((response) => {
      return response.data.token;
    })
    .catch((err) => console.log(err.message));

  return token;
}

async function create_order() {
  const token = await get_access_token();

  /*========================= 
    CREATE SHIPROCKET ORDER 
  ==========================*/
  // Order data
  var data = JSON.stringify({
    order_id: "224-447",
    order_date: "2022-07-04 11:11",
    pickup_location: "Primary",
    channel_id: "",
    comment: "Reseller: M/s Goku",
    billing_customer_name: "Naruto",
    billing_last_name: "Uzumaki",
    billing_address: "House 221B, Leaf Village",
    billing_address_2: "Near Hokage House",
    billing_city: "New Delhi",
    billing_pincode: "110002",
    billing_state: "Delhi",
    billing_country: "India",
    billing_email: "naruto@uzumaki.com",
    billing_phone: "9876543210",
    shipping_is_billing: true,
    shipping_customer_name: "",
    shipping_last_name: "",
    shipping_address: "",
    shipping_address_2: "",
    shipping_city: "",
    shipping_pincode: "",
    shipping_country: "",
    shipping_state: "",
    shipping_email: "",
    shipping_phone: "",
    order_items: [
      {
        name: "You Got This - Badge",
        sku: "Badge",
        units: 2,
        selling_price: "50",
        discount: "",
        tax: "",
        hsn: 441122,
      },
    ],
    payment_method: "Prepaid",
    shipping_charges: 50,
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: 0,
    sub_total: 5500,
    length: 5,
    breadth: 5,
    height: 2,
    weight: 0.5,
  });

  var config = {
    method: "post",
    url: "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  const shiprocketOrder = await axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  // Shipping id received from the shiprocket order response
  const shippingId = shiprocketOrder.shippment_id;

  /* ============================================ 
    CREATE AIR WAYBILL NUMBER(AWB) FOR SHIPPING 
  ===============================================*/
  data = JSON.stringify({
    shipment_id: shippingId,
  });

  config = {
    method: "post",
    url: "https://apiv2.shiprocket.in/v1/external/courier/assign/awb",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  const awb = await axios(config)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });

  const awbCode = awb.data.awb_code;
  const courierName = awb.courier_name;

  /* =============================
    REQUEST FOR SHIPMENT PICKUP 
  ============================== */

  data = JSON.stringify({
    shipment_id: [shippingId],
  });

  config = {
    method: "post",
    url: "https://apiv2.shiprocket.in/v1/external/courier/generate/pickup",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  const pickupResponse = await axios(config)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });

  const pickupDate = pickupResponse.pickup_scheduled_date;

  /* =================================
    REQUEST TO GENERATE MANIFEST 
  ================================= */
  data = JSON.stringify({
    shipment_id: [shippingId],
  });

  config = {
    method: "post",
    url: "https://apiv2.shiprocket.in/v1/external/manifests/generate",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  const manifest = await axios(config)
    .then(function (response) {
      console.log(response);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  const manifest_url = manifest.manifest_url;
}

module.exports.wrapper_api = async (dbOrder, email, contact, products) => {
  const token = await get_access_token();

  const orderItems = products.map((product) => {
    return {
      name: product.product_id.product_name,
      sku: product.product_id._id,
      units: product.quantity,
      selling_price: product.product_id.price,
    };
  });
  var data = JSON.stringify({
    order_id: dbOrder._id,
    order_date: dbOrder.order_date,
    channel_id: "3155338",
    billing_customer_name: dbOrder.shipping_address.first_name,
    billing_last_name: dbOrder.shipping_address.last_name,
    billing_address: `${dbOrder.shipping_address.house_no}, ${dbOrder.shipping_address.street}`,
    billing_address_2: dbOrder.shipping_address.landmark,
    billing_city: dbOrder.shipping_address.city,
    billing_pincode: dbOrder.shipping_address.pincode,
    billing_state: dbOrder.shipping_address.state,
    billing_country: "India",
    billing_email: email,
    billing_phone: contact,
    shipping_is_billing: true,
    order_items: orderItems,
    payment_method: "Prepaid",
    sub_total: dbOrder.sub_total,
    length: 100,
    breadth: 50,
    height: 10,
    weight: 0.5,
    pickup_location: "Primary",
  });

  var config = {
    method: "post",
    url: "https://apiv2.shiprocket.in/v1/external/shipments/create/forward-shipment",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log("create order", error.message);
    });
};
