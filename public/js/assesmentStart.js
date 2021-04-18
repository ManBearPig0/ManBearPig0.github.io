//parent class Question
var currentquestion;
class Question {
    problemStart = "";
    constructor(title, problem, quiz, index) {
        this.title = title.toString();
        this.problem = this.problemStart + problem;;
        this.quiz = quiz;
        this.index = index
    }
}
Question.prototype.display = function() {
    var question = document.createElement("form");
    question.id = "questionForm";
    question.addEventListener("submit", checkquestion);

    var questionTitle = document.createElement("h1");
    questionTitle.id = "question__title";
    questionTitle.appendChild(document.createTextNode(this.title));
    questionTitle.classList = [];

    var questionProblem = document.createElement("h2");
    questionProblem.appendChild(document.createTextNode(this.problem));

    var checkButton = document.createElement("input");
    checkButton.setAttribute("type", "submit");
    checkButton.setAttribute("value", "Check");
    checkButton.id = "question__check"
    checkButton.classList.add('btn');
    checkButton.classList.add('btn-red');

    //create navigation buttons
    var backButton = document.createElement("input");
    var nextButton = document.createElement("input");
    backButton.setAttribute("type", "button");
    nextButton.setAttribute("type", "button");
    backButton.setAttribute("value", "Back");
    nextButton.setAttribute("value", "Next");
    backButton.addEventListener("click", function() {
        if(currentquestion.questionnumber > 1){
            loadQuestion(currentquestion.quiz, currentquestion.questionnumber-1);
        }
    });
    nextButton.addEventListener("click", function() {
        loadQuestion(currentquestion.quiz, currentquestion.questionnumber+1);
    });

    question.appendChild(questionTitle);
    question.appendChild(questionProblem);
    question.appendChild(checkButton);
    question.appendChild(backButton);
    question.appendChild(nextButton);

    document.getElementById("question-window").appendChild(question);
}
class multipleChoice extends Question {
    problemStart = "Pick the right answer: ";
    constructor(title, problem, options, quiz, index) {
        super(title, problem, quiz, index);
        this.options = options;
    }
    display(){
        super.display();
        var form = document.getElementById("questionForm");
        for (var option of this.options) {
            let paragraph = document.createElement("p");
            let input = document.createElement("input");
            input.setAttribute("type", "radio");
            input.setAttribute("name", "vraag");
            input.setAttribute("value", option);
            input.id = option;
            input.appendChild(document.createTextNode(option));
            paragraph.appendChild(input);
            let label = document.createElement("label");
            label.setAttribute("for", option);
            label.appendChild(document.createTextNode(option));
            paragraph.appendChild(label);
            form.insertBefore(paragraph, document.getElementById("question__check"));
        }
    }
    check() {
        let boxes = document.getElementsByTagName("input");
        let attempt = "";
        for (let box of boxes) {
            if (box.checked) {
                attempt = box.getAttribute("value");
            }
        }
        return attempt;
    }
}


class fillInTheBlank extends Question {
    problemStart = "Fill in the black: "
    constructor(title, firsthalf, secondhalf, quiz, index) {
        super(title, "Fill in the blank:", quiz, index);
        this.firsthalf = firsthalf;
        this.secondhalf = secondhalf;
    }
    display() {
        super.display();
        var form = document.getElementById("questionForm");
        let paragraph = document.createElement("p");
        let input = document.createElement("input");
        input.id = "question__blank";
        input.setAttribute("type", "text");
        paragraph.appendChild(document.createTextNode(this.firsthalf));
        paragraph.appendChild(input);
        paragraph.appendChild(document.createTextNode(this.secondhalf));
        form.insertBefore(paragraph, document.getElementById("question__check"));
    }
    check() {
        let input = document.getElementById("question__blank");
        return input.value.toLowerCase();
    }
}
/*
var questions = [
    new multipleChoice("Creator", "Who created laravel:", "Taylor Otwell", ["Sergey Sosnovsky", "Tim Berners-Lee", "Taylor Otwell", "Bill Gates"]),
    new multipleChoice("Seeding", "When is database seeding applicable?", "For putting test data in the database", ["For putting test data in the database", "For updating database records, for example creating a new user", "For creating new tables and columns in your database", "For retrieving database data to put in a view"]),
    new fillInTheBlank("Interactions", "eloquent", "Laravel ", " is used for interacting with database records, through models."),
    new fillInTheBlank("Syntax", "blade", "Laravel ", ".html files uses a special syntax that allows you to  add logic into the html itseld. This is a PHP based logic that can also utilize authentication logic.")
];
*/

function loadQuestion(quiz, questionnumber){
    var req = new XMLHttpRequest();
    req.open("GET", "http://127.0.0.1:3000/getQuestion?quiz="+quiz+"&question="+questionnumber, true)
    req.onreadystatechange = function(){
        if(req.readyState == 4 && req.status == 200)
        {
            var values = JSON.parse(req.responseText);
            if(values.type == "multiple_choice")
            {
                currentquestion = new multipleChoice(values.title, values.problem, values.options, quiz, questionnumber);
            }
            else if(values.type == "fill_in_the_blank"){
                currentquestion = new fillInTheBlank(values.title, values.firsthalf, values.secondhalf, quiz, questionnumber);
            }
            var frame = document.getElementById("question-window");
            while (frame.children.length > 0) {
                frame.removeChild(frame.childNodes[0]);
            }
            currentquestion.display();
        }
    }
    req.send();
}
function loadQuizes(topic){
    var req = new XMLHttpRequest();
    req.open("GET", "http://127.0.0.1:3000/getQuizes?topic="+topic, true);
    req.onreadystatechange = function(){
        if(req.readyState == 4 && req.status == 200)
        {
            var quizes = JSON.parse(req.responseText);
            var frame = document.getElementById("question-window");
            while (frame.children.length > 0) {
                frame.removeChild(frame.childNodes[0]);
            }
	    var ul = document.createElement("ul");
            for(var i = 0; i < quizes.length; i++){
                var li = document.createElement("li");
                var button = document.createElement("input");
		button.className = "btn btn-red";
                button.setAttribute("type", "button");
                button.setAttribute("value", quizes[i]);
                button.setAttribute("onclick", "loadQuestion(value, 1)")
                li.appendChild(button);
                ul.appendChild(li);
            }
	    frame.appendChild(ul);
        }
    }
    req.send();
}
function checkquestion(e){
    e.preventDefault();
    req.open("GET", "http://127.0.0.1:3000/checkQuestion?attempt="+currentquestion.check()+"&quiz="+currentquestion.quiz+"&questionnumber="+currentquestion.index, true);
    req.onreadystatechange = function(){
        if(req.readyState == 4 && req.status == 200)
        {
            try{
                var reaction = JSON.parse(req.responseText);
                if(reaction.correct){
                    var questionTitle = document.getElementById("question__title");
                    questionTitle.removeChild(questionTitle.childNodes[0]);
                    questionTitle.appendChild(document.createTextNode(currentquestion.title + ":\t" + "correct"));
                    questionTitle.classList = ["correct"];
                }
                else{
                    var questionTitle = document.getElementById("question__title");
                    questionTitle.removeChild(questionTitle.childNodes[0]);
                    questionTitle.appendChild(document.createTextNode(currentquestion.title + ":\t" + "incorrect"));
                    questionTitle.classList = ["incorrect"];
                    inputs = document.getElementsByTagName("input");
                    if(inputs[0].getAttribute("type") == "text")
                    {
                        inputs[0].setAttribute("value", reaction.awnser);
                    }
                    else if(inputs[0].getAttribute("type") == "checkbox")
                    {
                        for(let input of inputs){
                            input.checked = false;
                            if(input.getAttribute("value") == reaction.awnser){
                                input.checked = true;
                            }
                        }
                    }
                }
            }
            catch{
                console.log("user not registered");
            }
        }
    }
    req.send();
}
var req = new XMLHttpRequest();
req.open("GET", "http://127.0.0.1:3000/getTopics", true);
req.onreadystatechange = function(){
    if(req.readyState == 4 && req.status == 200)
    {
        var topics = JSON.parse(req.responseText);
        var frame = document.getElementById("topic-selection");
        for(var i = 0; i < topics.length; i++){
            var li = document.createElement("li");
            var button = document.createElement("input");
	    button.className = "btn btn-red";
            button.setAttribute("type", "button");
            button.setAttribute("value", topics[i]);
            button.setAttribute("onclick", "loadQuizes(value)")
            li.appendChild(button);
            frame.appendChild(li);
        }
    }
}
req.send();
