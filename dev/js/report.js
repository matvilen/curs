/* eslint-disable no-undef */
$(function() {

    // eslint-disable-next-line
    var editor = new MediumEditor('#report-body', {
      placeholder: {
        text: ' ',
        hideOnClick: true
      }
    });

    // remove errors
  function removeErrors(){
    $('.report-form p.error').remove();
    $('.report-form input, #report-body').removeClass('error');
  }

     // clear
  $('.report-form input, #report-body').on('focus', function() {
    removeErrors();
  });
  
    // publish
    $('.publish-button').on('click', function(e) {
      e.preventDefault();    
      removeErrors();

      var data = {
        title: $('#report-title').val(),
        body: $('#report-body').html()
      };
      
      $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/report/add'
      }).done(function(data) {
        console.log(data);
        if (!data.ok) {
          $('.report-form h2').after('<p class="error">' + data.error + '</p>');
          if (data.fields) {
            data.fields.forEach(function(item) {
              $('#report-' + item).addClass('error');
            });
          }
        } else {
          // $('.report-form h2').after('<p class="success">Отлично!</p>');
          $(location).attr('href', '/');
        }
      });
      
      
    });
  });
  
  /* eslint-enable no-undef */