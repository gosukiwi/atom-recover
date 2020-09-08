# Atom Recover
Recover your unsaved files in case of catastrophic failure (power outage, blue
screen of death, etc).

It should "just work", nothing to do. It works like this:

1. Whenever you edit a file, it will save a temporary copy (`swapfile`) in the
background
1. When you save a file, it will delete the related swapfile
1. Whenever you open a file, if the swapfile is newer, and the contents of the
editor are different, it will load up the swapfile for you and delete it
1. If the swapfile doesn't look right, you can undo as you normally would,
changes are not persisted

## A note on Atom's default behavior
Atom does save the state of all your files while you are editing, so most of the
time your files will be recovered after a random failure.

There are some times though, that Atom just breaks. For this reason,
`atom-recover` serves as an extra layer of safety. If Atom's save file is
corrupted, `atom-recover` will load up it's own version.
