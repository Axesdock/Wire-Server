
// var options = {
//     valueNames: [ 'name', 'macid', 'status', 'ports', 'instadd', 'list-action' ]
//   };
  
//   var userList = new List('list-devices', options);



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
                                  <a class="dropdown-item" href="#">Edit</a>
                                  <a class="dropdown-item" href="#">Delete</a>
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

