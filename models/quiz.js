import sql from 'sqlite3';
import Model from './base/model.js';

class QuizModel extends Model {

    constructor() {
        const table = "quiz";
        const attributes = ["id", "topic_id", "title"];

        super(this.attributes, this.table);
    }
    
    
    Select 


}
