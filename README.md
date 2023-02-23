# Ely - Code Challenge
To launch locally: 
 - yarn install 
 - add a .env in root folder
 - yarn dev
 
Link to live version: [here](https://elycodechallenge.vercel.app/)

## Frontend React Application
db: mysql using [planetscale](https://planetscale.com/)

location: /src/pages/index

The user:
 - is able to search by title or by author. Results are paginated.
 - needs to signin using email to save a shortlist.
 - can reserve directly the book from the shortlist dialog, or check the return date
 - can check his ongoing reservations

backend logic for the shortlist
location: /src/pages/api/shortlist GET(fetch user's shortlist), POST(add a book to the shortlist), DELETE(remove a book from the shortlist)

## Backend: Local Library API

location: /src/pages/api

- /reservations/index: GET(check book availability), POST(reserve a book)
- /reservations/me: GET(get reservations by username)

