#!/bin/bash

rsync -av --exclude=".git" --delete ./HTML/ elivesapi@sandraliarte.elivecd.com:sandraliarte.elivecd.com/

