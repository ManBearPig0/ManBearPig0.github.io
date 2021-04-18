import sql from 'sqlite3';
import Model from './base/model.js';
import QuizModel from './quiz.js';

export default class QuestionModel extends Model {

    constructor() {
        const attributes = ["index", "quiz_id", "title", "statement", "answer", "type"];
        const table = "question";
        const key = ["index", "quiz_id"]; 

        super(attributes, table, key);
    }
    
    
    quiz() {
        return this._belongsTo(new QuizModel(), 'id', 'quiz_id');
    }


}
