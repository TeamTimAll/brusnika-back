import { Injectable } from "@nestjs/common";

import { pmtBigint } from "../../lib/number";

import { GetAllBanksDto } from "./dto/GetAllBanks.dto";

interface BanksResponse {
	name: string;
	monthly_installment: number;
}

interface Bank {
	name: string;
	max_precent: number;
	max_sum: bigint;
	max_term: number;
	precent: number;
}

const banks: Bank[] = [
	{
		name: "Дом РФ (Семейная программа)",
		max_precent: 20,
		max_sum: 12000000n,
		max_term: 360,
		precent: 6,
	},
	{
		name: "Дом РФ (IT-ипотека)",
		max_precent: 20,
		max_sum: 9000000n,
		max_term: 360,
		precent: 6,
	},
	{
		name: "Совкомбанк (Ипотека 11,5% на 4 года)",
		max_precent: 20,
		max_sum: 30000000n,
		max_term: 360,
		precent: 11.5,
	},
	{
		name: "ВТБ (До сдачи дома)",
		max_precent: 15,
		max_sum: 30000000n,
		max_term: 360,
		precent: 11.5,
	},
	{
		name: "ВТБ (Ипотека 8% на 2 года)",
		max_precent: 30,
		max_sum: 30000000n,
		max_term: 360,
		precent: 8.0,
	},
	{
		name: "Альфа-банк (Ипотека 2,98% на 3 года)",
		max_precent: 20,
		max_sum: 30000000n,
		max_term: 360,
		precent: 2.98,
	},
	{
		name: "Промсвязьбанк (Базовая программа)",
		max_precent: 20,
		max_sum: 50000000n,
		max_term: 360,
		precent: 19.4,
	},
	{
		name: "Сбербанк (Базовая программа)",
		max_precent: 15,
		max_sum: 100000000n,
		max_term: 360,
		precent: 20.0,
	},
] as const;

@Injectable()
export class CalculatorService {
	getAllBanks(dto: GetAllBanksDto): BanksResponse[] {
		const amount = dto.premise_price - dto.initial_payment;

		const filteredBanks = banks.filter(
			(b) =>
				b.max_precent >= dto.precent &&
				b.max_sum >= amount &&
				b.max_term >= dto.ipoteka_time,
		);
		filteredBanks;

		pmtBigint(dto.precent / 100 / 12, dto.ipoteka_time, amount);

		return [];
		// return [
		// 	{
		// 		name: "Sberbank (SBER)",
		// 		monthly_installment: this.calcLoan(
		// 			faker.number.int({
		// 				min: 500000,
		// 				max: 1000000,
		// 			}),
		// 			dto.initial_payment,
		// 			dto.ipoteka_time,
		// 			dto.precent,
		// 		),
		// 	},
		// 	{
		// 		name: "VTB (VTBR)",
		// 		monthly_installment: this.calcLoan(
		// 			faker.number.int({
		// 				min: 500000,
		// 				max: 1000000,
		// 			}),
		// 			dto.initial_payment,
		// 			dto.ipoteka_time,
		// 			dto.precent,
		// 		),
		// 	},
		// 	{
		// 		name: "Gazprombank (GAZP)",
		// 		monthly_installment: this.calcLoan(
		// 			faker.number.int({
		// 				min: 500000,
		// 				max: 1000000,
		// 			}),
		// 			dto.initial_payment,
		// 			dto.ipoteka_time,
		// 			dto.precent,
		// 		),
		// 	},
		// 	{
		// 		name: "Promsvyazbank.",
		// 		monthly_installment: this.calcLoan(
		// 			faker.number.int({
		// 				min: 500000,
		// 				max: 1000000,
		// 			}),
		// 			dto.initial_payment,
		// 			dto.ipoteka_time,
		// 			dto.precent,
		// 		),
		// 	},
		// 	{
		// 		name: "Russian Agricultural Bank.",
		// 		monthly_installment: this.calcLoan(
		// 			faker.number.int({
		// 				min: 500000,
		// 				max: 1000000,
		// 			}),
		// 			dto.initial_payment,
		// 			dto.ipoteka_time,
		// 			dto.precent,
		// 		),
		// 	},
		// ];
	}
}
