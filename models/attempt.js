import sql from 'sqlite3';
import Model from './base/model.js';
import QuizModel from './quiz.js';
import UserModel from './user.js';

export default class AttemptModel extends Model {

    constructor() {
        const attributes = ["index", "user_id", "quiz_id", "started", "ended"];
        const table = "attempt";
        const key = ["index", "user_id", "quiz_id"]; 

        super(attributes, table, key);
    }
    
    
    quiz() {
        return this.belongsTo(new QuizModel(), 'id', 'quiz_id');
    }

    user() {
        return this.belongsTo(new UserModel(), 'id', 'user_id');
    }


}
