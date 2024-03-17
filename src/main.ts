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
        return this.stringifyObject(obj, 0)
    }

    private static isEnclosedBy(input: string, index: number, char: string[]): boolean 
    {
        // TODO: escaped, char in string
        if ((input.substring(0, index).match(new RegExp("(?<!\/)" + char[0], "g")) || []).length
        == (input.substring(index, input.length).match(new RegExp("(?<!\/)" + char[1], "g")) || []).length) 
        {
            return true
        } 
        else 
        {
            return false
        }
    }

    private static stringifyObject(obj: object, indent: number): string 
    {
        let spcialString: string = ""

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

                    // Check Infinity
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
                            // TODO: multi-line array
                        } 
                        else 
                        {
                            spcialString += " ".repeat(indent) + `${key} = [${value}]\n`
                        }
                    } 
                    else 
                    {
                        spcialString += " ".repeat(indent) + `${key}:\n    ${this.stringifyObject(value, indent + 4)}\n`
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
        && (spcialValue[spcialValue.length - 1] == spcialValue[0])) 
        {
            return spcialValue
        } 
        else if (spcialValue[0] == "[" && spcialValue[spcialValue.length - 1] == "]") 
        {
            let arr = JSON.parse(spcialValue)

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
        let child: string = ""
        let codeArray = srcCode.split('\n')
        
        for (let i = lineNum; i < codeArray.length; i++) 
        {
            if (codeArray[i].length - codeArray[i].trimStart().length 
                > 4 + line.length - line.trimStart().length)
            {
                child += codeArray[i]
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
        let obj = {}

        for (const [lineNum, line] of srcCode.split("\n").entries()) 
        {
            if (line.trim() == '' || line.trim()[0] == "#") 
            {
                // Comments and empty lines
                continue
            } 
            else if (line.trim()[0] == "*") 
            {
                //TODO: check array
            }
            else if (line.trim().slice(line.length - 2, line.length) == ":=")
            {
                // Multi-line array
                let arr: any[] = []

                for (let child of this.getChildren(srcCode, line, lineNum).split("*")) 
                {
                    if (child.trim().length > 0) 
                    {
                        let element: any = null

                        // object type and other types
                        if (child[child.length -1] == ":")
                        {
                            element = this.parse(this.getChildren(srcCode, line, lineNum))
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
    
                return arr
            }
            else if (line.trim()[line.length - 1] == ":") 
            {
                // Object keys
                if (line.match(/[^\w\d\s:]/g) != null) 
                {
                    throw new SpcialSyntaxError(line, lineNum)
                }

                obj[line.trim().replace(":", "")] = this.parse(this.getChildren(srcCode, line, lineNum))              
            } 
            else if (line.includes("=")) 
            {
                // Key-value pairs
                let key = line.split("=")[0]
                let rhs = line.replace(key + "=", "").trim()

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
                        throw new SpcialSyntaxError(line, lineNum)
                    }
                }
            }
            else 
            {
                throw new SpcialSyntaxError(line, lineNum)
            }
        }

        return obj
    }
}