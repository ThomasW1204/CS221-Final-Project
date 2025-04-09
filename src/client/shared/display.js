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
 *  1 - No Active Screen Found - likely forgot to add active to default screen in html doc
 *  2 - Multiple Active Screens - like dev error or severe bug
 *  3 - Switch Screen Already Active - likely used wrong ID in switchActiveScreen 
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
            throw new ScreenError("No Active Screen Found", 1);
        } else if (activeScreens.length > 1) {
            throw new ScreenError("More Than ONE Active Screen: " + activeScreen.join(',') + ".",2);
        } else if (activeScreens[0].id === newScreenID) {
            throw new ScreenError("Given Screen Already Active: " + newScreenID, 3);
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
