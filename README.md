# SPCiaL
***S***imple and ***P***retty ***C***onf***I***gur***A***tion ***L***anguage

SPCial is a Python-like minimal configuration language inspired by JSON.
This repo contains a TypeScript SPCial parser

```
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
```
