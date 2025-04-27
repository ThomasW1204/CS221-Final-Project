/**

 * This file handles screen and overlay manipulations and dynamic switching.
 * 
 * It ensures only one screen is active at a time and controls overlay states.
 * The functions within this file are designed to manage screen transitions,
 * activate overlays, and provide debugging through structured error codes.
 */

/**
 * Custom error class for handling screen-related issues.
 * 
 * Errors related to screen transitions and overlays are thrown as `ScreenError`
 * instances, allowing structured debugging with predefined error codes.
 * 
 * ### Error Codes:
 * - **0** → Successful execution.
 * - **11** → No active screen found (forgot to add `.active` to default screen).
 * - **12** → Multiple active screens detected (dev error or severe bug).
 * - **13** → Target screen is already active (wrong ID used).
 * - **21** → Overlay is already active.
 * - **22** → Overlay not found (incorrect overlay ID).
 * - **23** → Overlay is already inactive.
 * 
 * @class ScreenError
 * @extends Error
 * @param {string} message - Description of the error.
 * @param {number} code - Error code from `ScreenErrorCodes`.

 */
class ScreenError extends Error {
    constructor(message,code){
        super(message);
        this.name = 'ScreenError';
        this.code = code;
    }
}

/**
 * Changes which screen (HTML element with class `.screen`) is active.
 * 
 * This function takes the ID of the desired screen and sets it as the active screen,
 * while deactivating all other screens. It returns an exit code based on the result
 * of the switch operation.
 * 
 * ### Return Codes:
 * - `0` → Success.
 * - `11` → No active screen found.
 * - `12` → Multiple active screens detected.
 * - `13` → Target screen is already active.
 * - `-1` → Unknown error occurred.
 * 
 * @param {string} newScreenID - The ID of the screen to activate.
 * @returns {number} Exit code indicating success or failure (see `ScreenErrorCodes`).
 * @throws {ScreenError} If:
 *   - No active screen is found (`code: 11`).
 *   - Multiple active screens exist (`code: 12`).
 *   - The new screen is already active (`code: 13`).
 * 
 * @example
 * // Activating a new screen
 * const result = switchActiveScreen("quizScreen");
 * if (result !== 0) {
 *     console.error("Screen switch failed with code:", result);
 * }

 */
export function switchActiveScreen(newScreenID) {
    // Get all screens on page
    const screens = document.getElementsByClassName('.screen');
    const activeScreens = document.querySelectorAll('.screen.active');
    try {
        // Error Catching
        if (!activeScreens) {

            throw new ScreenError("No Active Screen Found", 11);
        } else if (activeScreens.length > 11) {
            throw new ScreenError("More Than ONE Active Screen: " + activeScreen.join(',') + ".",12);
        } else if (activeScreens[0].id === newScreenID) {
            throw new ScreenError("Input Screen Already Active: " + newScreenID, 13);

        } 

        // Switch Screens
        // Get Element References
        const activeScreen = document.getElementById(activeScreens[0].id);
        const newActive = document.getElementById(newScreenID);

        // Switch Active 
        activeScreen.classList.remove("active");
        newActive.classList.add("active");

    } catch (error) {
        // Screen Errors
        if (error instanceof ScreenError){
            console.error(error);
            return error.code; // fail
        } else {
            // Random Errors
            console.error(error);
            return -1; // This code is for the calling function to show an unknown error occured
        }

        
    }
    return 0; // success
}


/**
 * Activates an overlay element by adding the `.active` class.
 * 
 * The function attempts to activate the overlay based on its `ID`. If the overlay is 
 * already active, missing, or encounters an unexpected error, it returns an appropriate
 * error code from `ScreenErrorCodes`.
 * 
 * ### Return Codes:
 * - `0` → Success.
 * - `21` → Overlay is already active.
 * - `22` → Overlay not found.
 * - `-1` → Unknown error.
 * 
 * @param {string} overlayID - ID of the overlay element to activate.
 * @returns {number} Exit code indicating success or failure (see `ScreenErrorCodes`).
 * @throws {ScreenError} If:
 *   - The overlay does not exist (`code: 22`).
 *   - The overlay is already active (`code: 21`).
 * 
 * @example
 * // Activate an overlay with ID "settingsOverlay"
 * const result = activateOverlay("settingsOverlay");
 * if (result !== 0) {
 *     console.error("Overlay activation failed with code:", result);
 * }
 */
export function activateOverlay(overlayID) {
    try {
        const inactiveOverlay = document.getElementById(overlayID);

        if (!inactiveOverlay) {
            throw new ScreenError('Overlay Not Found',22);
        } else if (inactiveOverlay.classList.contains('active')) {
            throw new ScreenError('Overlay Already Active',21);
        }

        inactiveOverlay.classList.add('active');
        
    } catch(error) {
        if (error instanceof ScreenError)
            switch (error.code) {
                case 21:
                    console.error(error.message + ": Overlay ID \"" + overlayID + "\" is already Active");
                    inactiveOverlay.classList.remove('active');
                    return error.code;

                case 22:
                    console.error(error.message + ": Overlay ID \"" + overlayID + "\" does not exist");
                    inactiveOverlay.classList.remove('active');
                    return error.code;
            }
        console.error(error.message);
        inactiveOverlay.classList.remove('active');
        return -1; // Unknown Error
    }

    return 0; // Successful exection
}

/**
 * Deactivates an overlay element by removing the `.active` class.
 * 
 * The function attempts to deactivate the overlay based on its `ID`. If the overlay is 
 * already inactive, missing, or encounters an unexpected error, it returns an appropriate
 * error code from `ScreenErrorCodes`.
 * 
 * ### Return Codes:
 * - `0` → Success.
 * - `23` → Overlay is already inactive.
 * - `22` → Overlay not found.
 * - `-1` → Unknown error.
 * 
 * @param {string} overlayID - ID of the overlay element to deactivate.
 * @returns {number} Exit code indicating success or failure (see `ScreenErrorCodes`).
 * @throws {ScreenError} If:
 *   - The overlay does not exist (`code: 22`).
 *   - The overlay is already inactive (`code: 23`).
 * 
 * @example
 * // Deactivate an overlay with ID "settingsOverlay"
 * const result = deactivateOverlay("settingsOverlay");
 * if (result !== 0) {
 *     console.error("Overlay deactivation failed with code:", result);
 * }
 */
export function deactivateOverlay(overlayID) {
    try {
        const activeOverlay = document.getElementById(overlayID);

        if (!activeOverlay) {
            throw new ScreenError('Overlay Not Found',22);
        } else if (!activeOverlay.classList.contains('active')) {
            throw new ScreenError('Overlay Already Inactive',23);
        }

        activeOverlay.classList.remove('active');
        
    } catch(error) {
        if (error instanceof ScreenError)
            switch (error.code) {
                case 23:
                    console.error(error.message + ": Overlay ID \"" + overlayID + "\" is already inctive");
                    inactiveOverlay.classList.remove('active');
                    return error.code;

                case 22:
                    console.error(error.message + ": Overlay ID \"" + overlayID + "\" does not exist");
                    return error.code;
            }
        console.error(error.message);
        inactiveOverlay.classList.remove('active');
        return -1; // Unknown Error
    }

    return 0; // Successful exection
}
