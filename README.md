# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## How to run this project locally

1. `git clone https://github.com/abdulqshabbir/whutz-app.git` (clone repo)
2. `cd whutz-app` (move into project directory)
3. Add a `.env` file to the project with all secrets
4. `yarn` (install dependencies)
5. `yarn dev` (start development server)
6. Navigate to `http://localhost:3000` and `http://localhost:3000/signup` to see the project running
7. Open a new terminal window and run `yarn studio` and click the link in the terminal to open up a GUI for interacting with the database

Other optional commands:
- `yarn lint` to check for linting errors
- `yarn prettier` to format code across entire project
- `yarn pull` to pull in database changes into our drizzle schema (which is used for our db client in the application)
- `yarn push` to push changes in our schema file up to our database and create corresponding tables
- `yarn migrate` to create automatic migrations using drizzle
