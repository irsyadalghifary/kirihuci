document.getElementById('nav-product').classList.add('active')

const new_product_limit = 4

$(function () {
  const get_product_kirihuci = () => {
    const pagination = `?limit=-1`
    const product_kirihuci_endpoint = `https://kirihuci-api.herokuapp.com/products/kirihuci/${pagination}`
  
    $.ajax({
      url: product_kirihuci_endpoint,
      type: 'GET',
      beforeSend: () => {
        // draw the skeleton for incoming product
        for (let i = 0; i < 6; i++) {
          $('#product-kirihuci>.row').append(`
            <div class="col-lg-4 col-md-6 col-sm-12">
              <div id="product-kirihuci-${i + 1}" class="skeleton"></div>
            </div>
          `)
        }
      },
      success: (response) => {
        const datas = response['data']

        // draw the skeleton for incoming new product
        for (let i = 0; i < new_product_limit; i++) {
          $('#product-kirihuci-new>.row').append(`
            <div class="col-lg-3 col-md-4 col-sm-6 col-12">
              <div id="product-kirihuci-new-${i + 1}" class="skeleton"></div>
            </div>
          `)
        }

        let products = []
        for (let i = 0; i < response['count'] - new_product_limit; i++) {
          const data = datas[i]
          const product_detail_url = `./product-detail.html?id=${data['id']}`
          products.push(`
          <img src="${data['image']}" class="card-img-top"/>
          <div class="text-center mt-3">
            <div class="produk-nama text-uppercase">${data['name']}</div>
            <p class="produk-text">${format_price(data['price'])}</p>
            <a class="btn my-button m-auto" href="${product_detail_url}">Detail Produk <i class="fa fa-chevron-right"></i></a>
          </div>
          `)
        }

        on_all_image_loaded({
          envs: [...products.map(p => $(p))],
          callback: () => {
            for (let i = 0; i < products.length; i++) {
              $(`#product-kirihuci-${i + 1}`).html(products[i])
            }

            $('#product-kirihuci .skeleton').removeClass('skeleton')
            $('#product-kirihuci .wait-skeleton').removeClass('wait-skeleton')
          },
        })


        let new_products = []
        for (let i = 0; i < new_product_limit; i++) {
          const data = datas[response['count'] - 1 - i]
          const product_detail_url = `./product-detail.html?id=${data['id']}`
          new_products.push(`
          <img src="${data['image']}" class="card-img-top"/>
          <div class="text-center mt-3">
            <div class="produk-nama text-uppercase">${data['name']}</div>
            <p class="produk-text">${format_price(data['price'])}</p>
            <a class="btn my-button m-auto" href="${product_detail_url}">Detail Produk <i class="fa fa-chevron-right"></i></a>
          </div>
          `)
        }

        on_all_image_loaded({
          envs: [...new_products.map(p => $(p))],
          callback: () => {
            for (let i = 0; i < new_products.length; i++) {
              $(`#product-kirihuci-new-${i + 1}`).html(new_products[i])
            }

            $('#product-kirihuci-new .skeleton').removeClass('skeleton')
            $('#product-kirihuci-new .wait-skeleton').removeClass('wait-skeleton')
          },
        })
      },
      error: (err) => {
        alert('Error on getting product kirihuci')
      }
    })
  }

  get_product_kirihuci()
})