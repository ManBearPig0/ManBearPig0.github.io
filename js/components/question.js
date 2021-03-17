class Question {
    problemStart = "";
    constructor(title, problem, awnser) {
        this.title = title.toString();
        this.problem = this.problemStart + problem;
        this.awnser = awnser;
    }
    display() {
        title = document.getElementsById("questiontitle")[0].setAttribute("text", this.title);
    }
    check() {

    }
}

const questionClass = new Question();

// Export Module to be able to require() this file.
module.exports = questionClass;