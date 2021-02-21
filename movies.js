window.addEventListener('DOMContentLoaded', async function(event) {
    let db = firebase.firestore()
    let apiKey = 'ad954a96a4790dd1aa181b4d7fd71bbb'
    let response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US`)
    let json = await response.json()
    let movies = json.results
    console.log(movies)
    
    for (let i=0; i<movies.length; i++) {
      let movie = movies[i]
      let docRef = await db.collection('watched').doc(`${movie.id}`).get()
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
        await db.collection('watched').doc(`${movie.id}`).set({})
      }) 
    }
  })