# Weather App

## Getting Started

Copy over `.env.example` to `.env` and fill out the api key details.

Install dependencies `npm install`  (or even better `bun install` 😉)

From there `npm run dev` to start the application.

## Screenshots

<div style="display:flex;">
  <img width="40%" alt="image" src="https://github.com/moishinetzer/weather-app/assets/11411486/d8a69f73-3889-4aaa-b6e0-d00a73dc6d4e">
  <img width="40%" alt="image" src="https://github.com/moishinetzer/weather-app/assets/11411486/cba7c8b9-f057-4d50-8bdd-5ab719542983">
  <img width="40%" alt="image" src="https://github.com/moishinetzer/weather-app/assets/11411486/ce4a2d5e-3ddd-4d81-ac4a-a763b0664350">
</div>

## Whats inside

- Remix.run (of course)
- Tyepscript (absolute must)
- Material Design
- Material Icons
- TailwindCSS (I'm not familiar enough with Materials' own styling solution as of yet, however I used their components where I felt necessary)
- Prisma for a DB to store the favourites
- Session storage for auth
- Weather API to get the weather details.
- remix-validated-form for typesafe form submission and parsing
- zod for parsing the api requests
- @epic-web/remember for it's easy to implement singleton pattern

I would love to talk about a bunch of ideas for optimizations I had, that I didn't have time to implement but given more time there are lots of interesting approaches that could be taken to do so,
