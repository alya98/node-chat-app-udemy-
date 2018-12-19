const socket = io();

socket.on('connect', function() {
  console.log('connected to server')
});

socket.on('disconnect', function() {
  console.log('disconnected from server')
});

socket.on('newMessage', function(message) {
  console.log('new message: ', message)
  const li = jQuery('<li></li>')
  li.text(`${message.from}: ${message.text}`);

  jQuery('#chat__messages').append(li)
})

jQuery('#message-form').on('submit', function(e) {
e.preventDefault();

const messageTextBox = jQuery('[name=message]');

socket.emit('createMessage', {
  from: 'alina',
  text: jQuery(messageTextBox).val()
}, function(data) {
  jQuery(messageTextBox).val('')
})
})

socket.on('newLocationMessage', function(message) {
  console.log('new message: ', message)
  const li = jQuery('<li></li>');
  const a = jQuery('<a target="_blank">My current location</a>')
  li.text(`${message.from}: `);
  a.attr('href', message.url)
  li.append(a);
  jQuery('#chat__messages').append(li)
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