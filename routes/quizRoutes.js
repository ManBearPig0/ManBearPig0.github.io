import express from 'express';
const router = express.Router();



router.post('/question', (req, res, next) => {
    // do something
});

router.get("/getTopics", (req, res, next) => {
    var Topiclist = ["test1", "test2"]
    var text = ""
    for(var i = 0; i< Topiclist.length; i++){
        text += Topiclist[i] + ",";
    }
    res.send(text);
})

router.get("/getQuizes", (req, res, next) => {
    var Questionlist = ["quiz1","quiz2"];
    var text = "";
    for(var i = 0; i< Questionlist.length; i++){
        text += Questionlist[i] + ",";
    }
    res.send(text);
})

export const quizRoutes = router;
