import { assertEquals } from "https://deno.land/std@0.205.0/assert/mod.ts";
import { Spcial } from "./main.ts";

Deno.test(function addTest() {
    const testInput = `
    # This is a comment
    hello = 'world'
    root:
        string = 'This is \'a\' string'
        number = 12345
        bool_val = True
        nil = Nothing
        array :=
            * :
                objInArray = True
        nestedObj:
            prop1 = "value1"
            prop2 = ['array', 'inside', 'an', 'object']
    `

    assertEquals(Spcial.toObjectFromString(testInput), {
        hello: "world",
        root: {
            string: "This is 'a' string",
            number: 12345,
            "bool_val": true,
            nil: null,
            array: [{
                objInArray: true
            }],
            nestedObj : {
                prop1: 'value1',
                prop2: ["array", "inside", "an", "object"]
            }
        }
    });
});

Deno.test(function addTest() {
    assertEquals(Spcial.toSpcialString({
        hello: 'world',
        root: {
            string: "This is 'a' string",
            number: 12345,
            "bool_val": true,
            nil: null,
            array: [{
                objInArray: true
            }],
            nestedObj: {
                prop1: 'value1',
                prop2: ["array", "inside", "an", "object"]
            }
        }
    }), 
`hello = 'world'
root:
    string = 'This is \\'a\\' string'
    number = 12345
    bool_val = True
    nil = Nothing
    array :=
        * :
            objInArray = True
    nestedObj:
        prop1 = 'value1'
        prop2 = ['array','inside','an','object']
`)
})

