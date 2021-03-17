class Question {
    problemStart = "";
    constructor(title, problem, awnser) {
        this.title = title.toString();
        this.problem = this.problemStart + problem;
        this.awnser = awnser;
    }
}
Question.prototype.display = function(){
    title = document.getElementsById("questiontitle")[0].setAttribute("text", this.title);
}
Question.prototype.check = function(input){
    if(input == this.awnser){

    }
}
class multipleChoice extends Question{
    problemStart = "Pick the right awnser: ";
    constructor(title, problem, awnser, options){
        super(title, problem, awnser);
        this.options = options
    }
}
multipleChoice.prototype.display = function(){
    this.super.display();

}

class fillInTheBlank extends Question{
    problemStart = "Fill in the black: "
}
fillInTheBlank.prototype.display = function(){
    this.super.display();

}

var questions = []
var initialDisplay = function(){
    var main = document.getElementsByTagName("main")[0];
    var pageTitle = document.createElement("h1");
    pageTitle.appendChild(document.createTextNode("Assesment"))
    var questionTitle = document.createElement("h2");

    main.appendChild(pageTitle);
}
var correct =  function(){ 

}
var incorrect = function(){

}

const questionClass = new Question();

// Export Module to be able to require() this file.
module.exports = questionClass;