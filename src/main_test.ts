import { Deno } from "https://deno.land/std@0.205.0/assert/mod.ts";
import { Spcial } from "./main.ts";

Deno.test(function addTest() {
    let testInput: string = `
    # Filename: example.spc
    # This is a comment
    hello = 'world'
    root:
        string = 'This is \\'a\\' string'
        number = 12345
        bool_val = True
        nil = Nothing
        array = []
        nestedObj:
            prop1 = 'value1'
            prop2 = ['array', 'inside', 'an', 'object']

    root -> array:
        objInArray:
            isIt = True
    `

    Deno.assertEquals(Spcial.toObjectFromString(testInput), {
        root: {
            string: "This is 'a' string",
            number: 12345,
            "bool_val": true,
            nil: null,
            array: [{
                objInArray: {
                    isIt: true
                }
            }],
            nestedObj : {
                prop1: 'val1',
                prop2: ["array", "inside", "an", "object"]
            }
        }
    });
});
