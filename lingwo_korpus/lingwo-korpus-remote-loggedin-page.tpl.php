<!DOCTYPE html>
<html>
<head>
  <title>Login Successful</title>
  <script>
    if (window.parent) {
      window.parent.location.hash = 'finished';

      // We are attempting to create a non-op, where we simply trigger the 
      // resize event of the parent window.
      window.parent.resizeBy(0, 0);
    }
  </script>
</head>
<body>
  <h1>Login Successful</h1>
</body>
</html>

