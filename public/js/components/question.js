class Question {
    problemStart = "";
    constructor(ititle, problem, awnser) {
        this.title = ititle.toString();
        this.problem = this.problemStart + problem;
        this.awnser = awnser;
    }
}
Question.prototype.display = function(){
    var questionTitle = document.getElementById("question__title");
    questionTitle.removeChild(questionTitle.childNodes[0]);
    questionTitle.appendChild(document.createTextNode(this.title));

    var questionProblem = document.getElementById("question__problem");
    questionProblem.removeChild(questionProblem.childNodes[0]);
    questionProblem.appendChild(document.createTextNode(this.problem));

    var main = document.getElementsByTagName("main")[0];
    while(main.children.length > 3){
        main.removeChild(main.childNodes[2])
    }
}
Question.prototype.check = function(input){
    if(input == this.awnser){
        correct();
    }
    else{
        incorrect();
    }
}
class multipleChoice extends Question{
    problemStart = "Pick the right awnser: ";
    constructor(title, problem, awnser, options){
        super(title, problem, awnser);
        this.options = options;
    }
    display(){
        super.display();
        var form = document.getElementsByTagName("form")[0];
        for(var option of this.options){
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
        console.log("succes");
    }
}


class fillInTheBlank extends Question{
    problemStart = "Fill in the black: "
    display(){
        super.display();
    }
}

var questions = [new multipleChoice("Creator", "Who created laravel:", "Taylor Otwell", ["Sergey Sosnovsky", "Tim Berners-Lee", "Taylor Otwell", "Bill Gates"])];
var currentquestion = 0;

var initialDisplay = function(){
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

    //create submit button
    var checkButton = document.createElement("input");
    checkButton.setAttribute("type", "button");
    checkButton.setAttribute("value", "Check");
    checkButton.id = "question__check";
    question.appendChild(checkButton);

    //add all elements to document
    main.appendChild(questionTitle);
    main.appendChild(questionProblem);
    main.appendChild(question);

    //display the first question
    questions[0].display();
}
var correct =  function(){ 

}
var incorrect = function(){

}
