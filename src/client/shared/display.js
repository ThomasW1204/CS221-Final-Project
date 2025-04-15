/**
 * This File manipulates displays for the screens
 * It should only contain content relative to screens that are active and
 * allows for the switching of active screens dynamically
 */

/**
 * This is a class for defined errors dealing with Screens.
 * Should there be an error when switching screens, this 
 * error type will be thrown. After an error occurs, the error will be sent to console (currently, later transition to log files)
 * The error code is used to link the error to a message and also an exit code for the calling function to know how to proceed
 * Codes:
 *  0 - This is not an error code, but a successful execution code, this is returned to the calling function as an exit code
 *  11 - No Active Screen Found - likely forgot to add active to default screen in html doc
 *  12 - Multiple Active Screens - like dev error or severe bug
 *  13 - Switch Screen Already Active - likely used wrong ID in switchActiveScreen 
 *  21 - Overlay Already Active - Given Overlay ID is already Active
 *  22 - Overlay not found - ID given for the overlay does not exist
 *  23 - Overlay Already Inactive - Given Overlay ID is already not active
 * These are the current codes, more will be added when necessary
 */
class ScreenError extends Error {
    constructor(message,code){
        super(message);
        this.name = ScreenError;
        this.code;
    }
}

/**
 * This will change which screen (html element with class .screen) is active
 * Input takes the ID of the screen that will be the new active screen
 * All other screens will be deactivated
 * It will return a code based on the result of the switch
 * Code:
 *    See ScreenError
 *    All Screen Specific Codes are '1x'codes
 *    Return code of -1 is unknown error
 * @param {String} newScreenID : This is the ID of the screen you wish to activate
 * @returns {number} exit code : See ScreenError
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
            return -11; // This code is for the calling function to show an unknown error occured
        }

        
    }
    return 0; // success
}

/**
 * This handles the activation overlay elements. These are classes with exclusively the '.overlay' class
 *  Codes:
 *      Overlay errors will make use of ScreenError error class
 *      overlay specific codes are '2x' codes 
 *      Return code of -1 is unknown error
 * @param {String} overlayID : ID of the element that is the overlay
 * @returns {Number}: Return code, see ScreenError. 0 is success
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
 * This handles the activation overlay elements. These are classes with exclusively the '.overlay' class
 *  Codes:
 *      Overlay errors will make use of ScreenError error class
 *      overlay specific codes are '2x' codes 
 *      Return code of -1 is unknown error
 * @param {String} overlayID 
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