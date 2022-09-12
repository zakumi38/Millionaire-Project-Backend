interface previousPayment {
    date: string
    amount: number
}

export class CreateRiderDto {
    readonly name: string

    readonly email: string

    readonly phoneNumber: string

    readonly previousPayments?: previousPayment[]
}
