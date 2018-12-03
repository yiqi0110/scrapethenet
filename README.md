# scrapethenet
### Description
>   This news scrapper takes articles from [npr.org]("https://www.npr.org/sections/news/") and displays the most recent articles on the browser window. Where each article can be commented on or if a comment already exists, that articles comment can be viewed by any user.

---
### Technologies Used
>   Axios, Cherrios, Jquery, Bootstrap, Express(Express-Handlebars), Morgan, and Mongoose.
#### package.json configuration
*npm installs*
>   Just run `npm i` in the terminal or run `npm i [dependancies]`.
#### Dependancies
- "axios": "^0.18.0"
- "cheerio": "^1.0.0-rc.2"
- "express": "^4.16.4"
- "express-handlebars": "^3.0.0"
- "mongoose": "^5.3.14"
- "morgan": "^1.9.1"

---
### How [scrape the net]("https://intense-headland-68962.herokuapp.com/") works
>   As the site loads, the window displays several articles pulled from the `npr.org` news outlet. Each article has an option to submit a comment to the database, and every article with notes has the option to view a preexisting comment posted by anyone.

---
### Copyrights
&copy; _Trevor Li_
[@thetrevorli]("https://yiqi0110.github.io/portfolio/")

---
<!-- ```javascript
function fancyAlert(arg) {
  if(arg) {
    $.facebox({div:'#foo'})
  }
}
``` -->