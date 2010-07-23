set util=C:\Applications\DEV\google-maps-utility-library-v3\svn\trunk\util\compiler
set compiler=%util%\closure\compiler.jar
set note=%util%\notation\notation.jar
set f=--formatting PRETTY_PRINT
set lv=--compilation_level ADVANCED_OPTIMIZATIONS
set ex=--externs %~dp0test_extern.js
set w=--output_wrapper "(function(){%%output%%})()"


copy %~dp0test_lib.js /B + %~dp0test_export.js /B %~dp0test_lib_exported.js
"%JAVA_HOME%\bin\java" -jar %note%  %~dp0test_lib_exported.js %~dp0test_lib_props.prop %~dp0test_lib_exported_notated.js
set i=--js %~dp0test_lib_exported_notated.js
set o=--js_output_file %~dp0test_lib_exported_compiled.js 
"%JAVA_HOME%\bin\java" -jar %compiler% %f% %lv% %i% %o% %ex% %w%

"%JAVA_HOME%\bin\java" -jar %note%  %~dp0test_lib.js %~dp0test_lib_all.prop %~dp0test_lib_notated.js
set i=--js %~dp0test_lib_notated.js
set o=--js_output_file %~dp0test_lib_notated_compiled.js 
"%JAVA_HOME%\bin\java" -jar %compiler% %f% %lv% %ex% %i% %o% %w%

rem copy %~dp0test_lib.js /B + %~dp0test_use.js /B %~dp0test_use_all.js
rem set i=--js %~dp0test_use_all.js
set i=--js %~dp0test_lib.js --js %~dp0test_use.js  
set o=--js_output_file %~dp0test_use_compiled.js 
"%JAVA_HOME%\bin\java" -jar %compiler% %f% %lv% %i% %o% %w%

pause