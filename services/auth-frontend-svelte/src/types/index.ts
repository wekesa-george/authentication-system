export type Loan = {
    id: string;
    principal: number;
    status: string;
    borrower: string;
    interestRate: number;
    start: string;
    maturity: string;
    ldays: number;
    lDaysPastDue: number;
    interestAccrued: number;
    totalFees: number;
    totalPaid: number;
    totalPayable: number;
  };
   
  