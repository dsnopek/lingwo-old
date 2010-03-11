
We generate the entry-list.txt using the following command in the Drupal root:

  drush sql query "SELECT CONCAT_WS(':', language, pos, headword) FROM lingwo_korpus_entry"

You have to delete the first line (its the column header).

