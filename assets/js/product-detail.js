document.getElementById('nav-product').classList.add('active')

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

          let carousel = $('<div/>', { id: 'additional-images-slider' })
          const datas = product['additional_images']
          for (let i = 0; i < datas.length; i++) {
            const data = datas[i]
            carousel.append(`
              <div>
                <img src="${data['image']}" class="card-img-top img-produk-additional">
              </div>
            `)
          }
          //carousel for additional images
          on_all_image_loaded({
            envs: [$(product_image), $(carousel)],
            callback: () => {
              $('#product-image').html(product_image)
              $('#additional-images-wrapper').append(carousel)

              _ = tns({
                container: '#additional-images-slider',
                slideBy: 'page',
                prevButton: '#additional-images-control-left',
                nextButton: '#additional-images-control-right',
                nav: false,
                autoplay: true,
                autoplayTimeout: 5000,
                autoplayButtonOutput: false,
                speed: 1000,
                preventActionWhenRunning: true,
                gutter: 20,
                responsive: {
                  540: {
                    items: 1,
                  },
                  720: {
                    items: 2,
                  },
                  960: {
                    items: 3,
                  },
                  1140: {
                    items: 4,
                  }
                }
              })

              $('#product-title').html(product['name'])
              $('#product-price').html(format_price(product['price']))
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

        const datas = response['data']
        let carousel = $('<div/>', { id: 'recommendation-slider' })
        for (let i = 0; i < datas.length; i++) {
          const data = datas[i]
          carousel.append(`
            <div class="recommendation-product">
              <img src="${data['image']}" class="card-img-top">
              <div class="text-center mt-3">
                <div class="produk-nama text-uppercase">${data['name']}</div>
                <p class="produk-text">${format_price(data['price'])}</p>
              </div>
            </div>
          `)
        }
        //carousel_html
        on_all_image_loaded({
          envs: [$(carousel)],
          callback: () => {
            $('#recommendation-wrapper').append(carousel)
            _ = tns({
              container: '#recommendation-slider',
              slideBy: 'page',
              prevButton: '#recommendation-control-left',
              nextButton: '#recommendation-control-right',
              nav: false,
              autoplay: true,
              autoplayTimeout: 5000,
              autoplayButtonOutput: false,
              speed: 1000,
              preventActionWhenRunning: true,
              gutter: 20,
              responsive: {
                540: {
                  items: 1,
                },
                720: {
                  items: 2,
                },
                960: {
                  items: 3,
                },
                1140: {
                  items: 4,
                }
              }
            })
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