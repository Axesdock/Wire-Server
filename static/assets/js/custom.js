
// var options = {
//     valueNames: [ 'name', 'macid', 'status', 'ports', 'instadd', 'list-action' ]
//   };
  
//   var userList = new List('list-devices', options);


// Render dashboard table starts
async function getDevices() {
  let url = 'http://localhost:4004/api/devices';
  try {
      let res = await fetch(url);
      return await res.json();
  } catch (error) {
      console.log(error);
  }
}


async function renderDevices() {
  let devices = await getDevices();
  let html = '';
  let divstatus = ''
  devices.forEach(device => {
      if(device.status == 'LIVE'){
        divstatus =  `  <td>
                            <span class="badge badge-dot mr-4">
                              <i class="bg-success"></i>
                              <span class="status">${device.status} Since: ${device.lastConnected}</span>
                            </span>
                          </td>`
      }
      else {
        divstatus =  ` <td>
                            <span class="badge badge-dot mr-4">
                              <i class="bg-warning"></i>
                              <span class="status">${device.status} Since: ${device.lastConnected}</span>
                            </span>
                          </td>`
      }

      if(device.isRegistered){
        devreg =  `  <td>
                            <span class="badge badge-dot mr-4">
                              <i class="bg-success"></i>
                          </td>`
      }
      else {
        devreg =  `
                            <span class="badge badge-dot mr-4">
                              <i class="bg-warning"></i>
                          `
      }

      let htmlSegment = ` <tr>
                            <th scope="row">
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <span class="name mb-0 text-sm">${devreg} ${device.name}</span>
                                </div>
                              </div>
                            </th>
                            <td class="macid">
                            ${device.mac}
                            </td>
                            ${divstatus}
                            <td>
                              
                              <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">
                                View
                              </button>
                            </td>
                            <td>
                              <div class="d-flex align-items-center">
                                <span class="instadd mr-2">${device.installAddress}</span>
                              </div>
                            </td>
                            <td class="text-right">
                              <div class="dropdown list-action">
                                <a class="btn btn-sm btn-icon-only text-light" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  <i class="fas fa-ellipsis-v"></i>
                                </a>
                                <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                                  <a class="dropdown-item" href="addnew.html?id=${device.name}">Edit</a>
                                  <a class="dropdown-item" href="delete.html?id=${device.name}">Delete</a>
                                </div>
                              </div>
                            </td>
                          </tr>
                          
                          <!-- Modal -->
                          <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                              <div class="modal-content">
                                <div class="modal-header">
                                  <h5 class="modal-title" id="exampleModalLabel">Ports</h5>
                                </div>
                                <div class="modal-body">
                                  <strong>Port 1:</strong> ${device.ports[0]}<br><strong>Port 2:</strong> ${device.ports[1]}
                                </div>
                                <div class="modal-footer">
                                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          `;
      html += htmlSegment;

  let container = document.querySelector('.device-table');
  container.innerHTML = html;
  var options = {
    valueNames: [ 'name', 'macid', 'status', 'ports', 'instadd', 'list-action' ]
  };
    var userList = new List('list-devices', options);
  });

}
// Render dashboard table ends


//edit devices starts
async function getDevice(id) {
  let url = 'http://localhost:4004/api/devices/'+id;
  try {
      let res = await fetch(url);
      return await res.json();
  } catch (error) {
      console.log(error);
  }
}

async function editDevice(id) {
  let device = await getDevice(id);
  let html = '';
    if(!device.isRegistered) {

      html = `   <form id="newDevice-form" action="http://localhost:4004/api/devices/${device.name}">
                  <h6 class="heading-small text-muted mb-4">Device Details</h6>
                  <div class="pl-lg-4">
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="form-group">
                          <label class="form-control-label" for="name">Name</label>
                          <input type="text" id="name" name="name" class="form-control" placeholder="Name" value="${device.name}">
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-group">
                          <label class="form-control-label" for="mac">MAC Address</label>
                          <input type="text" id="mac" name="mac" class="form-control" placeholder="MAC Address" value="${device.mac}">
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12">
                        <div class="form-group">
                          <label class="form-control-label" for="installAddress">Location</label>
                          <input id="installAddress" name="installAddress" class="form-control" placeholder="Installation Location" value="${device.installAddress}" type="text">
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr class="my-4" />
                  <!-- Address -->
                  <h6 class="heading-small text-muted mb-4">Ports</h6>
                  <div class="pl-lg-4">
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="form-group">
                          <label class="form-control-label" for="port1">Port 1</label>
                          <input type="text" id="ports1" name="port1" class="form-control" placeholder="Add Comment" value="${device.ports[0]}">
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-group">
                          <label class="form-control-label" for="port2">Port 2</label>
                          <input type="text" id="ports2" name="port2" class="form-control" placeholder="Add Comment" value="${device.ports[1]}">
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr class="my-4" />
                  <!-- Description -->
                  <h6 class="heading-small text-muted mb-4">Other Information</h6>
                  <div class="pl-lg-4">
                    <div class="form-group">
                      <label class="form-control-label">Comment</label>
                      <textarea rows="4" class="form-control" placeholder="Add any Additional comment." name="comment" value="${device.comment}"></textarea>
                    </div>
                  </div>
                  <div class="text-center">
                    <button type="submit" class="btn btn-primary mt-4">Add Device</button>
                  </div>
                </form>`;
    }

  let container = document.querySelector('.form-render');
  container.innerHTML = html;
  const deviceForm = document.getElementById("newDevice-form");
  deviceForm.addEventListener("submit", handleFormSubmit);
  console.log("EventListener Active.");
}
//edit devices ends

// dashboard stats starts

async function getStats() {
  let url = 'http://localhost:4004/api/stats/';
  try {
      let res = await fetch(url);
      return await res.json();
  } catch (error) {
      console.log(error);
  }
}

async function renderStats() {
  let stats = await getStats();
  let html = '';
      html = `  <div class="row">
                  <div class="col-xl-3 col-md-6">
                    <div class="card card-stats">
                      <!-- Card body -->
                      <div class="card-body">
                        <div class="row">
                          <div class="col">
                            <h5 class="card-title text-uppercase text-muted mb-0">Total Devices</h5>
                            <span class="h2 font-weight-bold mb-0">${stats.total}</span>
                          </div>
                          <div class="col-auto">
                            <div class="icon icon-shape bg-gradient-info text-white rounded-circle shadow">
                              <i class="ni ni-chart-bar-32"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-3 col-md-6">
                    <div class="card card-stats">
                      <!-- Card body -->
                      <div class="card-body">
                        <div class="row">
                          <div class="col">
                            <h5 class="card-title text-uppercase text-muted mb-0">Active Devices</h5>
                            <span class="h2 font-weight-bold mb-0">${stats.active}</span>
                          </div>
                          <div class="col-auto">
                            <div class="icon icon-shape bg-gradient-orange text-white rounded-circle shadow">
                              <i class="ni ni-active-40"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-3 col-md-6">
                    <div class="card card-stats">
                      <!-- Card body -->
                      <div class="card-body">
                        <div class="row">
                          <div class="col">
                            <h5 class="card-title text-uppercase text-muted mb-0">Dead Devices</h5>
                            <span class="h2 font-weight-bold mb-0">${stats.dead}</span>
                          </div>
                          <div class="col-auto">
                            <div class="icon icon-shape bg-gradient-red text-white rounded-circle shadow">
                              <i class="ni ni-chart-pie-35"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-3 col-md-6">
                    <div class="card card-stats">
                      <!-- Card body -->
                      <div class="card-body">
                        <div class="row">
                          <div class="col">
                            <h5 class="card-title text-uppercase text-muted mb-0">Unregistered Devices</h5>
                            <span class="h2 font-weight-bold mb-0">${stats.notRegistered}</span>
                          </div>
                          <div class="col-auto">
                            <div class="icon icon-shape bg-gradient-green text-white rounded-circle shadow">
                              <i class="ni ni-money-coins"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>`;

  let container = document.querySelector('.stats-render');
  container.innerHTML = html;
  // const deviceForm = document.getElementById("newDevice-form");
  // deviceForm.addEventListener("submit", handleFormSubmit);
  console.log("Stats Rendered.");
}

// dashboard stats ends


//login starts
async function login() {
  let url = 'http://localhost:4004/api/auth/login';
  try {
      let res = await fetch(url);
      return await res.json();
  } catch (error) {
      console.log(error);
  }
}

async function userlogin() {

  const deviceForm = document.getElementById("newDevice-form");
  deviceForm.addEventListener("submit", handleFormSubmit);
  console.log("EventListener Active.");
}

//login ends

function renderLoginFail() {
  let container = document.querySelector('.login-fail');
  container.style.display = "block";
}

// POST requests in json format
async function postFormDataAsJson({ url, formData }) {
  const plainFormData = Object.fromEntries(formData.entries());
  const formDataJsonString = JSON.stringify(plainFormData);

  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: formDataJsonString,
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
  return response.json();
}

// PUT requests in json format
async function putFormDataAsJson({ url, formData }) {
  const plainFormData = Object.fromEntries(formData.entries());
  const formDataJsonString = JSON.stringify(plainFormData);

  const fetchOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: formDataJsonString,
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  return response.json();
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkJWTCookie() {
  let token = getCookie("token");
  if (token != "" && token != null) {
    console.log("Token: "+token)
    let flag = tokenVerify(token);
    if (flag) {
      // window.location.href = address;
    }
    else {
      window.location.href = "./login.html?f=1";
    }
  } else {
    window.location.href = "./login.html?f=1";
  }
}

function GetFailLogin() {

  var $_GET = {};
  if(document.location.toString().indexOf('?') !== -1) {
      var query = document.location
                    .toString()
                    // get the query string
                    .replace(/^.*?\?/, '')
                    // and remove any existing hash string (thanks, @vrijdenker)
                    .replace(/#.*$/, '')
                    .split('&');

      for(var i=0, l=query.length; i<l; i++) {
        var aux = decodeURIComponent(query[i]).split('=');
        $_GET[aux[0]] = aux[1];
      }
  }
  if($_GET['f']) {
    renderLoginFail();
  }
}

async function tokenVerify(token) {
  let url = 'http://localhost:4004/api/auth/verify'
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({'token': token}),
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
  var x = response.json()
  if (x == 'success'){
    return true;
  }
  else return false;
}

function logout() {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "./login.html";
}