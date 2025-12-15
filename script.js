// --- 1. DATA: Country Code Mapping ---
const countryList = {
    AED: "AE", AFN: "AF", XCD: "AG", ALL: "AL", AMD: "AM", ANG: "AN", AOA: "AO", AQD: "AQ", ARS: "AR", AUD: "AU", AZN: "AZ", BAM: "BA", BBD: "BB", BDT: "BD", XOF: "BE", BGN: "BG", BHD: "BH", BIF: "BI", BMD: "BM", BND: "BN", BOB: "BO", BRL: "BR", BSD: "BS", NOK: "BV", BWP: "BW", BYR: "BY", BZD: "BZ", CAD: "CA", CDF: "CD", XAF: "CF", CHF: "CH", CLP: "CL", CNY: "CN", COP: "CO", CRC: "CR", CUP: "CU", CVE: "CV", CYP: "CY", CZK: "CZ", DJF: "DJ", DKK: "DK", DOP: "DO", DZD: "DZ", ECS: "EC", EEK: "EE", EGP: "EG", ETB: "ET", EUR: "FR", FJD: "FJ", FKP: "FK", GBP: "GB", GEL: "GE", GGP: "GG", GHS: "GH", GIP: "GI", GMD: "GM", GNF: "GN", GTQ: "GT", GYD: "GY", HKD: "HK", HNL: "HN", HRK: "HR", HTG: "HT", HUF: "HU", IDR: "ID", ILS: "IL", INR: "IN", IQD: "IQ", IRR: "IR", ISK: "IS", JMD: "JM", JOD: "JO", JPY: "JP", KES: "KE", KGS: "KG", KHR: "KH", KMF: "KM", KPW: "KP", KRW: "KR", KWD: "KW", KYD: "KY", KZT: "KZ", LAK: "LA", LBP: "LB", LKR: "LK", LRD: "LR", LSL: "LS", LTL: "LT", LVL: "LV", LYD: "LY", MAD: "MA", MDL: "MD", MGA: "MG", MKD: "MK", MMK: "MM", MNT: "MN", MOP: "MO", MRO: "MR", MTL: "MT", MUR: "MU", MVR: "MV", MWK: "MW", MXN: "MX", MYR: "MY", MZN: "MZ", NAD: "NA", XPF: "NC", NGN: "NG", NIO: "NI", NPR: "NP", NZD: "NZ", OMR: "OM", PAB: "PA", PEN: "PE", PGK: "PG", PHP: "PH", PKR: "PK", PLN: "PL", PYG: "PY", QAR: "QA", RON: "RO", RSD: "RS", RUB: "RU", RWF: "RW", SAR: "SA", SBD: "SB", SCR: "SC", SDG: "SD", SEK: "SE", SGD: "SG", SKK: "SK", SLL: "SL", SOS: "SO", SRD: "SR", STD: "ST", SVC: "SV", SYP: "SY", SZL: "SZ", THB: "TH", TJS: "TJ", TMT: "TM", TND: "TN", TOP: "TO", TRY: "TR", TTD: "TT", TWD: "TW", TZS: "TZ", UAH: "UA", UGX: "UG", USD: "US", UYU: "UY", UZS: "UZ", VEF: "VE", VND: "VN", VUV: "VU", YER: "YE", ZAR: "ZA", ZMK: "ZM", ZWD: "ZW", GGP: "GG"
};

// --- 2. VARIABLES ---
const dropList = document.querySelectorAll("select");
const fromCurrency = document.querySelector("#from-currency");
const toCurrency = document.querySelector("#to-currency");
const getButton = document.querySelector("#get-button");
const resultBox = document.querySelector("#result-box");
const rateText = document.querySelector("#rate-text");
const totalResult = document.querySelector("#total-result");
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = themeToggle.querySelector("i");
const htmlEl = document.documentElement;

// --- 3. INITIALIZATION ---
// Populate dropdowns
for (let i = 0; i < dropList.length; i++) {
    for (let currency_code in countryList) {
        // Select USD by default for FROM and INR for TO
        let selected = i == 0 ? (currency_code == "USD" ? "selected" : "") : (currency_code == "INR" ? "selected" : "");

        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    // Add change listener to update flag
    dropList[i].addEventListener("change", e => {
        loadFlag(e.target);
    });
}

// --- 4. FUNCTIONS ---
// Update Flag Image
function loadFlag(element) {
    for (let code in countryList) {
        if (code == element.value) {
            let imgTag = element.parentElement.querySelector("img");
            imgTag.src = `https://flagcdn.com/w80/${countryList[code].toLowerCase()}.png`;
        }
    }
}

// Get Exchange Rate
async function getExchangeRate() {
    const amount = document.querySelector("#amount");
    const exchangeRateTxt = document.querySelector("#rate-text");
    let amountVal = amount.value;

    // Validation
    if (amountVal == "" || amountVal == "0") {
        amount.value = "1";
        amountVal = 1;
    }

    // UI Loading State
    rateText.innerText = "Getting exchange rate...";
    totalResult.innerText = "---";
    resultBox.classList.add("active");

    try {
        // Using a free API
        let url = `https://api.exchangerate-api.com/v4/latest/${fromCurrency.value}`;
        let response = await fetch(url);
        let data = await response.json();

        let exchangeRate = data.rates[toCurrency.value];
        let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);

        // Update UI
        totalResult.innerText = `${totalExchangeRate} ${toCurrency.value}`;
        rateText.innerText = `(1 ${fromCurrency.value} = ${exchangeRate} ${toCurrency.value})`;
    } catch (error) {
        rateText.innerText = "Something went wrong";
        totalResult.innerText = "Error";
    }
}

// --- 5. EVENT LISTENERS ---
// Load rate on page load
window.addEventListener("load", () => {
    getExchangeRate();
});

// Convert Button Click
getButton.addEventListener("click", e => {
    e.preventDefault();
    getExchangeRate();
});

// Swap Icon Click
const exchangeIcon = document.querySelector("#swap-icon");
exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;

    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
});

// Dark/Light Mode Toggle
themeToggle.addEventListener("click", () => {
    const currentTheme = htmlEl.getAttribute("data-theme");
    if (currentTheme === "light") {
        htmlEl.setAttribute("data-theme", "dark");
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
    } else {
        htmlEl.setAttribute("data-theme", "light");
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
    }
});