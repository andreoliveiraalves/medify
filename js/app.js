import usersView from './views/usersView.js'
import mapView from './views/mapView.js'
import adminView from './views/adminView.js'
import gamificationView from './views/gamificationView.js'

class App {
    constructor() {
        var url = window.location.pathname
        var filename = url.substring(url.lastIndexOf('/') + 1)


        if (filename == "login.html") {
            this.usersView = new usersView()
        } else if (filename == "register.html") {
            this.usersView = new usersView()
        } else if (filename == "profile.html") {
            this.usersView = new usersView()
            this.gamificationView = new gamificationView()
        } else if (filename == "adminPanel.html") {
            this.adminView = new adminView()
        } else if (filename == "about.html") {
            this.usersView = new usersView()
        } else if (filename == "appointment.html") {
            this.usersView = new usersView()
            this.gamificationView = new gamificationView()
        } else if (filename == "" || "index.html") {
            this.usersView = new usersView()
            this.mapView = new mapView()
        } else {
            this.gamificationView = new gamificationView()
            this.usersView = new usersView()
            this.adminView = new adminView()
            this.mapView = new mapView()
        }
    }
}


new App()