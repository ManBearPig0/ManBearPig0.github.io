import sql from 'sqlite3';
import Model from './base/model.js';
import AttemptModel from './attempt.js';
import AnswerModel from './answer.js';

export default class UserModel extends Model {

    constructor() {
        const attributes = ["id", "name", "password", "login"];
        const table = "user";
        const key = ["id"]; 

        super(attributes, table, key);
    }
    
    

    attempt() {
        return this._hasMany(new AttemptModel(), 'user_id', 'id');
    }

    answer() {
        return this._hasMany(new AnswerModel(), 'user_id', 'id');
    }


}
