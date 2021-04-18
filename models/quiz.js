import sql from 'sqlite3';
import Model from './base/model.js';
import TopicModel from './topic.js';
import AttemptModel from './attempt.js';

export default class QuizModel extends Model {

    constructor() {
        const attributes = ["id", "topic_id", "title"];
        const table = "quiz";
        const key = ["id"]; 

        super(attributes, table, key);
    }
    
    
    topic() {
        return this._belongsTo(new TopicModel(), 'id', 'topic_id');
    }

    quiz() {
        return this._hasMany(new AttemptModel(), 'quiz_id', 'id');
    }


}
