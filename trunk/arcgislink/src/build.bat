set closure=C:\Applications\DEV\closure-library\svn\trunk
set base=C:\Applications\DEV\gmaps-utility-gis\svn\trunk
set util=C:\Applications\DEV\gmaps-utility-gis\svn\trunk
set compiler=%util%\util\compiler\closure\compiler.jar
set notation=%util%\util\compiler\notation\notation.jar
set yui=%util%\util\yui\yuicompressor.jar

set bat=%~dp0
set lib=%1
if "%1" == "" set lib=arcgislink
if "%1" == "" del %bat%build.log
rem %~dp0app_all-min.%date:~10,4%%date:~4,2%%date:~7,2%.js

cd %util%

rem "%JAVA_HOME%\bin\java" -jar "%util%\util\docs\jsdoc-toolkit\jsrun.jar" "%util%\util\docs\jsdoc-toolkit\app\run.js" --allfunctions --verbose --suppress --template=%util%\util\docs\template\ --directory=%base%\%lib%\docs %base%\%lib%\src\%lib%.js > %bat%build.log
rem "%JAVA_HOME%\bin\java" -jar %util%\util\java\js.jar %util%\util\lint\lint.js  %base%\%lib%\src\%lib%.js >> %bat%build.log
rem "%JAVA_HOME%\bin\java" -jar %util%\util\java\js.jar %util%\util\pack\pack.js %base%\%lib%\src %lib%.js >> %bat%build.log 

rem "%JAVA_HOME%\bin\java" -jar %notation%  %base%\%lib%\src\%lib%.js %base%\%lib%\src\%lib%.prop %base%\%lib%\src\%lib%_notation.js >> %bat%build.log 

set externs=--externs %util%\util\compiler\closure\google_maps_api_v3.js --externs %base%\%lib%\src\%lib%_externs.js 
set format=--formatting PRETTY_PRINT


rem ======== START SIMPLE =================
echo (function(){  > %base%\%lib%\src\%lib%_precompile.js
copy %base%\%lib%\src\%lib%_precompile.js /B + %base%\%lib%\src\%lib%.js /B %base%\%lib%\src\%lib%_precompile.js
echo window.gmaps = gmaps; })()  >> %base%\%lib%\src\%lib%_precompile.js
set in=--js %base%\%lib%\src\%lib%_precompile.js
set out=--js_output_file %base%\%lib%\src\%lib%_compiled.js
set level=--compilation_level SIMPLE_OPTIMIZATIONS
set format=
"%JAVA_HOME%\bin\java" -jar %compiler% %format% %level% %in% %out% >> %bat%build.log 
del %base%\%lib%\src\%lib%_precompile.js
rem ======== END SIMPLE ===================

rem ======= START ADVANCED =====================
set in=--js %base%\%lib%\src\%lib%.js --js %base%\%lib%\src\%lib%_export.js
set out=--js_output_file %base%\%lib%\src\%lib%_advanced.js
set level=--compilation_level ADVANCED_OPTIMIZATIONS
set wrap=--output_wrapper "(function(){%%output%%})()"
set externs=--externs %util%\util\compiler\closure\google_maps_api_v3.js --externs %base%\%lib%\src\%lib%_externs.js --externs %base%\%lib%\src\%lib%_externs_lib.js
set format=--formatting PRETTY_PRINT
"%JAVA_HOME%\bin\java" -jar %compiler% %externs% %format% %level% %in% %out% %wrap% >> %bat%build.log 
rem ======= END ADVANCED =====================

rem ======== START COMPILE APP==========
echo (function(){  > %base%\%lib%\examples\compile_precompile.js
copy %base%\%lib%\examples\compile_precompile.js /B + %base%\%lib%\src\%lib%.js /B %base%\%lib%\examples\compile_precompile.js
copy %base%\%lib%\examples\compile_precompile.js /B + %base%\%lib%\examples\compile.js /B %base%\%lib%\examples\compile_precompile.js
echo })()  >> %base%\%lib%\examples\compile_precompile.js
set in=--js %base%\%lib%\examples\compile_precompile.js
set externs=--externs %util%\util\compiler\closure\google_maps_api_v3.js --externs %base%\%lib%\src\%lib%_externs.js
set wrap=
rem set in=--js %base%\%lib%\src\%lib%.js --js %base%\%lib%\examples\compile.js
rem set wrap=--output_wrapper "(function(){%%output%%})()"
set out=--js_output_file %base%\%lib%\examples\compile_compiled.js
set level=--compilation_level ADVANCED_OPTIMIZATIONS
set format=--formatting PRETTY_PRINT
"%JAVA_HOME%\bin\java" -jar %compiler% %externs% %format% %level% %in% %out% %wrap% 
rem ======== END COMPILE APP==========

rem %bat%build.log 
rem %closure%\closure\bin\calcdeps.py -i %base%\%lib%\examples\identify.js -i %base%\%lib%\src\%lib%_precompile.js -p %closure%\ -o compiled -c %closure%\compiler.jar -f "--compilation_level=ADVANCED_OPTIMIZATIONS"  -f "--externs=%util%\util\compiler\closure\google_maps_api_v3.js" -f "--externs=%base%\%lib%\src\%lib%.js" > %base%\%lib%\examples\identify_compiled.js

rem copy %closure%\closure\goog\css\tab.css %base%\%lib%\examples\identify_compiled.css
rem copy %base%\%lib%\examples\identify_compiled.css /B + %closure%\closure\goog\css\tabbar.css /B %base%\%lib%\examples\identify_compiled.css
rem copy %base%\%lib%\examples\identify_compiled.css /B + %base%\%lib%\examples\identify.css /B  %base%\%lib%\examples\identify_compiled.css
rem "%JAVA_HOME%\bin\java" -jar %yui% -o %base%\%lib%\examples\identify_compiled.css %base%\%lib%\examples\identify_compiled.css >> %bat%build.log 

pause

rem ====================================== 
rem "%JAVA_HOME%\bin\java" -jar  %compiler% --compilation_level SIMPLE_OPTIMIZATIONS --externs %util%\util\compiler\closure\google_maps_api_v3.js --js %base%\%lib%\src\%lib%.js --js_output_file %base%\%lib%\src\%lib%_compiled.js >> %bat%build.log 
rem "%JAVA_HOME%\bin\java" -jar %util%\util\yui\yuicompressor.jar -o %base%\%lib%\src\%lib%_min.js  %base%\%lib%\src\%lib%.js >> %bat%build.log 
rem %closure%\closure\bin\calcdeps.py -i %base%\%lib%\examples\identify.js  -p %closure%\ -o compiled -c %closure%\compiler.jar -f "--compilation_level=ADVANCED_OPTIMIZATIONS"  -f "--externs=%util%\util\compiler\closure\google_maps_api_v3.js" -f "--externs=%base%\%lib%\src\%lib%.js"> %base%\%lib%\examples\identify_compiled.js
 