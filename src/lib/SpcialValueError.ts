// deno-lint-ignore-file no-explicit-any

export { SpcialValueError }

class SpcialValueError extends Error 
{
    constructor(value: any) 
    {
        super("Invalid value: " + value.toString())
    }
}