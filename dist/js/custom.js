$(function () {
  'use strict';

  // var attribution = new ol.control.Attribution({
  //   collapsible: false
  // });

  // var map = new ol.Map({
  //   controls: ol.control.defaults({ attribution: false }).extend([attribution]),
  //   layers: [
  //     new ol.layer.Tile({
  //       source: new ol.source.OSM()
  //     })
  //   ],
  //   target: 'map',
  //   view: new ol.View({
  //     center: ol.proj.fromLonLat([3.406448, 6.465422]),
  //     maxZoom: 18,
  //     zoom: 12
  //   })
  // });

  // var container = document.getElementById('popup');
  // var content = document.getElementById('popup-content');
  // var closer = document.getElementById('popup-closer');

  // var overlay = new ol.Overlay({
  //   element: container
  //   // autoPan: true,
  //   // autoPanAnimation: {
  //   //   duration: 250
  //   // }
  // });
  // map.addOverlay(overlay);

  // closer.onclick = function () {
  //   overlay.setPosition(undefined);
  //   closer.blur();
  //   return false;
  // };

  $('.preloader').fadeOut();
  // this is for close icon when navigation open in mobile view
  $('.nav-toggler').on('click', function () {
    $('#main-wrapper').toggleClass('show-sidebar');
  });
  $('.search-box a, .search-box .app-search .srh-btn').on('click', function () {
    $('.app-search').toggle(200);
    $('.app-search input').focus();
  });

  // ==============================================================
  // Resize all elements
  // ==============================================================
  $('body, .page-wrapper').trigger('resize');
  $('.page-wrapper').delay(20).show();

  //****************************
  /* This is for the mini-sidebar if width is less then 1170*/
  //****************************
  var setsidebartype = function () {
    var width = window.innerWidth > 0 ? window.innerWidth : this.screen.width;
    if (width < 1170) {
      $('#main-wrapper').attr('data-sidebartype', 'mini-sidebar');
    } else {
      $('#main-wrapper').attr('data-sidebartype', 'full');
    }
  };
  $(window).ready(setsidebartype);
  $(window).on('resize', setsidebartype);

  // search button click handler
  $('.search-btn').on('click', function () {
    if ($('#lga-select').val() === '') {
      alert('Please select a Local Govt Area (LGA)');
    } else {
      $('.search-form-container').toggleClass('d-none');
      $('.search-results-container').toggleClass('d-none');
      $('#map').toggleClass('d-none');
    }
  });

  // vaccine appointment sidebar link click handler
  $('#vaccine-apointment-link').on('click', function () {
    if (window.location.pathname.includes('search-vaccine-center')) {
      alert(
        'Please select a vaccine center before you can schedule an appointment'
      );
    }
  });

  $('#vaccine-center-name').text(
    new URLSearchParams(window.location.search).get('vaccine-center')
  );

  // populate the lga select element and markers on the map
  $.getJSON('../../data/la_vac_centers.json', function (data) {
    var items = ['<option value="">Select LGA</option>'];
    $.each(data, function (key, val) {
      // var geo = Object.values(val)[0]['latlng'].split(',');
      // var layer = new ol.layer.Vector({
      //   source: new ol.source.Vector({
      //     features: [
      //       new ol.Feature({
      //         name: Object.keys(val)[0].replace(' Local Government Area', ''),
      //         value: Object.keys(val)[0],
      //         geometry: new ol.geom.Point(
      //           ol.proj.fromLonLat([Number(geo[1]), Number(geo[0])])
      //         )
      //       })
      //     ]
      //   })
      // });
      // map.addLayer(layer);
      items.push(
        '<option value="' +
          Object.keys(val)[0] +
          '">' +
          Object.keys(val)[0] +
          '</option>'
      );
    });
    $('#lga-select').html(items.join(''));
  });

  // populate the vaccine center table
  window['getVaccineCenter'] = function (lga, updateView = false) {
    $('#lga-name').text(lga);
    $.getJSON('../../data/la_vac_centers.json', function (data) {
      var items = [];
      $.each(data, function (key, val) {
        if (Object.keys(val)[0] === lga) {
          const lgaObj = Object.values(val)[0];
          $.each(Object.values(lgaObj.data), function (key, item) {
            var index = key + 1;
            items.push(
              '<tr><th scope="row">' +
                index +
                '</th><td>' +
                item.healthCenterId +
                '</td><td>' +
                item.healthCenter +
                '</td><td>Open</td><td><btn class="btn btn-outline-secondary" onclick=' +
                '"(function() {document.getElementById(' +
                "'modal').classList.add(" +
                "'d-flex'); document.getElementById(" +
                "'modal').classList.remove(" +
                "'d-none'); window.vaccineCenter = '" +
                item.healthCenter +
                "'; })()" +
                '"' +
                '>Schedule</btn></td></tr>'
            );
          });
        }
      });
      $('#table-body').html(items.join(''));
    });
    if (updateView) {
      $('.search-form-container').toggleClass('d-none');
      $('.search-results-container').toggleClass('d-none');
      $('#map').toggleClass('d-none');
    }
  };

  // populate the vaccine center table when a lga is selected
  $('#lga-select').on('change', function () {
    window.getVaccineCenter(this.value);
  });

  $('#proceed-btn').on('click', function () {
    if (
      window.selectedDate &&
      window.selectedTime &&
      errors.date === '' &&
      errors.time === ''
    ) {
      window.location.href =
        'vaccine-appointment.html?vaccine-center=' +
        window.vaccineCenter +
        '&date=' +
        window.selectedDate +
        '&time=' +
        window.selectedTime;
    } else {
      alert('Please select a valid date and time');
    }
  });

  // map.on('singleclick', function (event) {
  //   var feature = this.forEachFeatureAtPixel(
  //     event.pixel,
  //     function (feature, layer) {
  //       return feature;
  //     }
  //   );

  //   if (map.hasFeatureAtPixel(event.pixel) === true) {
  //     var coordinate = event.coordinate;

  //     content.innerHTML =
  //       '<h6 class="text-center font-bold mb-2">' +
  //       feature.get('name') +
  //       '</h6><button onclick="window.getVaccineCenter(' +
  //       "'" +
  //       feature.get('value') +
  //       "'" +
  //       ', true)" class="btn btn-sm btn-outline-secondary">Search</button>';
  //     overlay.setPosition(coordinate);
  //   } else {
  //     overlay.setPosition(undefined);
  //     closer.blur();
  //   }
  // });

  // check if string contains number
  function hasNumber(str) {
    return /\d/.test(str);
  }

  // check if selected date is less than or equal to  today's date
  function isValidDate(date) {
    var today = new Date();
    var selectedDate = new Date(date);
    return selectedDate > today;
  }

  // check if selected date is moe than or equal to 18 years from today
  function isValidAge(date) {
    var today = new Date();
    var selectedDate = new Date(date);
    var age = today.getFullYear() - selectedDate.getFullYear();
    var m = today.getMonth() - selectedDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < selectedDate.getDate())) {
      age--;
    }
    return age >= 18;
  }

  // convert hh:mm to valid date object
  function convertTimeToDate(time) {
    var date = new Date();
    var timeArr = time.split(':');
    date.setHours(timeArr[0]);
    date.setMinutes(timeArr[1]);
    return date;
  }

  // check if selected time is between 8am and 5pm
  function isValidTime(time) {
    var selectedTime = new Date(convertTimeToDate(time));
    var selectedTimeHours =
      selectedTime.getHours() < 10
        ? '0' + selectedTime.getHours()
        : selectedTime.getHours();
    var selectedTimeMinutes =
      selectedTime.getMinutes() < 10
        ? '0' + selectedTime.getMinutes()
        : selectedTime.getMinutes();
    var selectedTimeString = selectedTimeHours + ':' + selectedTimeMinutes;
    return selectedTimeString >= '08:00' && selectedTimeString <= '17:00';
  }

  var errors = {
    firstName: '',
    lastName: '',
    nin: '',
    dob: '',
    phone: '',
    date: '',
    time: ''
  };

  $('#firstName').on('change', function () {
    if (hasNumber(this.value)) {
      errors.firstName = 'First name cannot contain numbers';
      $('#first-name-error').text(errors.firstName).css('color', 'red');
    } else {
      errors.firstName = '';
      $('#first-name-error').text(errors.firstName);
    }
  });

  $('#lastName').on('change', function () {
    errors.lastName = 'Last name cannot contain numbers';
    if (hasNumber(this.value)) {
      $('#last-name-error').text(errors.lastName).css('color', 'red');
    } else {
      errors.lastName = '';
      $('#last-name-error').text(errors.lastName);
    }
  });

  $('#nin').on('change', function () {
    errors.nin = 'NIN must be 11 digits';
    if (this.value.length !== 11 || isNaN(this.value)) {
      $('#nin-error').text(errors.nin).css('color', 'red');
    } else {
      errors.nin = '';
      $('#nin-error').text(errors.nin);
    }
  });

  $('#dob').on('change', function () {
    errors.dob = 'Date of birth must be 18 years and above';
    if (!isValidAge(this.value)) {
      $('#dob-error').text(errors.dob).css('color', 'red');
    } else {
      errors.dob = '';
      $('#dob-error').text(errors.dob);
    }
  });

  $('#phone').on('change', function () {
    errors.phone = 'Contact number must be 11 digits';
    if (this.value.length !== 11 || isNaN(this.value)) {
      $('#phone-error').text(errors.phone).css('color', 'red');
    } else {
      errors.phone = '';
      $('#phone-error').text('');
    }
  });

  $('#date').on('change', function () {
    errors.date = 'Date must be tomorrow or later';
    if (!isValidDate(this.value)) {
      $('#date-error').text(errors.date).css('color', 'red');
    } else {
      errors.date = '';
      window.selectedDate = this.value;
      $('#date-error').text(errors.date);
    }
  });

  $('#time').on('change', function () {
    errors.time = 'Time must be between 8am and 5pm';
    if (!isValidTime(this.value)) {
      $('#time-error').text(errors.time).css('color', 'red');
    } else {
      errors.time = '';
      window.selectedTime = this.value;
      $('#time-error').text(errors.time);
    }
  });

  $('.close-modal').on('click', function () {
    $('.modal').addClass('d-none').removeClass('d-flex');
  });

  $('#schedule-btn').on('click', function () {
    var firstName = $('#firstName').val();
    var lastName = $('#lastName').val();
    var gender = $('#gender').val();
    var nin = $('#nin').val();
    var dob = $('#dob').val();
    var phone = $('#phone').val();
    var address = $('#address').val();

    if (!Object.values(errors).every(error => error === '')) return;

    if (firstName && lastName && gender && nin && dob && phone && address) {
      Swal.fire({
        title: 'Schedule Successful',
        text: 'You have successfully scheduled an appointment',
        icon: 'success',
        confirmButtonText: 'Back to Home Page'
      }).then(result => {
        if (result.isConfirmed) {
          window.location.replace('search-vaccine-center.html');
        }
      });
    }
  });
});

// send email using send grid
function sendEmail() {
  var email = $('#email').val();
  var name = $('#name').val();
  var message = $('#message').val();
  var subject = $('#subject').val();
  var data = {
    email: email,
    name: name,
    message: message,
    subject: subject
  };
  $.ajax({
    type: 'POST',
    url: 'https://api.sendgrid.com/v3/mail/send',
    headers: {
      Authorization:
        'Bearer ' +
        'SG.O-xHd-w6T0i6UgJ6Uzk-9A.v-_s1YnQ2Q-6x8d6w-J6zpU6bHg-7pXdvk-V-g'
    },
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function (data) {
      console.log(data);
    },
    error: function (error) {
      console.log(error);
    }
  });
}

// send sms using twilio endpoint
function sendSMS() {
  var phone = $('#phone').val();
  var message = $('#message').val();
  var data = {
    phone: phone,
    message: message
  };
  $.ajax({
    type: 'POST',
    url: 'https://api.twilio.com/2010-04-01/Accounts/ACb5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5/Messages.json',
    headers: {
      Authorization: 'Basic ' + 'QWxhZGRpbjpPcGVuU2VzYW1l'
    },
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function (data) {
      console.log(data);
    },
    error: function (error) {
      console.log(error);
    }
  });
}
