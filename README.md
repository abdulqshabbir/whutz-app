# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## Todo

- [x] make it mobile responsive
- [x] Refactor all api calls behind custom hooks
- [x] support replies to images
- [x] support replies to text
- [x] support emojies
- [ ] add e2e tests using playright or cypress
- [ ] refactor backend-code into reusable services that are testable
- [ ] add ability to create threads/channels that are public and users can subscribe to (will require changes at db level)
- [ ] support video messages (and replies to video)
- [ ] suppport audio messages (and replies to audio)
- [ ] support PDF messages (and replies to PDF messages)
- [ ] channel id (and how many of the latest messages user is vieweing) should be a part of the query string

# Friend request flow

- [x] create a function `user.sendFriendRequest` which accepts an email address and adds an entry to the pendingFriendRequests table (userEmail, friendRequestEmail, status = 'pending')
- [x] create a function `user.acceptFriendRequest` which accepts an email (friendRequestEmail) and finds the coresponding entry in the `pendingFriendRequests` table, change status to 'accepted', and add a new entry in the `userFriends` table `accept_friend_request`
- [ ] create a function `user.getPendingFriendRequests` which lists all pending friend requests for a particuar user
- [ ] create a fucntion `user.getConnections` which lists all users the
- [ ] handle error/success states of api calls with toast notifications
- [ ] make friend requests realtime using websockets

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
