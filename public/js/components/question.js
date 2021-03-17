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
    var questionTitle = document.getElementById("question__title");
    questionTitle.removeChild(questionTitle.childNodes[0]);
    questionTitle.appendChild(document.createTextNode(this.title));
    questionTitle.classList = [];

    var questionProblem = document.getElementById("question__problem");
    questionProblem.removeChild(questionProblem.childNodes[0]);
    questionProblem.appendChild(document.createTextNode(this.problem));

    var form = document.getElementsByTagName("form")[0];
    while (form.children.length > 1) {
        form.removeChild(form.childNodes[0]);
    }
}
Question.prototype.check = function(input) {
    if (input == this.answer) {
        correct();
    } else {
        incorrect();
    }
}
class multipleChoice extends Question {
    problemStart = "Pick the right answer: ";
    constructor(title, problem, answer, options) {
        super(title, problem, answer);
        this.options = options;
    }
    display() {
        super.display();
        var form = document.getElementsByTagName("form")[0];
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
    check(){
        let boxes = document.getElementsByTagName("input");
        let attempt = "";
        for(let box of boxes){
            if(box.checked){
                attempt = box.getAttribute("value");
            }
        }
        super.check(attempt);
    }
}


class fillInTheBlank extends Question {
    problemStart = "Fill in the black: "
    constructor(title, answer, firsthalf, secondhalf){
        super(title, "Fill in the blank:", answer);
        this.firsthalf = firsthalf;
        this.secondhalf = secondhalf;
    }
    display() {
        super.display();
        var form = document.getElementsByTagName("form")[0];
        let paragraph = document.createElement("p");
        let input = document.createElement("input");
        input.id = "question__blank"
        input.setAttribute("type", "text");
        paragraph.appendChild(document.createTextNode(this.firsthalf));
        paragraph.appendChild(input);
        paragraph.appendChild(document.createTextNode(this.secondhalf));
        form.insertBefore(paragraph, document.getElementById("question__check"));
    }
    check(){
        let input = document.getElementById("question__blank");
        super.check(input.value.toLowerCase());
    }
}

var questions = [
new multipleChoice("Creator", "Who created laravel:", "Taylor Otwell", ["Sergey Sosnovsky", "Tim Berners-Lee", "Taylor Otwell", "Bill Gates"]),
new multipleChoice("Seeding", "When is database seeding applicable?", "For putting test data in the database", ["For putting test data in the database", "For updating database records, for example creating a new user", "For creating new tables and columns in your database", "For retrieving database data to put in a view"]),
new fillInTheBlank("Interactions", "eloquent", "Laravel ", " is used for interacting with database records, through models."),
new fillInTheBlank("Syntax", "blade", "Laravel ", ".html files uses a special syntax that allows you to  add logic into the html itseld. This is a PHP based logic that can also utilize authentication logic.")
];
var currentquestion = 0;

var initialDisplay = function() {
    var main = document.getElementsByTagName("main")[0];
    //create question heading
    var questionTitle = document.createElement("h1");
    questionTitle.id = "question__title";
    questionTitle.appendChild(document.createTextNode(""));

    //create question
    var questionProblem = document.createElement("h2");
    questionProblem.id = "question__problem";
    questionProblem.appendChild(document.createTextNode(""));

    //create form
    var question = document.createElement("form");

    //create check button
    var checkButton = document.createElement("input");
    checkButton.setAttribute("type", "button");
    checkButton.setAttribute("value", "Check");
    checkButton.classList.add('btn');
    checkButton.classList.add('btn-red');
    checkButton.addEventListener("click", () => questions[currentquestion].check())
    checkButton.id = "question__check";
    question.appendChild(checkButton);

    //create navigation buttons
    var backButton = document.createElement("input");
    var nextButton = document.createElement("input");
    backButton.setAttribute("type", "button");
    nextButton.setAttribute("type", "button");
    backButton.setAttribute("value", "Back");
    nextButton.setAttribute("value", "Next");
    backButton.addEventListener("click", function(){if(currentquestion>0)currentquestion--; questions[currentquestion].display();});
    nextButton.addEventListener("click", function(){if(currentquestion<questions.length-1)currentquestion++;questions[currentquestion].display();});

    //add all elements to document
    main.appendChild(questionTitle);
    main.appendChild(questionProblem);
    main.appendChild(question);
    main.appendChild(backButton);
    main.appendChild(nextButton);

    //display the first question
    questions[0].display();
}
var correct =  function(){ 
    var questionTitle = document.getElementById("question__title");
    questionTitle.removeChild(questionTitle.childNodes[0]);
    questionTitle.appendChild(document.createTextNode(questions[currentquestion].title + ":\t" + "correct"));
    questionTitle.classList = ["correct"];
}
var incorrect = function(){
    var questionTitle = document.getElementById("question__title");
    questionTitle.removeChild(questionTitle.childNodes[0]);
    questionTitle.appendChild(document.createTextNode(questions[currentquestion].title + ":\t" + "incorrect"));
    questionTitle.classList = ["incorrect"];
}
