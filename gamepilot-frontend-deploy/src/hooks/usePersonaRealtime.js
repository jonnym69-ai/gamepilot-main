"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePersonaRealtime = usePersonaRealtime;
const react_1 = require("react");
const personaEngineService_1 = require("../services/personaEngineService");
/**
 * Hook for real-time persona updates
 * Listens to personaEngineService changes and provides real-time persona data
 */
function usePersonaRealtime() {
    const [persona, setPersona] = (0, react_1.useState)(null);
    const [isListening, setIsListening] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        // Get initial persona data
        const initialPersona = personaEngineService_1.personaEngineService.getCurrentPersona();
        setPersona(initialPersona);
        // Set up polling for real-time updates
        const pollInterval = setInterval(() => {
            const currentPersona = personaEngineService_1.personaEngineService.getCurrentPersona();
            if (JSON.stringify(currentPersona) !== JSON.stringify(persona)) {
                setPersona(currentPersona);
            }
        }, 1000); // Poll every second for changes
        setIsListening(true);
        return () => {
            clearInterval(pollInterval);
            setIsListening(false);
        };
    }, []);
    const refreshPersona = async () => {
        try {
            // Force refresh from auth store
            const currentPersona = personaEngineService_1.personaEngineService.getCurrentPersona();
            setPersona(currentPersona);
        }
        catch (error) {
            console.error('Failed to refresh persona:', error);
        }
    };
    return {
        persona,
        isListening,
        refreshPersona,
        isPersonaInitialized: personaEngineService_1.personaEngineService.isPersonaInitialized()
    };
}
