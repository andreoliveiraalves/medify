import gamificationController from '../controllers/gamificationController.js'

export default class gamificationView {
    constructor() {
        this.gamificationController = new gamificationController()
        try {
            this.user = JSON.parse(sessionStorage.loggedUser)
        } catch (err) {}


        //XP
        //SHOW ON USER PROFILE
        try {
            if (this.user.xp) {
                document.getElementById("xp").innerHTML = this.user.xp + " XP"
            }
        } catch (err) {}


        //BADGES
        //SHOW BADGES IN PROFILE
        try {
            if (this.user.badges) {
                let userBadges = this.user.badges
                for (let badge of userBadges) {

                    document.getElementById("badgesList").innerHTML += `<img class="badgeImg" src="img/badges/` + badge + `Badge.png">`
                }
            }
        } catch (err) {}

        //COINS
        //SHOW COINS IN PROFILE
        try {
            //GET AND SHOW USER COINS
            let userCoins = this.user.coins ? this.user.coins : 0
            document.getElementById("coins").innerHTML += userCoins

            //SHOW ITEMS ON STORE
            for (let type in this.gamificationController.storeItems) {
                for (let item in this.gamificationController.storeItems[type]) {
                    //SETS CARD
                    let html = `<div class="col-lg-4 col-md-6 mb-4" style="margin-top: 50px;">
                    <div class="card h-100">
                        <a href="#"><img class="card-img-top" src="../content/img/` + type + `.jpg" alt="` + this.gamificationController.storeItems[type][item].name + `"></a>
                        <div class="card-body">
                        <h4 class="card-title"><a href="#">` + this.gamificationController.storeItems[type][item].name + `</a></h4>                                           
                        <h5>` + this.gamificationController.storeItems[type][item].price + ` <img src="../content/img/coin.png" style="height: 15px; width: auto;"></h5>
                        <p class="card-text">` + this.gamificationController.storeItems[type][item].desc + `</p>
                    </div>
                    <div class="card-footer" style="text-align: center;">
                        <button class="btn btn-pass redeemBtt" data-type="` + type + `" data-item="` + item + `">Redeem</button>
                     </div>
                    </div>
                </div>`

                    //SHOWS CARD
                    document.getElementById("storeItems").innerHTML += html
                }
            }

            //SETS EVENTLISTENERS
            let redeemBtts = document.getElementsByClassName("redeemBtt")

            for (let btt of redeemBtts) {
                let type = btt.dataset.type
                let item = btt.dataset.item

                btt.addEventListener("click", () => {
                    this.gamificationController.redeem(type, item)
                })
            }
        } catch (err) {}








        //BUTTONS HANDLER
        try {
            document.getElementById("exXP").addEventListener("change", () => {
                if (parseInt(document.getElementById("exXP").value) < 150) {
                    document.getElementById("exXP").value = 150
                    document.getElementById("exCoins").value = 1

                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Minimum of 150 XP to be exchanged',
                        showConfirmButton: false,
                        timer: 500
                    })

                } else {
                    document.getElementById("exCoins").value = parseFloat(parseInt(document.getElementById("exXP").value) / 150).toFixed(2)
                }
            })

            document.getElementById("exchangeBtt").addEventListener("click", () => {

                this.gamificationController.exchange(parseInt(document.getElementById("exXP").value), parseFloat(parseInt(document.getElementById("exXP").value) / 150).toFixed(2))
            })
        } catch (err) {}
    }
}