const LoanDetail = require('../models/loanDetail');

function calculateMonthlyPayment(loanAmount, interestRate, termInYears) {
  const principal = parseFloat(loanAmount);
  const annualRate = parseFloat(interestRate) / 100;
  const termMonths = parseInt(termInYears) * 12;
  if (annualRate === 0) {
    return +(principal / termMonths).toFixed(2);
  }
  const monthlyRate = annualRate / 12;
  const denominator = Math.pow(1 + monthlyRate, termMonths) - 1;
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / denominator;
  return +payment.toFixed(2);
}

async function createLoan(loanData) {
  const monthlyPayment = calculateMonthlyPayment(
    loanData.loanAmount,
    loanData.interestRate,
    loanData.termInYears
  );
  const record = await LoanDetail.create({
    ...loanData,
    monthlyPayment
  });
  return record;
}

async function getLoanById(loanId) {
  const record = await LoanDetail.findByPk(loanId);
  return record;
}

async function updateLoan(loanId, updates) {
  const loan = await LoanDetail.findByPk(loanId);
  if (!loan) throw new Error('Loan not found.');
  Object.assign(loan, updates);
  if ('loanAmount' in updates || 'interestRate' in updates || 'termInYears' in updates) {
    loan.monthlyPayment = calculateMonthlyPayment(
      loan.loanAmount,
      loan.interestRate,
      loan.termInYears
    );
  }
  await loan.save();
  return loan;
}

async function deleteLoan(loanId) {
  const loan = await LoanDetail.findByPk(loanId);
  if (!loan) throw new Error('Loan not found.');
  await loan.destroy();
}

async function listLoans() {
  return await LoanDetail.findAll();
}

module.exports = {
  createLoan,
  getLoanById,
  updateLoan,
  deleteLoan,
  listLoans,
  calculateMonthlyPayment
};
