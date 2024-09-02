export interface LocalId {
	id: string;
	system: string;
}

export interface CounterAgent {
	id: string;
	type: string;
	isClient: boolean;
	localIds: LocalId[];
	name: string;
	inn: string;
	passport: string;
	registeredAddress: string;
	actualAddress: string;
	organizationName: string;
	organizationFullName: string;
	kpp: string;
	ogrn: string;
}
