    firebase.auth().onAuthStateChanged(async function(user) {

        if (user) { 
      
        let db = firebase.firestore()
        let apiKey = 'ad954a96a4790dd1aa181b4d7fd71bbb'
        let response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US`)
        let json = await response.json()
        let movies = json.results
        console.log(movies)
     
        for (let i=0; i<movies.length; i++) {
          let movie = movies[i]
          let docRef = await db.collection('watched').doc(`${movie.id}-${user.uid}`).get()
          let watchedMovie = docRef.data()
          let opacityClass = ''
          if (watchedMovie) {
            opacityClass = 'opacity-20'
          }
      
          document.querySelector('.movies').insertAdjacentHTML('beforeend', `
            <div class="w-1/5 p-4 movie-${movie.id} ${opacityClass}">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="w-full">
              <a href="#" class="watched-button block text-center text-white bg-green-500 mt-4 px-4 py-2 rounded">I've watched this!</a>
            </div>
          `)
      
          document.querySelector(`.movie-${movie.id}`).addEventListener('click', async function(event) {
            event.preventDefault()
            let movieElement = document.querySelector(`.movie-${movie.id}`)
            movieElement.classList.add('opacity-20')
            await db.collection('watched').doc(`${movie.id}-${user.uid}`).set({})
          }) 
        }  
      
        console.log(user)
        let userName = user.displayName
        //sign out button
         document.querySelector('.sign-in-or-sign-out').innerHTML = `
         Signed in as ${userName}
         <button class="text-pink-500 underline sign-out">Sign Out</button>`
         
        document.querySelector('.sign-out').addEventListener('click', function (event) {  
          console.log('sign out clicked')  
          firebase.auth().signOut()
          document.location.href = 'movies.html'
        })
      }
      
      else {
        let ui = new firebaseui.auth.AuthUI(firebase.auth())
        let authUIConfig = {
            signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID
            ],
            signInSuccessUrl: 'movies.html' //the file ppl see when they sign in successfully
        }
      ui.start('.sign-in-or-sign-out', authUIConfig) //placeholder for class we would reference in html 
        }
      })