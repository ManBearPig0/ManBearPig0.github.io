import sql from 'sqlite3';
import Model from './base/model.js';

export default class UserModel extends Model {

    constructor() {
        super(["id", "name", "password", "login"], "user", ["id"]);
        
    }
    
    




}
