
  var db = firebase.firestore();
  const auth = firebase.auth();
  const tempTextField = document.querySelector("#temp");
  const saveButton = document.querySelector("#saveButton");
  const section = document.querySelector("section");
  const firstPage = document.querySelector("#firstPage")
  /* mdc.ripple.MDCRipple.attachTo(document.querySelector('#saveButton')); */



saveButton.addEventListener("click", function () {
  const tempToSave = parseFloat(tempTextField.value);
  googleLogin(tempToSave);
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      
      // User is signed in.
      db.collection("users")
        .where("user_id", "==", user.uid)
        .get()
        .then(function (querySnapShot) {
            //firstPage.innerHTML = ""
            section.innerHTML = ""
          section.innerHTML +=
            `<h2>Welcome to this temp page ${user.displayName}, your latest temp is ${tempToSave}. Here are your previous temperatures</h2>`;
          
          querySnapShot.forEach((doc) => {
            section.innerHTML += '<ul>'  
            section.innerHTML +=  `<li> ${doc.data().temperature} </li>`;
          });
            section.innerHTML += '</ul>'
        });
      // ...
    } else {
      // User is signed out.
      // ...
    }
  });  

  //query from db

  //redirect and add the rspective data to the new page
});



function googleLogin(tempToSave) {
  console.log("poop");
  let snapshot = null;
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      console.log(
        `this is uid ${result.user.uid}, this is result: ${result.user.displayName}`
      );
      db.collection("users")
        .add({
          user_id: result.user.uid,
          user_name: result.user.displayName,
          temperature: tempToSave,
          time: firebase.firestore.Timestamp.now(),
        })
        .then(function (docRef) {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    });
}
