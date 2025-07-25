import React, { useState } from 'react';
import { db } from '../firebase';

const taxBrackets = [
  { limit: 237100, rate: 0.18 },
  { limit: 370500, rate: 0.26 },
  { limit: 512800, rate: 0.31 },
  { limit: 673000, rate: 0.36 },
  { limit: 857900, rate: 0.39 },
  { limit: 1817000, rate: 0.41 },
  { limit: Infinity, rate: 0.45 }
];

const TaxCalculator = () => {
  const [amount, setAmount] = useState(0);
  const [tax, setTax] = useState(0);
  const [reserve, setReserve] = useState(0);
  
  const calculateTax = () => {
    let remaining = amount;
    let calculatedTax = 0;
    
    for (const bracket of taxBrackets) {
      if (remaining <= 0) break;
      const taxable = Math.min(remaining, bracket.limit);
      calculatedTax += taxable * bracket.rate;
      remaining -= bracket.limit;
    }
    
    setTax(calculatedTax);
    setReserve(calculatedTax * 0.25); // 25% reserve
  };

  return (
    <div className="tax-calculator">
      <h2>SARS Tax Calculator</h2>
      <div>
        <label>Amount (ZAR): </label>
        <input 
          type="number" 
          value={amount} 
          onChange={e => setAmount(parseFloat(e.target.value))} 
        />
        <button onClick={calculateTax}>Calculate</button>
      </div>
      
      {tax > 0 && (
        <div className="results">
          <p>Estimated Tax: R{tax.toFixed(2)}</p>
          <p>Recommended Reserve (25%): R{reserve.toFixed(2)}</p>
          <button onClick={() => db.collection('tax_reserve').add({ amount: reserve })}>
            Add to Reserve
          </button>
        </div>
      )}
    </div>
  );
};

export default TaxCalculator;
