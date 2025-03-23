let piosk = {
  addNewUrl () {
    let newUrl = $('#new-url').val()
    if (!newUrl) return

    piosk.appendUrl(newUrl)
    $('#new-url').val('')
  },
  appendUrl (url) {
    let tmpUrl = $('#template-url').contents().clone()

    $(tmpUrl).find('a').attr('href', url).html(url)
    $('#urls .list-group').append(tmpUrl)
  },
  renderPage (data) {
    $.each(data.urls, (index, item) => {
      piosk.appendUrl(item.url)
    })
    $('#interval').val(data.interval); // Set the interval input value
  },
  showStatus (xhr) {
    let tmpErr = $('#template-err').contents().clone()
    tmpErr.html(xhr.responseText)
    $('#urls').append(tmpErr)
    setTimeout(_ => { $('.alert-danger').remove() }, 5000)
  }
}

$(document).ready(() => {
  $.getJSON('/config')
  .done(piosk.renderPage)
  .fail(piosk.showStatus)

  $('#add-url').on('click', piosk.addNewUrl)
  $('#new-url').on('keyup', (e) => { if (e.key === 'Enter') piosk.addNewUrl() })

  $('#urls').on('click', 'button.btn-close', (e) => {
    $(e.target).parent().remove()
  })

  $('#execute').on('click', (e) => {
    let config = {}
    config.urls = []
    config.interval = $('#interval').val() || 10 // Default to 10 seconds if not provided
    $('li.list-group-item').each((index, item) => {
      config.urls.push({ url: $(item).find('a').attr('href') })
    })

    $.ajax({
      url: '/config',
      type: 'POST',
      data: JSON.stringify(config),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: piosk.showStatus,
      error: piosk.showStatus
    })
  })
})
