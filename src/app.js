import "./main.css"
import $ from "jquery"

import config from "../config"

(() => {

  $('.copyright').html(config.COPYRIGHT)

  // Get the form.
  let form = $("#subscribeForm")

  // Set up an event listener for the contact form.
  form.submit(function (e) {
    // Stop the browser from submitting the form.
    e.preventDefault()

    form.find(".text").hide()
    form.find("button").css({ "padding-bottom": "1.5rem", "padding-top": "0" })
    form.find(".loader").show()

    let input = form.find("input[name=email]")

    let email = input.val()
    let placeholder = input.attr("placeholder")

    if (email == "") {
      form.find(".loader").hide()
      form.find("button").css({ "padding-bottom": ".75rem", "padding-top": ".75rem" })
      form.find(".text").show()

      input.attr("placeholder", "Please add your email!")
      input.addClass("text-red-darker").removeClass("text-grey-dark")

      setTimeout(() => {
        input.attr("placeholder", placeholder)
        input.addClass("text-grey-dark").removeClass("text-red-darker")
      }, 2000)

      return false
    }

    // Submit the form using AJAX.
    $.ajax({
      type: "GET",
      dataType: "json",
      xhrFields: {
        withCredentials: true
      },
      url: "http://catchthis.khurafat.dev/api/subscribe?project=" + config.PROJECT + "&email=" + email,
    })
      .done(function (response) {
        input.val("")
        input.attr("placeholder", "We will notify you!")
        input.addClass("text-brand-btn").removeClass("text-grey-dark")

        setTimeout(() => {
          input.attr("placeholder", placeholder)
          input.addClass("text-grey-dark").removeClass("text-brand-btn")
        }, 2000)
      })
      .fail(function (data) {
        input.val("")
        input.attr("placeholder", "There was an error! Try again later.")
        input.addClass("text-red-darker").removeClass("text-grey-dark")

        setTimeout(() => {
          input.attr("placeholder", placeholder)
          input.addClass("text-grey-dark").removeClass("text-red-darker")
        }, 2000)
      })
      .always(function (data) {
        form.find(".loader").hide()
        form.find("button").css({ "padding-bottom": ".75rem", "padding-top": ".75rem" })
        form.find(".text").show()
      })

  })
})();
