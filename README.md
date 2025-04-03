# CS221-Final-Project

You will need Node.js to run and configure the website. Here's the install link. https://nodejs.org/en

Depending on how your computer is setup, you may need to alter the Path to accommodate node.js. Any problems with this can be solved easily with google or AI help.
Example: you may get error codes from trying to use "npm" commands if your path is not setup correctly. 

1. Clone the repository
2. Open your IDE's terminal
3. Go to cmd in IDE and go inside Website folder
4. Run this to install dependencies
```bash
`npm install` 
```
5. Run this to start the development server
```bash
`npm start`
```

Dummy Data for testing before working with DB can be found in 
Navigate to the file '.\src\client\shared\flashcardSetDummyData.js'

To use in your .js files, copy this at the top of your file:
```javascript
import flashcardSets from "../../shared/flashcardSetDummyData.js";
```
Afterwards you can use it as if it was defined in that file
Example:
```javascript
flashcardSet = flashcardSets[0];
```