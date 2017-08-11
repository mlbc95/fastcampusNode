import axios from 'axios'
var apiHelper = (function () {
  return {
    register: function (fName, lName, userName, email, password, school) {
      axios.post('auth/signup', {
        fName: fName,
        lName: lName,
        username: userName,
        email: email,
        password: password,
        school: school

      })
      .then(function (response) {
        return response
      })
  .catch(function (error) {
    console.log(error)
  })
    }
  }
}())
