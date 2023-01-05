import doctorsModel from '../models/doctorsModel.js'

export default class doctorsController {
    constructor() {
        this.doctorsModel = new doctorsModel();
    }
}