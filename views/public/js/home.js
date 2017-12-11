var socket = io.connect();


/*** request data for home ***/
if (window.location.pathname === '/') {
    socket.emit('get data');
}

/*** delete data ***/
function deleteRow(id) {
    socket.emit('delete data', { 'id': id }, function () {
        location.reload();
    });
}

/*** show data in home table ***/
socket.on('incoming data', function (data) {
    for (var i = 0; i < data.length; i++) {
        $('#details-table tr:last').after('<tr><td contenteditable="false">' + data[i].name + '</td><td contenteditable="false">' + data[i].department + '</td><td contenteditable="false">' + data[i].location + '</td><td><button value=' + data[i].id + ' id="btnEdit">Edit</button></td><td><button type="button" onclick= deleteRow(' + data[i].id + ')>Delete!</button></td></tr>');
    }
});


/*** add data ***/
$('#add_data').submit(function (event) {
    event.preventDefault();

    var name = $('#name').val();
    var department = $('#department').val();
    var location = $('#location').val();

    if (name.length < 1 || department.length < 1 || location.length < 1) {
        alert("Please complete the form");
        return;
    }
    socket.emit('add data', { 'name': name, 'department': department, 'location': location }, function (id) {
        $('#details-table tr:last').after('<tr><td>' + name + '</td><td>' + department + '</td><td>' + location + '</td><td><button id="btnEdit">Edit</button></td><td><button type="button" onclick= deleteRow(' + id + ')>Delete!</button></td></tr>');
        $('#name').val('');
        $('#department').val('');
        $('#location').val('');
    });
});


/*** edit data ***/
$("#details-table").on('click', '#btnEdit', function () {

    var $this = $(this);
    var tds = $this.closest('tr').find('td').filter(function () {
        return $(this).find('.editbtn').length === 0;
    });
    if ($this.html() === 'Edit') {
        $this.html('Save');
        tds.prop('contenteditable', true);
    } else {
        $this.html('Edit');
        tds.prop('contenteditable', false);

        var id = $this.val();
        var name = $this.closest('tr').find("td:eq(0)").text();
        var department = $this.closest('tr').find("td:eq(1)").text();
        var location = $this.closest('tr').find("td:eq(2)").text();
        var data = name + "\n" + department + "\n" + location;

        if (name.length < 1 || department.length < 1 || location.length < 1) {
            alert("Please complete the form");
            $this.html('Save');
            tds.prop('contenteditable', true);
            return;
        }
        socket.emit('edit data', { 'id': id, 'name': name, 'department': department, 'location': location })
    }
});