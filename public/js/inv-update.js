const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("#updateButton")
      updateBtn.removeAttribute("disabled")
    })