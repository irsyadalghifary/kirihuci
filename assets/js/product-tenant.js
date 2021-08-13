document.getElementById('nav-product').classList.add('active')

let current_product_page = 1
const products_per_page = 6
let total_products = 0

$(function () {
  const get_product_tenant = (page) => {
    const pagination = `?limit=${products_per_page}&page=${page}`
    const product_tenant_endpoint = `https://kirihuci-api.herokuapp.com/products/tenant/${pagination}`
  
    $.ajax({
      url: product_tenant_endpoint,
      type: 'GET',
      beforeSend: () => {
        // draw the skeleton for incoming product
        for (let i = 0; i < products_per_page; i++) {
          $('#product-tenant>.row').append(`
          <div class="col-lg-4 col-md-6 col-sm-12">
            <div id="product-tenant-${(page - 1) * products_per_page + i + 1}" class="skeleton"></div>
          </div>
          `)
        }
      },
      success: (response) => {
        total_products = response['total']

        const datas = response['data']
        let products = []

        for (let i = 0; i < response['count']; i++) {
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
              $(`#product-tenant-${(page - 1) * products_per_page + i + 1}`).html(products[i])
            }

            $('#product-tenant .skeleton').removeClass('skeleton')
            $('#product-tenant .wait-skeleton').removeClass('wait-skeleton')
          },
        })
      },
      error: (err) => {
        alert('Error on getting product tenant')
      }
    })
  }

  get_product_tenant(current_product_page)

  window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement

    if (scrollTop + clientHeight >= scrollHeight - 5 && (total_products > (current_product_page * products_per_page))) {
      get_product_tenant(++current_product_page)
    }
  }, { passive: true })
})