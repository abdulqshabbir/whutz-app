# 📱 WhutzApp - Chat Application

WhutzApp is a realtime chat application built with Next JS (Typescript/Node JS/React), tRPC, SQLite, Tailwind CSS, Pusher among other technologies. This chat app is designed originally for the web, but can also work on mobile devices.

## 🚀 Features

- 🗝 Sign in with Google (authentication)
- 🗨 Create 1-on-1 conversations
- 📬 Users can send text and images, reply to messages, and react with emojies
- 🔔 Users get sound notifications for new unseen messages that arrive
- 😂 Add emoji reactions to messages over websockets

## 🛠️ Main Technologies
- `React`
- `Next JS (full-stack framework)`
- `tRPC (API)`
- `SQLite (Database)`
- `AWS S3 (object storage)`
- `Tailwind CSS (styling)`
- `Pusher (websocket service)`

##  🎥 Demo Video
<video src="https://youtu.be/BvImlDa79ho" controls="controls" style="max-width: 730px;"></video>

## 📚 What I Learned

While completing this project, I deepened my understaning of how to write maintainable code for more complex systems.

### Custom Hooks:

- **Single Responsibility Principle**: Creating reusable hooks gave me an appreciation for how to build complex front-end systems by encapsulating reusable logic.  For example, I created the `usePusher` hook which was responsible for connecting to the Pusher (websocket service) client on the front-end and the `useScrollToBottomOfChat` hook which was responsible for scrolling to the bottom of the chat thread when new messages arrived as websocket events.

### Object Storage:

- **AWS S3**: Over the course of the project, I learned about how to create S3 bucket policies, create pre-signed URLs with upload conditions as well as using multipart form uploads on the front-end to directly upload to S3 servers.

### Managing Complex State management
- **Jotai**: As the project became more complex, using local state within React would require too much prop-drilling and React Context would force unnesssary re-renders of the entire application. So I reached for **Jotai** a minimal global state management solution that helped me solve the problem of global state management without the extra re-renders that would come with React context.

### Type safety across my application
- **tRPC**: This application uses tRPC as the API framework responsible for communicating between the front-end and back-end. Using tRPC made me really appreciate the power of typescript because I was able to validate my code from the database layer all the way to my front-end. This allowed me to move fast and make sweeping changes without having to worry about regressions.

## 🤔 How Can It Be Improved?
In terms of technical design, I'm currently in the process of refactoring my code to fully implement the *clean architecture* principles popularized by Robert Martin. My goal is to make sure I have clear layers of separation in my backend code for my entities, business logic (use cases), database access and other framework code.

In terms of functionality, I would love to add the ability to have group chats and send voice messages using the app.

## 🛠️ Contributing
If you would like to contribute to the project or run it locally, you will need
1. Create a turso account for the DB url
2. Google client id and secret from the google console
3. Pusher credentials for the front-end and back-end

After these services are setup you can run:
1. `git clone https://github.com/abdulqshabbir/whutz-app.git` (clone repo)
2. `cd whutz-app` (move into project directory)
3. Add a `.env` file to the project with all secrets from the steps above (see `.env.sample` for examples)
4. `yarn` (install dependencies)
5. `yarn dev` (start development server)
6. Navigate to `http://localhost:3000` and `http://localhost:3000/signup` to see the project running
7. Open a new terminal window and run `yarn studio` and click the link in the terminal to open up a GUI for interacting with the database

Please get in touch if you would like help running it locally. Ultimately, I would like to dockerize the application so it is easier to run in a local environment.

## 🗨 Social Media/Contact Info
- Twitter: https://twitter.com/abdulshabbirdev
- Linked In: https://www.linkedin.com/in/abdul-shabbir-702881145/

