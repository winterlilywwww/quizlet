const myMiddleware = (req, res, next) => {
    console.log('Middleware called');
    next(); // Pass control to the next middleware or route handler
  };

  app.use((req, res, next) => {
    console.log(req.url);
    next();
});

  
  // Export the middleware function correctly
  module.exports = myMiddleware;