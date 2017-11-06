$(function() {
  $('.apply-btn').click(function(evt) {
    if ($('.auth-btn').hasClass('logout-btn')) {
      $('form[name="prefill-acceptance"]').data('link', $(this).attr('href'))
      $('#prefill-acceptance').modal().on('hidden.bs.modal', () => {
        $('#prefill-acceptance .text-danger').addClass('hidden')
      })
      evt.preventDefault()
    }
  })


  //$('#login').modal('show')
  $('form[name="prefill-acceptance"]').submit(function(evt) {
    let link = $(this).data('link')
    let $spinner = $(this).find('.spinner')
    $spinner.removeClass('hidden')
    $.ajax({
      type: "POST",
      url: this.action,
      data: $(this).serialize(), // serializes the form's elements.
      xhrFields: {
        withCredentials: true
      },
      success: function(data) {
        link += encodeURIComponent(`&applicantDetailsKey=${data.applicantDetailsKey}`)
      },
      error: function(err) {
        $('#prefill-acceptance .text-danger.hidden').removeClass('hidden')
      },
      complete: function() {
        $spinner.addClass('hidden')
        let win = window.open(link, '_blank')
        if (win) {
          win.focus();
        } else {
          alert('Please allow popups for this website');
        }
      }
    });
    evt.preventDefault();
  });

  // $('form[name="prequalification"]').submit(function(evt) {
  //   evt.preventDefault();
  //   $form = $(this)
  //   $.ajax({
  //     type: "POST",
  //     url: this.action,
  //     data: $(this).serialize(), // serializes the form's elements.
  //     xhrFields: {
  //       withCredentials: true
  //     },
  //     success: function(data) {
  //       $form[0].submit()
  //     },
  //     error: function(err) {
  //       if (err.responseJSON) {
  //         $.each($form.serializeArray(), function(i, field) {
  //           $formInputParent = $(`[name="${field.name}"]`).parents('.form-group')
  //           if (err.responseJSON[field.name]) $formInputParent.addClass('has-error')
  //           else $formInputParent.removeClass('has-error')
  //         })
  //         $form.find('.modal-footer > .text-danger.hidden').removeClass('hidden')
  //       } else {
  //         $form[0].submit()
  //       }
  //     }
  //   });
  // });
});
