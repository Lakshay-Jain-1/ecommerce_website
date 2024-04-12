const socket = io();

// appending data in chat box
let text ;
function send() {
  const ele = document.createElement("h6");
  ele.innerText = document.getElementById("input").value;
  
  document.getElementById("chatbox").appendChild(ele);
  socket.emit("message",{msg:`${document.getElementById("input").value}`})
  

}



async function fetchData() {
  try {
    const response = await fetch("http://localhost:3000/product");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    productdata(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchData();
function productdata(data) {
  data.forEach((ele) => {
    let parent = document.createElement("div");
    parent.setAttribute("class", "product-container");

    let sub_parent = document.createElement("div");
    sub_parent.setAttribute("class", "product-card");

    let image = new Image();
    image.src = ele.image;
    image.setAttribute("id", "product-image");
    sub_parent.appendChild(image);

    let text = document.createElement("h4");
    text.innerText = ele.name;
    text.style.textAlign = "center";

    let details = document.createElement("h5");
    details.innerText = ele.details;

    let sub_subparent = document.createElement("div");
    sub_subparent.setAttribute("class", "cart");

    let button1 = document.createElement("button");
    button1.setAttribute("class", "plus");
    button1.innerText = "+";
    button1.setAttribute("value", ele.name);

    let button2 = document.createElement("button");
    button2.setAttribute("class", "minus");
    button2.innerText = "-";
    button2.setAttribute("value", ele.name);

    // Append elements
    sub_subparent.appendChild(button1);

    sub_subparent.appendChild(button2);

    sub_parent.appendChild(text);
    sub_parent.appendChild(details);
    sub_parent.appendChild(sub_subparent);

    parent.appendChild(sub_parent);
    document.getElementById("megaproduct-container").appendChild(parent);
  });
}

// Function to add quantity

setTimeout(() => {
  document.querySelectorAll("button.plus").forEach((ele) => {
    ele.addEventListener("click", (event) => {
      document.getElementById("asterisk").innerText =
        Number(document.getElementById("asterisk").innerText) + 1;

      if (localStorage.getItem(ele.value)) {
        localStorage.setItem(
          ele.value,
          Number(localStorage.getItem(ele.value)) + 1
        );
      } else {
        localStorage.setItem(ele.value, 1);
      }

      document.getElementById("asterisk").style.display = "block";
    });
  });

  document.querySelectorAll("button.minus").forEach((ele) => {
    ele.addEventListener("click", (event) => {
      const element = document.getElementById("asterisk");

      if (Number(element.innerText) == 0) {
        document.getElementById("asterisk").style.display = "none";
        return;
      }

      if (localStorage.getItem(ele.value)) {
        localStorage.setItem(
          ele.value,
          Number(localStorage.getItem(ele.value)) - 1
        );
      }

      element.innerText = Number(element.innerText) - 1;
    });
  });
}, 100);


// for opening form 
function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}
