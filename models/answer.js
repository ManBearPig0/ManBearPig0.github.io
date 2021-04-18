import sql from 'sqlite3';
import Model from './base/model.js';
import QuizModel from './quiz.js';
import UserModel from './user.js';

export default class AnswerModel extends Model {

    constructor() {
        const attributes = ["attempt_index", "question_index", "user_id", "quiz_id", "content", "correct"];
        const table = "quiz";
        const key = ["attempt_index", "question_index", "user_id", "quiz_id"]; 

        super(attributes, table, key);
    }
    
    
    quiz() {
        return this.belongsTo(new QuizModel(), 'id', 'quiz_id');
    }

    user() {
        return this._belongsTo(new UserModel(), 'id', 'user_id');
    }


}
