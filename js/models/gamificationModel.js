export default class gamificationModel {
    constructor() {
        this.users = JSON.parse(localStorage.users)
    }

    //SAVES USER TO LOCALSTORAGE AND SESSIONSTORAGE
    save(user) {
        this.users[user.id] = user
        localStorage.users = JSON.stringify(this.users)
        sessionStorage.loggedUser = JSON.stringify(user)
    }
}