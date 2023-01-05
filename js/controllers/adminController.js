import usersModel from '../models/usersModel.js'
import doctorsModel from '../models/doctorsModel.js'

export default class adminController {
    constructor() {
        this.usersModel = new usersModel();
        this.doctorsModel = new doctorsModel();
    }

    //FUNCTION TO GET ALL USERS
    getUsers() {
        return this.usersModel.getAll();
    }

    //FUNCTION TO GET A SPECIFIC DOCTOR
    getDoctors() {
        return this.doctorsModel.getAll();
    }

    //FUNCTION TO CREATE A DOCTOR
    createDoctor(dInfo) {

        //VALIDATES DATA INPUTS
        let valid = false
        for (let data in dInfo) {
            if (dInfo[data] == "") {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Pleasem fill all the fields!',
                    showConfirmButton: false,
                    timer: 1500
                })
                valid = false
                break
            }

            valid = true
        }

        //IF VALID - CREATES
        if (valid == true) {
            this.doctorsModel.create(dInfo)
        }
    }

    //FUNCTION TO UPDATE DOCTOR
    saveDoc(id, fname, lname, sp, bio, lat, long, pic) {

        let doctors = JSON.parse(localStorage.doctors)
        let doctor = doctors[id]

        if (doctor.appointments) {
            doctor = {
                id: id,
                fname: fname,
                lname: lname,
                bio: bio,
                specialty: sp,
                lat: lat,
                long: long,
                picture: pic,
                appointments: doctor.appointments
            }
        } else {
            doctor = {
                id: id,
                fname: fname,
                lname: lname,
                bio: bio,
                specialty: sp,
                lat: lat,
                long: long,
                picture: pic,
            }
        }

        doctor.status = 0
        doctors[id] = doctor
        this.doctorsModel.savePer(doctors)

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Doctor saved!',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            location.reload()
        })
    }

    //FUNCTION TO DELETE A DOCTOR
    deleteDoctor(id) {
        this.doctorsModel.remove(id)
    }

    //FUNCTION TO DELETE A USER
    deleteUser(id) {
        this.usersModel.remove(id)
    }
}