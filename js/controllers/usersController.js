import usersModel from '../models/usersModel.js'

export default class usersController {
    constructor() {
        this.usersModel = new usersModel();
    }

    //CHECKS IF USER EXISTS
    checkUser(username) {
        let users = this.usersModel.getAll();

        let s = false;
        for (let user of Object.keys(users)) {
            if (users[user].username == username) {

                s = true;
                break;
            }
        }

        return s;
    }

    //CHECK IF PASSWORD IS VALID
    checkPassword(username, password) {
        let users = this.usersModel.getAll();

        let s = false;
        for (let user of Object.keys(users)) {
            if ((users[user].username == username) && (users[user].password == password)) {
                s = true;
                break;
            }
        }

        return s;
    }

    //GETS A SPECIFIC USER
    getUser(username) {
        let users = this.usersModel.getAll();
        let id;

        for (let user of Object.keys(users)) {
            if (users[user].username == username) {
                id = users[user].id;
            }
        }

        return users[id];
    }

    //CHECKS IF USERNAME IS VALID
    checkUsername(username) {
        let users = this.usersModel.getAll();

        let s = false;
        for (let user of Object.keys(users)) {
            if (users[user].username == username) {
                s = true;
                break;
            }
        }

        if (username == "admin") {
            s = true
        }

        return s;
    }

    //CREATES USER
    createUser(items) {
        delete items.cpass
        this.usersModel.create(items);
    }

    //UPDATS USER INFO
    updateInfo(newInfo) {
        this.usersModel.update(newInfo)
    }
}