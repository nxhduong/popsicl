# SPCIAL Specifications
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

Strings can span multiple lines with string concatenation operator `&':

    # Value: str1str2str3
    multiLineString = 'str1'
        & 'str2'
        & 'str3'
### Numbers
    -123.456e+789
### Booleans: `True` and `False`
### Null value: `Nothing`
### Arrays
Single-line array:

    array = [1, 2, 3]

Multi-line array:

    array = @
        | 1
        | 2
        | 3
#### Objects inside arrays
Object inside arrays must be declared separately, using `->`:

    rootObject -> arrayName:
        objInsideArray1:
            value = 1
        objInsideArray2:
            value = 2