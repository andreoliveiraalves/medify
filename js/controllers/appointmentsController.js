import usersModel from '../models/usersModel.js'
import doctorsModel from '../models/doctorsModel.js'
import gamificationController from '../controllers/gamificationController.js'

export default class appointmentsController {
    constructor() {
        this.usersModel = new usersModel()
        this.doctorsModel = new doctorsModel()
        this.gamificationController = new gamificationController()
    }

    //FUNCTION TO START AN APPOINTMENT
    startAppointment(docId, dist) {
        if (sessionStorage.loggedUser) {
            //SETS THE DATE
            var d = new Date();
            var n = d.toLocaleDateString();

            //SETS THE INFO TO SAVE
            let userId = JSON.parse(sessionStorage.loggedUser).id
            let appointmentInfo = { docId: docId, userId: userId, date: n, distance: dist }

            //ADDS TO TEMPORARY APPOINTMENT
            sessionStorage.currAppointment = JSON.stringify(appointmentInfo)

            //REMOVE DOCTOR FROM MAP
            let doctors = JSON.parse(localStorage.doctors)
            doctors[docId].status = 1
            localStorage.doctors = JSON.stringify(doctors)


            //REDIRECTS TO APPOINTMENT
            location.href = "/content/appointment.html"
        } else {
            //ALERTS ERROR
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Oops...',
                text: 'Please login!',
                showConfirmButton: false,
                timer: 500,
                footer: '<a href="../content/login.html">Click here to Login</a>'
            })
        }
    }

    endAppointment(fbStatus, feedback = "") {
        //GAMIFICATION HANDLER
        this.gamificationController.addBadge("firstAppointment")
        if (parseInt(JSON.parse(sessionStorage.currAppointment).distance) <= 20) {
            this.gamificationController.addBadge("localSupport")
        }
        this.gamificationController.addXP(100)

        //SAVE APPOINTMENT
        if (fbStatus == false) {
            let aptInfo = JSON.parse(sessionStorage.currAppointment)

            let users = JSON.parse(localStorage.users)
            let doctors = JSON.parse(localStorage.doctors)

            let user = JSON.parse(sessionStorage.loggedUser)
            let doctor = doctors[aptInfo.docId]

            //CREATES THE OBJECT
            if (user.appointments) {
                let aptId = Object.keys(user.appointments).length

                user.appointments[aptId] = {
                    id: aptId,
                    doctor: {
                        fname: doctor.fname,
                        lname: doctor.lname,
                        speciality: doctor.speciality,
                        bio: doctor.bio
                    },
                    date: aptInfo.date
                }
            } else {
                user.appointments = {
                    0: {
                        id: 0,
                        doctor: {
                            fname: doctor.fname,
                            lname: doctor.lname,
                            speciality: doctor.speciality,
                            bio: doctor.bio
                        },
                        date: aptInfo.date
                    }
                }
            }

            users[user.id] = user
            sessionStorage.loggedUser = JSON.stringify(user)
            this.usersModel.savePer(users)

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Success!',
                text: 'Your appointment was completed! No feedback was given!',
                showConfirmButton: false,
                timer: 3500
            }).then(() => {

                //REDIRECTS TO MAIN PAGE
                location.href = "../index.html"
            })
        } else {

            //GAMIFICATION HANDLER
            this.gamificationController.addBadge("firstAppointment")
            this.gamificationController.addBadge("firstFeedback")
            if (parseInt(JSON.parse(sessionStorage.currAppointment).distance) <= 20) {
                this.gamificationController.addBadge("localSupport")
            }
            this.gamificationController.addXP(100)


            //SAVES APPOINTMENT
            let aptInfo = JSON.parse(sessionStorage.currAppointment)

            let users = JSON.parse(localStorage.users)
            let doctors = JSON.parse(localStorage.doctors)

            let user = JSON.parse(sessionStorage.loggedUser)
            let doctor = doctors[aptInfo.docId]

            if (user.appointments) {
                let aptId = Object.keys(user.appointments).length

                user.appointments[aptId] = {
                    id: aptId,
                    doctor: {
                        fname: doctor.fname,
                        lname: doctor.lname,
                        speciality: doctor.speciality,
                        bio: doctor.bio
                    },
                    date: aptInfo.date,
                    feedback: feedback
                }
            } else {
                user.appointments = {
                    0: {
                        id: 0,
                        doctor: {
                            fname: doctor.fname,
                            lname: doctor.lname,
                            speciality: doctor.speciality,
                            bio: doctor.bio
                        },
                        date: aptInfo.date,
                        feedback: feedback
                    }
                }
            }

            //SAVES TO LOCAL STORAGE
            users[user.id] = user
            sessionStorage.loggedUser = JSON.stringify(user)
            this.usersModel.savePer(users)

            //ALERTS SUCCESS
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Thank you!',
                text: 'Your appointment was completed! Thank you for your feedback',
                showConfirmButton: false,
                timer: 3500
            }).then(() => {
                //REDIRECTS TO MAIN PAGE
                location.href = "../index.html"
            })
        }

        //SETS DOCTOR AVAILABLE AGAIN
        let aptInfo = JSON.parse(sessionStorage.currAppointment)
        let doctors = JSON.parse(localStorage.doctors)
        doctors[aptInfo.docId].status = 0
        localStorage.doctors = JSON.stringify(doctors)

        //REMOVES THE CURRENT APPOINTMENT INFO
        sessionStorage.removeItem("currAppointment")
    }
}