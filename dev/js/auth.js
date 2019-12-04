/* eslint-disable no-undef */
$(function (){
  // remove errors
  function removeErrors(){
    $('form.login p.error, form.register p.error').remove();
    $('form.login input, form.register input').removeClass('error');
  }
    // toggle
    var flag = true;
    $('.switch-button').on('click', function(e) {
        e.preventDefault(); //e - объект-событие
        
        $('input').val('');
        removeErrors()
        $('p.success').remove();
        $('input').removeClass('success');

        if (flag) {
          flag = false;
          $('.register').show('slow');
          $('.login').hide();
        } else {
          flag = true;
          $('.login').show('slow');
          $('.register').hide();
        }
    });

       // clear
    $('form.login input, form.register input').on('focus', function() {
      removeErrors();
      $('p.success').remove();
      $('form.login input, form.register input').removeClass('success');
    });
    
      // register
  $('.register-button').on('click', function(e) {
    e.preventDefault();
    
        removeErrors();
        $('p.success').remove();
        $('input').removeClass('success');

    var data = {
      login: $('#register-login').val(),                      //jQUERY обращается к каждому из полей по id и вып-т ф-цию
      password: $('#register-password').val(),
      passwordConfirm: $('#register-password-confirm').val()
    };

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/api/auth/register'
    }).done(function(data) {
      if (!data.ok) {
        $('.register h2').after('<p class="error">' + data.error + '</p>');
        if (data.fields) {
            data.fields.forEach(function(item) {
            $('input[name=' + item + ']').addClass('error');
          });
        }
      }
       else {
        //$('.register h2').after('<p class="success">Отлично!</p>');
        $(location).attr('href', '/');

      
      }
    });
    });

          // autorization //login
  $('.login-button').on('click', function(e) {
    e.preventDefault();

        removeErrors();
        $('p.success').remove();
        $('input').removeClass('success');

    var data = {
      login: $('#login-login').val(),                      //jQUERY обращается к каждому из полей по id и вып-т ф-цию
      password: $('#login-password').val(),
    };

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/api/auth/login'
    }).done(function(data) {
      if (!data.ok) {
        $('.login h2').after('<p class="error">' + data.error + '</p>');
        if (data.fields) {
            data.fields.forEach(function(item) {
            $('input[name=' + item + ']').addClass('error');
          });
        }
      } else {
        //$('.login h2').after('<p class="success">Отлично!</p>');
        $(location).attr('href', '/');
      }
    });
});
});
/* eslint-enable no-undef */



