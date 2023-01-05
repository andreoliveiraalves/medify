export default class usersModel {
    constructor()  {
        this.users = localStorage.users ? JSON.parse(localStorage.users) : {}
    }

    //CREATES NEW USER
    create(newUser) {
        let usersObjK = Object.keys(this.users)

        if (usersObjK.length == 0) {
            newUser.id = 0
        } else {

            let lastid = usersObjK[usersObjK.length - 1]

            newUser.id = parseInt(lastid) + 1
        }

        this.users[newUser.id] = newUser;
        this._persist();
    }

    //REMOVES USER
    remove(id) {
        delete this.users[id];
        this._persist();
    }

    //UPDATES USER
    update(newInfo) {
        this.users[newInfo.id] = newInfo

        this._persist();
    }

    //RETURN ALL USERS
    getAll() {
        return this.users;
    }

    //GET USER
    get(id) {
        let user = this.users[id] ? this.users[id] : {};

        return user;
    }

    //SAVES NON DEFAULT USERS OBJECT - ex. SELF-CHANGED
    savePer(usersObj) {
        localStorage.users = JSON.stringify(usersObj);
    }

    //SAVES TO LOCAL STORAGE
    _persist() {
        localStorage.users = JSON.stringify(this.users);
    }
}