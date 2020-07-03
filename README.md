# Zoomkitty

Zoomkitty is a tool for turning Tabbycat draws into Zoom room pre-allocations, in order to speed up breakout room setup in debating competitions based around Zoom. The main caveat of this approach is that you can only really do one pre-allocation per Zoom meeting, so you would have to make a separate Zoom meeting per round. It supports importing data automatically from Tabbycat's API or using manual importers. This software is free to use and modify for non-commerical use, but commercial use requires a case-by-case exception, further details can be found in the LICENSE file.

## Building Zoomkitty

Building Zoomkitty requires Git, Node.JS (>=12.14.0) and some familiarity with the command line on your platform of choice (Yarn may also be required depending on your build environment). Pre-built binaries are not generally provided due to this being a spare-time, volunteer project.

The general build process is as follows:
```bash
git clone https://github.com/CreatedBySeb/zoomkitty
cd zoomkitty
npm i
npm run make
```
This will produce the appropriate build for your system in the `out/make` folder.

## Future Development

There are three remaining major features I would like to add before I would consider Zoomkitty to be 'complete'.

* Direct editing of entries
* Support for localisation into other languages
* Saving and loading participants and draws as a 'tournament'

After these, aside from major bug fixes, I will likely not be making any further changes, however if people wish to submit changes for consideration they are more than welcome
