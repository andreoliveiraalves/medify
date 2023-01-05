export default class appointmentsModel {
    constructor() {
        this.appointments = localStorage.appointments ? JSON.parse(localStorage.appointments) : {}
    }


    create(newAppointment) {
        newAppointment.id = Object.keys(this.appointments).length;

        this.appointments.push(newAppointment);
        this._persist();
    }

    remove(id) {
        delete this.appointments[id];

        this._persist();
    }

    update(newInfo) {
        this.appointments[newInfo.id] = newInfo

        this._persist();
    }

    getAll() {
        return this.appointments;
    }

    get(id) {
        let appointment = this.appointments[id] ? this.appointments[id] : {};

        return appointment;
    }

    _persist() {
        localStorage.appointments = JSON.stringify(this.appointments);
    }
}