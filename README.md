# Your startup name here

[My Notes](notes.md)

I plan to ease the process of answering the very difficult question, "What do you want to watch tonight". With the app, Watch with Me!

## 🚀 Specification Deliverable

> [!NOTE]
> For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] Proper use of Markdown
- [x] A concise and compelling elevator pitch
- [x] Description of key features
- [x] Description of how you will use each technology
- [x] One or more rough sketches of your application. Images must be embedded in this file using Markdown image references.

### Elevator pitch

Ever struggled with the age-old question, **'What do you want to watch tonight?'** With _Watch with Me!_ , you’ll never have to ask this again. This simple app lets anyone add movie titles, vote on what you’d like to watch, and instantly find the perfect match that everyone agrees on. It’s quick, fun, and takes the stress out of movie night decisions.

### Design

![Design image](Images/LoginPhoto.png)

This is where you will be able to login and will be the home page

![Design image](Images/RateMovie.png)

Here you can rate the movies pulled in through the API or added by users.You can also link with a different user and see what movie you both would like to watch

### Key features

- Login with your user
- Add and vote on movie titles
- Have the app return a movie everyone likes

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Uses correct HTML structure for application. 5 HTML pages. One for login, one to sign up, one to rate movies, one to add movies, one to match with other users. Hyperlinks to choice page.
- **CSS** - Application styling that looks good on different screen sizes, uses good whitespace, color choice and contrast.
- **JavaScript** - Provides login, choice display, applying votes, adding movies, display other users votes, backend endpoint calls.
- **React** - Single page section that displays recent shared liked movies in responce to users actions.
- **Service** - Backend service with endpoints for:
  - retrieving movies
  - submitting votes
  - retrieving vote status
  - add movies from [themovieDB](https://developer.themoviedb.org/reference/movie-popular-list)
- **DB/Login** - Store users, choices, and votes in database. Register and login users. Credentials securely stored in database. Can't vote unless authenticated.
- **WebSocket** - As each user votes, their votes are broadcast to all other users.

## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Server deployed and accessible with custom domain name** - [My server link](https://what-to-watch.click/).

Created the domain what-to-watch.click and registered it with the records using the host 35.173.93.38 that I set up through the CS260 start up configuration. Then edited the caddy file to include https requests.

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.
https://startup.what-to-watch.click/

- [x] **HTML pages** - I did complete this part of the deliverable. By looking at simons example and using the components to build it.
- [x] **Proper HTML element usage** - I did complete this part of the deliverable. By reading about the multiple elements and seeing which I wanted to know.
- [x] **Links** - I did complete this part of the deliverable. By inputing my reference files into my menu item.
- [x] **Text** - I did complete this part of the deliverable. By using the div to sepperate my information and by adding required text when needed.
- [x] **3rd party API placeholder** - I did complete this part of the deliverable. This is located on the add movies page.
- [x] **Images** - I did complete this part of the deliverable. This is on the add movie page and on the index page
- [x] **Login placeholder** - I did complete this part of the deliverable. Found on the login page
- [x] **DB data placeholder** - I did complete this part of the deliverable. Found on the rate movies page.
- [x] **WebSocket placeholder** - I did complete this part of the deliverable. Found in the rate movie page.

## 🚀 CSS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Header, footer, and main content body** - I looked through a lot of the Bootstrap design cases and integrated a lot of them througout my project
- [x] **Navigation elements** - Similar pattern to Simon but I used Bootstrap
- [x] **Responsive to window resizing** - Bootstrap implementation
- [x] **Application elements** - Again used bootstrap and some light js to build the carousel
- [x] **Application text content** -Bootstrap with some custom css in styles.css
- [x] **Application images** - Didnt do much with these except for placing them in the right location on the page

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

I was able to follow the instrucitons for Simon-React-part-1 however I was not sure how to push it to my github so that you can look at the files. I have deployed it to my website however.

- [x] **Bundled using Vite** - I did complete this part of the deliverable. Using the same concepts that we used in class for Simon
- [x] **Components** - I did complete this part of the deliverable. I Copied and moved the main part of my html files into my jsx files making sure to change className.
- [x] **Router** - Routing between login and voting components. Using the same idea for Simon I adjusted my code to make routing work without the HTML pages.

## 🚀 React part 2: Reactivity

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **All functionality implemented or mocked out** - I did complete this part of the deliverable.
      Through many subfunctions and implementing a storage into localstorage. I was also able to add the carausel back in with a loop thought the movies.
- [x] **Hooks** - I did complete this part of the deliverable.
      I added some temp storage for older persistant data.

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Node.js/Express HTTP service** -
      Used express to add the cookies and the front end to manage the calls to the backend.
- [x] **Static middleware for frontend** -
      Added local endpoints to account for the backend being called.
- [x] **Calls to third party endpoints** -
      Used the database look up in add movie that searches for your title and adds all movies with that title.
- [x] **Backend service endpoints** -
      Using the service > index.js created the api endpoints so that we can call the backend stroage for the data.
- [x] **Frontend calls service endpoints** -
      Manipulated the rating feature so that the data gets updated in both locations.

## 🚀 DB/Login deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **User registration** - I followed the instructions and example and implemented it like Simon
- [x] **User login and logout** - Using the simmilar concepts with my own twist I store the user and the movies in local storage when the user logs in and then remove them when they log out.
- [x] **Stores data in MongoDB** - Connection to Mongo just as in Simon
- [x] **Stores credentials in MongoDB** - Pursistant for the movies and the users
- [x] **Restricts functionality based on authentication** - movies and actions reduced based on permissions and if user is logged on.

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Backend listens for WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Frontend makes WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Data sent over WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **WebSocket data displayed** - I did not complete this part of the deliverable.
- [ ] **Application is fully functional** - I did not complete this part of the deliverable.
