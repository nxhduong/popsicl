import { Deno } from "https://deno.land/std@0.205.0/assert/mod.ts";
import { Spcial } from "./main.ts";

Deno.test(function addTest() {
    let testInput: string = `
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

    Deno.assertEquals(Spcial.toObjectFromString(testInput), {
        hello: "world",
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
                prop1: 'value1',
                prop2: ["array", "inside", "an", "object"]
            }
        }
    });
});

Deno.test(function addTest() {
    Deno.assertEquals({
        hello: 'world',
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
    }, `
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
            prop1 = 'value1'
            prop2 = ['array', 'inside', 'an', 'object']
    `)
})