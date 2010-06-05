
We generate the entry-list.txt using the following command in the Drupal root:

  drush -r $HOME/prj/lingwo/drupal sql-query "SELECT DISTINCT CONCAT_WS(':', language, pos, headword) FROM lingwo_korpus_entry ORDER BY language, pos, headword" > entry-list.txt

You have to delete the first line (its the column header).

