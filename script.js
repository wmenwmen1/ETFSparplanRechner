document.addEventListener('DOMContentLoaded', () => {
  console.log('ETF Sparplan Rechner UI loaded successfully.');



  // DOM Elements - Savings Plan Accumulation
  const savingsForm = document.getElementById('savings-form');
  const zinsInput = document.getElementById('zins');
  const sparbetrag1_5 = document.getElementById('sparbetrag-1-5');
  const sparbetrag6_10 = document.getElementById('sparbetrag-6-10');
  const sparbetrag11_15 = document.getElementById('sparbetrag-11-15');
  const sparbetrag16_20 = document.getElementById('sparbetrag-16-20');

  // DOM Elements - Savings Table Results
  const eingezahlt5 = document.getElementById('eingezahlt-5');
  const zins5 = document.getElementById('zins-5');
  const vermoegen5 = document.getElementById('vermoegen-5');
  
  const eingezahlt10 = document.getElementById('eingezahlt-10');
  const zins10 = document.getElementById('zins-10');
  const vermoegen10 = document.getElementById('vermoegen-10');
  
  const eingezahlt15 = document.getElementById('eingezahlt-15');
  const zins15 = document.getElementById('zins-15');
  const vermoegen15 = document.getElementById('vermoegen-15');
  
  const eingezahlt20 = document.getElementById('eingezahlt-20');
  const zins20 = document.getElementById('zins-20');
  const vermoegen20 = document.getElementById('vermoegen-20');

  // DOM Elements - Target Goal Savings Calculator
  const targetForm = document.getElementById('target-form');
  const zielZinsInput = document.getElementById('ziel-zins');
  const zielDauerSelect = document.getElementById('ziel-dauer');
  const zielvermoegenInput = document.getElementById('zielvermoegen');
  const zielSparbetragResult = document.getElementById('ziel-sparbetrag-result');
  const targetResultCard = document.getElementById('target-result-card');

  // Helper to format numbers with apostrophe thousands separators and decimal dot (e.g. 1'234.56)
  const formatCurrency = (value) => {
    const parts = value.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    return parts.join('.');
  };

  // Savings Plan Form Submit Handler
  savingsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Read values
    const zins = parseFloat(zinsInput.value);
    const rate1_5 = parseFloat(sparbetrag1_5.value);
    const rate6_10 = parseFloat(sparbetrag6_10.value);
    const rate11_15 = parseFloat(sparbetrag11_15.value);
    const rate16_20 = parseFloat(sparbetrag16_20.value);

    // Monthly interest rate
    const monthlyRate = zins / 100 / 12;
    let currentWealth = 0;
    let totalDeposited = 0;

    const results = {
      5: { deposited: 0, interest: 0, wealth: 0 },
      10: { deposited: 0, interest: 0, wealth: 0 },
      15: { deposited: 0, interest: 0, wealth: 0 },
      20: { deposited: 0, interest: 0, wealth: 0 }
    };

    // Simulate month-by-month for 20 years (240 months)
    for (let month = 1; month <= 240; month++) {
      let monthlySaving = 0;
      if (month <= 60) {
        monthlySaving = rate1_5;
      } else if (month <= 120) {
        monthlySaving = rate6_10;
      } else if (month <= 180) {
        monthlySaving = rate11_15;
      } else {
        monthlySaving = rate16_20;
      }

      totalDeposited += monthlySaving;
      // Compounded monthly, beginning of period (vorschüssig)
      currentWealth = (currentWealth + monthlySaving) * (1 + monthlyRate);

      if (month === 60) {
        results[5] = { deposited: totalDeposited, wealth: currentWealth, interest: currentWealth - totalDeposited };
      } else if (month === 120) {
        results[10] = { deposited: totalDeposited, wealth: currentWealth, interest: currentWealth - totalDeposited };
      } else if (month === 180) {
        results[15] = { deposited: totalDeposited, wealth: currentWealth, interest: currentWealth - totalDeposited };
      } else if (month === 240) {
        results[20] = { deposited: totalDeposited, wealth: currentWealth, interest: currentWealth - totalDeposited };
      }
    }

    // Update table elements
    eingezahlt5.textContent = formatCurrency(results[5].deposited);
    zins5.textContent = formatCurrency(results[5].interest);
    vermoegen5.textContent = formatCurrency(results[5].wealth);

    eingezahlt10.textContent = formatCurrency(results[10].deposited);
    zins10.textContent = formatCurrency(results[10].interest);
    vermoegen10.textContent = formatCurrency(results[10].wealth);

    eingezahlt15.textContent = formatCurrency(results[15].deposited);
    zins15.textContent = formatCurrency(results[15].interest);
    vermoegen15.textContent = formatCurrency(results[15].wealth);

    eingezahlt20.textContent = formatCurrency(results[20].deposited);
    zins20.textContent = formatCurrency(results[20].interest);
    vermoegen20.textContent = formatCurrency(results[20].wealth);
  });

  // Target Goal Form Submit Handler
  targetForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Read values from the target form (its own interest rate field)
    const zins = parseFloat(zielZinsInput.value);
    const dauerYears = parseInt(zielDauerSelect.value, 10);
    const zielvermoegen = parseFloat(zielvermoegenInput.value);

    const monthlyInterestRate = zins / 100 / 12;
    const totalMonths = dauerYears * 12;
    let requiredMonthlySaving = 0;

    if (monthlyInterestRate > 0) {
      // Formula for beginning-of-period monthly payment:
      // P = FV * i / ((1 + i) * ((1 + i)^M - 1))
      const compoundFactor = Math.pow(1 + monthlyInterestRate, totalMonths);
      requiredMonthlySaving = (zielvermoegen * monthlyInterestRate) / ((1 + monthlyInterestRate) * (compoundFactor - 1));
    } else {
      // 0% interest fallback
      requiredMonthlySaving = zielvermoegen / totalMonths;
    }

    // Display result
    zielSparbetragResult.textContent = formatCurrency(requiredMonthlySaving);
    
    // Add visual styling to result card
    targetResultCard.classList.add('active');
  });
});
