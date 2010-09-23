<!DOCTYPE html>
<html>
<head>
  <title>Logout Successful</title>
</head>
<body>
  <h1>Logout Successful</h1>
  <?php if ($relay_url): ?>
  <iframe height="0" width="0" style="display: none" src="<?php print $relay_url; ?>#logout-successful"></iframe>
  <?php endif; ?>
</body>
</html>

