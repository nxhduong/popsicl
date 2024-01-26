# SPCiaL
***S***imple and ***P***opular ***C***onf***I***gur***A***tion ***L***anguage

SPCial is a Python-like minimal configuration language inspired by JSON.

```
* Filename: example.spcl
**
This is a
multi-line comment
**
  root:
    string = "This is a string"
    number = 12345
    "boolean value" = True
    null = Nothing
    array = ["element1", 2, false, null, {"nested": "object"}]
    "nested object":
      property1 = "value1"
      property2 = 2
      "property 3" = false
      "property5" = ["array", "inside", "an", "object"]
```
