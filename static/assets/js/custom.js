
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
    if(!device.isRegistered) {
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

      let htmlSegment = ` <tr>
                            <th scope="row">
                              <div class="media align-items-center">
                                <div class="media-body">
                                  <span class="name mb-0 text-sm">${device.name}</span>
                                </div>
                              </div>
                            </th>
                            <td class="macid">
                            ${device.mac}
                            </td>
                            ${divstatus}
                            <td>
                              <a href="#" class="btn btn-sm btn-neutral ports">View</a>
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
                          </tr>`;
      html += htmlSegment;
    }

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
                          <input type="text" id="port1" name="port1" class="form-control" placeholder="Add Comment" value="${device.port1}">
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-group">
                          <label class="form-control-label" for="port2">Port 2</label>
                          <input type="text" id="port2" name="port2" class="form-control" placeholder="Add Comment" value="${device.port2}">
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


// dashboard stats ends
