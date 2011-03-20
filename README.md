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

Copyright
---------

Copyright 2010, 2011 David Snopek

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

