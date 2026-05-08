// -Path: "cli/src/types/type.ts"
/**
 * Get union type of all values in a const object
 */
export type KeyConst<Const extends Record<string, unknown>> = Const[keyof Const];