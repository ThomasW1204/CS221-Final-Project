const starBtn = document.getElementById("starting");
const impBtn = document.getElementById("import");
const creBtn = document.getElementById("create");
const displayP = document.getElementById("displayPic");
let allSets = JSON.parse(localStorage.getItem("allSets")) || {};
console.log(allSets);
//if (Object.keys(allSets).length === 0) {//uncomment this if you want it to only add basic sets when there are no sets
  console.log("No sets found, adding default ones...");
  let saveSetToAllSets = ({
    "HistoryFinal" : {"setName" : "HistoryFinal",
    "cards" : [
        {"term": "Who was the 1st president of the United States?", "definition" :"George Washington"},
        {"term": "Who created the Emancipation Proclamation?", "definition" :"Abraham Lincoln"},
        {"term": "Who was president during the Cuban Missile Crisis?", "definition" :"John F. Kennedy"},
        {"term": "Who was the person who alerted the colonies that the British were coming?", "definition" :"Paul Revere"},
        {"term": "Who was the 4th president of the United States?", "definition" :"James Madison"},
        {"term": "Who was the first Black Supreme Court justice in the United States?", "definition" :"Thurgood Marshall"},
        {"term": "Who was the first American to win a Nobel Peace Prize?", "definition" :"Theodore Roosevelt"}
      ]},
    "MathFinal" : {"setName" : "MathFinal",
      "cards" : [
        {"term": "What is 3 + 3?", "definition" :"6"},
        {"term": "What is 6 / 2", "definition" : "3"},
        {"term": "What is 7 x 3?", "definition" :"21"},
        {"term": "What is 9 x 10", "definition" :"90"},
        {"term": "What is 400/20", "definition" :"20"},
        {"term": "What is 10 - 5?", "definition" :"5"},
      ]}, 
    "ScienceFinal" : {"setName" : "ScienceFinal",
      "cards" : [
        {"term": "What does DNA stand for?", "definition" :"Deoxyribonucleic acid"},
        {"term": "How many bones are in the human body?", "definition" : "206"},
        {"term": "Humans and chimpanzees share roughly how much DNA?", "definition" :"98 percent"},
        {"term": "What is the most abundant gas in the Earth's atmosphere?", "definition" :"Nitrogen"},
        {"term": "In which year did the Apollo 13 space mission take place?", "definition" :"1970"},
        {"term": "What was the first vaccine to be developed against a contagious disease?", "definition" :"The smallpox vaccine"},
      ]}
  });
 // localStorage.setItem("allSets", JSON.stringify(saveSetToAllSets));

 allSets = { ...allSets, ...saveSetToAllSets };

  localStorage.setItem("allSets", JSON.stringify(allSets));
//}
console.log(JSON.parse(localStorage.getItem("allSets")));

starBtn.addEventListener("click", () => {
  window.location.href = "startingPage.html";
});

impBtn.addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

creBtn.addEventListener("click", () => {
  window.location.href = "createStudySet.html";
});

starBtn.addEventListener("mouseenter", () => {
  displayP.innerHTML ="<img src=../src/client/pages/homeScreen/start.gif>"
});

impBtn.addEventListener("mouseenter", () => {
  displayP.innerHTML ="<img src=../src/client/pages/homeScreen/import.gif>"
});

creBtn.addEventListener("mouseenter", () => {
  displayP.innerHTML ="<img src=../src/client/pages/homeScreen/create.gif>"
});