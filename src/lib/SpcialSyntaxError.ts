export { SpcialSyntaxError }

class SpcialSyntaxError extends SyntaxError 
{
    constructor(line?: string, lineNum?: number) 
    {
        super("Syntax error at line number " + lineNum ?? "" + ": " + line ?? "")
    }
}