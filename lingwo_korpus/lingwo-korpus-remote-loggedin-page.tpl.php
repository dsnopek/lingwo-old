<!DOCTYPE html>
<html>
<head>
  <title>Login Successful</title>
</head>
<body>
  <h1>Login Successful</h1>
  <?php if ($relay_url): ?>
  <iframe height="0" width="0" style="display: none" src="<?php print $relay_url; ?>#login-successful"></iframe>
  <?php endif; ?>
</body>
</html>

