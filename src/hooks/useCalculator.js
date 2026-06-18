import { useMemo } from 'react';

const CURRENCY_SYMBOLS = {
  USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥', AUD: 'A$', CAD: 'C$',
};

export function useCalculator(state, avatarColors) {
  const { people, items, tip, tax, currency } = state;

  const currencySymbol = CURRENCY_SYMBOLS[currency] || '$';

  const formatAmount = (amount) => {
    const symbol = currencySymbol;
    return `${symbol}${Math.abs(amount).toFixed(2)}`;
  };

  const calculations = useMemo(() => {
    if (people.length === 0 || items.length === 0) {
      return {
        subtotal: 0,
        tipAmount: 0,
        taxAmount: 0,
        grandTotal: 0,
        perPerson: {},
        settlements: [],
        balances: {},
      };
    }

    // ── Subtotal ──────────────────────────────────────────
    const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);

    // ── Per-person raw totals (before tip/tax) ────────────
    const rawTotals = {};
    people.forEach(p => rawTotals[p.id] = 0);

    items.forEach(item => {
      const amount = item.amount || 0;
      if (item.assignedTo === 'all') {
        const share = amount / people.length;
        people.forEach(p => rawTotals[p.id] += share);
      } else {
        if (rawTotals[item.assignedTo] !== undefined) {
          rawTotals[item.assignedTo] += amount;
        }
      }
    });

    // ── Tip & Tax ─────────────────────────────────────────
    const tipAmount = subtotal * (tip / 100);
    const taxAmount = subtotal * (tax / 100);
    const grandTotal = subtotal + tipAmount + taxAmount;

    // Distribute tip+tax proportionally
    const extraMultiplier = 1 + (tip / 100) + (tax / 100);
    const perPerson = {};
    people.forEach(p => {
      perPerson[p.id] = rawTotals[p.id] * extraMultiplier;
    });

    // ── Settlements ────────────────────────────────────────
    // Use average-based: everyone should pay grandTotal / people.length
    const perPersonShare = grandTotal / people.length;

    // Balance = how much each person owes vs what they'd owe equally
    // Positive balance = owed money, negative = owes money
    const balances = {};
    people.forEach(p => {
      balances[p.id] = perPersonShare - perPerson[p.id];
    });

    // Greedy settlement algorithm to minimize transactions
    const debtors = [];
    const creditors = [];
    people.forEach(p => {
      const bal = balances[p.id];
      if (bal > 0.005) debtors.push({ id: p.id, amount: bal });
      else if (bal < -0.005) creditors.push({ id: p.id, amount: -bal });
    });

    const settlements = [];
    let di = 0, ci = 0;
    while (di < debtors.length && ci < creditors.length) {
      const d = { ...debtors[di] };
      const c = { ...creditors[ci] };
      const amount = Math.min(d.amount, c.amount);
      if (amount > 0.005) {
        settlements.push({ from: d.id, to: c.id, amount });
      }
      debtors[di].amount -= amount;
      creditors[ci].amount -= amount;
      if (debtors[di].amount < 0.005) di++;
      if (creditors[ci].amount < 0.005) ci++;
    }

    return { subtotal, tipAmount, taxAmount, grandTotal, perPerson, settlements, balances };
  }, [people, items, tip, tax]);

  const getPersonById = (id) => people.find(p => p.id === id);
  const getPersonColor = (person) => person ? avatarColors[person.colorIdx] : null;
  const getPersonInitials = (name) => {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  return { calculations, currencySymbol, formatAmount, getPersonById, getPersonColor, getPersonInitials };
}
