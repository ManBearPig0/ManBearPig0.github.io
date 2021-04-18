import express from 'express';
import QuizModel from '../models/quiz.js';
import TopicModel from '../models/topic.js'
const router = express.Router();


router.get("/getTopics", (req, res, next) => {

    function getResult(result) {
        let Topiclist = result.map(obj => obj.title);
        var text = JSON.stringify(Topiclist);
        res.send(text);
    }
    new TopicModel().select(["title"]).get(getResult);
});
router.get("/getQuizes", (req, res, next) => {
    function getResult(result) {
        let Quizlist = result.map(obj => obj.title);
        var text = JSON.stringify(Quizlist);
        res.send(text);
    }
    
    var topic = req.query.topic;
    new TopicModel().where(["title", topic]).select(["title", "id"]).quiz().get(getResult);
})

router.get("/getQuestion", (req, res, next) => {
    function getResult(result) {
        if(result.type == "multiple_choice"){
            var question = {title: result.title, problem: JSON.parse(result.statement).problem, options: JSON.parse(result.statement).options, type : result.type};
        }
        else if(result.type == "fill_in_the_blank"){
            var question = {title: result.title, problem: JSON.parse(result.statement).problem, firsthalf: JSON.parse(result.statement).firsthalf, secondhalf: JSON.parse(result.statement).secondhalf, type : result.type};
        }
        var text = JSON.stringify(question);
        res.send(text);
    }
    var quiz = req.query.quiz;
    var questionnumber =  req.query.question;
    new QuizModel().where(["title", quiz]).question().where(["index", questionnumber]).first(getResult);
})
router.get("/checkQuestion", (req, res, next)=>{
    function getResult(result) {
        console.log(result.answer);
        var reaction = {correct: attempt == result.answer  , awnser: result.answer, source: "temp"};
        var text = JSON.stringify(reaction);
        res.send(text);
    }
    var attempt = req.query.attempt;
    var quiz = req.query.quiz;
    var questionnumber = req.query.questionnumber;
    new QuizModel().where(["title", quiz]).question().where(["index", questionnumber]).select(["answer"]).first(getResult);
})
export const quizRoutes = router;
