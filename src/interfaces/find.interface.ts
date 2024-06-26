/**
 * TypeOrm interface options is to use in our functions.
 *  @interface IFindBy - Interface
 * * select - object
 * * relations - string[ ]
 * * where - object
 */
export interface IFindOne {
	select?: object;
	relations?: string[];
}
export interface IFindBy extends IFindOne {
	where: object;
}
export interface IFind extends Partial<IFindBy> {}
