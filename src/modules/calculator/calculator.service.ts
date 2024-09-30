import { Injectable } from "@nestjs/common";

import { GetAllBanksDto } from "./dto";

interface BanksResponse {
	name: string;
	monthly_installment: number;
}

interface Bank {
	name: string;
	max_precent: number;
	max_sum: number;
	max_term: number;
}

const banks: Bank[] = [
	{
		name: "Дом РФ (Семейная программа)",
		max_precent: 20,
		max_sum: 12000000,
		max_term: 360,
	},
	{
		name: "Дом РФ (IT-ипотека)",
		max_precent: 20,
		max_sum: 9000000,
		max_term: 360,
	},
	{
		name: "Совкомбанк (Ипотека 11,5% на 4 года)",
		max_precent: 20,
		max_sum: 30000000,
		max_term: 360,
	},
	{
		name: "ВТБ (До сдачи дома)",
		max_precent: 15,
		max_sum: 30000000,
		max_term: 360,
	},
	{
		name: "ВТБ (Ипотека 8% на 2 года)",
		max_precent: 30,
		max_sum: 30000000,
		max_term: 360,
	},
	{
		name: "Альфа-банк (Ипотека 2,98% на 3 года)",
		max_precent: 20,
		max_sum: 30000000,
		max_term: 360,
	},
	{
		name: "Промсвязьбанк (Базовая программа)",
		max_precent: 20,
		max_sum: 50000000,
		max_term: 360,
	},
	{
		name: "Сбербанк (Базовая программа)",
		max_precent: 15,
		max_sum: 100000000,
		max_term: 360,
	},
];

@Injectable()
export class CalculatorService {
	private calcLoan(
		loanAmount: number,
		interestRate: number,
		loanTermMonths: number,
	): number {
		const monthlyRate = interestRate / 12 / 100;

		const numerator =
			monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths);
		const denominator = Math.pow(1 + monthlyRate, loanTermMonths) - 1;

		const monthlyPayment = (loanAmount * numerator) / denominator;

		return monthlyPayment;
	}

	getAllBanks(dto: GetAllBanksDto): BanksResponse[] {
		const loanAmount = dto.premise_price - dto.initial_payment;

		const filteredBanks = banks.filter((bank) => {
			const isLoanAmountSupported = bank.max_sum >= loanAmount;
			const isTermSupported = bank.max_term >= dto.ipoteka_time;

			return isLoanAmountSupported && isTermSupported;
		});

		return filteredBanks.map((bank) => {
			const monthlyPayment = this.calcLoan(
				loanAmount,
				bank.max_precent,
				dto.ipoteka_time,
			);
			return {
				name: bank.name,
				monthly_installment: Math.round(monthlyPayment),
			};
		});
	}
}
