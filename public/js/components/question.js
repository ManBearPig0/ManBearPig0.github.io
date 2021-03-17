class Question {
    problemStart = "";
    constructor(ititle, iproblem, iawnser) {
        this.title = ititle.toString();
        this.problem = this.problemStart + iproblem;
        this.awnser = iawnser;
    }
}
Question.prototype.display = function() {
    var questionTitle = document.getElementById("question__title");
    questionTitle.removeChild(questionTitle.childNodes[0]);
    questionTitle.appendChild(document.createTextNode(this.title));

    var questionProblem = document.getElementById("question__problem");
    questionProblem.removeChild(questionProblem.childNodes[0]);
    questionProblem.appendChild(document.createTextNode(this.problem));

    var main = document.getElementsByTagName("main")[0];
    while (main.children.length > 3) {
        main.removeChild(main.childNodes[2])
    }
}
Question.prototype.check = function(input) {
    if (input == this.awnser) {
        correct();
    } else {
        incorrect();
    }
}
class multipleChoice extends Question {
    problemStart = "Pick the right awnser: ";
    constructor(title, problem, awnser, options) {
        super(title, problem, awnser);
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
    display() {
        super.display();
    }
}

var questions = [new multipleChoice("Creator", "Who created laravel:", "Taylor Otwell", ["Sergey Sosnovsky", "Tim Berners-Lee", "Taylor Otwell", "Bill Gates"])];
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
    checkButton.id = "question__check";
    checkButton.addEventListener("click", questions[currentquestion].check);
    question.appendChild(checkButton);

    //create navigation buttons
    var backButton = document.createElement("input");
    var nextButton = document.createElement("input");
    backButton.setAttribute("type", "button");
    nextButton.setAttribute("type", "button");
    backButton.setAttribute("value", "Back");
    nextButton.setAttribute("value", "Next");
    backButton.addEventListener("click", function(){if(currentquestion>0)currentquestion--;});
    nextButton.addEventListener("click", function(){if(currentquestion<questions.length-1)currentquestion++;});

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
    console.log("correct");
}
var incorrect = function(){
    console.log("incorrect");
}
