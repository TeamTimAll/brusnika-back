import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

import { GetAllBanksDto } from "./dto/GetAllBanks.dto";

interface Banks {
	name: string;
	monthly_installment: number;
}

@Injectable()
export class CalculatorService {
	getAllBanks(dto: GetAllBanksDto): Banks[] {
		return [
			{
				name: "Sberbank (SBER)",
				monthly_installment: this.calcLoan(
					faker.number.int({
						min: 500000,
						max: 1000000,
					}),
					dto.initial_payment,
					dto.ipoteka_time,
					dto.precent,
				),
			},
			{
				name: "VTB (VTBR)",
				monthly_installment: this.calcLoan(
					faker.number.int({
						min: 500000,
						max: 1000000,
					}),
					dto.initial_payment,
					dto.ipoteka_time,
					dto.precent,
				),
			},
			{
				name: "Gazprombank (GAZP)",
				monthly_installment: this.calcLoan(
					faker.number.int({
						min: 500000,
						max: 1000000,
					}),
					dto.initial_payment,
					dto.ipoteka_time,
					dto.precent,
				),
			},
			{
				name: "Promsvyazbank.",
				monthly_installment: this.calcLoan(
					faker.number.int({
						min: 500000,
						max: 1000000,
					}),
					dto.initial_payment,
					dto.ipoteka_time,
					dto.precent,
				),
			},
			{
				name: "Russian Agricultural Bank.",
				monthly_installment: this.calcLoan(
					faker.number.int({
						min: 500000,
						max: 1000000,
					}),
					dto.initial_payment,
					dto.ipoteka_time,
					dto.precent,
				),
			},
		];
	}

	private calcLoan(
		random_number: number,
		initial_pay: number,
		ipoteka_time: number,
		percent: number,
	): number {
		return random_number - (initial_pay / ipoteka_time) * percent;
	}
}
