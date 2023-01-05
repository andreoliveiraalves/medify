import gamificationModel from '../models/gamificationModel.js'

export default class gamificationController {
    constructor() {

        //SETS DEFAULT STORE ITEMS
        try {
            this.storeItems = {
                appointmentsDiscount: {
                    discount25: {
                        name: "25% Desconto",
                        desc: "lorem ipsum",
                        price: 50
                    },
                    discount50: {
                        name: "50% Desconto",
                        desc: "lorem ipsum",
                        price: 100
                    },
                    discount100: {
                        name: "100% Desconto",
                        desc: "lorem ipsum",
                        price: 150
                    }
                },
                pillsDiscount: {
                    discount5: {
                        name: "5% Desconto",
                        desc: "lorem ipsum",
                        price: 10
                    },
                    discount25: {
                        name: "25% Desconto",
                        desc: "lorem ipsum",
                        price: 30
                    }
                }
            }

            this.gamificationModel = new gamificationModel()
            this.users = JSON.parse(localStorage.users)
            this.user = sessionStorage.loggedUser != "admin" ? JSON.parse(sessionStorage.loggedUser) : "admin"
        } catch (err) {}
    }

    //FUNCTION TO ADD XP TO USER
    addXP(amount) {

        //UPDATES XP
        if (this.user.xp) {
            this.user.xp += amount
        } else {
            this.user.xp = amount
        }

        //ALERTS SUCCESS
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'You received ' + amount + ' XP!',
            showConfirmButton: false,
            timer: 500
        }).then(() => { this.gamificationModel.save(this.user) })
    }

    //FUNCTION TO ADD BADGE
    addBadge(badgeName) {

        //CHECKS IF USER ALREADY HAS THAT BADGE
        if (this.user.badges) {
            let valid = false
            let userBadges = this.user.badges

            for (let badge in userBadges) {
                if (userBadges[badge] == badgeName) {
                    valid = false
                    break
                } else { valid = true }
            }

            if (valid) {
                this.user.badges.push(badgeName)
                this.gamificationModel.save(this.user)

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'You received a new Badge!',
                    imageUrl: '../content/img/badges/' + badgeName + 'Badge.png',
                    imageHeight: 100,
                    imageAlt: badgeName,
                    showConfirmButton: false,
                    timer: 500
                }).then(() => { this.addXP(300) })
            }


        } else {
            this.user.badges = []
            this.user.badges.push(badgeName)
            this.gamificationModel.save(this.user)

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'You received a new Badge!',
                imageUrl: '../content/img/badges/' + badgeName + 'Badge.png',
                imageHeight: 100,
                imageAlt: badgeName,
                showConfirmButton: false,
                timer: 500
            }).then(() => { this.addXP(300) })
        }
    }

    //FUNCTION TO REDEEM ITEM FROM STORE
    redeem(type, name) {
        if (this.user.coins) {
            if (Number(this.user.coins) >= Number(this.storeItems[type][name].price)) {

                this.addXP(100)
                this.user.coins = parseFloat(Number(this.user.coins) - Number(this.storeItems[type][name].price)).toFixed(2)
                this.users[this.user.id] = this.user
                localStorage.users = JSON.stringify(this.users)
                sessionStorage.loggedUser = JSON.stringify(this.user)

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Success',
                    text: 'You redeemed a new product!',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    location.reload()
                })
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Not enough coins!',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Oops...',
                text: 'Not enough coins!',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    //FUNCTION TO EXCHANGE XP TO COINS
    exchange(xpStr, coinsStr) {
        coinsStr = coinsStr.replace(",", ".")
        let coinsValue = Number(parseFloat(coinsStr).toFixed(2))
        let xpValue = parseInt(xpStr)
        let userXP = this.user.xp ? parseInt(this.user.xp) : 0

        if (this.user.xp) {
            if (xpValue > userXP) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Not enough xp! You need ' + (xpValue - userXP) + ' XP.',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                this.user.xp -= xpValue
                this.user.coins = this.user.coins ? parseFloat((Number(this.user.coins) + coinsValue)).toFixed(2) : coinsValue

                //SAVES TO STORAGE
                let users = JSON.parse(localStorage.users)
                users[this.user.id] = this.user
                localStorage.users = JSON.stringify(users)
                sessionStorage.loggedUser = JSON.stringify(this.user)

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Success.',
                    text: 'Your XP was exchanged!',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    location.reload()
                })
            }
        } else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Oops...',
                text: 'Not enough XP!',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }
}