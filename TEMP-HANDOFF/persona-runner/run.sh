#!/bin/bash
# run.sh <id>: one persona via opencode big-pickle
D=$(dirname "$(readlink -f "$0")"); id=$1
line=$(grep "^$id	" "$D/personas.tsv"); persona=$(echo "$line" | cut -f2); vp=$(echo "$line" | cut -f3)
mkdir -p "$D/$id"
p=$(sed -e "s|{PERSONA}|$persona|" -e "s|{ID}|p-$id|g" -e "s|{VIEWPORT}|$vp|" -e "s|{DIR}|$D/$id|g" "$D/prompt.txt")
cd "$D/$id" && timeout 1500 opencode run --auto -m opencode-go/mimo-v2.6-flash --title "persona $id" "$p" > "$D/$id/opencode.log" 2>&1
echo "$id exit $?"
