//parent class Question
class Question {
    problemStart = "";
    constructor(title, problem, answer) {
        this.title = title.toString();
        this.problem = this.problemStart + problem;
        this.answer = answer;
    }
}
Question.prototype.display = function() {
    var question = document.createElement("form");
    question.id = "questionForm";

    var questionTitle = document.createElement("h1");
    questionTitle.appendChild(document.createTextNode(this.title));

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
        if (currentquestion > 0) currentquestion--;
        //last question
    });
    nextButton.addEventListener("click", function() {
        if (currentquestion < questions.length - 1) currentquestion++;
        //next question
    });

    question.appendChild(questionTitle);
    question.appendChild(questionProblem);
    question.appendChild(checkButton);
    question.appendChild(backButton);
    question.appendChild(nextButton);

    document.getElementById("questionwindow").appendChild(question);
}

class multipleChoice extends Question {
    problemStart = "Pick the right answer: ";
    constructor(title, problem, answer, options) {
        super(title, problem, answer);
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
}


class fillInTheBlank extends Question {
    problemStart = "Fill in the black: "
    constructor(title, answer, firsthalf, secondhalf) {
        super(title, "Fill in the blank:", answer);
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
    req.open("GET", "http://127.0.0.1:3000/getQuestion?quiz="+quiz+"question="+questionnumber, true)
    req.onreadystatechange = function(){
        if(req.readyState == 4 && req.status == 200)
        {
            var values = JSON.parse(req.responseText);
            var question = new multipleChoice(values.title, values.problem, values.awnser, values.options);
            var frame = document.getElementById("questionwindow");
            while (frame.children.length > 0) {
                frame.removeChild(frame.childNodes[0]);
            }
            question.display();
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
            var frame = document.getElementById("questionwindow");
            while (frame.children.length > 0) {
                frame.removeChild(frame.childNodes[0]);
            }
            for(var i = 0; i < quizes.length; i++){
                var p = document.createElement("p");
                var button = document.createElement("input");
                button.setAttribute("type", "button");
                button.setAttribute("value", quizes[i]);
                button.setAttribute("onclick", "loadQuestion(value, 1)")
                p.appendChild(button);
                frame.appendChild(p);
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
        var frame = document.getElementById("topicselection");
        for(var i = 0; i < topics.length; i++){
            var p = document.createElement("p");
            var button = document.createElement("input");
            button.setAttribute("type", "button");
            button.setAttribute("value", topics[i]);
            button.setAttribute("onclick", "loadQuizes(value)")
            p.appendChild(button);
            frame.appendChild(p);
        }
    }
}
req.send();