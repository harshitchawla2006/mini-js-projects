const BASE_URL = "https://api.exchangerate-api.com/v4/latest/";

const dropdowns = document.querySelectorAll("select");
const btn = document.querySelector("button");
const fromCurr = dropdowns[0];
const toCurr = dropdowns[1];
const msg = document.querySelector(".msg");
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;
    if ((select.name === "from" && currCode === "USD") || (select.name === "to" && currCode === "INR")) { // for initial
      option.selected = true;
    }
    select.append(option);
  }

  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
}
function updateFlag(select) {
  const currCode = select.value;
  const img = select.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryList[currCode]}/flat/64.png`;
}

// Convert currency
btn.addEventListener("click", async () => {
  const amountInput = document.querySelector("input");
  let amount = parseFloat(amountInput.value); // string to floating point number
  if (isNaN(amount) || amount <= 0) {
    msg.innerText = "Please enter a valid amount";
    return;
  }

  const from = fromCurr.value;
  const to = toCurr.value;

  try {
    const response = await fetch(`${BASE_URL}${from}`); // fetching url
    if (!response.ok) throw new Error("Network error");

    const data = await response.json(); //asking for reponse in form of object
    const rate = data.rates[to]; // extracting rate from that object acc to toCurr.value 
    const finalAmount = (amount * rate).toFixed(2); // final amt cal
    msg.innerText = `${amount} ${from} = ${finalAmount} ${to}`;
  } catch (error) {
    msg.innerText = "Failed to fetch exchange rate";
    console.error(error);
  }
});
