// deno-lint-ignore-file no-explicit-any

import { SpcialSyntaxError } from "./lib/SpcialSyntaxError.ts"
import { SpcialValueError } from "./lib/SpcialValueError.ts"

export { Spcial }

class Spcial 
{
    /**
     * Outputs equivalent JavaScript object from SPCiaL string
     * @param spcialString SPCiaL string
     * @returns Native JS object
     */
    public static toObjectFromString(spcialString: string): object
    {
        return this.parse(spcialString)
    }

    /**
     * Converts a Javascript object to a SPCiaL string
     * @param obj JS object as input
     * @returns SPCiaL string
     */
    public static toSpcialString(obj: object): string
    {
        return this.toSpcialEquivalent(obj, 0)
    }

    // This function converts each key-value pair
    public static toSpcialEquivalent(obj: object, indent: number)
    {
        let spcialString = ""

        if (Array.isArray(obj)) {
            throw new SpcialValueError(obj)
        }

        for (const [key, value] of Object.entries(obj)) 
        {
            switch (typeof value) 
            {
                case "string":
                    spcialString += " ".repeat(indent) + `${key} = '${value.replace("'", "\\'")}\n'`
                    break
                    
                case "number":
                    if (Number.isNaN(value)) 
                    {
                        throw new SpcialValueError(value)
                    }

                    // Check for Infinity
                    try
                    {
                        JSON.parse(value.toString())
                    } 
                    catch
                    {
                        throw new SpcialValueError(value)
                    } 

                    spcialString += " ".repeat(indent) + `${key} = ${value}\n`
                    break

                case "boolean":
                    spcialString += " ".repeat(indent) + `${key} = ${value? "True" : "False"}\n`
                    break

                case "object":
                    if (value == null)
                    {
                        spcialString += " ".repeat(indent) + `${key} = Nothing\n`
                    }

                    if (Array.isArray(value)) 
                    {
                        for (let i = 1; i < value.length; i++) 
                        {
                            if (typeof value[i - 1] != typeof value[i]) 
                            {
                                throw new SpcialValueError(value)
                            }
                        }

                        if (value.findIndex((element) => typeof element == "object") != -1) 
                        {
                            spcialString += " ".repeat(indent) + `${key} :=`

                            for (const element of value)
                            {
                                spcialString += " ".repeat(indent + 4) + `* ${element.toSpcialEquivalent(element, 0).replace(`${key} =`, "").trim()}`
                            }
                        } 
                        else 
                        {
                            let arrString = ""

                            for (const element of value)
                            {
                                // Convert but remove the "key =" part
                                arrString += this.toSpcialEquivalent(element, 0).replace(`${key} =`, "") + ","
                            }

                            spcialString += " ".repeat(indent) + `${key} = [${arrString}]\n`
                        }
                    } 
                    else 
                    {
                        spcialString += " ".repeat(indent) + `${key}:\n${this.toSpcialEquivalent(value, indent + 4)}`
                    }
                    break

                default:
                    throw new SpcialValueError(value)
            }
        }

        return spcialString
    }

    /**
     * Converts SPCiaL values to corresponding native values
     * @param spcialValue 
     * @returns JS/TS equivalent value
     */
    private static evaluate(spcialValue: string): any
    {
        spcialValue = spcialValue.trim()

        if (spcialValue == "True") 
        {
            return true
        } 
        else if (spcialValue == "False") 
        {
            return false
        } 
        else if (spcialValue == "Nothing") 
        {
            return null
        } 
        else if (!Number.isNaN(Number(spcialValue))) 
        {
            return Number(spcialValue)
        } 
        else if ((spcialValue[0] == "'" || spcialValue[0] == "\"") 
        && (spcialValue.slice(-1) == spcialValue[0])) 
        {
            // TODO: ignore '/' case
            return spcialValue.slice(1, -1).replaceAll("\\" + "'", "\'").replaceAll("\\" + '"', "\"")
        } 
        else if (spcialValue[0] == "[" && spcialValue.slice(-1) == "]") 
        {
            const arr = JSON.parse(spcialValue)

            for (let i = 1; i < arr.length; i++) 
            {
                if (typeof arr[i - 1] != typeof arr[i]) 
                {
                    throw new SpcialValueError(arr)
                }
            }

            if (arr.findIndex((element: any) => typeof element == "object" && !Array.isArray(element)) != -1) 
            {
                throw new SpcialSyntaxError()
            } 
            else 
            {
                return arr
            }
        } 
        else 
        {
            throw new SpcialSyntaxError()
        }
    }

    private static getChildren(srcCode: string, line: string, lineNum: number) 
    {
        let child = ""
        const codeArray = srcCode.split('\n')
        
        for (let i = lineNum + 1; i < codeArray.length; i++) 
        {
            if (codeArray[i].length - codeArray[i].trimStart().length 
                >= 4 + line.length - line.trimStart().length)
            {
                child += codeArray[i] + "\n"
            }
            else
            {
                break
            }
        }

        return child
    }

    private static parse(srcCode: string): object
    {
        const obj: {[key: string]: any} = {}
        const linesOfCode = srcCode.split("\n")

        for (let lineNum = 0; lineNum < linesOfCode.length; lineNum++)
        {
            if (linesOfCode[lineNum].trim() == '' || linesOfCode[lineNum].trim()[0] == "#") 
            {
                // Ignore comments and empty lines
                continue
            } 
            else if (linesOfCode[lineNum].trim()[0] == "*") 
            {
                //TODO: check if element is child of an array
            }
            else if (linesOfCode[lineNum].trim().slice(-2) == ":=")
            {
                // Multi-line array
                const arr = []
                const elements = this.getChildren(srcCode, linesOfCode[lineNum], lineNum).split("*")

                for (const child of elements) 
                {
                    if (child.trim().length > 0) 
                    {
                        let element = null

                        // Object and other types
                        if (child.split("\n")[0].slice(-1) == ":")
                        {
                            element = this.parse(this.getChildren(srcCode, linesOfCode[lineNum], lineNum))
                        }
                        else
                        {
                            element = this.evaluate(child.trim())
                        }

                        // Array elements must be the same type
                        if (arr.length > 0 && typeof element != typeof arr[arr.length - 1])
                        {
                            throw new SpcialValueError(element)
                        }
                        else
                        {
                            arr.push(element)
                        }
                    }
                }
                obj[linesOfCode[lineNum].replace(":=", "").trim()] = arr

                // Skip lines
                lineNum += elements.length
            }
            else if (linesOfCode[lineNum].trim().split("").pop() == ":") 
            {
                // Object keys
                if (linesOfCode[lineNum].match(/[^\w\d\s:]/g) != null) 
                {
                    throw new SpcialSyntaxError(linesOfCode[lineNum], lineNum)
                }

                const children = this.getChildren(srcCode, linesOfCode[lineNum], lineNum)
                obj[linesOfCode[lineNum].trim().replace(":", "")] = this.parse(children)
                
                // Skip lines
                lineNum += children.length
            } 
            else if (linesOfCode[lineNum].includes("=")) 
            {
                // Key-value pairs
                const key = linesOfCode[lineNum].split("=")[0]
                let rhs = linesOfCode[lineNum].replace(key + "=", "").trim()

                // Remove comments
                for (let i = rhs.length - 1; i >= 0; i--) 
                {
                    if (rhs[i] == "'" || rhs[i] == "\"") 
                    {
                        break
                    } 
                    else if (rhs[i] == "#") 
                    {
                        rhs = rhs.substring(0, i).trim()
                    }
                }

                try 
                {
                    obj[key.trim()] = this.evaluate(rhs)
                }
                catch (err)
                {
                    if (err instanceof SpcialSyntaxError) 
                    {
                        throw new SpcialSyntaxError(linesOfCode[lineNum], lineNum)
                    }
                }
            }
            else 
            {
                throw new SpcialSyntaxError(linesOfCode[lineNum], lineNum)
            }
        }

        return obj
    }
}

let testInput = `
# This is a comment
hello = 'world'
root:
    string = 'This is \\'a\\' string'
    number = 12345
    bool_val = True
    nil = Nothing
    array :=
        * objInArray:
            isIt = True
    nestedObj:
        prop1 = "value1"
        prop2 = ['array', 'inside', 'an', 'object']
`
console.log(Spcial.toObjectFromString(testInput))