var db = firebase.firestore();
const auth = firebase.auth();
const tempTextField = document.querySelector("#temp");
const saveButton = document.querySelector("#saveButton");
const section = document.querySelector("section");
const firstPage = document.querySelector("#firstPage");
/* mdc.ripple.MDCRipple.attachTo(document.querySelector('#saveButton')); */

saveButton.addEventListener("click", function () {
  const tempToSave = parseFloat(tempTextField.value);
  googleLogin(tempToSave);
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      db.collection('users').doc(user.uid).collection("updates")
        .get()
        .then(function (querySnapShot) {
          //firstPage.innerHTML = ""
          section.innerHTML = "";
          section.innerHTML += `<h2>Welcome to this temp page ${user.displayName}, your latest temp is ${tempToSave}. Here are your previous temperatures</h2>`;

          querySnapShot.forEach((doc) => {
            section.innerHTML += "<ul>";
            section.innerHTML += `<li> ${doc.data().temperature} </li>`;
          });
          section.innerHTML += "</ul>";
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
      const user = result.user;
      console.log(
        `this is uid ${user.uid}, this is result: ${user.displayName}`
      );

      

      db.collection("users").doc(user.uid).get().then((doc) => {
        if (doc.exists) {
          db.collection("users").doc(user.uid).collection("updates").add({
            temperature: tempToSave,
            time: firebase.firestore.Timestamp.now(),
            user_id : user.uid
          }).then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
          })
          .catch(function (error) {
            console.error("Error adding document: ", error);
          });
        } else {
          db.collection("users")
            .doc(user.uid)
            .set({
              user_id: user.uid,
              user_name: user.displayName,
            })
            .then(() => {
              db.collection("users").doc(user.uid).collection("updates").add({
                temperature: tempToSave,
                time: firebase.firestore.Timestamp.now(),
                user_id : user.uid
              });
            }).then(function (docRef) {
              console.log("Document written with ID: ", docRef.id);
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
            });
        }
      });
    });
}
