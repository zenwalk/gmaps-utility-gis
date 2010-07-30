set base=C:\Applications\DEV\closure-library\svn\trunk\closure\goog\base.js
set compiler=C:\Applications\DEV\gmaps-utility-gis\svn\trunk\util\compiler\closure\compiler.jar
set f=--formatting PRETTY_PRINT
set lv=--compilation_level ADVANCED_OPTIMIZATIONS

set w=--output_wrapper "(function(){%%output%%})()"
rem ================== just one  ==============
cd %~dp0

"%JAVA_HOME%\bin\java" -jar %compiler% %f% %lv% %w% --js %base% --js static.js --js_output_file static_compiled.js 

"%JAVA_HOME%\bin\java" -jar %compiler% %f% %lv% %w% --js %base% --js proto.js --js_output_file proto_compiled.js 
 
pause