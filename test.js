// Import modules
import UserModel from './models/user.js';
import QuizModel from './models/quiz.js';
import TopicModel from './models/topic.js';
import QuestionModel from './models/question.js';

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

//new TopicModel().where(['title', 'Code']).quiz().orderBy('title', 'asc').get(showResult);

new QuestionModel().create({index: "1", quiz_id: "1", title:"Creator", statement: JSON.stringify({options: ["Sergey Sosnovsky", "Tim Berners-Lee", "Taylor Otwell", "Bill Gates"]}), answer: "Taylor Otwell", type: "multiple_choice"});

