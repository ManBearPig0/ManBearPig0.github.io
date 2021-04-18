import sql from 'sqlite3';
import Model from './base/model.js';
import QuizModel from './quiz.js';

export default class TopicModel extends Model {

    constructor() {
        const attributes = ["id", "title", "description"];
        const table = "topic";
        const key = ["id"]; 

        super(attributes, table, key);
    }

    quiz() {
        return this._hasMany(new QuizModel(), 'topic_id', 'id');
    }
    

}
