#!/bin/bash

export TAG=$(jj log --no-graph -r @- -T "change_id.short() ++ '-' ++ commit_id.short()")
export PROJECT_ID="funcscwsideprojectprodaa67l9qf"