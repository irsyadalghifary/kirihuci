$(function () {
  const params = new URLSearchParams(window.location.search);

  const get_product_detail = (product_id) => {
    const product_detail_endpoint = `https://kirihuci-api.herokuapp.com/products/${product_id}/:detail`
  
    $.ajax({
      url: product_detail_endpoint,
      type: 'GET',
      success: (response) => {
        if (response.length > 0) {
          const product = response[0]
          const product_image = $(`<img class="img-produk-main" src="${product['image']}"/>`)

          const carousel_length = 4
          let carousels = ''
          const datas = product['additional_images']
          for (let i = 0; i <= datas.length; i += carousel_length) {
            carousels += `<div class='carousel-item ${i == 0 ? 'active': ''}'>`
            carousels += '\n'
            carousels += `<div class="row">`
            for (let j = i; j < Math.min(i + carousel_length, datas.length); j++) {
              const data = datas[j]
              carousels += '\n'
              carousels += `
                <div class="col-${parseInt(12 / carousel_length)}">
                  <img src="${data['image']}" class="img-produk-additional"/>
                </div>
              `
            }
            carousels += '</div> '
            carousels += '\n'
            carousels += '</div> '
          }
          //carousel for additional images
          on_all_image_loaded({
            envs: [$(product_image), $(carousels)],
            callback: () => {
              $('#product-image').html(product_image)
              $('#product-carousel-additional-image').append(carousels)

              $('#product-title').html(product['name'])
              $('#product-price').html(`Rp. ${product['price'].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")},00`)
              $('#product-description').html(product['description'])
              $('#product-notes').html(product['notes'])
              $('#product-shipping-notes').html(product['shipping_notes'])
              $('#product-dimension').html(product['dimension'])
              $('#product .skeleton').removeClass('skeleton')
              $('#product .wait-skeleton').removeClass('wait-skeleton')
            }
          })
        } else {
          alert('Product not found!')
        }
      },
      error: (err) => {
        alert('Error on getting product detail')
      }
    })
  }
  
  const get_recommendations = (product_id) => {
    const recommendations_endpoint = `https://kirihuci-api.herokuapp.com/products/?sort=DESC&limit=-1`
    $.ajax({
      url: recommendations_endpoint,
      type: 'GET',
      success: (response) => {
        const carousel_length = 4

        const datas = response['data']
        let carousels = ''
        for (let i = 0; i <= response['count']; i += carousel_length) {
          carousels += `<div class='carousel-item ${i == 0 ? 'active': ''}'>`
          carousels += '\n'
          carousels += `<div class="row">`
          for (let j = i; j < Math.min(i + carousel_length, response['count']); j++) {
            const data = datas[j]
            carousels += '\n'
            carousels += `
              <div class="col-${parseInt(12 / carousel_length)}">
                <div class="h-100">
                  <img src="${data['image']}" class="card-img-top"/>
                  <div class="text-center mt-3">
                    <div class="produk-nama text-uppercase">${data['name']}</div>
                    <p class="produk-text">Rp. ${data['price']}</p>
                  </div>
                </div>
              </div>
            `
          }
          carousels += '</div> '
          carousels += '\n'
          carousels += '</div> '
        }
        //carousel_html
        on_all_image_loaded({
          envs: [$(carousels)],
          callback: () => {
            $('#product-carousel-recommendation').append(carousels)
            $('#recommendation .skeleton').removeClass('skeleton')
            $('#recommendation .wait-skeleton').removeClass('wait-skeleton')
          }
        })
      },
      error: (err) => {
        alert('Error on getting product detail')
      }
    })
  }

  const product_id = params.get('id')
    
  if (!product_id) {
    alert('ProductID Not Found!')
    return
  }

  get_product_detail(product_id)
  get_recommendations(product_id)
})