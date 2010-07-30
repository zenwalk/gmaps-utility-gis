set base=C:\Applications\DEV\closure-library\svn\trunk\closure\goog\base.js
set compiler=C:\Applications\DEV\gmaps-utility-gis\svn\trunk\util\compiler\closure\compiler.jar
set f=--formatting PRETTY_PRINT
set lv=--compilation_level ADVANCED_OPTIMIZATIONS
set ex=--externs test_extern.js
set w=--output_wrapper "(function(){%%output%%})()"
cd %~dp0

rem ====== lib ==============
"%JAVA_HOME%\bin\java" -jar %compiler% %f% %lv% %w% %ex% --js %base% --js test_lib.js --js test_export.js --js_output_file test_lib_compiled.js 
set w=
rem ====== together ============
"%JAVA_HOME%\bin\java" -jar %compiler% %f% %lv% %w% %ex% --js %base% --js test_lib.js --js test_app.js --js_output_file test_all_compiled.js 
 
pause