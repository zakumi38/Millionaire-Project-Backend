export class CreateRiderDto {
  readonly name: string;

  readonly email: string;

  readonly phoneNumber: string;

  readonly overallTotalPayment?: number;

  readonly todayIncome?: number;

  readonly previousPayments?: {
    date: string
    amount: number
  };
}
