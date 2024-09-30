import { Injectable } from "@nestjs/common";

import { GetAllBanksDto } from "./dto";

interface BanksResponse {
	name: string;
	monthly_installment: number;
	program_name: string;
	program_description?: string | null;
}

interface Bank {
	name: string;
	max_percent: number;
	percent: number;
	max_sum: number;
	max_term: number;
	program_name: string;
	program_description?: string | null;
}

const banks: Bank[] = [
	{
		name: "Дом РФ",
		max_percent: 20,
		max_sum: 12000000,
		max_term: 360,
		program_name: "Семейная программа",
		program_description: null,
		percent: 6,
	},
	{
		name: "Дом РФ",
		max_percent: 20,
		max_sum: 9000000,
		max_term: 360,
		program_name: "IT-ипотека",
		program_description: null,
		percent: 6,
	},
	{
		name: "Совкомбанк",
		max_percent: 20,
		max_sum: 30000000,
		max_term: 360,
		program_name: "Ипотека 11,5% на 4 года",
		program_description:
			"С 5го года ставка 21,74%. Ставка работает без субсидирования и без удорожания стоимости квартиры",
		percent: 11.5,
	},
	{
		name: "ВТБ",
		max_percent: 15,
		max_sum: 30000000,
		max_term: 360,
		program_name: "До сдачи дома",
		program_description: null,
		percent: 11.5,
	},
	{
		name: "ВТБ",
		max_percent: 30,
		max_sum: 30000000,
		max_term: 360,
		program_name: "Ипотека 8% на 2 года",
		program_description: null,
		percent: 8,
	},
	{
		name: "Альфа-банк",
		max_percent: 20,
		max_sum: 30000000,
		max_term: 360,
		program_name: "Ипотека 2,98% на 3 года",
		program_description: null,
		percent: 2.98,
	},
	{
		name: "Промсвязьбанк",
		max_percent: 20,
		max_sum: 50000000,
		max_term: 360,
		program_name: "Базовая программа",
		program_description: null,
		percent: 19.4,
	},
	{
		name: "Сбербанк",
		max_percent: 15,
		max_sum: 100000000,
		max_term: 360,
		program_name: "Базовая программа",
		program_description: null,
		percent: 20,
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
		const initialPaymentPercentage =
			(dto.initial_payment / dto.premise_price) * 100;

		const filteredBanks = banks.filter((bank) => {
			const isLoanAmountSupported = bank.max_sum >= loanAmount;
			const isTermSupported = bank.max_term >= dto.ipoteka_time;
			const isInitialPaymentSupported =
				initialPaymentPercentage >= bank.max_percent;

			return (
				isLoanAmountSupported &&
				isTermSupported &&
				isInitialPaymentSupported
			);
		});

		return filteredBanks.map((bank) => {
			const monthlyPayment = this.calcLoan(
				loanAmount,
				bank.percent,
				dto.ipoteka_time,
			);
			return {
				name: bank.name,
				monthly_installment: Math.round(monthlyPayment),
				program_description: bank.program_description,
				program_name: bank.program_name,
			};
		});
	}
}
