"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.personaTester = void 0;
exports.initializePersonaTestConsole = initializePersonaTestConsole;
const personaTest_1 = require("./personaTest");
Object.defineProperty(exports, "personaTester", { enumerable: true, get: function () { return personaTest_1.personaTester; } });
// Initialize console commands
function initializePersonaTestConsole() {
    window.testPersona = async () => {
        console.log('🧪 Starting Persona Engine Test from Console...');
        await personaTest_1.personaTester.runFullTest();
    };
    console.log(`
🧪 Persona Engine Test Commands Available:
   - testPersona() - Run comprehensive persona engine test
   - personaResults - View last test results (after running test)
   
Example: testPersona()
  `);
}
