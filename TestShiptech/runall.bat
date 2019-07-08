powershell.exe .\builddb.ps1
del log.txt
del blog.txt
node TestRunner ./TestCases/Scenario_0.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_0a.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_1.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_2.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_3.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_4.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_5.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_6a.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_6b.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_7.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_8.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_8a_12585.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_9.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_10.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_11.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_12.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_13.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_14.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_15.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_16.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_17.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_18.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_19.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_20.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_21.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_22.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_23.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_24.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_25.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_26.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_27.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_28.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_29.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_30.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_31.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_32.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_33.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_34.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_35.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_36.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_37.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_38.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_39.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_40.json ./TestCases/connection.atest.json
node TestRunner ./TestCases/Scenario_41.json ./TestCases/connection.atest.json


node TestRunner ./TestCases/SendEmail.json ./TestCases/connection.atest.json
shutdown.exe /s /t 00