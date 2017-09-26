var selected_customer;

var start_index = 0;
var end_index = 0;

function select_picture(pic) {
    var blockers = picture_view.getElementsByClassName('pic');
    for (var i = 0; i < blockers.length; i += 1) {
        if (blockers[i].getElementsByTagName('img')[0] != pic) {
            blockers[i].style.opacity = "0.3";
        } else {
            blockers[i].style.opacity = "1";
            document.getElementById('main_pic').src = pic.src;
            document.getElementById('detail').style.display = "block";
        }
    }
}

function submit() {

}

function change_tab(tab) {
    let elements = document.getElementById('cssmenu').getElementsByTagName('ul')[0].getElementsByTagName('li');
    if (!tab.classList.contains('active')) {
        for (var i = 0; i < elements.length; i++) {
            if (elements[i] != tab) {
                elements[i].classList.remove('active');
            } else {
                elements[i].classList.add('active');
            }
        }

        if (tab.value == "0") {
            document.getElementById('picture_view').style.display = 'block';
            document.getElementById('detail').style.visibility = 'visible';

            document.getElementById('messenger_view').style.display = 'none';
        } else if (tab.value == "1") {
            document.getElementById('picture_view').style.display = 'none';
            document.getElementById('detail').style.visibility = 'hidden';

            document.getElementById('messenger_view').style.display = 'inline';

        }
    }
}

function create_message(type, message, img){
    var msg_ul = document.getElementById('message_ul'); 
    
    var new_msg = document.createElement('li');
    var new_span = document.createElement('span');
    var new_p = document.createElement('p');
    var new_a = document.createElement('a');

    if (type === 'customer') {                
        new_span.setAttribute('class', 'helper customer');
        new_span.appendChild(img);
        new_msg.setAttribute('class', 'customer');
    } else {
        new_span.setAttribute('class', 'helper');
        new_msg.setAttribute('class', 'me');
    }

    new_a.appendChild(document.createTextNode(message));
    new_a.setAttribute('class', 'box');
    new_p.appendChild(new_a);
    new_msg.appendChild(new_span);
    new_msg.appendChild(new_p);
    msg_ul.append(new_msg);

    msg_ul.scrollTop = msg_ul.scrollHeight;
}

function send_message() {
    var msg = document.getElementById('message_text').value;
    create_message('me', msg);
    document.getElementById('message_text').value = '';
}

function showDialog(customer, customerId) {
    clear_message_field();

    selected_customer.style.backgroundColor = 'white';    
    selected_customer = customer;

    customer.style.backgroundColor = 'rgb(240, 240, 240)';

    $.ajax({
        url: "/chatroom/" + customerId,
        type: "GET",
        dataType: "JSON",
        success: function(data) {
            for (var i=data.userMessage.length-1 ; i >= 0 ; i--){
                var img = customer.getElementsByTagName('img')[0].cloneNode(true);
                let record = data.userMessage[i];
                create_message(record.type, record.text, img);
            }
        },
        error: function() {
            alert('error')
        },
        complete: function() {
            var message_field = document.getElementsByClassName('message')[0];
            
                message_field.style.display = 'block';
                var nav_text = message_field.getElementsByTagName('nav')[0].getElementsByTagName('p')[0];
                nav_text.textContent = customer.getElementsByTagName('p')[0].textContent;
            
            
                var msg_ul = document.getElementById('message_ul');
                msg_ul.scrollTop = msg_ul.scrollHeight;
        }
        
    });
}

function clear_message_field(){
    var msg_ul = document.getElementById('message_ul'); 

    while(msg_ul.firstChild)
        msg_ul.removeChild(msg_ul.firstChild);
}

function closeDialog() {
    document.getElementsByClassName('message')[0].style.display = 'none';
}

var pic_data = [];

function load_pic_data(last_index){
    $.ajax({
        url: "/img/first/1",
        type: "GET",
        dataType: "JSON",
        success: function(data){
            pic_data=data.list;
        },
        error: function(){

        },
        complete: function(){
            let gallery = document.getElementById('picture_view');
            
            end_index = last_index;
            start_index = ((last_index - pic_data.length + 1) < 0) ? 0 : (last_index - pic_data.length + 1);

            for( var i=0; i<pic_data.length; i++){
                var imgstr = "data:" + pic_data[i].imgType + ";base64," + pic_data[i].imgBinary;
                var imgtag = document.createElement('img');
                imgtag.setAttribute('class','button');
                imgtag.setAttribute('type', 'button');
                imgtag.setAttribute('src', imgstr);
                imgtag.setAttribute('onclick', "select_picture(this)");

                var container = document.createElement('div');
                container.setAttribute('class', 'container');

                var pic_a = document.createElement('a');
                pic_a.setAttribute('class', 'pic');

                pic_a.appendChild(imgtag);

                if (pic_data[i].checked) {
                    var img = document.createElement('img');
                    img.setAttribute('class', 'icon');
                    img.setAttribute('src', '/assets/icon/checked.png');

                    pic_a.appendChild(img);
                }

                var name_p = document.createElement('p');
                name_p.appendChild(document.createTextNode(pic_data[i].userName));

                pic_a.appendChild(name_p);

                container.appendChild(pic_a);

                gallery.appendChild(container);
            }
            
            gallery.scrollLeft = 0;
        }
    });
}
