import sql from 'sqlite3';
import Model from './base/model.js';
import QuizModel from './quiz.js';

class TopicModel extends Model {

    constructor() {
        this.table = "topic";
        this.attributes = ["id", "title", "description"];

        super(this.attributes, this.table);
    }

    quiz() {
        this.hasMany(QuizModel, 'topic_id', 'id');
    }
    
    
    .getQuiz(SELECT * FROM QUIZ WHERE id IN ( (SELECT * WHERE score <= 100 AND ... FROM this.table) ));


}
