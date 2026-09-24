const products=[
{id:1,name:"Smart Audio Pro",cat:"Electronics",price:2499,old:3499,rating:4.8,reviews:1240,visual:"electronics",shape:"object",badge:"BESTSELLER"},
{id:2,name:"Aero Wireless Headphones",cat:"Electronics",price:3199,old:4499,rating:4.6,reviews:842,visual:"electronics",shape:"object round",badge:"24% OFF"},
{id:3,name:"Studio Desk Lamp",cat:"Home",price:1299,old:1799,rating:4.7,reviews:623,visual:"home",shape:"object flat",badge:"TOP PICK"},
{id:4,name:"Minimal Table Set",cat:"Home",price:1899,old:2499,rating:4.5,reviews:318,visual:"home",shape:"object round"},
{id:5,name:"Everyday Premium Tote",cat:"Fashion",price:999,old:1499,rating:4.4,reviews:517,visual:"fashion",shape:"object flat",badge:"SALE"},
{id:6,name:"Mono Essential Sneakers",cat:"Fashion",price:2199,old:2999,rating:4.7,reviews:911,visual:"fashion",shape:"object"},
{id:7,name:"Daily Form Bottle",cat:"Wellness",price:699,old:999,rating:4.8,reviews:1521,visual:"wellness",shape:"object",badge:"BESTSELLER"},
{id:8,name:"Calm Aroma Diffuser",cat:"Wellness",price:1199,old:1599,rating:4.6,reviews:284,visual:"wellness",shape:"object round"}
];
let cart=JSON.parse(localStorage.getItem("shopProCart")||"[]"),
activeCat="All",min=0,max=Infinity,minRating=0,
currentUser=JSON.parse(localStorage.getItem("shopCurrentUser")||"null"),
users=JSON.parse(localStorage.getItem("shopUsers")||"[]"),
orders=JSON.parse(localStorage.getItem("shopOrders")||"[]");
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const money=n=>"₹"+n.toLocaleString("en-IN");

function saveUsers(){localStorage.setItem("shopUsers",JSON.stringify(users))}
function saveOrders(){localStorage.setItem("shopOrders",JSON.stringify(orders))}
function openAccount(){
  $("#ordersModal").classList.remove("show"); renderAccount(); $("#accountModal").classList.add("show"); $("#overlay").classList.add("show");
}
function renderAccount(){
  if(!currentUser){
    $("#accountBody").innerHTML=`<div class="account-main" style="max-width:440px;margin:auto"><small>MY ACCOUNT</small><h2>Welcome back</h2><p>Sign in to manage your profile and orders, or create a new account.</p>
    <form class="account-form" id="loginForm"><label>Email</label><input id="loginEmail" type="email" required placeholder="you@example.com"><label>Password</label><input id="loginPassword" type="password" required placeholder="••••••••"><button class="primary full">Sign in →</button></form>
    <div class="auth-switch">New here? <button class="text-btn" id="showRegister">Create an account</button></div></div>`;
    $("#loginForm").onsubmit=e=>{e.preventDefault();let email=$("#loginEmail").value.trim().toLowerCase(),pass=$("#loginPassword").value;let u=users.find(x=>x.email===email&&x.password===pass);if(!u){toast("Invalid email or password");return}currentUser={id:u.id,name:u.name,email:u.email};localStorage.setItem("shopCurrentUser",JSON.stringify(currentUser));renderAccount();toast("Signed in successfully ✓")};
    $("#showRegister").onclick=renderRegister; return;
  }
  let initials=currentUser.name.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase();
  let userOrders=orders.filter(o=>o.userId===currentUser.id);
  $("#accountBody").innerHTML=`<div class="account-wrap"><aside class="account-side"><div class="avatar">${initials}</div><b>${currentUser.name}</b><small>${currentUser.email}</small><div class="account-menu"><button class="active">Profile</button><button id="accountOrders">My Orders (${userOrders.length})</button></div><button class="logout-btn" id="logout">Sign out</button></aside><section class="account-main"><small>ACCOUNT OVERVIEW</small><h2>Hello, ${currentUser.name.split(" ")[0]}</h2><p>Your account information is stored locally for this demo. A real deployment can connect this UI to Firebase/Supabase.</p><div class="profile-grid"><div class="profile-box"><small>Name</small><b>${currentUser.name}</b></div><div class="profile-box"><small>Email</small><b>${currentUser.email}</b></div><div class="profile-box"><small>Total orders</small><b>${userOrders.length}</b></div><div class="profile-box"><small>Cart items</small><b>${cart.reduce((s,x)=>s+x.qty,0)}</b></div></div><br><button class="primary full" id="viewMyOrders">View my orders →</button></section></div>`;
  $("#logout").onclick=()=>{currentUser=null;localStorage.removeItem("shopCurrentUser");renderAccount();toast("Signed out")};
  $("#accountOrders").onclick=()=>openOrders();
  $("#viewMyOrders").onclick=()=>openOrders();
}
function renderRegister(){
  $("#accountBody").innerHTML=`<div class="account-main" style="max-width:440px;margin:auto"><small>CREATE ACCOUNT</small><h2>Join SHOP.</h2><p>Create a demo customer account. Your account remains on this browser.</p>
  <form class="account-form" id="registerForm"><label>Full name</label><input id="regName" required placeholder="Your name"><label>Email</label><input id="regEmail" type="email" required placeholder="you@example.com"><label>Password</label><input id="regPassword" minlength="6" type="password" required placeholder="At least 6 characters"><button class="primary full">Create account →</button></form><div class="auth-switch">Already registered? <button class="text-btn" id="showLogin">Sign in</button></div></div>`;
  $("#registerForm").onsubmit=e=>{e.preventDefault();let name=$("#regName").value.trim(),email=$("#regEmail").value.trim().toLowerCase(),password=$("#regPassword").value;if(users.some(u=>u.email===email)){toast("Account already exists");return}let u={id:"u_"+Date.now(),name,email,password};users.push(u);saveUsers();currentUser={id:u.id,name:u.name,email:u.email};localStorage.setItem("shopCurrentUser",JSON.stringify(currentUser));renderAccount();toast("Account created ✓")};
  $("#showLogin").onclick=renderAccount;
}
function openOrders(){
  if(!currentUser){openAccount();toast("Please sign in first");return}
  $("#accountModal").classList.remove("show");renderOrders();$("#ordersModal").classList.add("show");$("#overlay").classList.add("show");
}
function renderOrders(){
  let list=orders.filter(o=>o.userId===currentUser.id);
  $("#ordersBody").innerHTML=list.length?list.map(o=>`<div class="order-card"><div class="order-top"><div><b>${o.id}</b><small>${o.date}</small></div><span class="status">${o.status}</span></div><div class="order-items">${o.items.map(i=>`<div class="order-line"><span>${i.name} × ${i.qty}</span><b>${money(i.price*i.qty)}</b></div>`).join("")}</div><div class="order-bottom"><span>Payment: ${o.payment}</span><b>${money(o.total)}</b></div></div>`).join(""):`<div class="empty-orders">You haven't placed any orders yet.<br><br><button class="primary" id="shopNow">Start shopping →</button></div>`;
  let s=$("#shopNow");if(s)s.onclick=()=>{closeAll();document.querySelector("#shop").scrollIntoView()};
  $("#ordersAccountBtn").onclick=openAccount;
}
function render(){
 let q=$("#search").value.toLowerCase(), list=products.filter(p=>(activeCat==="All"||p.cat===activeCat)&&p.price>=min&&p.price<=max&&p.rating>=minRating&&(p.name+" "+p.cat).toLowerCase().includes(q));
 if($("#searchCategory").value!=="All")list=list.filter(p=>p.cat===$("#searchCategory").value);
 const s=$("#sort").value;if(s==="rating")list.sort((a,b)=>b.rating-a.rating);if(s==="low")list.sort((a,b)=>a.price-b.price);if(s==="high")list.sort((a,b)=>b.price-a.price);
 $("#resultText").textContent=`Showing ${list.length} product${list.length!==1?"s":""}`;
 $("#products").innerHTML=list.length?list.map(card).join(""):`<div style="grid-column:1/-1;padding:70px;text-align:center;color:#777">No products match your filters.</div>`;
}
function card(p){
 return `<article class="product"><div class="visual ${p.visual}"><div class="${p.shape}"></div>${p.badge?`<span class="badge">${p.badge}</span>`:""}<button class="heart" data-heart="${p.id}">♡</button></div><div class="pinfo"><small>${p.cat}</small><h3>${p.name}</h3><div class="stars">★★★★★ <span>${p.rating} (${p.reviews.toLocaleString()})</span></div><div class="price"><b>${money(p.price)}</b><span class="old">${money(p.old)}</span><span class="off">${Math.round((1-p.price/p.old)*100)}% off</span></div><div class="delivery">✓ Free delivery · In stock</div><button class="add" data-add="${p.id}">Add to Cart</button></div></article>`
}
function save(){localStorage.setItem("shopProCart",JSON.stringify(cart))}
function add(id){let x=cart.find(i=>i.id===id);x?x.qty++:cart.push({id,qty:1});save();renderCart();toast("Added to cart")}
function renderCart(){
 $("#count").textContent=cart.reduce((s,x)=>s+x.qty,0);
 if(!cart.length){$("#cartItems").innerHTML='<div style="padding:70px 10px;text-align:center;color:#777">Your cart is empty.</div>';$("#total").textContent="₹0";return}
 $("#cartItems").innerHTML=cart.map(x=>{let p=products.find(p=>p.id===x.id);return `<div class="cart-row"><div class="cart-thumb ${p.visual}"><div class="${p.shape}"></div></div><div class="cart-info"><b>${p.name}</b><p>${money(p.price)}</p><div class="qty"><button data-qty="${p.id}" data-d="-1">−</button><span>${x.qty}</span><button data-qty="${p.id}" data-d="1">+</button></div><button class="remove" data-remove="${p.id}">Remove</button></div></div>`}).join("");
 $("#total").textContent=money(cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0))
}
function modal(id){let p=products.find(p=>p.id===id);$("#modalBody").innerHTML=`<div class="modal-grid"><div class="visual ${p.visual}"><div class="${p.shape}"></div></div><div><small>${p.cat}</small><h2>${p.name}</h2><div class="stars">★★★★★ ${p.rating} · ${p.reviews.toLocaleString()} reviews</div><p>Designed for everyday use with a clean finish, reliable performance and a premium feel. This is demo product content ready to be replaced with your real catalogue data.</p><h2>${money(p.price)}</h2><button class="add" data-modal-add="${p.id}">Add to Cart →</button></div></div>`;$("#productModal").classList.add("show");$("#overlay").classList.add("show")}
function openCart(){$("#cartDrawer").classList.add("open");$("#overlay").classList.add("show")}
function closeAll(){$("#cartDrawer").classList.remove("open");$("#productModal").classList.remove("show");$("#checkoutModal").classList.remove("show");$("#accountModal").classList.remove("show");$("#ordersModal").classList.remove("show");$("#overlay").classList.remove("show")}
function checkout(){if(!cart.length){toast("Your cart is empty");return}$("#checkoutSummary").innerHTML=cart.map(x=>{let p=products.find(p=>p.id===x.id);return `<div class="summary-row"><span>${p.name} × ${x.qty}</span><b>${money(p.price*x.qty)}</b></div>`}).join("")+`<div class="summary-row"><b>Total</b><b>${$("#total").textContent}</b></div>`;$("#cartDrawer").classList.remove("open");$("#checkoutModal").classList.add("show")}
let timer;function toast(t){$("#toast").textContent=t;$("#toast").classList.add("show");clearTimeout(timer);timer=setTimeout(()=>$("#toast").classList.remove("show"),1700)}
document.addEventListener("click",e=>{
 let a=e.target.closest("[data-add]");if(a){add(+a.dataset.add);return}
 let h=e.target.closest("[data-heart]");if(h){h.textContent=h.textContent==="♡"?"♥":"♡";return}
 let q=e.target.closest("[data-qty]");if(q){let x=cart.find(i=>i.id===+q.dataset.qty);x.qty+=+q.dataset.d;if(x.qty<=0)cart=cart.filter(i=>i.id!==x.id);save();renderCart();return}
 let r=e.target.closest("[data-remove]");if(r){cart=cart.filter(i=>i.id!==+r.dataset.remove);save();renderCart();return}
 let c=e.target.closest("[data-cat]");if(c){activeCat=c.dataset.cat;$("#search").value="";render();document.querySelector("#shop").scrollIntoView();return}
 let f=e.target.closest("[data-filter]");if(f){activeCat=f.dataset.filter;render();return}
 let rt=e.target.closest("[data-rating]");if(rt){minRating=+rt.dataset.rating;render();return}
 let ma=e.target.closest("[data-modal-add]");if(ma){add(+ma.dataset.modalAdd);closeAll();return}
});
$("#search").addEventListener("input",render);$("#searchCategory").addEventListener("change",render);$("#sort").addEventListener("change",render);
$("#minPrice").addEventListener("input",e=>{min=+e.target.value||0;render()});$("#maxPrice").addEventListener("input",e=>{max=+e.target.value||Infinity;render()});
$("#clearFilters").onclick=()=>{activeCat="All";min=0;max=Infinity;minRating=0;$("#minPrice").value="";$("#maxPrice").value="";render()};
$("#filterBtn").onclick=()=>$("#filters").classList.toggle("show");
$("#openCart").onclick=openCart;$("#closeCart").onclick=closeAll;$("#closeModal").onclick=closeAll;$("#overlay").onclick=closeAll;
$("#checkout").onclick=checkout;$("#closeCheckout").onclick=closeAll;$("#closeAccount").onclick=closeAll;$("#closeOrders").onclick=closeAll;
$("#checkoutForm").onsubmit=e=>{
 e.preventDefault();
 if(!currentUser){closeAll();openAccount();toast("Sign in before placing an order");return}
 const payment=e.target.querySelector("select").value;
 const total=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);
 orders.unshift({id:"ORD-"+Math.random().toString(36).slice(2,8).toUpperCase(),userId:currentUser.id,date:new Date().toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"}),status:"Confirmed",payment, total, items:cart.map(x=>{let p=products.find(p=>p.id===x.id);return {name:p.name,price:p.price,qty:x.qty}})});
 saveOrders();cart=[];save();renderCart();e.target.reset();closeAll();toast("Order placed successfully ✓");setTimeout(openOrders,500);
};
$("#account").onclick=openAccount;$("#orders").onclick=openOrders;
$("#openCategories").onclick=()=>$("#categories").scrollIntoView();
$("#products").addEventListener("click",e=>{if(!e.target.closest("button")&&!e.target.closest(".heart")){let p=e.target.closest(".product");if(p){let name=p.querySelector("h3").textContent;let x=products.find(x=>x.name===name);if(x)modal(x.id)}}});
render();renderCart();