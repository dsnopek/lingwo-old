Lingwo (old)
============

The majority of the core Lingwo code has recently been released as a [project on Drupal.org] [1]:

The code still in this repo needs to be brought up to Drupal.org standards so that it can
be independently released.

Right now, this is the future I image for these modules:

 * lingwo_korpus: Will become either "lingwo_corpus" or "corpus" on Drupal.org.  It needs some
   work to remove the current Python requirement.  I'd like to make it so that it only calls
   out for actual NLP but can do the rest itself.  Then NLP could be disabled by default and
   the module would still work.
 
 * lingwo_data: This will probably take a detour to bbcom, before becoming generic enough to be
   released on Drupal.org.  The service end of it and maybe some example scripts will eventually
   be released as "lingwo_import".  Our actual import scripts should be ported to work on NodeJS
   as well as Rhino and will probably remain in bbcom.

[1]: http://drupal.org/sandbox/dsnopek/1073982 "Lingwo dictionary project page on Drupal.org"

