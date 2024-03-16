# SPCiaL
***S***imple and ***P***retty ***C***onf***I***gur***A***tion ***L***anguage

SPCial is a Python-like minimal configuration language inspired by JSON.

It is simple, readable, and safe (does not allow expressions evaluation).

This repo contains a TypeScript SPCial parser (WIP) which you can include as a library.

```
    # Filename: example.spc
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
            prop1 = 'value1'
            prop2 = ['array', 'inside', 'an', 'object']
```
## Contribute to this project
All contributions and suggestions are greatly appreciated
## License
[MIT](./LICENSE)