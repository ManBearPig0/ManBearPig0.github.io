import sqlite from 'sqlite3';
import path from 'path';

export default class Model {
    constructor(attributes, table, key) {
        this.table = table;
        this.attributes = attributes;
        this.key = key;

        this.select_query = `SELECT * FROM ${table}`;
        this.started_query = false;

        this.sql_functions = ['max', 'min', 'julianday'];
        this.sql_logic_operators = ['=', '>', '<', '>=', '<=', '<>'];

        this.input_data = {};
        this.input_names = {};
        this.result = false;
    }

    #database_path = path.resolve(path.dirname('')) + "/storage/db/laravel.db";

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

    /**
     * A hasMany relation to get all the related Models of the currently queried Models.
     * @param {Model} model A different model class which has a relation with this model class. 
     * @param {string} foreign_key The name of the column for the foreign key in the other model
     * @param {string} key The name of the column which the foreign key references in this model. 
     * @returns {Model} Returns self
     */
    _hasMany(model, foreign_key, key) {
        model.select_query = `SELECT * FROM (SELECT * FROM ${model.table} WHERE ${this.#createNameID(foreign_key)} IN (SELECT ${this.#createNameID(key)} FROM (${this.select_query})))`;
        model.input_data = this.input_data;
        model.input_names = this.input_names;
        return model;
    }

    /**
     * A belongsTo relation to get all the related Models of the currently queried Models. (Is functionally the same as _hasMany, but serves a different meaning)
     * @param {Model} model A different model class which has a relation with this model class. 
     * @param {string} foreign_key The name of the column for the foreign key in the other model
     * @param {string} key The name of the column which the foreign key references in this model. 
     * @returns {Model} Returns self
     */
    _belongsTo(model, foreign_key, key) {
        model.select_query = `SELECT * FROM (SELECT * FROM ${model.table} WHERE ${this.#createNameID(foreign_key)} IN (SELECT ${this.#createNameID(key)} FROM (${this.select_query})))`;
        model.input_data = this.input_data;
        model.input_names = this.input_names;
        return model;
    }

    /**
     * Same as the 'where' function, but places an OR statement at where the previous 'where' ended.
     */
    orWhere(conditionList) {
        return this.where(conditionList, true);
    }

    /**
     * Add a WHERE clause to the current query.
     * @param {array} attributes An array containing a condition or 2d array with multiple conditions. 
     * A condition consists of a column, optionally a custom operator and a value: ['name', 'John'] is equal to ['name', '=', 'John']
     * @param {bool} orWhere Set if this query should place an OR instead of an AND.
     * @returns {Model} Returns self
     */
    where(conditionList, orWhere = false) {
        let conditional_query = "";

        if (Array.isArray(conditionList[0])) {
            // Add the '=' operator to all conditions that didn't specify an operator
            conditionList = conditionList.map((condition) => {
                if (condition.length == 2) {
                    return [condition.slice(0, 1), '=', condition.slice(1)]
                }
                return condition;
            });

            // Add multiple conditions while validating input
            conditional_query = conditionList.filter((condition) => (this.attributes.indexOf(condition[0]) != -1 && this.sql_logic_operators.indexOf(condition[1]) != -1))
                .map((condition) => `${this.#createNameID(condition[0])} ${condition[1]} ${this.#createDataID(condition[2])}`)
                .join(" AND ");
        } else if (this.attributes.indexOf(conditionList[0]) != -1) {
            // Add the '=' operator to if didn't specify an operator
            if (conditionList.length == 2) {
                conditionList = [conditionList[0], '=', conditionList[1]]
            }

            // single condition while validating inputs
            if ((this.attributes.indexOf(conditionList[0]) != -1 && this.sql_logic_operators.indexOf(conditionList[1]) != -1)) {
                conditional_query = `${this.#createNameID(conditionList[0])} ${conditionList[1]} ${this.#createDataID(conditionList[2])}`;
            }
        }

        if (conditional_query) {
            this.select_query = this.#appendAfterQueryStatement(this.select_query, conditional_query, "WHERE", (orWhere) ? "OR" : null)
        }

        return this;
    }

    orderBy(attributes, direction = "DESC") {
        direction = direction.toUpperCase();
        direction = (direction == "ASC" || direction == "DESC") ? direction : "DESC";

        if (Array.isArray(attributes) == false) {
            attributes = [attributes];
        }

        let order_query = attributes.filter((name) => this.attributes.indexOf(name) != -1).map((attribute) => this.#createNameID(attribute)).join(` ${direction}, `);
            order_query += ` ${direction}`;

        if (order_query) {
            this.select_query = this.#appendAfterQueryStatement(this.select_query, order_query, "ORDER BY");
        }

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
            select_str = attributes.filter((arr) => this.attributes.indexOf(arr[0]) != -1).map((arr) => {
                let name = `${this.#createNameID(arr[0])}`;
                arr.splice(0, 1).filter((func) => this.sql_functions.indexOf(func) != -1).forEach((func) => {
                    name = `${func}(${name})`;
                });
                return name;
            }).join(", ");
        } else {
            // Select each attribute.
            select_str = attributes.filter((name) => this.attributes.indexOf(name) != -1).map((attribute) => this.#createNameID(attribute)).join(", ");
        }

        let leftPos = this.select_query.indexOf("SELECT");
        let rightPos = this.select_query.indexOf("FROM") + 4;
        this.select_query = this.select_query.replace(this.select_query.substr(leftPos, rightPos - leftPos), `SELECT ${select_str} FROM`);
        return this;
    }

    /**
     * Insert or append a new query string into the correct position.
     * 
     * @param {string} queryString Main query string to add into 
     * @param {string} appendString Query to append
     * @param {string} statement Statement
     * @param {*} additional 
     * @returns 
     */
    #appendAfterQueryStatement(queryString, appendString, statement, additional = null) {
        const statementOrderList = ["WHERE", "ORDER BY", "IN"];
        const statementOrderPos = statementOrderList.indexOf(statement);
        if (statementOrderPos == -1) {
            throw "unknown statement: " + statement;
        }

        // Only edit after the inner query, to not unclude inner query duplicate statements.
        const posAfterInnerQuery = (this.select_query.lastIndexOf(")") == -1 ? 0 : this.select_query.lastIndexOf(")"));
        let statementPos = queryString.length;
        let statementExists = (queryString.indexOf(statement, posAfterInnerQuery) != -1);

        // Get the position before at the end of the query before any other statement in the order after the current statement 
        statementOrderList.splice(statementOrderPos + 1, statementOrderList.length - statementOrderPos).forEach((orderStatement, key) => {
            if (queryString.indexOf(orderStatement, posAfterInnerQuery) != -1 && queryString.indexOf(orderStatement, posAfterInnerQuery) < statementPos) {
                statementPos = queryString.indexOf(orderStatement, posAfterInnerQuery);
            }
        });

        function addAtPos(string, substr, pos) {
            return [string.slice(0, pos), substr, string.slice(pos)].join('');
        }

        switch (statement) {
            case "WHERE":
                if (statementExists) {
                    let addStatement = (additional == "OR") ? "OR" : "AND";
                    return addAtPos(queryString, ` ${addStatement} ${appendString} `, statementPos);
                } else {
                    return addAtPos(queryString, ` WHERE ${appendString} `, statementPos);
                }
            case "ORDER BY":
                if (statementExists) {
                    return addAtPos(queryString, `, ${appendString} `, statementPos);
                } else {
                    return addAtPos(queryString, ` ORDER BY ${appendString} `, statementPos);
                }
            default:
                return queryString;
        }
    }

    /**
     * Save all data values as ID's before executing the query. This is to avoid SQL injections and other errors
     * @param {string} dataString 
     * @returns 
     */
    #createDataID(dataString) {
        const dataID = Object.keys(this.input_data).length;
        this.input_data[dataID] = dataString;
        return `"${dataID}"`;
    }

    /**
     * Save all data values as ID's before executing the query. This is to avoid SQL injections and other errors
     * @param {string} dataString 
     * @returns 
     */
    #createNameID(nameString) {
        const nameID = Object.keys(this.input_names).length;
        this.input_names[nameID] = nameString;
        return `'${nameID}'`;
    }

    /**
     * Save all attribute values as ID's before executing the query. This is to avoid other errors
     * @param {string} dataString 
     * @returns 
     */
    #createAttributeID(dataString) {
        const dataID = Object.keys(this.input_data).length;
        this.input_attributes[dataID] = dataString;
        return dataID;
    }

    /**
     * Retrieves a single record using the query build with this class.
     * @param {function} callback Function that receivers the result as an object parameter after it has been processed
     * @returns {array} an array of a single record attribute values or undefined
     */
    first(callback) {
        let query = this.select_query;
        this.#runQuery("get", query, callback);
    }

    /**
     * Retrieves multiple records using the query build with this class.
     * @param {function} callback Function that receivers the result as an object parameter after it has been processed
     * @returns {array} returns a 2d array of records and their attribute values or undefined
     */
    get(callback) {
        let query = this.select_query;
        this.#runQuery("all", query, callback);
    }

    /**
     * Delete existing database records with DELETE using the query build with this class.
     * @param {function} callback Function that receivers the result as an object parameter after it has been processed
     * @returns {array} returns a 2d array of records and their attribute values or undefined
     */
    delete() {
        let query = `DELETE FROM ${this.table} WHERE (${this.key.map((attribute) => this.#createNameID(attribute)).join(', ')}) 
            IN (SELECT (${this.key.map((attribute) => this.#createNameID(attribute)).join(', ')}) FROM (${this.select_query}))`;
        this.#runQuery("run", query);
    }

    /** 
     * Update existing database records using the query build with this class.
     * @param {object} attributeValues An object with the attribute name as the key and it's value as the new value, e.g: {name: 'John', password: 'secret'}
     * @param {function} callback Function that receivers the result as an object parameter after it has been processed
     */
    update(attributeValues) {
        // let setQuery = attributeValues.filter((attribute) => this.attributes.indexOf(attribute) != -1)
        //     .map((attribute, value) => `${attribute} = ${value}`).join(', ');
        let setQuery = "";

        for (const attribute in attributeValues) {
            if (this.attributes.indexOf(attribute) != -1) {
                if (setQuery) {
                    setQuery += `, ${this.#createNameID(attribute)} = ${this.#createDataID(attributeValues[attribute])}`;
                } else {
                    setQuery = `${this.#createNameID(attribute)} = ${this.#createDataID(attributeValues[attribute])}`;
                }
            }
        }

        let query = `UPDATE ${this.table} SET ${setQuery} WHERE ${this.key.map((attribute) => this.#createNameID(attribute)).join(', ')} 
            IN (SELECT (${this.key.map((attribute) => this.#createNameID(attribute)).join(', ')}) FROM (${this.select_query}))`;
        this.#runQuery("get", query);
    }


    /**
     * Creates a single record using INSERT
     * @param {object} attributes An object with the attribute name as the key and it's value as the new value, e.g: {name: 'John', password: 'secret'}
     * @param {function} callback Function that receivers the result as an object parameter after it has been processed
     */
    create(attributes) {
        const names = [];
        const values = [];
        for (const name in attributes) {
            names.push(name);
            values.push(attributes[name]);
        }

        // Build sql query
        const query = `INSERT INTO ${this.table}(${names.map((attribute) => this.#createNameID(attribute)).join(', ')}) VALUES (${values.map((val) => this.#createDataID(val)).join(', ')})`;
        this.#runQuery("run", query);
    }


    /**
     * Connect to the database, run a query and callback it's results.
     * @param {string} functionName This should be 'get' or 'run', depending on what function has called it
     * @param {string} query The query with dataID's instead of user input values. This will be parsed.
     * @param {*} callback A callback function that will run once the query has finished
     * @returns 
     */
    #runQuery(functionName, query, callback = null) {
        sqlite.verbose();
        let db = new sqlite.Database(this.#database_path, sqlite.OPEN_READWRITE, (err) => {
            if (err) { return console.error(err.message); }
        });

        function replaceAtPos(string, substr, pos, length) {
            return [string.slice(0, pos), substr, string.slice(pos + length)].join('');
        }

        try {
            // Replace all dataID's in query  with (?) and create an array in correct order to avoid SQL injections.
            let values = [];
            while (query.indexOf('"') != -1) {
                const firstPos = query.indexOf('"');
                const secondPos = query.indexOf('"', firstPos + 1);

                if (secondPos === -1) { break; }

                let dataID = query.substr(firstPos + 1, secondPos - firstPos - 1);
                let data = this.input_data[dataID];

                query = replaceAtPos(query, `?`, firstPos, secondPos - firstPos + 1);

                values.push(data);
            }

            let names = [];
            while (query.indexOf("'") != -1) {
                const firstPos = query.indexOf("'");
                const secondPos = query.indexOf("'", firstPos + 1);

                if (secondPos === -1) { break; }

                let nameID = query.substr(firstPos + 1, secondPos - firstPos - 1);
                let name = this.input_names[nameID];

                query = replaceAtPos(query, `"${name}"`, firstPos, secondPos - firstPos + 1);

                names.push(name);
            }

            console.log("Running Query: \t", query, "\nWith values: \t", values);

            if (functionName == "get") {
                db.get(query, values, (err, rows) => {
                    if (err) { throw err; }
                    if (callback) { callback(rows); }
                });
            } else if (functionName == "run") {
                db.run(query, values, (err, rows) => {
                    if (err) { throw err; }
                    if (callback) { callback(rows); }
                });
            } else if (functionName == "all") {
                db.all(query, values, (err, rows) => {
                    if (err) { throw err; }
                    if (callback) { callback(rows); }
                });
            }

        } finally {
            db.close((err) => {
                if (err) { return console.error(err.message); }
            });
        }
    }
}