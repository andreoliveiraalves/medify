export default class doctorsModel {
    constructor() {
        this.doctors = localStorage.doctors ? JSON.parse(localStorage.doctors) : {};;
    }

    //CREATES NEW DOCTOR
    create(newDoctor) {
        let doctorsObjK = Object.keys(this.doctors)

        if (doctorsObjK.length == 0) {
            newDoctor.id = 0
        } else {
            let lastid = doctorsObjK[doctorsObjK.length - 1]
            newDoctor.id = parseInt(lastid) + 1
            newDoctor.status = 0
        }

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Doctor created!',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            location.reload()
        })

        this.doctors[newDoctor.id] = newDoctor;
        this._persist();
    }

    //DELETES DOCTOR
    remove(id) {
        delete this.doctors[id];

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Doctor deleted!',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            location.reload()
        })

        this._persist();
    }

    //GETS ALL DOCTORS
    getAll() {
        return this.doctors;
    }

    //GETS A DOCTOR
    get(id) {
        return this.doctors[id] ? this.doctors[id] : {};
    }

    //SAVES A NON-DEFAULT DOCTORS OBJECT - ex. SELF-CHANGED
    savePer(doctorsObj) {
        localStorage.doctors = JSON.stringify(doctorsObj);
    }

    //SAVES TO LOCAL STORAGE
    _persist() {
        localStorage.doctors = JSON.stringify(this.doctors);
    }
}