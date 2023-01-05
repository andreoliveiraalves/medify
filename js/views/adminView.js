  import usersController from '../controllers/usersController.js'
  import doctorsController from '../controllers/doctorsController.js'
  import appointmentsController from '../controllers/appointmentsController.js'
  import adminController from '../controllers/adminController.js'

  export default class adminView {
      constructor() {
          this.usersController = new usersController()
          this.doctorsController = new doctorsController()
          this.appointmentsController = new appointmentsController()
          this.adminController = new adminController()

          //GETS MAIN VARS
          try {
              this.users = this.adminController.getUsers();
              this.doctors = this.adminController.getDoctors();
          } catch (err) {}

          //SETS USERS/DOCTORS COUNTER
          try {
              document.getElementById("usersAm").innerHTML = Object.keys(this.users).length
              document.getElementById("docsAm").innerHTML = Object.keys(this.doctors).length
          } catch (err) {}

          //LOADS DOCTOR INTO ADMIN PANEL
          try {
              for (let doctor in this.doctors) {
                  //SETS CARD
                  let doc = `<tr>
                            <th scope="row">` + this.doctors[doctor].id + `</th>
                            <td>` + this.doctors[doctor].fname + " " + this.doctors[doctor].lname + `</td>
                            <td>` + this.doctors[doctor].specialty + `</td>
                            <td>
                                <button type="button" data-docid="` + this.doctors[doctor].id + `" class="docMoreBtt">
                                <i class="fas fa-search"></i>
                                </button>                                
                            </td>
                            <td>
                                <button type="button" data-docid="` + this.doctors[doctor].id + `" class="docDelBtt">
                                <i class="fas fa-ban"></i>
                                </button>                                
                            </td>
                        </tr>`

                  document.getElementById("doctorsList").innerHTML += doc
              }

              let docsMoreBtt = document.getElementsByClassName("docMoreBtt")
              let docsDelBtt = document.getElementsByClassName("docDelBtt")

              //SETS MODAL
              for (let btt of docsMoreBtt) {
                  btt.addEventListener("click", () => {
                      let id = btt.dataset.docid
                      let doctor = this.doctors[id]


                      document.getElementById("modal").innerHTML = `
                <div class="modal-dialog modal-dialog-centered" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">` + doctor.fname + " " + doctor.lname + `</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                      <b>ID: </b>
                      <input readonly type="text" id="dmid" value="` + doctor.id + `" placeholder="` + doctor.id + `"></input><br>
                      <b>Name: </b>
                      <input type="text" id="dmfname" value="` + doctor.fname + `" placeholder="` + doctor.fname + `"></input>
                      <input type="text" id="dmlname" value="` + doctor.lname + `" placeholder="` + doctor.lname + `"></input><br>
                      <b>Specialty: </b>
                      <input type="text" id="dmspecialty" value="` + doctor.specialty + `" placeholder="` + doctor.specialty + `"></p><br>
                      <b>Bio: </b>
                      <input type="text" id="dmbio" value="` + doctor.bio + `" placeholder="` + doctor.bio + `"></p><br>
                      <b>Location: <b/>
                      <ul>
                            <li>Lat: <input type="text" value="` + doctor.lat + `" id="dmlat" placeholder="` + doctor.lat + `"></p></li>
                            <li>Long: <input type="text" value="` + doctor.long + `" id="dmlong" placeholder="` + doctor.long + `"></p></li>
                      </ul>
                      <input type="file" data-oldpic="` + doctor.picture + `" id="dmpic" ">
                    </div>
                    <div class="modal-footer" id="footerModal">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary editar" id="editDoc">Edit</button>
                    </div>
                </div>
            </div>`

                      $("#modal").modal('show')

                      $("#editDoc").click(() => {
                          this.editDoc()
                      })
                  })
              }

              //SETS DELETE BUTTONS
              for (let btt of docsDelBtt) {
                  btt.addEventListener("click", () => {
                      let id = btt.dataset.docid

                      this.adminController.deleteDoctor(id)
                  })
              }
          } catch (err) {}

          //SETS EVENT LISTENER TO BUTTON
          try {
              //CREATES A DOCTOR
              $("#createDoc").click(() => {
                  event.preventDefault();

                  let fname = document.getElementById("dfname").value
                  let lname = document.getElementById("dlname").value
                  let specialty = document.getElementById("dspecialty").value
                  let bio = document.getElementById("dbio").value
                  let picture = document.getElementById("dphoto").value
                  let lat = document.getElementById("dlat").value
                  let long = document.getElementById("dlong").value

                  let toChange = picture;
                  let toRemove = 'C:' + '\\' + 'fakepath' + '\\';
                  let picFN = toChange.replace(toRemove, "");

                  let dInfo = {
                      fname: fname,
                      lname: lname,
                      specialty: specialty,
                      bio: bio,
                      picture: picFN,
                      lat: lat,
                      long: long
                  }

                  this.adminController.createDoctor(dInfo);
              })

              //SETS USERS CARDS
              for (let user in this.users) {
                  let usr = `<tr>
                          <th scope="row">` + this.users[user].id + `</th>
                          <td>` + this.users[user].fname + " " + this.users[user].lname + `</td>
                          <td>` + this.users[user].username + `</td>
                          <td>
                              <button type="button" data-userid="` + this.users[user].id + `" class="userMoreBtt">
                              <i class="fas fa-search"></i>
                              </button>                                
                          </td>
                          <td>
                              <button type="button" data-userid="` + this.users[user].id + `" class="userDelBtt">
                              <i class="fas fa-ban"></i>
                              </button>                                
                          </td>
                      </tr>`

                  document.getElementById("usersList").innerHTML += usr
              }

              let userDelBtts = document.getElementsByClassName("userDelBtt")
              let usersMoreBtts = document.getElementsByClassName("userMoreBtt")

              for (let btt of userDelBtts) {
                  let id = btt.dataset.userid
                  btt.addEventListener("click", () => {
                      this.adminController.deleteUser(id)

                      Swal.fire({
                          position: 'center',
                          icon: 'success',
                          title: 'User Deleted!',
                          showConfirmButton: false,
                          timer: 500
                      }).then(() => {
                          location.reload()
                      })
                  })
              }

              //SETS USER INFO MODALS
              for (let btt of usersMoreBtts) {
                  btt.addEventListener("click", () => {
                      let id = btt.dataset.userid
                      let user = this.users[id]


                      document.getElementById("modal").innerHTML = `
              <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title">` + user.username + `</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
                  <div class="modal-body">
                      <b>Name: </b>
                    <input type="text" id="umfname" value=""placeholder="` + user.fname + `"></input>
                    <input type="text" id="umlname" placeholder="` + user.lname + `"></input><br>
                    <b>Username: </b>
                    <input type="text" id="umusername" placeholder="` + user.username + `"></p><br>
                    <b>Password: </b>
                    <input type="text" id="umpassword" placeholder="` + user.password + `"></p><br>
                    <b>Email: </b>
                    <input type="text" id="umemail" placeholder="` + user.email + `"></p><br>
                    <b>Address: </b>
                    <input type="text" id="umaddress" placeholder="` + user.address + `"></p><br>
                    <b>Phone: </b>
                    <input type="text" id="umphone" placeholder="` + user.phone + `"></p><br>
                    <b>Diseases: </b>
                    <input type="text" id="umdiseases" placeholder="` + user.diseases + `"></p><br>
                    <b>Prescription Pills: </b>
                    <input type="text" id="umpills" placeholder="` + user.pills + `"></p><br>
                  </div>
                  <div class="modal-footer" id="footerModal">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                      <button type="button" class="btn btn-primary editar" id="editUser">Call</button>
                  </div>
              </div>
          </div>`

                      $("#modal").modal('show')
                  })
              }
          } catch (err) {}
      }


      //EDIT DOC MODAL HANDLER
      editDoc() {
          try {
              let id = document.getElementById("dmid").value
              let fname = document.getElementById("dmfname").value
              let lname = document.getElementById("dmlname").value
              let bio = document.getElementById("dmbio").value
              let sp = document.getElementById("dmspecialty").value
              let lat = document.getElementById("dmlat").value
              let long = document.getElementById("dmlong").value
              let pic = document.getElementById("dmpic").value

              if (pic != "") {
                  let toChange = pic;
                  let toRemove = 'C:' + '\\' + 'fakepath' + '\\';
                  let picFN = toChange.replace(toRemove, "");
                  pic = picFN
              } else {
                  pic = document.getElementById("dmpic").dataset.oldpic
              }

              this.adminController.saveDoc(id, fname, lname, sp, bio, lat, long, pic)
          } catch (err) {}
      }
  }