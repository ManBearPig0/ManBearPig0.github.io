import sqlite from 'sqlite3';

export default class Model {
    constructor(attributes, table, key) {
        this.table = table;
        this.attributes = attributes;
        this.key = key;

        this.select_query = `SELECT * FROM ${table}`;
        this.started_query = false;

        this.sql_functions = ['max', 'min', 'julianday'];
        this.sql_logic_operators = ['=', '>', '<', '>=', '<=', '<>'];
    }

    #db;
    #database_path = "../../storage/db/laravel.db";


    /**
     * Customly set the SELECT query, vulnerable against SQL injections
     * @param {string} query Custom query string 
     */
    unsafeSelect(query) {
        if (query.substr(0, 6) != "SELECT") {
            query = `SELECT ${query}`;
        }

        this.sql_select = query;
        return this;
    }

    hasMany(model, foreign_key, key) {
        model.select_query = `SELECT * FROM ${model.table} WHERE ${foreign_key} IN (SELECT ${key} FROM (${this.select_query}))`;
        return model;
    }

    /**
     * Add a WHERE clause to the current query.
     * @param {array} attributes An array containing a condition or 2d array with multiple conditions. 
     * A condition consists of a column, optionally a custom operator and a value: ['name', 'John'] is equal to ['name', '=', 'John']
     * @returns {Model} Returns self
     */
    where(attributes) {
        let conditional_query = "";

        function parseCondition(array) {
            if (array.length == 2) {
                // Default is checking if attribute is equal to a value
                return `"${array[0]}" = ${array[1]}`;
            } else if (array.length > 2) {
                // With custom comparison operator
                return `"${array[0]}" ${array[1]} ${array[2]}`;
            }
        }

        if (Array.isArray(attributes[0])) {
            // Add multiple conditions
            conditional_query = " WHERE " + attributes.filter((condition) => this.attributes.indexOf(condition[0]) != -1)
                .map((condition) => parseCondition(condition))
                .join(" AND ");
        } else if (this.attributes.indexOf(attributes[0]) != -1) {
            // single condition
            conditional_query = ` WHERE ${parseCondition(attributes)}`;
        }
        
        this.select_query = `SELECT * FROM (${this.select_query}) ${conditional_query}`;
        return this;
    }

    /**
     * Select any attributes with optional SQL functions from the current query.
     * @param {array} attributes An array of attributes or 2d array with first the attribute and then any number of available SQL functions.
     */
    select(attributes) {
        let select_str = "*";
        if (Array.isArray(attributes[0])) {
            // Select each attribute with optional SQL function
            select_str =  attributes.filter((arr) => this.attributes.indexOf(arr[0]) != -1).map((arr) => {
                let name = `"${arr[0]}"`;
                arr.splice(0,1).filter((func) => this.sql_functions.indexOf(func) != -1).forEach((func) => {
                    name = `${func}(${name})`;
                });
            }).join(", ");
        } else {
            // Select each attribute.
            select_str =  attributes.filter((name) => this.attributes.indexOf(name) != -1).join(", ");
        }

        let leftPos = this.select_query.indexOf("SELECT");
        let rightPos = this.select_query.indexOf("FROM") + 4;
        this.select_query = this.select_query.replace(this.select_query.substr(leftPos, rightPos - leftPos), `SELECT ${select_str} FROM`);
        return this;
    }

    /**
     * Retrieves a single record using the query build with this class.
     * 
     * @returns {array} an array of a single record attribute values or undefined
     */
    first() {
        let query = this.select_query;

        if (true) {
            console.log(query);
        } else {
            this.#runQuery(() => {
                this.#db.get(query, (err, rows) => {
                    if (err) { throw err; }
                    return rows;
                })
            });
        }
    }

    /**
     * Retrieves multiple records using the query build with this class.
     * 
     * @returns {array} returns a 2d array of records and their attribute values or undefined
     */
     get() {
        let query = this.select_query;

        if (true) {
            console.log(query);
        } else {
            this.#runQuery(() => {
                this.#db.run(query, (err, rows) => {
                    if (err) { throw err; }
                    return rows;
                })
            });
        }
    }

    /**
     * Delete existing database records with DELETE using the query build with this class.
     * 
     * @returns {array} returns a 2d array of records and their attribute values or undefined
     */
    delete() {
        let query = `DELETE FROM ${this.table} WHERE (${this.key.join(', ')}) IN (SELECT (${this.key.join(', ')}) FROM (${this.select_query}))`;

        if (true) {
            console.log(query);
        } else {
            this.#runQuery(() => {
                this.#db.run(query, (err, rows) => {
                    if (err) { throw err; }
                    return rows;
                })
            });
        }
    }

    /** 
     * Update existing database records using the query build with this class.
     * 
     * @param {object} attributes An object with the attribute name as the key and it's value as the new value, e.g: {name: 'John', password: 'secret'}
     */
    update(attributes) { // W.I.P
        let query = this.select_query;
        let values = attributes;

        this.#runQuery(() => {
            this.#db.run(query, values, (err) => {
                if (err) { throw err; }
            });
        });
    }


    /**
     * Creates a single record using INSERT
     * 
     * @param {object} attributes An object with the attribute name as the key and it's value as the new value, e.g: {name: 'John', password: 'secret'}
     */
     create(attributes) {
        const names = attributes.map((val, name) => name);
        const values = attributes.map((val, name) => val);
        
        // Build sql query
        const sql = `INSERT INTO ${table}(${names.join(', ')}) VALUES (${values.map((val) => '?').join(', ')})`;

        this.#runQuery(() => {
            this.#db.run(sql, values, (err) => {
                if (err) { throw err; }
            });
        });
    }

    /**
     * Attempt executing database query request.
     * @param {*} func 
     */
    #runQuery(func) {
        this.#setupDB();
        try {
            func();
        } finally {
            this.#closeDB();
        }
    }

    /**
     * Sets up the database connection 
     */
    #setupDB() {
        sqlite.verbose();
        this.#db = new sqlite.Database(this.#database_path, sqlite.OPEN_READWRITE, (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Connected to the laravel SQlite database file.');  
        });
    }

    /**
     * Closes the current database connection
     */
    #closeDB() {
        this.#db.close((err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log('Closed the database connection.');
        });    
    }
}
