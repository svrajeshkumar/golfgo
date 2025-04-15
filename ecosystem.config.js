module.exports = {
    apps : [
      {
        name: "golf-frontend", // Choose a unique name for your app
        script: "node_modules/next/dist/bin/next", // Path to Next.js executable
        args: "start -p 8002", // Command to start Next.js server
        watch: true // Set to true if you want PM2 to watch for file changes and restart the app
      }
    ]
  };