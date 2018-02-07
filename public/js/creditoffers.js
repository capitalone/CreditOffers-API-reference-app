$(function() {
  if(!$('.signed-in').length) {
    $('.apply-btn').addClass('disabled').parent().attr('title', 'Apply Now Link Disabled')
  }

  $('.signed-in .apply-btn').click(function(evt) {
    let href = $(this).attr('href')
    $('form[name="prefill-acceptance"]').data('link', href)

    if (href.indexOf('/mpid/') > -1) {
      $('#prefill-acceptance button[type="submit"]').removeClass('hidden')
      $('#prefill-acceptance .modal-body .applicant-key-text').remove()
      $('#prefill-acceptance .deny-prefill').remove()
    } else {
      $('a.deny-prefill').attr('href', href)
    }

    $('#prefill-acceptance').modal().on('hidden.bs.modal', () => {
      $('#prefill-acceptance .text-danger').addClass('hidden')
    })

    evt.preventDefault()
  })

  //Prefill append applicantDetailsKey to link url
  $('form[name="prefill-acceptance"]').submit(function(evt) {
    let applicantDetailsKey
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
        applicantDetailsKey = data.applicantDetailsKey
        link += encodeURIComponent(`?applicantDetailsKey=a-${applicantDetailsKey}`)
      },
      error: function(err) {
        $('#prefill-acceptance .text-danger.hidden').removeClass('hidden')
      },
      complete: function() {
        if (link.indexOf('/mpid/') > -1) {
          $('#prefill-acceptance button[type="submit"]').addClass('hidden')
          $('#prefill-acceptance .modal-body').append(
            `
            <div class="applicant-key-text"><h5 class="text-center">You have been generated an Applicant Details Key:<br> ${applicantDetailsKey}</h5>
            <p class="text-center">In production, this would be appended to the end of the Apply Now link.</p></div>
            `
          )
        } else {
          let win = window.open(link, '_blank')
          if (win) {
            win.focus();
          } else {
            alert('Please allow popups for this website');
          }
        }
        $spinner.addClass('hidden')
      }
    });
    evt.preventDefault();
  });
});
