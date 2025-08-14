#!/bin/bash

# get rid of 'AT-SPI: Error retrieving accessibility bus address' warnings
export NO_AT_BRIDGE=1

setterm blank 0
setterm powerdown 0

/usr/bin/openbox-session
