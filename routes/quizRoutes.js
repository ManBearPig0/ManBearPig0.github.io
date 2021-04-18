import express from 'express';
const router = express.Router();


router.post('/question', (req, res, next) => {
    // do something
});

router.get("/getTopics", (req, res, next) => {
    var Topiclist = ["test1", "test2"]
    var text = JSON.stringify(Topiclist);
    res.send(text);
})

router.get("/getQuizes", (req, res, next) => {
    var Questionlist = ["quiz1","quiz2"];
    var text = JSON.stringify(Questionlist);;
    res.send(text);
})

router.get("/getQuestion", (req, res, next) => {
    var question = {title :"Creator", problem: "Who created laravel:", awnser : "Taylor Otwell", options:["Sergey Sosnovsky", "Tim Berners-Lee", "Taylor Otwell", "Bill Gates"]};
    var text = JSON.stringify(question);
    res.send(text);
})

export const quizRoutes = router;
