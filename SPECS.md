# SPCIAL Specifications
SPCiaL files have the extension of `.spc`
```
    # This is a comment
    hello = 'world'
    root:
        string = 'This is \\'a\\' string'
        number = 12345
        bool_val = True
        nil = Nothing
        array = :=
            * objInArray:
                isIt = True
        nestedObj:
            prop1 = 'value1'
            prop2 = ['array', 'inside', 'an', 'object']
```
## Comments
Comments start with `#`:
    
    # This is a comment
## Indentation
Child must be indented **exactly `4` spaces** from the parent

    parent:
        child
## Key-value pairs
Syntax:

    Key = Value
## Data types and structures
### Strings
Strings must be single-quoted:

    'This is a string'

Multi-line strings are not allowed (yet)
### Numbers
    -123.456e+789
### Booleans: `True` and `False`
### Null value: `Nothing`
### Arrays
Elements in array must have the same type
Single-line array:

    array = [1, 2, 3]

Multi-line array:

    array :=
        * 1
        * 2
        * 3