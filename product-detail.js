$(function () {
  const params = new URLSearchParams(window.location.search);

  const get_product_detail = (product_id) => {
    const product_detail_endpoint = `http://kirihuci-api.herokuapp.com/products/${product_id}/:detail`
  
    $.ajax({
      url: product_detail_endpoint,
      type: 'GET',
      success: (response) => {
        if (response.length > 0) {
          const product = response[0]
          $('#product-image').attr('src', product.image)
          $('#product-title').html(product.name)
          $('#product-price').html(`Rp. ${product.price},00`)
          $('#product-description').html(product.description)
          $('#product-notes').html(product.notes)
          $('#product-shipping-notes').html(product.shipping_notes)
          $('#product-dimension').html(product.dimension)

          //carousel for additional images
        }
      },
      error: (err) => {
        alert('Error on getting product detail')
      }
    })
  }
  
  const get_recommendations = (product_id) => {
    const recommendations_endpoint = `http://kirihuci-api.herokuapp.com/products/?sort=DESC`
  
    $.ajax({
      url: recommendations_endpoint,
      type: 'GET',
      success: (response) => {
        const carousel_length = 3
        let results = []
        for (let i = 0; i <= response.count; i += carousel_length) {
          let carousel = []
          for (let j = i; j < Math.min(i + carousel_length, response.count); j++) {
            carousel.push(response.data[j])
          }
          results.push(carousel)
        }
        console.log(results)
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