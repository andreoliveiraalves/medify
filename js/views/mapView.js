import doctorsModel from '../models/doctorsModel.js'
import appointmentsController from '../controllers/appointmentsController.js'

export default class mapView {
    constructor() {
        this.doctorsModel = new doctorsModel()
        this.appointmentsController = new appointmentsController()

        try {
            var page = location.href.split("/").slice(-1)
            if (page == "" || "#")
                this.loadMap()


            document.getElementById("filterDocs").addEventListener("click", () => {
                this.filter(document.getElementById("fdName").value, document.getElementById("fdDist").value, document.getElementById("fdSp").value)
            })
        } catch (err) {}
    }


    _initMap(userLocation) {
        try {
            let myStyle = [{
                    "featureType": "administrative",
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "color": "#d70000"
                    }]
                },
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "color": "#444444"
                    }]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [{
                        "color": "#f2f2f2"
                    }]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [{
                        "visibility": "off"
                    }]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "all",
                    "stylers": [{
                        "visibility": "simplified"
                    }]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "labels",
                    "stylers": [{
                        "visibility": "off"
                    }]
                },
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [{
                            "saturation": -100
                        },
                        {
                            "lightness": 45
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [{
                        "visibility": "simplified"
                    }]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.icon",
                    "stylers": [{
                        "visibility": "off"
                    }]
                },
                {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [{
                        "visibility": "off"
                    }]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [{
                            "color": "#a4dff7"
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                }
            ]

            //CREATES THE MAP
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                center: { lat: parseFloat(userLocation.coords.latitude), lng: parseFloat(userLocation.coords.longitude) },
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: true,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false,
                styles: myStyle
            })

            //SETS THE USER IN THE MAP --------------------
            var icon = {
                url: "../content/img/user.svg", // url
                scaledSize: new google.maps.Size(30, 30), // scaled size
                origin: new google.maps.Point(0, 0), // origin
                anchor: new google.maps.Point(16, 32) // anchor
            };

            let marker = new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.BOUNCE,
                position: { lat: parseFloat(userLocation.coords.latitude), lng: parseFloat(userLocation.coords.longitude) },
                title: "Your Location",
                icon: icon
            });

            marker.addListener('click', function() {
                map.setZoom(16);
                map.setCenter(marker.getPosition());
            });
            //----------------------------------------------

            //SHOWS DOCTORS IN THE MAP
            let markers = []
            let doctors = this.doctorsModel.getAll();

            for (let doctor of Object.keys(doctors)) {
                let currDoctor = doctors[doctor]

                if (currDoctor.status == 0) {


                    let infowindow = new google.maps.InfoWindow();

                    var icon = {
                        url: "../content/img/marker.png",
                        scaledSize: new google.maps.Size(35, 35),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(16, 32)
                    };

                    getTravelTime(currDoctor.lat, currDoctor.long)



                    //FUNCTION TO CALCULATE TRAVEL TIME
                    function getTravelTime(doctorLat, doctorLong) {
                        let doctorOri = [doctorLat] + "," + [doctorLong];
                        let userDest = [userLocation.coords.latitude] + "," + [userLocation.coords.longitude];

                        const service = new google.maps.DistanceMatrixService();
                        const matrixOptions = {
                            origins: [doctorOri],
                            destinations: [userDest],
                            travelMode: 'DRIVING',
                            unitSystem: google.maps.UnitSystem.METRIC
                        };

                        service.getDistanceMatrix(matrixOptions, function(response, status) {
                            if (status == 'OK') {
                                let dist = response.rows[0].elements[0].distance.text
                                let dur = response.rows[0].elements[0].duration.text
                                let final = [dist] + " - " + [dur];

                                marker = new google.maps.Marker({
                                    map: map,
                                    animation: google.maps.Animation.DROP,
                                    position: { lat: parseFloat(currDoctor.lat), lng: parseFloat(currDoctor.long) },
                                    docid: currDoctor.id,
                                    title: 'Dr. ' + currDoctor.fname + " " + currDoctor.lname,
                                    specialty: currDoctor.specialty,
                                    distance: [dist],
                                    travelTime: final,
                                    bio: currDoctor.bio,
                                    doctorName: "doctor" + currDoctor.fname + currDoctor.lname,
                                    picture: currDoctor.picture,
                                    icon: icon
                                });

                                let content = "<div style='text-align: center'><h3>" + marker.title + "</h3><img style='height: 200px;' src='content/img/doctors/" + marker.picture + "'><h4 style='margin-top: 5px'>" + marker.specialty + "</h4><h6>" + marker.travelTime + "</h6><button id='vmBtt' onclick='" + '$("#modal").modal("show")' + "' data-docid='" + marker.docid + "'> View More </button></div>"

                                google.maps.event.addListener(marker, 'click', (function(marker, content, infowindow) {
                                    return function() {
                                        map.setZoom(14)
                                        map.setCenter(marker.getPosition())
                                        infowindow.setContent(content)
                                        infowindow.open(map, marker)

                                        //SETS MODAL INFO
                                        document.getElementById("modal").innerHTML = `
                                            <div class="modal-dialog modal-dialog-centered" role="document">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title">` + marker.title + `</h5>
                                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div class="modal-body">
                                                        <p><b>Name: </b>` + marker.title + `</p>
                                                        <p><b>Specialty: </b>` + marker.specialty + `</p>
                                                        <p><b>Distance: </b>` + marker.travelTime + `</p>
                                                        <p><b>Biography: </b>` + marker.bio + `</p>
                                                    </div>
                                                    <div class="modal-footer" id="footerModal">
                                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                        <button type="button" class="callDoc btn btn-primary" data-docid="` + marker.docid + `">Call</button>
                                                    </div>
                                                </div>
                                            </div>`

                                        let callDocBtts = document.getElementsByClassName("callDoc")

                                        for (let btt of callDocBtts) {
                                            let id = btt.dataset.docid

                                            btt.addEventListener("click", () => {
                                                this.appointmentsController = new appointmentsController()
                                                this.appointmentsController.startAppointment(id, marker.distance)
                                            })
                                        }

                                    };
                                })(marker, content, infowindow));
                            } else if (status !== "OK") {
                                Swal.fire({
                                    position: 'center',
                                    icon: 'error',
                                    title: 'An internal error ocurred!',
                                    text: 'We are trying to fix it for you! Wait a moment...',
                                    showConfirmButton: false,
                                    timer: 500
                                }).then(() => {
                                    location.reload()
                                })
                            }

                            //ADD MARKER TO STORAGE
                            markers.push(marker)

                            document.getElementById("filterDocs").setAttribute("data-userlat", userLocation.coords.latitude)
                            document.getElementById("filterDocs").setAttribute("data-userlong", userLocation.coords.longitude)
                            document.getElementById("filterDocs").addEventListener("click", () => {


                                markers.forEach(currMarker => {
                                    currMarker.setMap(null)
                                });
                            })
                        })
                    };
                }
            }
        } catch (err) {}
    }

    loadMap() {

        try {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    let userLocation = position;
                    this._initMap(userLocation);
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: "Your browser does not support geolocation!",
                })
            }
        } catch (err) {}
    }

    filter(name, fDist, sp) {

        try {

            let markers = []
            let doctors = this.doctorsModel.getAll()

            let userLocationLat = document.getElementById("filterDocs").dataset.userlat
            let userLocationLong = document.getElementById("filterDocs").dataset.userlong

            let myStyle = [{
                    "featureType": "administrative",
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "color": "#d70000"
                    }]
                },
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "color": "#444444"
                    }]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [{
                        "color": "#f2f2f2"
                    }]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [{
                        "visibility": "off"
                    }]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "all",
                    "stylers": [{
                        "visibility": "simplified"
                    }]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "labels",
                    "stylers": [{
                        "visibility": "off"
                    }]
                },
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [{
                            "saturation": -100
                        },
                        {
                            "lightness": 45
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [{
                        "visibility": "simplified"
                    }]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.icon",
                    "stylers": [{
                        "visibility": "off"
                    }]
                },
                {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [{
                        "visibility": "off"
                    }]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [{
                            "color": "#a4dff7"
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                }
            ]


            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                center: { lat: parseFloat(userLocationLat), lng: parseFloat(userLocationLong) },
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: true,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false,
                styles: myStyle
            })

            //SETS THE USER IN THE MAP --------------------
            var icon = {
                url: "../content/img/user.svg", // url
                scaledSize: new google.maps.Size(30, 30), // scaled size
                origin: new google.maps.Point(0, 0), // origin
                anchor: new google.maps.Point(16, 32) // anchor
            };

            let marker = new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.BOUNCE,
                position: { lat: parseFloat(userLocationLat), lng: parseFloat(userLocationLong) },
                title: "Your Location",
                icon: icon
            });

            marker.addListener('click', function() {
                map.setZoom(16);
                map.setCenter(marker.getPosition());
            });
            //----------------------------------------------


            for (let doctor of Object.keys(doctors)) {

                let dFullName = doctors[doctor].fname + " " + doctors[doctor].lname
                if (dFullName.includes(name)) {

                    let currDoctor = doctors[doctor]

                    if (currDoctor.status == 0) {
                        if ((currDoctor.specialty == sp) || (sp == "")) {

                            let infowindow = new google.maps.InfoWindow();

                            var icon = {
                                url: "../content/img/marker.png",
                                scaledSize: new google.maps.Size(35, 35),
                                origin: new google.maps.Point(0, 0),
                                anchor: new google.maps.Point(16, 32)
                            };

                            getTravelTime(currDoctor.lat, currDoctor.long)



                            //FUNCTION TO CALCULATE TRAVEL TIME
                            function getTravelTime(doctorLat, doctorLong) {
                                let markers = []
                                let doctorOri = [doctorLat] + "," + [doctorLong];
                                let userDest = [userLocationLat] + "," + [userLocationLong];

                                const service = new google.maps.DistanceMatrixService();
                                const matrixOptions = {
                                    origins: [doctorOri],
                                    destinations: [userDest],
                                    travelMode: 'DRIVING',
                                    unitSystem: google.maps.UnitSystem.METRIC
                                };

                                let marker

                                service.getDistanceMatrix(matrixOptions, function(response, status) {
                                    if (status == 'OK') {
                                        let dist = response.rows[0].elements[0].distance.text
                                        let dur = response.rows[0].elements[0].duration.text
                                        let final = [dist] + " - " + [dur];

                                        let cDist = dist.replace("km", "")

                                        if ((parseFloat(cDist) <= parseFloat(fDist)) || (fDist == "")) {
                                            marker = new google.maps.Marker({
                                                map: map,
                                                animation: google.maps.Animation.DROP,
                                                position: { lat: parseFloat(currDoctor.lat), lng: parseFloat(currDoctor.long) },
                                                docid: currDoctor.id,
                                                title: 'Dr. ' + currDoctor.fname + " " + currDoctor.lname,
                                                specialty: currDoctor.specialty,
                                                distance: [dist],
                                                travelTime: final,
                                                bio: currDoctor.bio,
                                                doctorName: "doctor" + currDoctor.fname + currDoctor.lname,
                                                picture: currDoctor.picture,
                                                icon: icon
                                            });

                                            let content = "<div style='text-align: center'><h3>" + marker.title + "</h3><img style='height: 200px;' src='content/img/doctors/" + marker.picture + "'><h4 style='margin-top: 5px'>" + marker.specialty + "</h4><h6>" + marker.travelTime + "</h6><button id='vmBtt' onclick='" + '$("#modal").modal("show")' + "' data-docid='" + marker.docid + "'> View More </button></div>"

                                            google.maps.event.addListener(marker, 'click', (function(marker, content, infowindow) {
                                                return function() {
                                                    map.setZoom(14)
                                                    map.setCenter(marker.getPosition())
                                                    infowindow.setContent(content)
                                                    infowindow.open(map, marker)

                                                    //SETS MODAL INFO
                                                    document.getElementById("modal").innerHTML = `
                                            <div class="modal-dialog modal-dialog-centered" role="document">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title">` + marker.title + `</h5>
                                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div class="modal-body">
                                                        <p><b>Name: </b>` + marker.title + `</p>
                                                        <p><b>Specialty: </b>` + marker.specialty + `</p>
                                                        <p><b>Distance: </b>` + marker.travelTime + `</p>
                                                        <p><b>Biography: </b>` + marker.bio + `</p>
                                                    </div>
                                                    <div class="modal-footer" id="footerModal">
                                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                        <button type="button" class="callDoc btn btn-primary" data-docid="` + marker.docid + `">Call</button>
                                                    </div>
                                                </div>
                                            </div>`

                                                    let callDocBtts = document.getElementsByClassName("callDoc")

                                                    for (let btt of callDocBtts) {
                                                        let id = btt.dataset.docid

                                                        btt.addEventListener("click", () => {
                                                            this.appointmentsController = new appointmentsController()
                                                            this.appointmentsController.startAppointment(id, marker.distance)
                                                        })
                                                    }

                                                };
                                            })(marker, content, infowindow));
                                        } else if (status !== "OK") {
                                            Swal.fire({
                                                position: 'center',
                                                icon: 'error',
                                                title: 'An internal error ocurred!',
                                                text: 'We are trying to fix it for you! Wait a moment...',
                                                showConfirmButton: false,
                                                timer: 500
                                            }).then(() => {
                                                location.reload()
                                            })
                                        }

                                        //ADD MARKER TO STORAGE
                                        markers.push(marker)

                                        document.getElementById("filterDocs").addEventListener("click", () => {

                                            markers.forEach(currMarker => {
                                                currMarker.setMap(null)
                                            })
                                        })
                                    }
                                })
                            }
                        }
                    }
                }
            }
        } catch (err) {}
    }
}