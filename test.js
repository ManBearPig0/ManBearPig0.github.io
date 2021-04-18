// Import modules
import UserModel from './models/user.js';
import QuizModel from './models/quiz.js';
import TopicModel from './models/topic.js';

// let result = new UserModel().where([['id', '>', '2'], ['name', '=', 'john']]).orderBy('id').orWhere(['name', 'fat bat']).select(['name', 'password']).update({name: 'samuel'});


// new UserModel().create({
//     name: "jonh",
//     password: "Very Secret password",
// });


// new UserModel().where(['name', '=', 'jons']).delete(processResult);

// for(let i=0; i<10; i++) {
//     new UserModel().where(['name', `user-${i}`]).update({login: i});
// }
// new UserModel().where(['name', `John`]).update({login: 252});

// new TopicModel().create({title: "Code", description: "How the semantics work, and tests your skill in coding with Laravel."});
// new TopicModel().create({title: "Facts", description: "How well you know the purpose of Laravel, it's history, by whom it was made and other juicy facts."});

// new QuizModel().create({topic_id: 1, title: "Eloquent"});
// new QuizModel().create({topic_id: 1, title: "Blade"});
// new QuizModel().create({topic_id: 1, title: "Seeders"});

// new QuizModel().create({topic_id: 2, title: "History"});
// new QuizModel().create({topic_id: 2, title: "Framework"});
// new QuizModel().create({topic_id: 2, title: "MVC"});
// new QuizModel().create({topic_id: 2, title: "Composer"});

// new TopicModel().where(['title', 'Code']).quiz().orderBy('title', 'asc').get(showResult);


function showResult(result) {
    console.log("Result: \t", result);
}

// router.get("/getTopics", (req, res, next) => {

//     function showResult(result) {
//         Topiclist = result.map(obj => obj.title);
//         console.log("Result list: ", Topiclist);
//         var text = JSON.stringify(Topiclist);
//         res.send(text);
//     }
    
//     console.log("Executing query...");
//     new TopicModel().select(["title"]).get(showResult);
// });


new QuizModel().where(["title", "Blade"]).question().where(["index", 1]).first(showResult);



// router.get("/getQuestion", (req, res, next) => {
//     function getResult(result) {
//         let question = result.map(obj => obj.title);
//         console.log(result);
//         var text = JSON.stringify(question);
//         res.send(text);
//     }
//     var quiz = req.query.quiz;
//     var questionnumber =  req.query.question;
//     new QuizModel().where(["title", "Blade"]).question().where(["index", 1]).first(getResult);
// })


// Running Query:   SELECT * FROM question WHERE "quiz_id" IN (SELECT "id" FROM (SELECT * FROM quiz WHERE "title" = ? )) WHERE "index" = ?  
// With values:     [ 'Bladequestion=1', undefined ]