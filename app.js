const convertButton = document.getElementById("convert-button");
const amountInput = document.getElementById("amount");
const message = document.querySelector(".msg");

const fromCurrencyText = document.getElementById("from-currency-text");
const toCurrencyText = document.getElementById("to-currency-text");

const fromCurrencyFlag = document.getElementById("from-flag");
const toCurrencyFlag = document.getElementById("to-flag");

const fromOptions = document.getElementById("from-options");
const toOptions = document.getElementById("to-options");

// Function to update flag based on the selected currency
const updateFlag = (selectElement, flagId, textId) => {
    const countryCode = selectElement.options[selectElement.selectedIndex].dataset.flag;
    const flagImg = document.getElementById(flagId);
    const currencyText = document.getElementById(textId);
    flagImg.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    currencyText.textContent = selectElement.value;
};


const populateCurrencyOptions = (optionsContainer, countries) => {
    optionsContainer.innerHTML = "";
    countries.forEach(([currency, countryCode]) => {
        const optionElement = document.createElement("div");
        optionElement.classList.add("option");
        optionElement.dataset.value = currency;
        optionElement.dataset.flag = countryCode;
        optionElement.innerHTML = `
            <img src="https://flagsapi.com/${countryCode}/flat/64.png" alt="${currency} flag">
            ${currency}
        `;
        optionsContainer.appendChild(optionElement);
        optionElement.addEventListener("click", () => {
            const selectedCurrency = optionElement.dataset.value;
            const selectedFlag = optionElement.dataset.flag;

            // Update selected currency and flag
            if (optionsContainer === fromOptions) {
                fromCurrencyText.textContent = selectedCurrency;
                fromCurrencyFlag.src = `https://flagsapi.com/${selectedFlag}/flat/64.png`;
            } else {
                toCurrencyText.textContent = selectedCurrency;
                toCurrencyFlag.src = `https://flagsapi.com/${selectedFlag}/flat/64.png`;
            }

            optionsContainer.style.display = 'none';
        });
    });
};


document.querySelectorAll('.custom-select').forEach(select => {
    const selectedOption = select.querySelector('.selected-option');
    const options = select.querySelector('.options');

    selectedOption.addEventListener('click', () => {
        options.style.display = options.style.display === 'block' ? 'none' : 'block';
    });
});


const convertCurrency = async () => {
    const amount = amountInput.value;
    const from = fromCurrencyText.textContent;
    const to = toCurrencyText.textContent;

    if (amount <= 0) {
        message.innerText = "Please enter a valid amount.";
        return;
    }

    const url = `https://api.exchangerate-api.com/v4/latest/${from}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const rate = data.rates[to];
        const convertedAmount = (amount * rate).toFixed(2);

        message.innerText = `${amount} ${from} = ${convertedAmount} ${to}`;
    } catch (error) {
        message.innerText = "Error fetching the exchange rate. Please try again.";
    }
};


convertButton.addEventListener("click", convertCurrency);


const countries = [
    ["USD", "US"], ["INR", "IN"], ["EUR", "FR"], ["GBP", "GB"], ["AUD", "AU"],
    ["CAD", "CA"], ["JPY", "JP"], ["CNY", "CN"], ["RUB", "RU"], ["MXN", "MX"]
];


window.onload = () => {
    populateCurrencyOptions(fromOptions, countries);
    populateCurrencyOptions(toOptions, countries);
};
