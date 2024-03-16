export { SpcialValueError }

class SpcialValueError extends Error 
{
    constructor(value: any) 
    {
        super("Invalid value: " + value.toString())
    }
}