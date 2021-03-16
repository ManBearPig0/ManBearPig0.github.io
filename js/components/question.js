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