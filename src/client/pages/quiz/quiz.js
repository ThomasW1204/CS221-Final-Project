// This segment is for testing, for now I will assign the index value of the data set I'm testing 
// As a hardcoded value. Later it will pull stuff from a MongoDB. Currently, I prefer that we output these
// FlashCard sets to a file to store. Someone can create the file and then send it off toi someone else
// For them to read the Flashcard set and then start studying. This is suboptimal in terms of user
// Retention or usability but its the best back up plan if I can figure out server.

// Import Flashcard set
import flashcardSets from "../../shared/flashcardSetDummyData.js";

// Index of Flashcard set
index = 0;

flashcardSet = flashcardSets[0];

title = Element.querySelector("title");

