function add() {
  const element = document.getElementById("quantity");
  element.innerText = Number(element.innerText) + 1;
  document.getElementById("asterisk").style.display = "block";
  document.getElementById("asterisk").innerText = element.innerText;
}

function subtract() {
  const element = document.getElementById("quantity");
  console.log(element);

  element.innerText = Number(element.innerText) - 1;
  if (element.innerText == 0) {
    document.getElementById("asterisk").style.display = "none";
    return;
  }
  document.getElementById("asterisk").innerText = element.innerText;
}


