const socket = io();

function scrollToBottom() {
  const messages = jQuery('#messages');
  const newMessage = messages.children('li:last-child')

  const clientHeight = messages.prop('clientHeight');
  const scrollTop = messages.prop('scrollTop');
  const scrollHeight = messages.prop('scrollHeight');
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight>=scrollHeight){
    messages.scrollTop(scrollHeight)
  }
}

socket.on('connect', function() {
  console.log('connected to server')
  const params = jQuery.deparam(window.location.search);
  console.log(params)
  socket.emit('join', params, function(error) {
    if (error) {
      alert(error)
      window.location.href = '/'
    } else {
      console.log('no error')
    }
  })
});

socket.on('disconnect', function() {
  console.log('disconnected from server')
});

socket.on('updateUserList', function(users) {
  console.log('User list: ', users)
  const ol = jQuery('<ol></ol>');

  users.forEach(user => {
    ol.append(jQuery('<li></li>').text(user))
  });
  jQuery('#users').html(ol);
})

socket.on('newMessage', function(message) {
  const formatedTime = moment(message.createdAt).format('h:mm a')
  const template = jQuery('#message-template').html();

  const html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formatedTime
  });

  jQuery('#messages').append(html)
  scrollToBottom();
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  const messageTextBox = jQuery('[name=message]');

  socket.emit('createMessage', {
    text: jQuery(messageTextBox).val()
  }, function() {
    jQuery(messageTextBox).val('')
  })
})

socket.on('newLocationMessage', function(message) {
  const formatedTime = moment(message.createdAt).format('h:mm a')
  const template = jQuery('#location-message-template').html();

  const html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formatedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
})

const locationButton = jQuery('#send-location');

locationButton.on('click', function(e) {
  if (!navigator.geolocation) {
    return alert('geolocation does not supported by your browser')
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...')

  navigator.geolocation.getCurrentPosition(function(position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    })
  }, function(){
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location')
  })
})