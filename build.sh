mkdir -p docs
cp -r src/* docs
drop-inline-css -r src -o docs
deno run -A bundle.js
minify -r docs -o .
