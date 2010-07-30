Closure compiler notes

options:
  --regular code + export code.js then compile (more functions with alias to obfuscated symbol)
  -- rename symbol to quoted notation (only obsfucate non-renamed)
 
 enums: use externs
 json: use externs
 
 instance property: rename to quote
 
 
 anonymous wrapper in compiler time to allow compile with app code.
 
   
   
   
   
   
use full qualified name in definition because

if use short name, then any assignment is consider a usage, so all static properties are exported when compiled with app.   