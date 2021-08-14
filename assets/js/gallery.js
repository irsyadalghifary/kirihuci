document.getElementById('nav-gallery').classList.add('active')

let current_photo_page = 1
let current_video_page = 1

const photos_per_page = 6
const videos_per_page = 4

function get_youtube_thumbnail(url, quality = 'max') {
  if (url) {
    var video_id, thumbnail, result
    if (result = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/)) {
      video_id = result.pop()
    } else if (result = url.match(/youtu.be\/(.{11})/)) {
      video_id = result.pop()
    }

    if (video_id) {
      var quality_key = 'maxresdefault'
      if (quality == 'low') {
        quality_key = 'sddefault'
      } else if (quality == 'medium') {
        quality_key = 'mqdefault'
      } else if (quality == 'high') {
        quality_key = 'hqdefault'
      }

      return `http://img.youtube.com/vi/${video_id}/${quality_key}.jpg`
    }
  }
  return false;
}

$(function () {
  const draw_pagination = (item_total, current_page, item_per_page) => {
    let pagination_html = ''
    pagination_html += `<div class="pagination justify-content-end mt-4">`
    pagination_html += `  <ul class="pagination pagination-sm">`
    pagination_html += `    <li class="my-page-item"><a class="my-page-link" href="##" data-value="prev"> < </a></li>`
    for (let i = 1; i <= Math.ceil(item_total / item_per_page); i++) {
      let page_link_html = ''
      if (i === current_page) {
        page_link_html = `<span class="my-page-link my-page-active">${i}</span>`
      } else {
        page_link_html = `<a class="my-page-link" href="##" data-value="${i}">${i}</a>`
      }
      pagination_html += `    <li class="my-page-item">${page_link_html}</li>`
    }
    pagination_html += `    <li class="my-page-item"><a class="my-page-link" href="##" data-value="next"> > </a></li>`
    pagination_html += `  </ul>`
    pagination_html += `</div>`

    return pagination_html
  }

  const get_gallery_photo = (page) => {
    const pagination = `?limit=${photos_per_page}&page=${page}`
    const gallery_photo = `https://kirihuci-api.herokuapp.com/galleries/:photo${pagination}`
  
    $.ajax({
      url: gallery_photo,
      type: 'GET',
      success: (response) => {
        const datas = response['data']
        let photos = []
        for (let i = 0; i < response['count']; i++) {
          const data = datas[i]
          photos.push($(`<img src="${data['thumbnail']}" class="w-100 h-auto" />`))
        }

        on_all_image_loaded({
          envs: [...photos.map(p => $(p))],
          callback: () => {
            for (let i = 0; i < photos.length; i++) {
              $(`#gallery-photo-${i + 1}`).html(photos[i])
              $(`#gallery-photo-${i + 1}`).magnificPopup({
                items: {
                  src: datas[i]['source']
                },
                type: 'image'
              })
            }

            for (let i = photos.length; i < photos_per_page; i++) {
              $(`#gallery-photo-${i + 1}`).empty()
            }

            $('#pagination-photo').empty()
            $('#pagination-photo').html(draw_pagination(response['total'], current_photo_page, photos_per_page))

            $('#gallery-photo .skeleton').removeClass('skeleton')
            $('#gallery-photo .wait-skeleton').removeClass('wait-skeleton')
          }
        })
      },
      error: (err) => {
        alert('Error on getting gallery photo')
      }
    })
  }

  const get_gallery_video = (page) => {
    const pagination = `?limit=${videos_per_page}&page=${page}`
    const gallery_video = `https://kirihuci-api.herokuapp.com/galleries/:video${pagination}`
  
    $.ajax({
      url: gallery_video,
      type: 'GET',
      success: (response) => {
        const datas = response['data']
        let videos = []
        for (let i = 0; i < response['count']; i++) {
          const data = datas[i]
          videos.push($(`<img src="${data['thumbnail']}" class="w-100 h-auto" />`))
        }

        on_all_image_loaded({
          envs: [...videos.map(p => $(p))],
          callback: () => {
            for (let i = 0; i < videos.length; i++) {
              $(`#gallery-video-${i + 1}`).html(videos[i])
              $(`#gallery-video-${i + 1}`).magnificPopup({
                items: {
                  src: datas[i]['source']
                },
                type: 'iframe',
                iframe: {
                  patterns: {
                    youtube: {
                      index: 'youtu.be',
                      id: '/',
                      src: '//www.youtube.com/embed/%id%'
                    }
                  }
                }
              })
            }

            for (let i = videos.length; i < videos_per_page; i++) {
              $(`#gallery-video-${i + 1}`).empty()
            }

            $('#pagination-video').empty()
            $('#pagination-video').html(draw_pagination(response['total'], current_video_page, videos_per_page))

            $('#gallery-video .skeleton').removeClass('skeleton')
            $('#gallery-video .wait-skeleton').removeClass('wait-skeleton')
          }
        })
      },
      error: (err) => {
        alert('Error on getting gallery video')
      }
    })
  }
  
  
  get_gallery_photo(1)
  get_gallery_video(1)

  $('#pagination-photo').on('click', '.my-page-link', function() {
    let next_value = current_photo_page
    if (this.dataset.value == 'prev') {
      --next_value
    } else if (this.dataset.value == 'next') {
      ++next_value
    } else {
      next_value = parseInt(this.dataset.value)
    }

    if (next_value > 0 && next_value <= $('#pagination-photo ul.pagination').children().length - 2) {
      current_photo_page = next_value
      $('[id^="gallery-photo-"]').empty()
      $('[id^="gallery-photo-"]').addClass('skeleton')
      get_gallery_photo(current_photo_page)
    }
  })

  $('#pagination-video').on('click', '.my-page-link', function() {
    let next_value = current_video_page
    if (this.dataset.value == 'prev') {
      --next_value
    } else if (this.dataset.value == 'next') {
      ++next_value
    } else {
      next_value = parseInt(this.dataset.value)
    }

    if (next_value > 0 && next_value <= $('#pagination-video ul.pagination').children().length - 2) {
      current_video_page = next_value
      $('[id^="gallery-video-"]').empty()
      $('[id^="gallery-video-"]').addClass('skeleton')
      get_gallery_video(current_video_page)
    }
  })
})